import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';

@Schema()
export class User {
  @Prop({ default: () => new mongoose.Types.ObjectId() })
  id: string;

  @Prop({ required: true })
  userName: string;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: '#123@123#' })
  password: string;

  @Prop({
    default: 'https://docs.nestjs.com/assets/logo-small-gradient.svg',
  })
  picture: string;
}

export type UserDocument = User & Document;

export const UserSchema = SchemaFactory.createForClass(User);
