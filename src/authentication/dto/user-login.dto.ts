import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, Length, Matches } from 'class-validator';

export class UserLoginDto {
  @ApiProperty({
    example: 'someEmail@gmail.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'someHardPassword1',
  })
  @Length(6, 20, { message: 'Password must have 6-20 chars' })
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'Password should have at least one number and one capital letter',
  })
  password: string;
}
