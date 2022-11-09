import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import {
  AppAbility,
  CaslAbilityFactory,
} from '../../modules/casl/casl-ability.factory';
import {
  CHECK_POLICIES_KEY,
  PolicyHandler,
} from '../decorators/check-policies.decorator';

@Injectable()
export class PoliciesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private caslAbilityFactory: CaslAbilityFactory,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const policyHandlers =
      this.reflector.get<PolicyHandler[]>(
        CHECK_POLICIES_KEY,
        context.getHandler(),
      ) || [];

    const { user, params } = context.switchToHttp().getRequest();
    const ability = this.caslAbilityFactory.createForUser(user);

    const policyHandlersResolvedPromises = await Promise.all(
      policyHandlers.map((handler) =>
        PoliciesGuard.execPolicyHandler(handler, ability, params),
      ),
    );

    if (policyHandlersResolvedPromises.every(Boolean)) {
      return true;
    }

    throw new ForbiddenException('Forbidden resource. You are not the owner');
  }

  private static execPolicyHandler(
    handler: PolicyHandler,
    ability: AppAbility,
    params: Record<string, string>,
  ) {
    if (typeof handler === 'function') {
      return handler(ability, params);
    }
    return handler.handle(ability, params);
  }
}
