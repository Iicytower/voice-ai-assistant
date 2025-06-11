import { Injectable } from '@nestjs/common';
import { DatabasePatterns, OnMessage } from '@libs/common';
import { ChatRepository, UserRepository } from './repositories';
import { Chat, User } from './entities';

type DeleteMessagesRequest = {
  userId: string;
  chatId: string;
  chatMessageIds: string[];
};

@Injectable()
export class DatabaseHandler {
  constructor(
    private readonly chatRepository: ChatRepository,
    private readonly userRepository: UserRepository,
  ) {}

  @OnMessage(DatabasePatterns.CREATE_CHAT)
  async createChat(data: Partial<Chat>) {
    try {
      const chat = await this.chatRepository.create(data);
      return { success: true, chat };
    } catch (error) {
      console.error('Error creating chat:', error);
      return { success: false, error: error.message };
    }
  }

  @OnMessage(DatabasePatterns.UPDATE_CHAT)
  async updateChat({ id, data }: { id: string; data: Partial<Chat> }) {
    try {
      const chat = await this.chatRepository.update(id, data);
      return { success: true, chat };
    } catch (error) {
      console.error('Error updating chat:', error);
      return { success: false, error: error.message };
    }
  }

  @OnMessage(DatabasePatterns.DELETE_CHAT)
  async deleteChat(id: string) {
    try {
      await this.chatRepository.hardDelete(id);
      return { success: true };
    } catch (error) {
      console.error('Error deleting chat:', error);
      return { success: false, error: error.message };
    }
  }

  @OnMessage(DatabasePatterns.GET_CHAT)
  async getChat({ userId, chatId }: { userId: string; chatId: string }) {
    try {
      const chat = await this.chatRepository.findOneByUserIdAndChatId(userId, chatId);
      return { success: true, chat };
    } catch (error) {
      console.error('Error getting chat:', error);
      return { success: false, error: error.message };
    }
  }

  @OnMessage(DatabasePatterns.GET_USER_CHATS)
  async getUserChats(userId: string) {
    try {
      const chats = await this.chatRepository.findAllByUserId(userId);
      return { success: true, chats };
    } catch (error) {
      console.error('Error getting user chats:', error);
      return { success: false, error: error.message };
    }
  }

  @OnMessage(DatabasePatterns.DELETE_CHAT_MESSAGES)
  async deleteChatMessages(request: DeleteMessagesRequest) {
    try {
      await this.chatRepository.deleteManyChatMessages(
        request.userId,
        request.chatId,
        request.chatMessageIds,
      );
      return { success: true };
    } catch (error) {
      console.error('Error deleting chat messages:', error);
      return { success: false, error: error.message };
    }
  }

  @OnMessage(DatabasePatterns.CREATE_USER)
  async createUser(data: Partial<User>) {
    try {
      const user = await this.userRepository.create(data);
      return { success: true, user };
    } catch (error) {
      console.error('Error creating user:', error);
      return { success: false, error: error.message };
    }
  }

  @OnMessage(DatabasePatterns.UPDATE_USER)
  async updateUser({ id, data }: { id: string; data: Partial<User> }) {
    try {
      const user = await this.userRepository.update(id, data);
      return { success: true, user };
    } catch (error) {
      console.error('Error updating user:', error);
      return { success: false, error: error.message };
    }
  }

  @OnMessage(DatabasePatterns.DELETE_USER)
  async deleteUser(id: string) {
    try {
      await this.userRepository.hardDelete(id);
      return { success: true };
    } catch (error) {
      console.error('Error deleting user:', error);
      return { success: false, error: error.message };
    }
  }

  @OnMessage(DatabasePatterns.GET_USER)
  async getUser(id: string) {
    try {
      const user = await this.userRepository.findById(id);
      return { success: true, user };
    } catch (error) {
      console.error('Error getting user:', error);
      return { success: false, error: error.message };
    }
  }

  @OnMessage(DatabasePatterns.GET_USER_BY_EMAIL)
  async getUserByEmail(email: string) {
    try {
      const user = await this.userRepository.findByEmail(email);
      return { success: true, user };
    } catch (error) {
      console.error('Error getting user by email:', error);
      return { success: false, error: error.message };
    }
  }
}
