import { MessageRole } from '@libs/common';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

export type ChatDocument = Chat & Document;

@Schema({ timestamps: true })
export class Message {
  @Prop({ type: String, default: uuidv4 })
  _id: string;

  @Prop({ type: String, enum: MessageRole, required: true })
  role: MessageRole;

  @Prop({ type: String, required: true })
  content: string;
}

const MessageSchema = SchemaFactory.createForClass(Message);

@Schema({ timestamps: true })
export class Chat {
  @Prop({ type: String, required: true, default: uuidv4 })
  _id: string;

  @Prop({ type: String, required: false })
  name: string;

  @Prop({ type: [MessageSchema], required: true })
  messages: Message[];

  @Prop({ type: MongooseSchema.Types.String, ref: 'User', required: true })
  userId: string;

  @Prop()
  deletedAt: Date | null;

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;
}

export const ChatSchema = SchemaFactory.createForClass(Chat);
