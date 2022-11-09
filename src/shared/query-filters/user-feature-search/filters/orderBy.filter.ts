import { SelectQueryBuilder } from 'typeorm';

import { EntityFilterInterface } from '../../entity-filter.interface';
import { UserFeatureEntity } from '../../../models/user-feature.entity';
import { CommonOrderByFilter } from '../../common-filters/common-order-by.filter';

export default class OrderByFilter
  extends CommonOrderByFilter<UserFeatureEntity>
  implements EntityFilterInterface<UserFeatureEntity>
{
  apply(builder: SelectQueryBuilder<UserFeatureEntity>, value: string) {
    return this.handleOrderBy(builder, value, 'user_features');
  }
}
