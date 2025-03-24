import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserInfosDto {
  @ApiProperty()
  readonly userName: string;
  @ApiProperty()
  readonly picture: string;
}
