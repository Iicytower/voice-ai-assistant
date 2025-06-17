import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { BaseInputDto } from '../base.input.dto';
import { MessageRole } from '../../../types';
import { Type } from 'class-transformer';

class ChatHistoryDto {
  @IsEnum(MessageRole)
  role: MessageRole;

  @IsString()
  @IsNotEmpty()
  content: string;
}

export class GenerateResponseInputDto extends BaseInputDto {
  @IsString()
  @IsNotEmpty()
  userPrompt: string;

  @IsString()
  @IsNotEmpty()
  systemPrompt?: string;

  @IsOptional()
  additionalData?: any;

  @IsOptional()
  @IsArray()
  @MinLength(0)
  @ValidateNested({ each: true })
  @Type(() => ChatHistoryDto)
  history?: ChatHistoryDto[];
}
