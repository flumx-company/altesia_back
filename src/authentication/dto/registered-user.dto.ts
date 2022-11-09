import { ApiProperty } from '@nestjs/swagger';

export class RegisteredUserDto {
  @ApiProperty()
  id: number;
}
