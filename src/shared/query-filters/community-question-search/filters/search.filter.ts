import { Brackets, SelectQueryBuilder } from 'typeorm';

import { EntityFilterInterface } from '../../entity-filter.interface';
import { CommunityQuestionEntity } from '../../../models/community-question.entity';

export default class SearchFilter
  implements EntityFilterInterface<CommunityQuestionEntity>
{
  apply(builder: SelectQueryBuilder<CommunityQuestionEntity>, value: string) {
    return builder.andWhere(
      new Brackets((qb) => {
        qb.where('community_questions.title like :title', {
          title: `%${value}%`,
        }).orWhere('community_questions.description like :description', {
          description: `%${value}`,
        });
      }),
    );
  }
}
