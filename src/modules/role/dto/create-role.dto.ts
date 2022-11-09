import { ApiProperty } from '@nestjs/swagger';

import { RoleEnum } from '../enums/role.enum';

export class CreateRoleDto {
  @ApiProperty({
    required: true,
    enum: [RoleEnum.ADMIN, RoleEnum.USER, RoleEnum.SUPER_ADMIN],
  })
  name: RoleEnum;
}
