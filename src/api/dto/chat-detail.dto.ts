import { IsString, IsArray, ValidateNested, IsDate, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { MessageRole } from '@libs/common';

export class MessageDto {
  @IsString()
  role: MessageRole;

  @IsString()
  content: string;
}

export class ChatDetailDto {
  @IsString()
  _id: string;

  @IsString()
  name: string;

  @IsString()
  userId: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MessageDto)
  messages: MessageDto[];

  @IsDate()
  createdAt: Date;

  @IsDate()
  updatedAt: Date;

  @IsOptional()
  @IsDate()
  deletedAt: Date | null;
}
