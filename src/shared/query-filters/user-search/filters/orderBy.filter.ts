import { SelectQueryBuilder } from 'typeorm';

import { UserEntity } from '../../../models/user.entity';
import { EntityFilterInterface } from '../../entity-filter.interface';
import { CommonOrderByFilter } from '../../common-filters/common-order-by.filter';

export default class OrderByFilter
  extends CommonOrderByFilter<UserEntity>
  implements EntityFilterInterface<UserEntity>
{
  apply(builder: SelectQueryBuilder<UserEntity>, value: string) {
    return this.handleOrderBy(builder, value, 'user');
  }
}
