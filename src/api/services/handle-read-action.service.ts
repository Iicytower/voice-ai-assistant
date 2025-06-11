import { KnowledgeBasePatterns, LLMPatterns, MessageBus, MessageRole } from '@libs/common';
import { Injectable } from '@nestjs/common';

@Injectable()
export class HandleReadActionService {
  constructor(private readonly messageBus: MessageBus) {}

  async handle(prompt: string, chatHistory: { role: MessageRole; content: string }[]) {
    const dataFromKnowledgeBase = await this.messageBus.send(KnowledgeBasePatterns.READ, prompt);

    // below ternary operator is used to check do we need to use data from knowledge base
    const additionalData =
      dataFromKnowledgeBase.results.length > 0 &&
      dataFromKnowledgeBase.results[0]._additional.certainty >= 0.7
        ? JSON.stringify(dataFromKnowledgeBase.results.map((item: any) => item.content))
        : '';

    const dataFromLLM = await this.messageBus.send(LLMPatterns.GET_INFORMATION, {
      userPrompt: prompt,
      additionalData,
      history: chatHistory,
    });

    return dataFromLLM;
  }
}
