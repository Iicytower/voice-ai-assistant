import { extractJsonFromString, LLMPatterns, OnMessage } from '@libs/common';
import { Injectable } from '@nestjs/common';
import { LangchainService } from './services';
import { AgentClass, LLMRequest } from './types';
import {
  CreateMetadataForKnowledgeBaseAgent,
  GetActionTypeAgent,
  GetInformationAgent,
} from './agents';

type GenerateResponseInput = LLMRequest;

type UseAgentInput = {
  agent: AgentClass;
  data: LLMRequest;
};

@Injectable()
export class LLMHandler {
  constructor(private readonly langchainService: LangchainService) {}

  /**
   * @deprecated
   * leave it here only for development purposes
   */
  @OnMessage(LLMPatterns.GENERATE_RESPONSE)
  async generateResponse(input: GenerateResponseInput): Promise<string> {
    const { userPrompt, systemPrompt, history = [] } = input;

    const response = await this.langchainService.chat({
      prompt: userPrompt,
      history,
      systemMessage: systemPrompt,
    });

    return response;
  }

  @OnMessage(LLMPatterns.GET_TYPE_OF_ACTION)
  async getActionType(input: GenerateResponseInput): Promise<string> {
    const dataFromLLM = await this.useAgent({ agent: GetActionTypeAgent, data: input });

    const { actionType } = JSON.parse(extractJsonFromString(dataFromLLM));

    return actionType;
  }

  @OnMessage(LLMPatterns.GET_INFORMATION)
  async getInformation(input: GenerateResponseInput): Promise<string> {
    const dataFromLLM = await this.useAgent({ agent: GetInformationAgent, data: input });

    return dataFromLLM;
  }

  @OnMessage(LLMPatterns.CREATE_METADATA_FOR_KNOWLEDGE_BASE)
  async createMetadataForKnowledgeBase(input: GenerateResponseInput) {
    const chunks = await this.useAgent({
      agent: CreateMetadataForKnowledgeBaseAgent,
      data: input,
    });

    return chunks;
  }

  private async useAgent(input: UseAgentInput): Promise<string> {
    const { data, agent: Agent } = input;
    const agentInstance = new Agent();

    return agentInstance.run(data);
  }
}
