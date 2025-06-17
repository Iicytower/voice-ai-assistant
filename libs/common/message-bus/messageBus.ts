import { Injectable, OnModuleInit } from '@nestjs/common';
import { ModuleRef, DiscoveryService, MetadataScanner } from '@nestjs/core';
import { MessageBusInputDto, MessageBusOutputDto } from './messageBus.types';
import { EVENT_HANDLER, MESSAGE_HANDLER } from './messageBus.constants';
import { instanceToPlain, plainToClass } from 'class-transformer';
import { validateOrReject } from 'class-validator';
import { EventPattern, MessagePattern, VALIDATION_MAP } from './comunication';
import { BaseOutputDto } from './dto';

/**
 * stworzyć obiekty podobne do:
 * { pattern: string, inputDto: MessageBusInputDto, outputDto: MessageBusOutputDto }
 * niech dtoski będą dodawane w libsach i reszta ma się dziać pod spodem.
 * czyli używając messageBus podajemy sam pattern, a automatycznie jest wygenerowana mapa,
 * która po kluczu (comunication pattern) jest w stanie znaleźć input i output i zweryfikować dane
 * 1. robimy dto input i output
 * 2. robimy obiekt z patternem, inputDto i outputDto
 * 3. używamy
 *
 * pod spodem:
 * 1. przy starcie aplikacji jest tworzona mapa z patternami i dtoskami
 * 2. przy wywołaniu send jest sprawdzana poprawność danych wejściowych (zgodnie z input dto)
 * 3. przy odebraniu danych od magic boxa jest sprawdzana poprawność danych wyjściowych (zgodnie z output dto)
 */
@Injectable()
export class MessageBus implements OnModuleInit {
  private messageHandlers = new Map<MessagePattern, Function>();
  private eventHandlers = new Map<EventPattern, Function[]>();
  private validationMap = VALIDATION_MAP;

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

  async send(pattern: MessagePattern, data: Record<string, any>): Promise<BaseOutputDto> {
    const handler = this.messageHandlers.get(pattern);
    if (!handler) {
      throw new Error(`No message handler for pattern "${pattern}"`);
    }

    const validationMapItem = this.getValidationMapItem(pattern);
    if (!validationMapItem) {
      throw new Error(`No validation map item for pattern "${pattern}"`);
    }

    const validatedData = await this.validateDto(validationMapItem.input, data);

    const result = await handler(validatedData);

    const validatedResult = await this.validateDto(validationMapItem.output, result);

    return validatedResult;
  }

  async emit<T = any>(pattern: EventPattern, event: T): Promise<void> {
    const handlers = this.eventHandlers.get(pattern) || [];
    for (const handler of handlers) {
      await handler(event);
    }
  }

  private getValidationMapItem(pattern: MessagePattern) {
    return this.validationMap.get(pattern);
  }

  private async validateDto(
    Dto: MessageBusInputDto | MessageBusOutputDto,
    data: Record<string, any>,
  ) {
    const plain = instanceToPlain(data);
    const dto = plainToClass(Dto, plain, {});

    await validateOrReject(dto, { whitelist: true });

    return dto;
  }
}
