import { Column, Entity, ManyToOne, OneToMany, OneToOne } from 'typeorm';

import { HasRemoveAttachmentsHook } from '../../common/entities/has-remove-attachments.hook';
import { EntityHasAttachmentsInterface } from '../../common/interfaces/entity-has-attachments.interface';

import { UserEntity } from './user.entity';
import { UserFeatureFileEntity } from './user-feature-file.entity';
import { UserFeatureReplyEntity } from './user-feature-reply.entity';

@Entity('user_features')
export class UserFeatureEntity
  extends HasRemoveAttachmentsHook
  implements EntityHasAttachmentsInterface<UserFeatureFileEntity>
{
  @Column()
  title: string;

  @Column()
  description: string;

  @Column({ default: false })
  is_replied: boolean;

  @Column({ default: null })
  replied_description: string;

  @ManyToOne(() => UserEntity, (userEntity) => userEntity.userFeatures, {
    onDelete: 'CASCADE',
  })
  user: UserEntity;

  @OneToMany(
    () => UserFeatureFileEntity,
    (userFeatureFile) => userFeatureFile.userFeature,
    {
      cascade: true,
    },
  )
  attachmentFiles: UserFeatureFileEntity[];

  @OneToOne(
    () => UserFeatureReplyEntity,
    (userFeatureReply) => userFeatureReply.userFeature,
    {
      cascade: true,
    },
  )
  userFeatureReply: UserFeatureReplyEntity;
}
