import { BaseInputDto, BaseOutputDto } from './dto';

export type MessageBusInputDto = new () => BaseInputDto;
export type MessageBusOutputDto = new () => BaseOutputDto;
