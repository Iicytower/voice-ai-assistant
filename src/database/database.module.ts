import { Module, OnApplicationShutdown } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import { MessageBusModule } from '@libs/common';
import databaseConfig from './database.config';
import { User, UserSchema, Chat, ChatSchema } from './entities';
import { DatabaseHandler } from './database.handler';
import { ChatRepository, UserRepository } from './repositories';

@Module({
  imports: [
    ConfigModule.forFeature(databaseConfig),
    MessageBusModule.register(),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('database.uri'),
        serverSelectionTimeoutMS: configService.get<number>('database.serverSelectionTimeoutMS'),
        maxPoolSize: configService.get<number>('database.maxPoolSize'),
        autoCreate: true, // Automatically creates database if it doesn't exist
        connectionFactory: (connection: Connection) => {
          connection.on('connected', () => {
            console.log('MongoDB connection established');
          });
          connection.on('disconnected', () => {
            console.log('MongoDB connection disconnected');
          });
          connection.on('error', error => {
            console.error('MongoDB connection error:', error);
          });
          return connection;
        },
      }),
      inject: [ConfigService],
    }),
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Chat.name, schema: ChatSchema },
    ]),
  ],
  providers: [DatabaseHandler, ChatRepository, UserRepository],
})
export class DatabaseModule implements OnApplicationShutdown {
  constructor(private readonly configService: ConfigService) {}

  async onApplicationShutdown() {
    // Ensure clean shutdown of database connections
    const connection = (await import('mongoose')).default.connection;
    await connection.close();
  }
}
