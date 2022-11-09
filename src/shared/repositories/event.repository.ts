import { EntityRepository } from 'typeorm';

import { EventEntity } from '../models/event.entity';
import { EventFileEntity } from '../models/event-file.entity';

import { ManageEntityAttachmentsRepository } from './manage-entity-attachments.repository';

@EntityRepository(EventEntity)
export class EventRepository extends ManageEntityAttachmentsRepository<
  EventFileEntity,
  EventEntity
> {}
