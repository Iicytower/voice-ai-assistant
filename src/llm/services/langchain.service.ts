import { Injectable } from '@nestjs/common';
import { ChatOpenAI } from '@langchain/openai';
import { MessageRole, OpenRouterModel } from '@libs/common';
import { HumanMessage, AIMessage, SystemMessage } from '@langchain/core/messages';
import { BaseMessage } from '@langchain/core/messages';

type ChatInput = {
  prompt: string;
  history?: { role: MessageRole; content: string }[];
  systemMessage?: string;
  model?: OpenRouterModel;
};

@Injectable()
export class LangchainService {
  private model: ChatOpenAI;
  private defaultModel: OpenRouterModel =
    (process.env.OPENROUTER_DEFAULT_MODEL as OpenRouterModel) || OpenRouterModel.QWEN3_30B_FREE;

  private readonly defaultSystemMessage =
    'You are a helpful AI assistant that provides accurate and concise responses.';

  constructor() {
    this.model = new ChatOpenAI({
      configuration: {
        baseURL: 'https://openrouter.ai/api/v1',
        defaultHeaders: {
          'HTTP-Referer': process.env.SITE_URL || 'http://localhost:3000',
          'X-Title': process.env.APP_NAME || 'Voice AI Assistant',
        },
      },
      openAIApiKey: process.env.OPENROUTER_API_KEY,
      modelName: this.defaultModel,
      temperature: 0.7,
    });
  }

  async chat(input: ChatInput): Promise<string> {
    try {
      const { prompt, history, systemMessage, model } = input;

      if (model) {
        this.model.model = model;
      }

      const messages: BaseMessage[] = [
        new SystemMessage(systemMessage || this.defaultSystemMessage),
        ...history.map(msg =>
          msg.role === 'user' ? new HumanMessage(msg.content) : new AIMessage(msg.content),
        ),
        new HumanMessage(prompt),
      ];

      const response = await this.model.invoke(messages);
      return String(response.content);
    } catch (error) {
      console.error('Error in chat method:', error);
      throw new Error('Failed to get response from AI model');
    }
  }
}
