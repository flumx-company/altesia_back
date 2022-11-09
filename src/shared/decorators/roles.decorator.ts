import { applyDecorators, SetMetadata } from '@nestjs/common';

import { RoleEnum } from '../../modules/role/enums/role.enum';

import { SwaggerAuth } from './swagger/swagger-auth.decorator';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: RoleEnum[]) =>
  applyDecorators(SwaggerAuth(), SetMetadata(ROLES_KEY, roles));
