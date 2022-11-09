import { Entity, ManyToOne } from 'typeorm';

import { AttachmentEmbeddedColumnsEntity } from '../../common/entities/attachment-embedded-columns.entity';

import { OpportunityAlertEntity } from './opportunity-alert.entity';

@Entity('opportunity_alerts_files')
export class OpportunityAlertFileEntity extends AttachmentEmbeddedColumnsEntity {
  @ManyToOne(
    () => OpportunityAlertEntity,
    (alertEntity) => alertEntity.attachmentFiles,
    {
      onDelete: 'CASCADE',
      orphanedRowAction: 'delete',
    },
  )
  opportunityAlert: OpportunityAlertEntity;
}
