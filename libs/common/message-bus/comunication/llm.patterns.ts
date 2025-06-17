import { PlainTextOutputDto } from '../dto/common/plain-text.dto';
import { GenerateResponseInputDto } from '../dto/llm/generate-response.input.dto';

export enum LLMPatterns {
  GENERATE_RESPONSE = 'llm.generate-response',
  GET_TYPE_OF_ACTION = 'llm.get-action-type',
  GET_INFORMATION = 'llm.get-information',
  // SEPARATE_DATA_TO_CHUNKS = 'llm.separate-data-to-chunks',
  CREATE_METADATA_FOR_KNOWLEDGE_BASE = 'llm.create-metadata-for-knowledge-base',
}

export const LLM_PATTERNS = {
  [LLMPatterns.GENERATE_RESPONSE]: {
    pattern: LLMPatterns.GENERATE_RESPONSE,
    input: GenerateResponseInputDto,
    output: PlainTextOutputDto,
  },
};
