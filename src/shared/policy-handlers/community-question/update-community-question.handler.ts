import { getConnection } from 'typeorm';

import { IPolicyHandler } from '../../decorators/check-policies.decorator';
import { AppAbility } from '../../../modules/casl/casl-ability.factory';
import { PolicyActionEnum } from '../../../common/enums/policy-action.enum';
import { CommunityQuestionEntity } from '../../models/community-question.entity';

export class UpdateCommunityQuestionHandler implements IPolicyHandler {
  async handle(ability: AppAbility, params: Record<string, string>) {
    const communityQuestion = await getConnection()
      .getRepository(CommunityQuestionEntity)
      .findOneOrFail(params.id, {
        relations: ['user'],
      });
    return ability.can(PolicyActionEnum.Update, communityQuestion);
  }
}
