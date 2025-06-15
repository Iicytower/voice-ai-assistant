import { KnowledgeBasePatterns, OnMessage } from '@libs/common';
import { Injectable } from '@nestjs/common';
import { WeaviateService } from './weaviate.service';
import { KnowledgeEntryMetadata } from '@libs/common';

type UpdateKnowledgeRequest = {
  id: string;
  content: string;
  metadata?: KnowledgeEntryMetadata;
};

type CreateKnowledgeRequest = {
  dataToAddToKnowledgeBase: string[];
  metadata?: KnowledgeEntryMetadata;
};

@Injectable()
export class KnowledgeBaseHandler {
  constructor(private readonly weaviateService: WeaviateService) {}

  @OnMessage(KnowledgeBasePatterns.CREATE)
  async create(input: CreateKnowledgeRequest) {
    const { dataToAddToKnowledgeBase, metadata } = input;
    try {
      for await (const chunk of dataToAddToKnowledgeBase) {
        await this.weaviateService.addEntry({ content: chunk, metadata });
      }

      return { success: true };
    } catch (error) {
      console.error('Error creating knowledge entry:', error);
      return { success: false, error: error.message };
    }
  }

  @OnMessage(KnowledgeBasePatterns.READ)
  async read(payload: { prompt: string; metadataFilter?: Partial<KnowledgeEntryMetadata> }) {
    try {
      const { prompt, metadataFilter } = payload;
      const results = await this.weaviateService.searchSimilar(prompt, 10, metadataFilter);

      return { success: !!results.length, results };
    } catch (error) {
      console.error('Error searching knowledge base:', error);
      return { success: false, error: error.message };
    }
  }

  @OnMessage(KnowledgeBasePatterns.UPDATE)
  async update(request: UpdateKnowledgeRequest) {
    try {
      await this.weaviateService.updateEntry(request);
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
