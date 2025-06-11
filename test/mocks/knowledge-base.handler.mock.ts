import { Injectable } from '@nestjs/common';
import { KnowledgeBasePatterns, OnMessage } from '@libs/common';

@Injectable()
export class KnowledgeBaseHandler {
  @OnMessage(KnowledgeBasePatterns.CREATE)
  async create() {
    return { success: true };
  }

  @OnMessage(KnowledgeBasePatterns.READ)
  async read() {
    return {
      success: true,
      results: [
        {
          content: 'Test content',
          _additional: {
            certainty: 0.8,
          },
        },
      ],
    };
  }

  @OnMessage(KnowledgeBasePatterns.UPDATE)
  async update() {
    return { success: true };
  }

  @OnMessage(KnowledgeBasePatterns.DELETE)
  async delete() {
    return { success: true };
  }
}
