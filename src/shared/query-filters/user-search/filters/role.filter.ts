import { SelectQueryBuilder } from 'typeorm';

import { UserEntity } from '../../../models/user.entity';
import { EntityFilterInterface } from '../../entity-filter.interface';

export default class RoleFilter implements EntityFilterInterface<UserEntity> {
  apply(builder: SelectQueryBuilder<UserEntity>, value: string) {
    return builder.andWhere('roleDetails.name = :roleName', {
      roleName: value,
    });
  }
}
