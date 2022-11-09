import { BaseEntity } from 'src/common/entities/base-entity.entity';
import { Column, Entity } from 'typeorm';

import { PasswordResetStatusEnum } from '../../modules/password-reset/enums/password-reset-status.enum';

@Entity('password_resets')
export class PasswordResetEntity extends BaseEntity {
  @Column()
  email: string;

  @Column()
  token: string;

  @Column()
  secret: string;

  @Column({
    type: 'enum',
    enum: PasswordResetStatusEnum,
    default: PasswordResetStatusEnum.PENDING,
  })
  status: PasswordResetStatusEnum;

  public static of(params: Partial<PasswordResetEntity>): PasswordResetEntity {
    const entity = new PasswordResetEntity();

    Object.assign(entity, params);

    return entity;
  }
}
