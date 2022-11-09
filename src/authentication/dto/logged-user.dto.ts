import { ApiProperty } from '@nestjs/swagger';

export class LoggedUser {
  @ApiProperty()
  token: string;
}
