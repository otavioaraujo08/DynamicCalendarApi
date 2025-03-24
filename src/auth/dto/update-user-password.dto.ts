import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserPasswordDto {
  @ApiProperty()
  readonly oldPassword: string;
  @ApiProperty()
  readonly newPassword: string;
}
