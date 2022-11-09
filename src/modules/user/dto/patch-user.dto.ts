import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';

import { UserStatusEnum } from '../enums/user-status.enum';

export class PatchUserDto {
  @ApiProperty({
    example: 5,
  })
  internal_rating: number;

  @ApiProperty({
    enum: [UserStatusEnum.PENDING, UserStatusEnum.VERIFIED],
  })
  @IsEnum(UserStatusEnum, {
    message: `status must be a valid enum value. Valid values are: ${UserStatusEnum.VERIFIED}, ${UserStatusEnum.WAITING_FOR_ACCESS}, ${UserStatusEnum.PENDING}`,
  })
  status: UserStatusEnum;
}
