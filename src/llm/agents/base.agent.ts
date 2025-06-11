import { Injectable } from '@nestjs/common';
import { LangchainService } from '../services';
import { LLMRequest, Prompt } from '../types';
import { OpenRouterModel } from '@libs/common';

export type GetPromptInput = {
  prompt?: string;
  additionalData?: any;
};

@Injectable()
export abstract class BaseAgent {
  private readonly langchainService = new LangchainService();
  protected readonly model: OpenRouterModel;

  constructor(model?: OpenRouterModel) {
    this.model =
      model ||
      (process.env.OPENROUTER_DEFAULT_MODEL as OpenRouterModel) ||
      OpenRouterModel.QWEN3_30B_FREE;
  }

  abstract getPrompt(input: GetPromptInput): Prompt;

  async run(input: LLMRequest): Promise<string> {
    const { userPrompt, history = [] } = input;

    const prompt = this.getPrompt({ prompt: userPrompt, additionalData: input.additionalData });

    const response = await this.langchainService.chat({
      prompt: prompt.userPrompt,
      history,
      systemMessage: prompt.systemPrompt,
      model: this.model,
    });

    return this.sanitizeOutput(response);
  }

  protected sanitizeOutput(input: string): string {
    return input;
  }
}
