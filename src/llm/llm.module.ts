import { MessageBusModule } from '@libs/common';
import { Module } from '@nestjs/common';
import { LLMHandler } from './llm.handler';
import { LangchainService } from './services';

@Module({
  imports: [MessageBusModule.register()],
  providers: [LLMHandler, LangchainService],
})
export class LLMModule {}
