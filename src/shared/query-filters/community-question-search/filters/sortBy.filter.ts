import { SelectQueryBuilder } from 'typeorm';

import { EntityFilterInterface } from '../../entity-filter.interface';
import { CommunityQuestionEntity } from '../../../models/community-question.entity';
import { CommonSortByFilter } from '../../common-filters/common-sort-by.filter';
import { CommunityQuestionStatusEnum } from '../../../../modules/community-question/enums/community-question-status.enum';

export default class SortByFilter
  extends CommonSortByFilter<CommunityQuestionEntity>
  implements EntityFilterInterface<CommunityQuestionEntity>
{
  apply(builder: SelectQueryBuilder<CommunityQuestionEntity>, value: string) {
    return this.sortBy(builder, value, CommunityQuestionStatusEnum);
  }
}
