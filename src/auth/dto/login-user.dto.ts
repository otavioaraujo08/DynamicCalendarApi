import { ApiProperty } from '@nestjs/swagger';

export class LoginUserDto {
  @ApiProperty()
  readonly userName: string;
  @ApiProperty()
  readonly password: string;
}
