import { ApiProperty } from '@nestjs/swagger';
import { UserDto } from 'src/auth/dto/user.dto';

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
  readonly createdBy: UserDto | string | null;
  @ApiProperty()
  readonly updatedBy: UserDto | string | null;
}
