import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { ScheduleDto } from './dto/schedule.dto';
import { UpdateScheduleDto } from './dto/update-schedule.dto';
import { ScheduleService } from './schedule.service';

@ApiTags('schedule')
@Controller('schedule')
export class ScheduleController {
  constructor(private readonly scheduleService: ScheduleService) {}

  @ApiOperation({ summary: 'Get all schedules' })
  @ApiResponse({
    status: 200,
    description: 'Schedules found.',
    type: [ScheduleDto],
  })
  @ApiResponse({ status: 404, description: 'Schedules not found.' })
  @Get()
  async getAllSchedules(): Promise<ScheduleDto[]> {
    try {
      return await this.scheduleService.getAllSchedules();
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'An unexpected error occurred';
      throw new HttpException(errorMessage, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @ApiOperation({ summary: 'Get schedule by ID' })
  @ApiResponse({
    status: 200,
    description: 'Schedule found.',
    type: ScheduleDto,
  })
  @ApiResponse({ status: 404, description: 'Schedule not found.' })
  @Get('/:id')
  async getScheduleById(@Param('id') id: string): Promise<ScheduleDto> {
    try {
      const schedule = await this.scheduleService.getScheduleById(id);
      if (!schedule) {
        throw new HttpException('Schedule not found.', HttpStatus.NOT_FOUND);
      }
      return schedule;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'An unexpected error occurred';
      throw new HttpException(errorMessage, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @ApiOperation({ summary: 'Create Schedule' })
  @ApiResponse({ status: 201, description: 'Schedule created.' })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  @Post()
  async createSchedule(
    @Body() schedule: CreateScheduleDto,
  ): Promise<ScheduleDto> {
    try {
      return await this.scheduleService.createSchedule(schedule);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'An unexpected error occurred';
      throw new HttpException(errorMessage, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @ApiOperation({ summary: 'Update Schedule' })
  @ApiResponse({ status: 200, description: 'Schedule updated.' })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  @Put('/:id')
  async updateSchedule(
    @Param('id') id: string,
    @Body() schedule: UpdateScheduleDto,
  ): Promise<ScheduleDto> {
    try {
      return await this.scheduleService.updateSchedule(id, schedule);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'An unexpected error occurred';
      throw new HttpException(errorMessage, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @ApiOperation({ summary: 'Delete Schedule' })
  @ApiResponse({ status: 200, description: 'Schedule deleted.' })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  @Delete('/:id')
  async deleteSchedule(@Param('id') id: string): Promise<ScheduleDto> {
    try {
      return await this.scheduleService.deleteSchedule(id);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'An unexpected error occurred';
      throw new HttpException(errorMessage, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
