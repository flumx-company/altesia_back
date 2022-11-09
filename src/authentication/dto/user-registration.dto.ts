import { ApiProperty, OmitType } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, Length, Matches } from 'class-validator';

import { CreateUserProfileDto } from '../../modules/user/dto/create-user-profile.dto';

export class UserRegistrationDto extends OmitType(CreateUserProfileDto, [
  'expertise',
]) {
  @ApiProperty({
    example: 'user first name',
  })
  @IsNotEmpty()
  first_name: string;

  @ApiProperty({
    example: 'user last name',
  })
  @IsNotEmpty()
  last_name: string;

  @ApiProperty({
    example: 'someEmail@gmail.com',
  })
  @IsEmail({}, { message: 'Email is not valid' })
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
