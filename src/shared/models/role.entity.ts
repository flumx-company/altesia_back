import { Column, Entity, JoinColumn, OneToMany } from 'typeorm';

import { BaseEntity } from '../../common/entities/base-entity.entity';
import { RoleEnum } from '../../modules/role/enums/role.enum';

import { UserRoleEntity } from './user-role.entity';

@Entity('roles')
export class RoleEntity extends BaseEntity {
  @Column({
    type: 'enum',
    enum: RoleEnum,
    default: RoleEnum.USER,
    unique: true,
  })
  name: RoleEnum;

  @OneToMany(() => UserRoleEntity, (roleUser) => roleUser.role, {
    cascade: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ referencedColumnName: 'role_id' })
  userRoles!: UserRoleEntity[];

  public static of(params: Partial<RoleEntity>): RoleEntity {
    const entity = new RoleEntity();

    Object.assign(entity, params);

    return entity;
  }
}
