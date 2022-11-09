import { Column, Entity, JoinColumn, OneToMany } from 'typeorm';
import { BaseEntity } from 'src/common/entities/base-entity.entity';

import { UserMissionEntity } from './user-profile-mission.entity';

@Entity('missions')
export class MissionEntity extends BaseEntity {
  @Column({
    unique: true,
  })
  name: string;

  @OneToMany(() => UserMissionEntity, (userMission) => userMission.mission)
  @JoinColumn({ referencedColumnName: 'mission_id' })
  userMissions: UserMissionEntity[];
}
