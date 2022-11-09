import { Entity, JoinColumn, ManyToOne } from 'typeorm';

import { BaseEntity } from '../../common/entities/base-entity.entity';

import { UserEntity } from './user.entity';
import { RoleEntity } from './role.entity';

@Entity('user_roles')
export class UserRoleEntity extends BaseEntity {
  @ManyToOne(() => UserEntity, (user) => user.userRoles, {
    primary: true,
    onDelete: 'CASCADE',
    orphanedRowAction: 'delete',
  })
  @JoinColumn({ name: 'user_id' })
  user!: UserEntity;

  @ManyToOne(() => RoleEntity, (role) => role.userRoles, {
    primary: true,
    onDelete: 'CASCADE',
    orphanedRowAction: 'delete',
  })
  @JoinColumn({ name: 'role_id' })
  role!: RoleEntity;

  public static of(params: Partial<UserRoleEntity>): UserRoleEntity {
    const entity = new UserRoleEntity();

    Object.assign(entity, params);

    return entity;
  }
}
