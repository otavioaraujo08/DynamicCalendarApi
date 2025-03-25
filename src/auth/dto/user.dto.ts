import { ApiProperty } from '@nestjs/swagger';

export class UserDto {
  @ApiProperty()
  readonly _id: string;
  @ApiProperty()
  readonly username: string;
  @ApiProperty()
  readonly picture: string;
}
