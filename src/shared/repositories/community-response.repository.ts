import { EntityRepository } from 'typeorm';

import { CommunityResponseEntity } from '../models/community-response.entity';
import { CommunityResponseFileEntity } from '../models/community-response-file.entity';

import { ManageEntityAttachmentsRepository } from './manage-entity-attachments.repository';

@EntityRepository(CommunityResponseEntity)
export class CommunityResponseRepository extends ManageEntityAttachmentsRepository<
  CommunityResponseFileEntity,
  CommunityResponseEntity
> {}
