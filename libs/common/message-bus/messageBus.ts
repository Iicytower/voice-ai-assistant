import { Injectable, OnModuleInit } from '@nestjs/common';
import { ModuleRef, DiscoveryService, MetadataScanner } from '@nestjs/core';
import { EventPattern, MessagePattern } from './messageBus.types';
import { EVENT_HANDLER, MESSAGE_HANDLER } from './messageBus.constants';

@Injectable()
export class MessageBus implements OnModuleInit {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
  private messageHandlers = new Map<MessagePattern, Function>();
  // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
  private eventHandlers = new Map<EventPattern, Function[]>();

  constructor(
    private readonly moduleRef: ModuleRef,
    private readonly discoveryService: DiscoveryService,
    private readonly metadataScanner: MetadataScanner,
  ) {}

  async onModuleInit() {
    const providers = this.discoveryService.getProviders();

    for (const wrapper of providers) {
      const { instance } = wrapper;
      if (!instance || typeof instance !== 'object') continue;

      const prototype = Object.getPrototypeOf(instance);
      const methodNames = this.metadataScanner.getAllMethodNames(prototype);

      for (const methodName of methodNames) {
        const methodRef = prototype[methodName];
        if (typeof methodRef !== 'function') continue;

        const handler = methodRef.bind(instance);

        const messagePattern = Reflect.getMetadata(MESSAGE_HANDLER, prototype, methodName);
        if (messagePattern) {
          this.messageHandlers.set(messagePattern, handler);
        }

        const eventPattern = Reflect.getMetadata(EVENT_HANDLER, prototype, methodName);
        if (eventPattern) {
          const handlers = this.eventHandlers.get(eventPattern) || [];
          handlers.push(handler);
          this.eventHandlers.set(eventPattern, handlers);
        }
      }
    }
  }

  async send<T = any, R = any>(pattern: MessagePattern, message: T): Promise<R> {
    const handler = this.messageHandlers.get(pattern);
    if (!handler) {
      throw new Error(`No message handler for pattern "${pattern}"`);
    }
    return await handler(message);
  }

  async emit<T = any>(pattern: EventPattern, event: T): Promise<void> {
    const handlers = this.eventHandlers.get(pattern) || [];
    for (const handler of handlers) {
      await handler(event);
    }
  }
}
