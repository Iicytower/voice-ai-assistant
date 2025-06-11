import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class InputApiDto {
  @IsString()
  @IsNotEmpty()
  prompt: string;

  @IsOptional()
  @IsString()
  chatId?: string;

  @IsOptional()
  @IsString()
  chatName?: string;
}
