import { EntityRepository } from 'typeorm';

import { OpportunityAlertEntity } from '../models/opportunity-alert.entity';
import { OpportunityAlertFileEntity } from '../models/opportunity-alert-file.entity';

import { ManageEntityAttachmentsRepository } from './manage-entity-attachments.repository';

@EntityRepository(OpportunityAlertEntity)
export class OpportunityAlertRepository extends ManageEntityAttachmentsRepository<
  OpportunityAlertFileEntity,
  OpportunityAlertEntity
> {}
