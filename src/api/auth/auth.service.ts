import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { DatabasePatterns, MessageBus } from '@libs/common';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class AuthService {
  constructor(
    private readonly messageBus: MessageBus,
    private readonly jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto) {
    const {
      success: checkSuccess,
      user: existingUser,
      error: checkError,
    } = await this.messageBus.send(DatabasePatterns.GET_USER_BY_EMAIL, registerDto.email);

    if (!checkSuccess) {
      throw new Error(checkError);
    }

    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    const hashedPassword = await bcrypt.hash(registerDto.password, 10);
    const { success, user, error } = await this.messageBus.send(DatabasePatterns.CREATE_USER, {
      _id: uuidv4(),
      email: registerDto.email,
      nickname: registerDto.nickname,
      password: hashedPassword,
    });

    if (!success) {
      throw new Error(error);
    }

    const token = this.generateToken(user);
    return { token };
  }

  async login(loginDto: LoginDto) {
    const { success, user, error } = await this.messageBus.send(
      DatabasePatterns.GET_USER_BY_EMAIL,
      loginDto.email,
    );

    if (!success) {
      throw new Error(error);
    }

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(loginDto.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const token = this.generateToken(user);
    return { token };
  }

  private generateToken(user: any) {
    const payload = {
      sub: user._id,
      nickname: user.nickname,
    };
    return this.jwtService.sign(payload);
  }
}
