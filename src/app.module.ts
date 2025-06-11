import { Module } from '@nestjs/common';
import { ApiModule } from './api/api.module';
import { KnowledgeBaseModule } from './knowledge-base/knowledge-base.module';
import { MessageBusModule } from '@libs/common';
import { ConfigModule } from '@nestjs/config';
import { LLMModule } from './llm/llm.module';
import { DatabaseModule } from './database/database.module';
import databaseConfig from './database/database.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env'],
      load: [databaseConfig],
    }),
    MessageBusModule.register(),
    DatabaseModule,
    ApiModule,
    KnowledgeBaseModule,
    LLMModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
