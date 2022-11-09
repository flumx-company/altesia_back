import { getConnection } from 'typeorm';

import { IPolicyHandler } from '../../decorators/check-policies.decorator';
import { AppAbility } from '../../../modules/casl/casl-ability.factory';
import { PolicyActionEnum } from '../../../common/enums/policy-action.enum';
import { CommunityResponseEntity } from '../../models/community-response.entity';

export class UpdateCommunityResponseHandler implements IPolicyHandler {
  async handle(ability: AppAbility, params: Record<string, string>) {
    const communityResponse = await getConnection()
      .getRepository(CommunityResponseEntity)
      .findOneOrFail(params.id, {
        relations: ['user'],
      });
    return ability.can(PolicyActionEnum.Update, communityResponse);
  }
}
