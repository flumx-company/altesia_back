import { SelectQueryBuilder } from 'typeorm';

import { EntityFilterInterface } from '../../entity-filter.interface';
import { CommonSortByFilter } from '../../common-filters/common-sort-by.filter';
import { ReleasedStatusesEnum } from '../../../../common/enums/released-statuses.enum';
import { EventEntity } from '../../../models/event.entity';

export default class SortByFilter
  extends CommonSortByFilter<EventEntity>
  implements EntityFilterInterface<EventEntity>
{
  apply(builder: SelectQueryBuilder<EventEntity>, value: string) {
    return this.sortBy(builder, value, ReleasedStatusesEnum);
  }
}
