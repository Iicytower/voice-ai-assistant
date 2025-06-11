import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { TrafficManager } from './traffic-manager';
import { InputApiDto } from './dto/input-api.dto';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { CurrentUser } from './auth/decorators/current-user.decorator';
import { User } from '../database/entities/user.entity';

@Controller('prompt')
export class ApiController {
  constructor(private readonly trafficManager: TrafficManager) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  input(@Body() input: InputApiDto, @CurrentUser() user: User) {
    return this.trafficManager.input({
      prompt: input.prompt,
      chatId: input.chatId || null,
      user: {
        _id: user._id,
        email: user.email,
        nickname: user.nickname,
      },
    });
  }
}
