import { SelectQueryBuilder } from 'typeorm';

import { EntityFilterInterface } from '../../entity-filter.interface';
import { CommonOrderByFilter } from '../../common-filters/common-order-by.filter';
import { EventEntity } from '../../../models/event.entity';

export default class OrderByFilter
  extends CommonOrderByFilter<EventEntity>
  implements EntityFilterInterface<EventEntity>
{
  apply(builder: SelectQueryBuilder<EventEntity>, value: string) {
    return this.handleOrderBy(builder, value, 'events');
  }
}
