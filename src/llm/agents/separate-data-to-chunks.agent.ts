import { Prompt } from '../types';
import { BaseAgent, GetPromptInput } from './base.agent';

export class SeparateDataToChunksAgent extends BaseAgent {
  getPrompt(input: GetPromptInput): Prompt {
    const { prompt } = input;

    return {
      systemPrompt: prompt,
      userPrompt: `
          In system prompt you have prompt from user.
          Extract only data to add to knowledge base.
          Do not add any other text or comments, also do not translate it to any other language.
          answer in following format:
          {
            "title": "TITLE_OF_THE_DATA",
            "data": [
            "THIS_IS_FIRST_CHUNK_TO_ADD_TO_KNOWLEDGE_BASE"
            "THIS_IS_SECOND_CHUNK_TO_ADD_TO_KNOWLEDGE_BASE"
            "THIS_IS_THIRD_CHUNK_TO_ADD_TO_KNOWLEDGE_BASE"
            ]
          }
        `,
    };
  }
}
