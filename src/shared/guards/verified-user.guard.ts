import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { UserStatusEnum } from 'src/modules/user/enums/user-status.enum';

import { RequestMethodEnum } from '../../common/enums/request-method.enum';

@Injectable()
export class VerifiedUserGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const whitelistUrls = ['/api/v1/client/user/profile'];
    const canOnlyUpdateProfile =
      user.status === UserStatusEnum.WAITING_FOR_ACCESS &&
      whitelistUrls.some((whiteListUrl) => whiteListUrl === request.url) &&
      request.method === RequestMethodEnum.PUT;
    if (user.status === UserStatusEnum.VERIFIED || canOnlyUpdateProfile) {
      return true;
    } else {
      throw new ForbiddenException(
        `You don\`t have permission. Your status is "${user.status}"`,
      );
    }
  }
}
