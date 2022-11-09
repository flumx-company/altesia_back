import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';

export class ResendConfirmationEmailCodeDto {
  @ApiProperty({
    example: 'someEmail@gmail.com',
  })
  @IsEmail()
  email: string;
}
