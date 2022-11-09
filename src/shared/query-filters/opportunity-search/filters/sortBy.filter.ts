import { SelectQueryBuilder } from 'typeorm';

import { EntityFilterInterface } from '../../entity-filter.interface';
import { OpportunityEntity } from '../../../models/opportunity.entity';
import { CommonSortByFilter } from '../../common-filters/common-sort-by.filter';
import { ReleasedStatusesEnum } from '../../../../common/enums/released-statuses.enum';

export default class SortByFilter
  extends CommonSortByFilter<OpportunityEntity>
  implements EntityFilterInterface<OpportunityEntity>
{
  apply(builder: SelectQueryBuilder<OpportunityEntity>, value: string) {
    return this.sortBy(builder, value, ReleasedStatusesEnum);
  }
}
