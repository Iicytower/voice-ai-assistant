import { KnowledgeBasePatterns, LLMPatterns, MessageBus, MessageRole } from '@libs/common';
import { Injectable } from '@nestjs/common';

@Injectable()
export class HandleReadActionService {
  constructor(private readonly messageBus: MessageBus) {}

  async handle(prompt: string, chatHistory: { role: MessageRole; content: string }[]) {
    const metadataFilter = await this.messageBus.send(
      LLMPatterns.CREATE_METADATA_FOR_KNOWLEDGE_BASE,
      {
        userPrompt: prompt,
        history: chatHistory,
      },
    );

    const dataFromKnowledgeBase = await this.messageBus.send(KnowledgeBasePatterns.READ, {
      prompt,
      metadataFilter,
    });

    // TODO below ternary operator is used to check do we need to use data from knowledge base
    const additionalData =
      dataFromKnowledgeBase.results.length > 0 ? JSON.stringify(dataFromKnowledgeBase.results) : '';

    const dataFromLLM = await this.messageBus.send(LLMPatterns.GET_INFORMATION, {
      userPrompt: prompt,
      additionalData,
      history: chatHistory,
    });

    return dataFromLLM;
  }
}
