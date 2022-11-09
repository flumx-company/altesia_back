import { SelectQueryBuilder } from 'typeorm';

import { EntityFilterInterface } from '../../entity-filter.interface';
import { CommunityQuestionEntity } from '../../../models/community-question.entity';
import { CommonOrderByFilter } from '../../common-filters/common-order-by.filter';

export default class OrderByFilter
  extends CommonOrderByFilter<CommunityQuestionEntity>
  implements EntityFilterInterface<CommunityQuestionEntity>
{
  apply(builder: SelectQueryBuilder<CommunityQuestionEntity>, value: string) {
    return this.handleOrderBy(builder, value, 'community_questions');
  }
}
