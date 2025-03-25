import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { Schedule } from './schedule/schema/schedule.schema';

@Module({
  imports: [
    MongooseModule.forRoot(
      `mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONG_PASSWORD}@dynamiccalendarcluster.d8fzz.mongodb.net/?retryWrites=true&w=majority&appName=DynamicCalendarCluster`,
    ),
    AuthModule,
    Schedule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
