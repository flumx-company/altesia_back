import { Entity, ManyToOne } from 'typeorm';

import { AttachmentEmbeddedColumnsEntity } from '../../common/entities/attachment-embedded-columns.entity';

import { UserFeatureEntity } from './user-feature.entity';

@Entity('user_feature_files')
export class UserFeatureFileEntity extends AttachmentEmbeddedColumnsEntity {
  @ManyToOne(
    () => UserFeatureEntity,
    (userFeatureEntity) => userFeatureEntity.attachmentFiles,
    { onDelete: 'CASCADE', orphanedRowAction: 'delete' },
  )
  userFeature: UserFeatureEntity;
}
