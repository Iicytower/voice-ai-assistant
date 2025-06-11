import { Injectable } from '@nestjs/common';
import { LLMPatterns, OnMessage } from '@libs/common';

@Injectable()
export class LLMHandler {
  @OnMessage(LLMPatterns.GET_TYPE_OF_ACTION)
  async getActionType() {
    return 'read';
  }

  @OnMessage(LLMPatterns.GET_INFORMATION)
  async getInformation() {
    return 'Test response from LLM';
  }

  @OnMessage(LLMPatterns.SEPARATE_DATA_TO_CHUNKS)
  async separateDataToChunks() {
    return { data: ['Test chunk 1', 'Test chunk 2'] };
  }
}
