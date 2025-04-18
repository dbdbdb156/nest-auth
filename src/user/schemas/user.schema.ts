import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop({ required: true, unique: true, index: true })
  id: string;

  @Prop({ required: true })
  nickname: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ type: [String], default: ['guest'] })
  roles: string[];
}

export const UserSchema = SchemaFactory.createForClass(User);