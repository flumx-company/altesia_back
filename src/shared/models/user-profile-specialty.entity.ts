import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

import { BaseEntity } from '../../common/entities/base-entity.entity';

import { SpecialtyEntity } from './specialty.entity';
import { UserProfileEntity } from './user-profile.entity';

@Entity('user_profile_specialties')
export class UserProfileSpecialtyEntity extends BaseEntity {
  @JoinColumn({ name: 'user_profile_id' })
  @ManyToOne(() => UserProfileEntity, (user) => user.userProfileSpecialties, {
    primary: true,
    onDelete: 'CASCADE',
    orphanedRowAction: 'delete',
  })
  userProfile: UserProfileEntity;

  @JoinColumn({ name: 'specialty_id' })
  @ManyToOne(() => SpecialtyEntity, (specialty) => specialty.userSpecialties, {
    primary: true,
    onDelete: 'CASCADE',
    orphanedRowAction: 'delete',
  })
  specialty: SpecialtyEntity;

  @Column()
  level: string;
}
