import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';

import { AppAbility } from '../../modules/casl/casl-ability.factory';
import { PoliciesGuard } from '../guards/policies.guard';

export interface IPolicyHandler {
  handle(
    ability: AppAbility,
    params: Record<string, string>,
  ): Promise<boolean> | boolean;
}

type PolicyHandlerCallback = (
  ability: AppAbility,
  params: Record<string, string>,
) => boolean;

export declare type PolicyHandler = IPolicyHandler | PolicyHandlerCallback;

export const CHECK_POLICIES_KEY = 'check_policy';
export const CheckPolicies: any = (...handlers: PolicyHandler[]) =>
  applyDecorators(
    UseGuards(PoliciesGuard),
    SetMetadata(CHECK_POLICIES_KEY, handlers),
  );
