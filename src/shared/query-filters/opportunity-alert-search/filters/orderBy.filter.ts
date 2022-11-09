import { SelectQueryBuilder } from 'typeorm';

import { EntityFilterInterface } from '../../entity-filter.interface';
import { OpportunityAlertEntity } from '../../../models/opportunity-alert.entity';
import { CommonOrderByFilter } from '../../common-filters/common-order-by.filter';

export default class OrderByFilter
  extends CommonOrderByFilter<OpportunityAlertEntity>
  implements EntityFilterInterface<OpportunityAlertEntity>
{
  apply(builder: SelectQueryBuilder<OpportunityAlertEntity>, value: string) {
    return this.handleOrderBy(builder, value, 'alertOpportunities');
  }
}
