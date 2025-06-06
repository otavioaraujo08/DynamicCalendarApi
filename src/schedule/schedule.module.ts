import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from 'src/auth/auth.module';
import { ScheduleController } from './schedule.controller';
import { ScheduleService } from './schedule.service';
import { Schedule, ScheduleSchema } from './schema/schedule.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Schedule.name, schema: ScheduleSchema },
    ]),
    AuthModule,
  ],
  controllers: [ScheduleController],
  providers: [ScheduleService],
  exports: [ScheduleService],
})
export class ScheduleModule {}
