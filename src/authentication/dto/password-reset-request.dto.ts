import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';

export class PasswordResetRequest {
  @ApiProperty({
    example: 'someEmail@gmail.com',
  })
  @IsEmail({}, { message: 'Email is not valid' })
  email: string;
}
