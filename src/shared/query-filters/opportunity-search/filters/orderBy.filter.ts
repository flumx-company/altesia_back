import { SelectQueryBuilder } from 'typeorm';

import { EntityFilterInterface } from '../../entity-filter.interface';
import { OpportunityEntity } from '../../../models/opportunity.entity';
import { CommonOrderByFilter } from '../../common-filters/common-order-by.filter';

export default class OrderByFilter
  extends CommonOrderByFilter<OpportunityEntity>
  implements EntityFilterInterface<OpportunityEntity>
{
  apply(builder: SelectQueryBuilder<OpportunityEntity>, value: string) {
    return this.handleOrderBy(builder, value, 'opportunities');
  }
}
