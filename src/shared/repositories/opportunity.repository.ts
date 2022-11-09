import { EntityRepository } from 'typeorm';

import { OpportunityEntity } from '../models/opportunity.entity';
import { OpportunityFileEntity } from '../models/opportunity-file.entity';

import { ManageEntityAttachmentsRepository } from './manage-entity-attachments.repository';

@EntityRepository(OpportunityEntity)
export class OpportunityRepository extends ManageEntityAttachmentsRepository<
  OpportunityFileEntity,
  OpportunityEntity
> {}
