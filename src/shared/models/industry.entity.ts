import { Column, Entity, JoinColumn, OneToMany } from 'typeorm';
import { BaseEntity } from 'src/common/entities/base-entity.entity';

import { UserProfileIndustryEntity } from './user-profile-industry.entity';

@Entity('industries')
export class IndustryEntity extends BaseEntity {
  @Column({
    unique: true,
  })
  name: string;

  @OneToMany(
    () => UserProfileIndustryEntity,
    (userIndustry) => userIndustry.industry,
  )
  @JoinColumn({ referencedColumnName: 'industry_id' })
  userIndustries: UserProfileIndustryEntity[];
}
