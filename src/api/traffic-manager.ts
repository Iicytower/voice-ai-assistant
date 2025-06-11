import { LLMPatterns, MessageBus, MessageRole, DatabasePatterns } from '@libs/common';
import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

import { HandleCreateActionService, HandleReadActionService } from './services';

type TrafficManagerInput = {
  prompt: string;
  chatId?: string;
  user: {
    _id: string;
    email: string;
    nickname: string;
  };
};

@Injectable()
export class TrafficManager {
  constructor(
    private readonly messageBus: MessageBus,
    private readonly handleCreateActionService: HandleCreateActionService,
    private readonly handleReadActionService: HandleReadActionService,
  ) {}

  async input(input: TrafficManagerInput) {
    const { prompt, user } = input;
    let { chatId } = input;

    const chat = chatId
      ? (await this.messageBus.send(DatabasePatterns.GET_CHAT, { userId: user._id, chatId })).chat
      : { messages: [] };

    const chatHistory =
      chat.messages?.map(item => ({
        role: item.role,
        content: item.content,
      })) || [];

    const actionType = await this.getActionType(prompt);

    let response: string;

    switch (actionType) {
      case 'create':
        response = await this.handleCreateActionService.handle(prompt, chatHistory);
        break;
      case 'read':
        response = await this.handleReadActionService.handle(prompt, chatHistory);
        break;
      case 'delete':
        response = 'delete action';
        break;
      case 'update':
        response = 'update action';
        break;

      default:
        throw new Error('Invalid type of request');
        break;
    }

    if (chatHistory.length === 0) {
      const newChatId = uuidv4();
      const { success, error } = await this.messageBus.send(DatabasePatterns.CREATE_CHAT, {
        _id: newChatId,
        userId: user._id,
        name: prompt.slice(0, 10),
        messages: [
          { _id: uuidv4(), role: MessageRole.USER, content: prompt },
          { _id: uuidv4(), role: MessageRole.ASSISTANT, content: response },
        ],
      });

      if (!success) {
        throw new Error(error);
      }

      chatId = newChatId;
    }

    if (chatHistory.length > 0) {
      const { success, error } = await this.messageBus.send(DatabasePatterns.UPDATE_CHAT, {
        id: chat._id,
        data: {
          messages: [
            ...chat.messages,
            { _id: uuidv4(), role: MessageRole.USER, content: prompt },
            { _id: uuidv4(), role: MessageRole.ASSISTANT, content: response },
          ],
        },
      });

      if (!success) {
        throw new Error(error);
      }

      chatId = chat._id;
    }

    const { chat: updatedChat } = await this.messageBus.send(DatabasePatterns.GET_CHAT, {
      userId: user._id,
      chatId,
    });

    return {
      response,
      chat: updatedChat,
    };
  }

  private async getActionType(prompt: string): Promise<string> {
    const actionType = await this.messageBus.send(LLMPatterns.GET_TYPE_OF_ACTION, {
      userPrompt: prompt,
    });

    if (!['create', 'read', 'update', 'delete'].includes(actionType)) {
      throw new Error('wrong action type');
    }

    return actionType;
  }
}
