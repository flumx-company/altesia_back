import { Column, Entity, JoinColumn, OneToMany } from 'typeorm';
import { BaseEntity } from 'src/common/entities/base-entity.entity';

import { UserProfileSpecialtyEntity } from './user-profile-specialty.entity';

@Entity('specialties')
export class SpecialtyEntity extends BaseEntity {
  @Column({
    unique: true,
  })
  name: string;

  @OneToMany(
    () => UserProfileSpecialtyEntity,
    (userSpecialty) => userSpecialty.specialty,
  )
  @JoinColumn({ referencedColumnName: 'specialty_id' })
  userSpecialties: UserProfileSpecialtyEntity[];
}
