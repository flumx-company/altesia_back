import { SelectQueryBuilder } from 'typeorm';

import { UserEntity } from '../../../models/user.entity';
import { UserStatusEnum } from '../../../../modules/user/enums/user-status.enum';
import { EntityFilterInterface } from '../../entity-filter.interface';
import { CommonSortByFilter } from '../../common-filters/common-sort-by.filter';

export default class SortByFilter
  extends CommonSortByFilter<UserEntity>
  implements EntityFilterInterface<UserEntity>
{
  apply(builder: SelectQueryBuilder<UserEntity>, value: string) {
    return this.sortBy(builder, value, UserStatusEnum);
  }
}
