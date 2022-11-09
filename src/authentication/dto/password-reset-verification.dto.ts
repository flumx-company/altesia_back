import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';

export class PasswordResetVerification {
  @ApiProperty()
  token: string;

  @ApiProperty({
    example: 'someEmail@gmail.com',
  })
  @IsEmail()
  email: string;
}
