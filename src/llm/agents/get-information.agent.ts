import { Prompt } from '../types';
import { BaseAgent, GetPromptInput } from './base.agent';

export class GetInformationAgent extends BaseAgent {
  getPrompt(input: GetPromptInput): Prompt {
    const { prompt, additionalData } = input;

    return {
      userPrompt: `
          Please answer the user's request in the same language that user's request is in. Remember to use the context from system prompt.
          User's request is:
          \`\`\`
          ${prompt}
          \`\`\`
        `,
      systemPrompt: additionalData
        ? `
          This is context for user prompt:
          \`\`\`json
          ${additionalData}
          \`\`\`
        `
        : '',
    };
  }
}
