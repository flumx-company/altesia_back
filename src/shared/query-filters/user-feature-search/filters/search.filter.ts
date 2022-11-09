import { Brackets, SelectQueryBuilder } from 'typeorm';

import { EntityFilterInterface } from '../../entity-filter.interface';
import { UserFeatureEntity } from '../../../models/user-feature.entity';

export default class SearchFilter
  implements EntityFilterInterface<UserFeatureEntity>
{
  apply(builder: SelectQueryBuilder<UserFeatureEntity>, value: string) {
    return builder.andWhere(
      new Brackets((qb) => {
        qb.where('user_features.title like :title', {
          title: `%${value}%`,
        }).orWhere('user_features.description like :description', {
          description: `%${value}`,
        });
      }),
    );
  }
}
