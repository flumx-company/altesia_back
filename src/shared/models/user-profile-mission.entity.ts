import { Entity, JoinColumn, ManyToOne } from 'typeorm';

import { BaseEntity } from '../../common/entities/base-entity.entity';

import { MissionEntity } from './mission.entity';
import { UserProfileEntity } from './user-profile.entity';

@Entity('user_profile_missions')
export class UserMissionEntity extends BaseEntity {
  @JoinColumn({ name: 'user_profile_id' })
  @ManyToOne(() => UserProfileEntity, (user) => user.userProfileMissions, {
    primary: true,
    onDelete: 'CASCADE',
    orphanedRowAction: 'delete',
  })
  userProfile: UserProfileEntity;

  @JoinColumn({ name: 'mission_id' })
  @ManyToOne(() => MissionEntity, (mission) => mission.userMissions, {
    primary: true,
    onDelete: 'CASCADE',
    orphanedRowAction: 'delete',
  })
  mission: MissionEntity;
}
