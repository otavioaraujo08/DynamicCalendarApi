import { ApiProperty } from '@nestjs/swagger';

export class ScheduleDto {
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
  readonly updatedBy: string;
}
