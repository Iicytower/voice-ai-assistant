import { KnowledgeBasePatterns, OnMessage } from '@libs/common';
import { Injectable } from '@nestjs/common';
import { WeaviateService } from './weaviate.service';

type UpdateKnowledgeRequest = {
  id: string;
  content: string;
};

type CreateKnowledgeRequest = {
  dataToAddToKnowledgeBase: string[];
  title: string;
};

@Injectable()
export class KnowledgeBaseHandler {
  constructor(private readonly weaviateService: WeaviateService) {}

  @OnMessage(KnowledgeBasePatterns.CREATE)
  async create(input: CreateKnowledgeRequest) {
    const { dataToAddToKnowledgeBase, title } = input;
    try {
      for await (const chunk of dataToAddToKnowledgeBase) {
        await this.weaviateService.addEntry(title, chunk);
      }

      return { success: true };
    } catch (error) {
      console.error('Error creating knowledge entry:', error);
      return { success: false, error: error.message };
    }
  }

  @OnMessage(KnowledgeBasePatterns.READ)
  async read(prompt: string) {
    try {
      const results = await this.weaviateService.searchSimilar(prompt, 10);

      return { success: !!results.length, results };
    } catch (error) {
      console.error('Error searching knowledge base:', error);
      return { success: false, error: error.message };
    }
  }

  @OnMessage(KnowledgeBasePatterns.UPDATE)
  async update(request: UpdateKnowledgeRequest) {
    try {
      await this.weaviateService.updateEntry(request.id, request.content);
      return { success: true };
    } catch (error) {
      console.error('Error updating knowledge entry:', error);
      return { success: false, error: error.message };
    }
  }

  @OnMessage(KnowledgeBasePatterns.DELETE)
  async delete(id: string) {
    try {
      await this.weaviateService.deleteEntry(id);
      return { success: true };
    } catch (error) {
      console.error('Error deleting knowledge entry:', error);
      return { success: false, error: error.message };
    }
  }
}
