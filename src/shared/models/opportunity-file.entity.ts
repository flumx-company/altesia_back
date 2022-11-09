import { Entity, ManyToOne } from 'typeorm';

import { AttachmentEmbeddedColumnsEntity } from '../../common/entities/attachment-embedded-columns.entity';

import { OpportunityEntity } from './opportunity.entity';

@Entity('opportunity_files')
export class OpportunityFileEntity extends AttachmentEmbeddedColumnsEntity {
  @ManyToOne(
    () => OpportunityEntity,
    (opportunityEntity) => opportunityEntity.attachmentFiles,
    {
      onDelete: 'CASCADE',
      orphanedRowAction: 'delete',
    },
  )
  opportunity: OpportunityEntity;
}
