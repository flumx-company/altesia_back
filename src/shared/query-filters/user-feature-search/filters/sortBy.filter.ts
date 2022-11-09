import { SelectQueryBuilder } from 'typeorm';

import { EntityFilterInterface } from '../../entity-filter.interface';
import { UserFeatureEntity } from '../../../models/user-feature.entity';

export default class SortByFilter
  implements EntityFilterInterface<UserFeatureEntity>
{
  apply(builder: SelectQueryBuilder<UserFeatureEntity>, value: string) {
    const [field, fieldValue] = value.split(' ');
    return builder.andWhere({ [field]: !!fieldValue.includes('1') });
  }
}
