import {
  Ability,
  AbilityBuilder,
  AbilityClass,
  ExtractSubjectType,
  InferSubjects,
  MongoQuery,
} from '@casl/ability';

import { UserEntity } from '../../shared/models/user.entity';
import { PolicyActionEnum } from '../../common/enums/policy-action.enum';
import { CommunityResponseEntity } from '../../shared/models/community-response.entity';
import { CommunityQuestionEntity } from '../../shared/models/community-question.entity';
import { CommunityResponseRatingEntity } from '../../shared/models/community-response-rating.entity';

type Subjects =
  | InferSubjects<
      | typeof CommunityResponseEntity
      | typeof CommunityQuestionEntity
      | typeof CommunityResponseRatingEntity
    >
  | 'all';

export type AppAbility = Ability<[PolicyActionEnum, Subjects]>;

export class CaslAbilityFactory {
  createForUser(user: UserEntity) {
    const { can, build } = new AbilityBuilder<
      Ability<[PolicyActionEnum, Subjects]>
    >(Ability as AbilityClass<AppAbility>);

    can(
      PolicyActionEnum.Update,
      [
        CommunityResponseEntity,
        CommunityQuestionEntity,
        CommunityResponseRatingEntity,
      ],
      {
        'user.id': user.id,
      } as MongoQuery,
    );

    return build({
      detectSubjectType: (item) =>
        item.constructor as ExtractSubjectType<Subjects>,
    });
  }
}
