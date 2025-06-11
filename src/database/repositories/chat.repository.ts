import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { GenericRepository } from '@libs/common';
import { Chat, ChatDocument } from '../entities/chat.entity';

@Injectable()
export class ChatRepository extends GenericRepository<ChatDocument> {
  constructor(
    @InjectModel(Chat.name)
    chatModel: Model<ChatDocument>,
  ) {
    super(chatModel);
  }

  async findOneByUserIdAndChatId(userId: string, chatId: string): Promise<ChatDocument | null> {
    return await this.model.findOne({ userId, _id: chatId }).exec();
  }

  async findAllByUserId(userId: string): Promise<ChatDocument[]> {
    return await this.findByFilters({ userId }, { select: '_id name userId' });
  }

  async deleteManyChatMessages(
    userId: string,
    chatId: string,
    chatMessageIds: string[],
  ): Promise<void> {
    await this.model.updateOne(
      { userId, _id: chatId },
      { $pull: { messages: { _id: { $in: chatMessageIds } } } },
    );
  }
}
