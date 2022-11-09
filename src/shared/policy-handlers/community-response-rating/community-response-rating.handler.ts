import { getConnection } from 'typeorm';

import { IPolicyHandler } from '../../decorators/check-policies.decorator';
import { AppAbility } from '../../../modules/casl/casl-ability.factory';
import { PolicyActionEnum } from '../../../common/enums/policy-action.enum';
import { CommunityResponseRatingEntity } from '../../models/community-response-rating.entity';

export class CommunityResponseRatingHandler implements IPolicyHandler {
  async handle(ability: AppAbility, params: Record<string, string>) {
    const entity = await getConnection()
      .getRepository(CommunityResponseRatingEntity)
      .findOneOrFail(params.id, {
        relations: ['user'],
      });
    return ability.can(PolicyActionEnum.Update, entity);
  }
}
