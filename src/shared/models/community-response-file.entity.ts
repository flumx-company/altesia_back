import { Entity, ManyToOne } from 'typeorm';

import { AttachmentEmbeddedColumnsEntity } from '../../common/entities/attachment-embedded-columns.entity';

import { CommunityResponseEntity } from './community-response.entity';

@Entity('community_response_files')
export class CommunityResponseFileEntity extends AttachmentEmbeddedColumnsEntity {
  @ManyToOne(
    () => CommunityResponseEntity,
    (communityResponse) => communityResponse.attachmentFiles,
    { onDelete: 'CASCADE', orphanedRowAction: 'delete' },
  )
  communityResponse: CommunityResponseEntity;
}
