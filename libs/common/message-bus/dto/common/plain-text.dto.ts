import { IsNotEmpty, IsString } from 'class-validator';
import { BaseInputDto } from '../base.input.dto';
import { BaseOutputDto } from '../base.output.dto';

export class PlainTextInputDto extends BaseInputDto {
  @IsString()
  @IsNotEmpty()
  text: string;
}

export class PlainTextOutputDto extends BaseOutputDto {
  @IsString()
  @IsNotEmpty()
  text: string;
}
