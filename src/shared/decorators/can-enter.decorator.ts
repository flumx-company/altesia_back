import { applyDecorators, UseGuards } from '@nestjs/common';

import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { RolesGuard } from '../guards/roles.guard';
import { RoleEnum } from '../../modules/role/enums/role.enum';

import { Roles } from './roles.decorator';

export function CanEnter(...roles: RoleEnum[]) {
  return applyDecorators(Roles(...roles), UseGuards(JwtAuthGuard, RolesGuard));
}
