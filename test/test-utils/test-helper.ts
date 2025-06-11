import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AppModule } from '../../src/app.module';
import { TestContainer } from './test-container';
import { WeaviateService } from '../mocks/weaviate.service.mock';
import { LLMHandler } from '../mocks/llm.service.mock';
import { KnowledgeBaseHandler } from '../mocks/knowledge-base.handler.mock';

export class TestHelper {
  private static app: INestApplication;
  private static isInitialized = false;

  static async initApp(): Promise<INestApplication> {
    if (this.isInitialized && this.app) {
      return this.app;
    }

    try {
      // Start test containers first
      await TestContainer.start();

      // Create NestJS test module
      console.log('Creating NestJS test module...');
      const moduleRef = await Test.createTestingModule({
        imports: [AppModule],
      })
        .overrideProvider(WeaviateService)
        .useClass(WeaviateService)
        .overrideProvider(LLMHandler)
        .useClass(LLMHandler)
        .overrideProvider(KnowledgeBaseHandler)
        .useClass(KnowledgeBaseHandler)
        .compile();

      // Create app instance
      console.log('Creating NestJS application...');
      const app = moduleRef.createNestApplication();

      // Apply the same settings as in main.ts
      app.setGlobalPrefix('api');
      app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));

      console.log('Initializing NestJS application...');
      await app.init();
      console.log('NestJS application initialized successfully');

      this.app = app;
      this.isInitialized = true;
      return app;
    } catch (error) {
      console.error('Error initializing test application:', error);
      await this.cleanup();
      throw error;
    }
  }

  static async cleanup() {
    try {
      if (this.app) {
        console.log('Closing NestJS application...');
        await this.app.close();
        console.log('NestJS application closed successfully');
      }
    } catch (error) {
      console.error('Error closing NestJS application:', error);
    } finally {
      this.app = null;
      this.isInitialized = false;

      // Always try to stop containers
      await TestContainer.stop();
    }
  }

  static getApp(): INestApplication {
    if (!this.isInitialized || !this.app) {
      throw new Error('Test application not initialized');
    }
    return this.app;
  }
}
