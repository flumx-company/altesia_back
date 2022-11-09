import { Brackets, SelectQueryBuilder } from 'typeorm';

import { UserEntity } from '../../../models/user.entity';
import { EntityFilterInterface } from '../../entity-filter.interface';

export default class SearchFilter implements EntityFilterInterface<UserEntity> {
  apply(builder: SelectQueryBuilder<UserEntity>, value: string) {
    return builder.andWhere(
      new Brackets((qb) => {
        qb.where('user.first_name like :first_name', {
          first_name: `%${value}%`,
        })
          .orWhere('user.last_name like :last_name', {
            last_name: `%${value}`,
          })
          .orWhere('user.email like :email', {
            email: `%${value}%`,
          });
      }),
    );
  }
}
