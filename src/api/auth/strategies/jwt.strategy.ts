import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { DatabasePatterns, MessageBus } from '@libs/common';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly messageBus: MessageBus) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET || 'your-secret-key',
    });
  }

  async validate(payload: any) {
    const { success, user, error } = await this.messageBus.send(
      DatabasePatterns.GET_USER,
      payload.sub,
    );

    if (!success) {
      throw new Error(error);
    }

    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
