import { IsString } from 'class-validator';

export class ChatListItemDto {
  @IsString()
  _id: string;

  @IsString()
  name: string;

  @IsString()
  userId: string;
}

export class ChatListResponseDto {
  chats: ChatListItemDto[];
}
