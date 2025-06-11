import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabasePatterns, MessageBus } from '@libs/common';
import { ChatListItemDto } from '../dto/chat-list.dto';
import { ChatDetailDto } from '../dto/chat-detail.dto';

@Injectable()
export class ChatService {
  constructor(private readonly messageBus: MessageBus) {}

  async getUserChats(userId: string): Promise<ChatListItemDto[]> {
    const { success, chats, error } = await this.messageBus.send(
      DatabasePatterns.GET_USER_CHATS,
      userId,
    );
    if (!success) {
      throw new Error(error);
    }
    return chats.map(chat => ({
      _id: chat._id,
      name: chat.name,
      userId: chat.userId,
    }));
  }

  async getUserChat(userId: string, chatId: string): Promise<ChatDetailDto | null> {
    const { success, chat, error } = await this.messageBus.send(DatabasePatterns.GET_CHAT, {
      userId,
      chatId,
    });
    if (!success) {
      throw new Error(error);
    }
    if (!chat) {
      return null;
    }

    return {
      _id: chat._id,
      name: chat.name,
      userId: chat.userId,
      messages: chat.messages,
      createdAt: chat.createdAt,
      updatedAt: chat.updatedAt,
      deletedAt: chat.deletedAt,
    };
  }

  async deleteMessages(userId: string, chatId: string, chatMessageIds: string[]) {
    const { success, error } = await this.messageBus.send(DatabasePatterns.DELETE_CHAT_MESSAGES, {
      userId,
      chatId,
      chatMessageIds,
    });

    if (!success) {
      throw new Error(error);
    }

    return { success: true };
  }

  async deleteChat(userId: string, chatId: string) {
    // First check if chat exists
    const {
      success: getChatSuccess,
      chat,
      error: getChatError,
    } = await this.messageBus.send(DatabasePatterns.GET_CHAT, { userId, chatId });

    if (!getChatSuccess) {
      throw new Error(getChatError);
    }

    if (!chat) {
      throw new NotFoundException('Chat not found');
    }

    const { success, error } = await this.messageBus.send(DatabasePatterns.DELETE_CHAT, chatId);
    if (!success) {
      throw new Error(error);
    }

    return { success: true };
  }
}
