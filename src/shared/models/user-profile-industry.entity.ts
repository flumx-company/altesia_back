import { Entity, JoinColumn, ManyToOne } from 'typeorm';

import { BaseEntity } from '../../common/entities/base-entity.entity';

import { IndustryEntity } from './industry.entity';
import { UserProfileEntity } from './user-profile.entity';

@Entity('user_profile_industries')
export class UserProfileIndustryEntity extends BaseEntity {
  @JoinColumn({ name: 'user_profile_id' })
  @ManyToOne(() => UserProfileEntity, (user) => user.userProfileIndustries, {
    primary: true,
    onDelete: 'CASCADE',
    orphanedRowAction: 'delete',
  })
  userProfile: UserProfileEntity;

  @JoinColumn({ name: 'industry_id' })
  @ManyToOne(() => IndustryEntity, (industry) => industry.userIndustries, {
    primary: true,
    onDelete: 'CASCADE',
    orphanedRowAction: 'delete',
  })
  industry: IndustryEntity;
}
