import { Module } from '@nestjs/common';
import { KnowledgeBaseHandler } from './knowledge-base.handler';
import { MessageBusModule } from '@libs/common';
import { WeaviateService } from './weaviate.service';

@Module({
  imports: [MessageBusModule.register()],
  providers: [KnowledgeBaseHandler, WeaviateService],
})
export class KnowledgeBaseModule {}
