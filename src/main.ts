import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const globalPrefix = 'api';
  const PORT = process.env.PORT || 3000;

  app.getHttpAdapter().getInstance().disable('x-powered-by');
  app.setGlobalPrefix(globalPrefix);
  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));

  await app.listen(PORT);
  Logger.log(`🚀 Application is running on: http://localhost:${PORT}/${globalPrefix}`);
}
bootstrap();
