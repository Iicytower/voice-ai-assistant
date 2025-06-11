import { Controller, Get, UseGuards, NotFoundException, Query, Delete } from '@nestjs/common';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { CurrentUser } from './auth/decorators/current-user.decorator';
import { User } from '../database/entities/user.entity';
import { ChatService } from './services/chat.service';
import { ChatListResponseDto } from './dto/chat-list.dto';
import { ChatDetailDto } from './dto/chat-detail.dto';

@Controller('chats')
@UseGuards(JwtAuthGuard)
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Get('findAll')
  async getUserChats(@CurrentUser() user: User): Promise<ChatListResponseDto> {
    const chats = await this.chatService.getUserChats(user._id);
    return { chats };
  }

  @Get('findOne')
  async getUserChat(
    @CurrentUser() user: User,
    @Query('id') chatId: string,
  ): Promise<ChatDetailDto> {
    const chat = await this.chatService.getUserChat(user._id, chatId);
    if (!chat) {
      throw new NotFoundException('Chat not found');
    }
    return chat;
  }

  @Delete('delete-messages')
  async deleteMessages(
    @CurrentUser() user: User,
    @Query('chatId') chatId: string,
    @Query('chatMessageIds') chatMessageIds: string,
  ) {
    await this.chatService.deleteMessages(user._id, chatId, chatMessageIds.split(','));

    return { success: true };
  }

  @Delete('delete')
  async deleteChat(@CurrentUser() user: User, @Query('chatId') chatId: string) {
    return await this.chatService.deleteChat(user._id, chatId);
  }
}
