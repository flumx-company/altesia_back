import { ApiProperty } from '@nestjs/swagger';
import { IsMobilePhone } from 'class-validator';

export class CreateUserProfileDto {
  @ApiProperty({
    example: 'country name',
  })
  country: string;

  @ApiProperty({
    example: '+31636363634',
  })
  @IsMobilePhone()
  phone_number: string;

  @ApiProperty({
    example: 'some degree',
  })
  degree: string;

  @ApiProperty({
    example: 'some experience',
  })
  experience: string;

  @ApiProperty({
    example: 'some expertise',
  })
  expertise: string;
}
