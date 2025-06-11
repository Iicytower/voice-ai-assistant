import { DynamicModule, Global, Module } from '@nestjs/common';
import { DiscoveryModule, MetadataScanner } from '@nestjs/core';
import { MessageBus } from './messageBus';

@Global()
@Module({})
export class MessageBusModule {
  static register(): DynamicModule {
    return {
      module: MessageBusModule,
      imports: [DiscoveryModule],
      providers: [MessageBus, MetadataScanner],
      exports: [MessageBus],
    };
  }
}
