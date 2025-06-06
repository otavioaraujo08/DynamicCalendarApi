import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ collection: 'users' })
export class User {
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
