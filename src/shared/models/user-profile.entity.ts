import { Column, Entity, JoinColumn, OneToMany, OneToOne } from 'typeorm';
import { BaseEntity } from 'src/common/entities/base-entity.entity';

import { UserEntity } from './user.entity';
import { UserProfileIndustryEntity } from './user-profile-industry.entity';
import { UserProfileSpecialtyEntity } from './user-profile-specialty.entity';
import { UserMissionEntity } from './user-profile-mission.entity';

@Entity('user_profiles')
export class UserProfileEntity extends BaseEntity {
  @Column()
  country: string;

  @Column()
  phone_number: string;

  @Column()
  degree: string;

  @Column()
  experience: string;

  @Column({ default: '' })
  expertise: string;

  @Column({ default: '' })
  availability?: string;

  @Column({ default: '' })
  open_to?: string;

  @Column({ default: 0 })
  min_rate?: number;

  @Column({ default: 0 })
  gross_salary?: number;

  @Column({ default: false })
  ok_to_contact?: boolean;

  @Column({ default: '' })
  preferred_time_to_be_contacted?: string;

  @Column({ default: '' })
  locations_to_work?: string;

  @Column({ default: '' })
  linkedin_link?: string;

  @OneToOne(() => UserEntity, (userEntity) => userEntity.userProfile, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  user: UserEntity;

  // custom many to many table
  @OneToMany(
    () => UserProfileIndustryEntity,
    (userIndustry) => userIndustry.userProfile,
    {
      cascade: true,
    },
  )
  @JoinColumn({ referencedColumnName: 'user_profile_id' })
  userProfileIndustries: UserProfileIndustryEntity[];

  @OneToMany(
    () => UserProfileSpecialtyEntity,
    (userSpecialty) => userSpecialty.userProfile,
    {
      cascade: true,
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
  )
  @JoinColumn({ referencedColumnName: 'user_profile_id' })
  userProfileSpecialties: UserProfileSpecialtyEntity[];

  @OneToMany(
    () => UserMissionEntity,
    (userSpecialty) => userSpecialty.userProfile,
    {
      cascade: true,
    },
  )
  @JoinColumn({ referencedColumnName: 'user_profile_id' })
  userProfileMissions: UserMissionEntity[];

  public static of(params: Partial<UserProfileEntity>): UserProfileEntity {
    const entity = new UserProfileEntity();

    Object.assign(entity, params);

    return entity;
  }
}
