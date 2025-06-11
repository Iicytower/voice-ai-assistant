import { MessageRole } from '@libs/common';
import { BaseAgent } from './agents';

export type Prompt = {
  userPrompt: string;
  systemPrompt?: string;
  additionalData?: any;
};

export type LLMRequest = Prompt & {
  history?: { role: MessageRole; content: string }[];
};

export type AgentClass<T extends BaseAgent = BaseAgent> = new (...args: any[]) => T;
