import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserInfosDto {
  @ApiProperty()
  readonly username: string;
  @ApiProperty()
  readonly picture: string;
}
