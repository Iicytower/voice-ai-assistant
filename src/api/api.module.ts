import { Module } from '@nestjs/common';
import { TrafficManager } from './traffic-manager';
import { ApiController } from './api.controller';
import { ChatController } from './chat.controller';
import { MessageBusModule } from '@libs/common';
import { HandleCreateActionService, HandleReadActionService } from './services';
import { ChatService } from './services/chat.service';
import { AuthModule } from './auth/auth.module';

const services = [HandleCreateActionService, HandleReadActionService, ChatService];

@Module({
  imports: [MessageBusModule.register(), AuthModule],
  controllers: [ApiController, ChatController],
  providers: [TrafficManager, ...services],
})
export class ApiModule {}
