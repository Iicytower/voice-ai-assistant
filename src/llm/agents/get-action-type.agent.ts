import { OpenRouterModel } from '@libs/common';
import { Prompt } from '../types';
import { BaseAgent, GetPromptInput } from './base.agent';

export class GetActionTypeAgent extends BaseAgent {
  constructor() {
    super(OpenRouterModel.QWEN3_30B_FREE); //TODO when i will buy tokens, should set the fastest model for this agent
  }

  getPrompt(input: GetPromptInput): Prompt {
    const { prompt } = input;

    return {
      systemPrompt: 'You are a helpful assistant that can help the user with their request.',
      userPrompt: `
        The user's request is: 
        \`\`\`
        ${prompt}
        \`\`\`
        You need to choose the type of action to perform.
        The type of action can be: create, read, delete, update.
        Return the type of action in JSON format.
        Example:
        {
          "actionType": "create"
        }
        Answer only with the valid JSON. Do not need any other text.
        `,
    };
  }
}
