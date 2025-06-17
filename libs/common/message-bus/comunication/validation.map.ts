import { BaseInputDto, BaseOutputDto } from '../dto';
import { PlainTextOutputDto } from '../dto/common/plain-text.dto';
import { GenerateResponseInputDto } from '../dto/llm/generate-response.input.dto';
import { DatabasePatterns } from './database.patterns';
import { KnowledgeBasePatterns } from './knowledge-base.patterns';
import { LLMPatterns } from './llm.patterns';

export type MessagePattern = LLMPatterns | KnowledgeBasePatterns | DatabasePatterns;
export type EventPattern = string;

type ValidationMapItem = {
  pattern: MessagePattern;
  input: new () => BaseInputDto;
  output: new () => BaseOutputDto;
};

export const VALIDATION_MAP = new Map<MessagePattern, ValidationMapItem>([
  [
    LLMPatterns.GENERATE_RESPONSE,
    {
      pattern: LLMPatterns.GENERATE_RESPONSE,
      input: GenerateResponseInputDto,
      output: PlainTextOutputDto,
    },
  ],
]);
