import { KnowledgeBasePatterns, LLMPatterns, MessageBus, MessageRole } from '@libs/common';
import { Injectable } from '@nestjs/common';

@Injectable()
export class HandleCreateActionService {
  constructor(private readonly messageBus: MessageBus) {}

  async handle(prompt: string, chatHistory: { role: MessageRole; content: string }[]) {
    const LLMAnswer = await this.messageBus.send(LLMPatterns.CREATE_METADATA_FOR_KNOWLEDGE_BASE, {
      userPrompt: prompt,
      history: chatHistory,
    });

    const { data: dataToAddToKnowledgeBase, title, category, tags } = LLMAnswer;

    if (Array.isArray(dataToAddToKnowledgeBase) && dataToAddToKnowledgeBase.length === 0) {
      throw new Error('No data to add to the knowledge base or something goes wrong');
    }

    await this.messageBus.send(KnowledgeBasePatterns.CREATE, {
      dataToAddToKnowledgeBase,
      metadata: {
        title,
        category,
        tags,
        author: 'placeholder',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    });

    return 'Data has been added to the knowledge base';
  }
}
