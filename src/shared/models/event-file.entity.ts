import { EventEntity } from 'src/shared/models/event.entity';
import { Entity, ManyToOne } from 'typeorm';

import { AttachmentEmbeddedColumnsEntity } from '../../common/entities/attachment-embedded-columns.entity';

@Entity('events_files')
export class EventFileEntity extends AttachmentEmbeddedColumnsEntity {
  @ManyToOne(
    () => EventEntity,
    (eventsEntity) => eventsEntity.attachmentFiles,
    {
      onDelete: 'CASCADE',
      orphanedRowAction: 'delete',
    },
  )
  event: EventEntity;
}
