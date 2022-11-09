import { Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm';

import { BaseEntity } from '../../common/entities/base-entity.entity';

import { UserFeatureEntity } from './user-feature.entity';
import { UserEntity } from './user.entity';

@Entity('user_feature_replies')
export class UserFeatureReplyEntity extends BaseEntity {
  @OneToOne(
    () => UserFeatureEntity,
    (userFeature) => userFeature.userFeatureReply,
    {
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
  )
  @JoinColumn()
  userFeature: UserFeatureEntity;

  @ManyToOne(() => UserEntity, {
    onDelete: 'CASCADE',
  })
  replier: UserEntity;
}
