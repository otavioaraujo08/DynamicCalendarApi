import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { AuthService } from 'src/auth/auth.service';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { ScheduleDto } from './dto/schedule.dto';
import { UpdateScheduleDto } from './dto/update-schedule.dto';
import { Schedule, ScheduleDocument } from './schema/schedule.schema';

@Injectable()
export class ScheduleService {
  private readonly logger = new Logger(ScheduleService.name);

  constructor(
    @InjectModel(Schedule.name) private scheduleModel: Model<ScheduleDocument>,
    private readonly authService: AuthService,
  ) {}

  async getAllSchedules(): Promise<ScheduleDto[]> {
    this.logger.log('Getting all schedules');
    const schedules = await this.scheduleModel.find().exec();
    this.logger.log(`Found ${schedules.length} schedules`);
    return schedules;
  }

  async getScheduleById(id: string): Promise<ScheduleDto | null> {
    this.logger.log(`Getting schedule with id: ${id}`);
    const schedule = await this.scheduleModel.findById(id).exec();
    if (!schedule) {
      this.logger.error(`Schedule with id: ${id} not found`);
      return null;
    }
    this.logger.log(`Found schedule with id: ${id}`);
    return schedule;
  }

  async createSchedule(schedule: CreateScheduleDto): Promise<Schedule> {
    this.logger.log('Creating schedule');

    console.log('-X-X-X-X-X-X-X-X-X-X');
    console.log(schedule);
    console.log('-X-X-X-X-X-X-X-X-X-X');

    const requiredFields = [
      'date',
      'startTime',
      'endTime',
      'dayOfTheWeek',
      'title',
      'description',
      'createdBy',
    ];
    for (const field of requiredFields) {
      if (!schedule[field]) {
        this.logger.error(`Missing required field: ${field}`);
        throw new BadRequestException(`Missing required field: ${field}`);
      }
    }

    if (!Types.ObjectId.isValid(schedule.createdBy)) {
      this.logger.error(
        `Invalid ObjectId for createdBy: ${schedule.createdBy}`,
      );
      throw new BadRequestException(`Invalid ObjectId for createdBy`);
    }

    const userExists = await this.authService.findUserById(schedule.createdBy);
    if (!userExists) {
      this.logger.error(`User with id: ${schedule.createdBy} not found`);
      throw new NotFoundException(
        `User with id: ${schedule.createdBy} not found`,
      );
    }

    const createdSchedule = new this.scheduleModel({
      ...schedule,
      createdAt: new Date(),
    });
    this.logger.log(`Schedule created: ${schedule.title}`);
    return createdSchedule.save();
  }

  async updateSchedule(
    id: string,
    schedule: UpdateScheduleDto,
  ): Promise<Schedule> {
    this.logger.log(`Updating schedule with id: ${id}`);

    const requiredFields = [
      'date',
      'startTime',
      'endTime',
      'dayOfTheWeek',
      'title',
      'description',
      'updatedBy',
    ];
    for (const field of requiredFields) {
      if (!schedule[field]) {
        this.logger.error(`Missing required field: ${field}`);
        throw new BadRequestException(`Missing required field: ${field}`);
      }
    }

    if (!Types.ObjectId.isValid(schedule.updatedBy)) {
      this.logger.error(
        `Invalid ObjectId for updatedBy: ${schedule.updatedBy}`,
      );
      throw new BadRequestException(`Invalid ObjectId for updatedBy`);
    }

    const userExists = await this.authService.findUserById(schedule.updatedBy);
    if (!userExists) {
      this.logger.error(`User with id: ${schedule.updatedBy} not found`);
      throw new NotFoundException(
        `User with id: ${schedule.updatedBy} not found`,
      );
    }

    const updatedSchedule = await this.scheduleModel
      .findByIdAndUpdate(
        id,
        { ...schedule, updatedAt: new Date() },
        { new: true },
      )
      .exec();
    if (!updatedSchedule) {
      this.logger.error(`Schedule with id: ${id} not found`);
      throw new NotFoundException(`Schedule with id: ${id} not found`);
    }
    this.logger.log(`Schedule updated: ${schedule.title}`);
    return updatedSchedule;
  }

  async deleteSchedule(id: string): Promise<Schedule> {
    this.logger.log(`Deleting schedule with id: ${id}`);
    const deletedSchedule = await this.scheduleModel
      .findByIdAndDelete(id)
      .exec();
    if (!deletedSchedule) {
      this.logger.error(`Schedule with id: ${id} not found`);
      throw new NotFoundException(`Schedule with id: ${id} not found`);
    }
    this.logger.log(`Schedule deleted: ${deletedSchedule.title}`);
    return deletedSchedule;
  }
}
