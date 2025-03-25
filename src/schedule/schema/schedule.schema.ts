import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';

@Schema()
export class Schedule {
  @Prop({ default: () => new mongoose.Types.ObjectId() })
  id: string;

  @Prop({ required: true })
  date: string;

  @Prop({ required: true })
  startTime: string;

  @Prop({ required: true })
  endTime: string;

  @Prop({ required: true })
  dayOfTheWeek: string;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  createdBy: string;

  @Prop({})
  updatedBy: string;
}

export type ScheduleDocument = Schedule & Document;

export const ScheduleSchema = SchemaFactory.createForClass(Schedule);
