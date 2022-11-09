import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { ROLES_KEY } from '../decorators/roles.decorator';
import { RoleEnum } from '../../modules/role/enums/role.enum';

type isRolesMatchedType = (
  requiredRoles: RoleEnum[],
  userRoles: RoleEnum[],
) => boolean;

const isRolesMatched: isRolesMatchedType = (requiredRoles, userRoles) => {
  return requiredRoles.some((item) => userRoles.includes(item));
};

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<RoleEnum[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();
    const userRoles: RoleEnum[] = (user.userRoles || []).map(
      (userRole) => userRole.role.name,
    );

    if (isRolesMatched(requiredRoles, userRoles)) {
      return true;
    }

    throw new ForbiddenException('You don`t have permission');
  }
}
