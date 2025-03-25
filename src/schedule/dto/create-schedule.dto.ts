import { ApiProperty } from '@nestjs/swagger';

export class CreateScheduleDto {
  @ApiProperty()
  readonly date: string;
  @ApiProperty()
  readonly startTime: string;
  @ApiProperty()
  readonly endTime: string;
  @ApiProperty()
  readonly dayOfTheWeek: string;
  @ApiProperty()
  readonly title: string;
  @ApiProperty()
  readonly description: string;
  @ApiProperty()
  readonly createdBy: string;
  @ApiProperty()
  readonly createdAt: string;
}
