import { EntityRepository } from 'typeorm';

import { CommunityQuestionEntity } from '../models/community-question.entity';
import { CommunityQuestionFileEntity } from '../models/community-question-file.entity';

import { ManageEntityAttachmentsRepository } from './manage-entity-attachments.repository';

@EntityRepository(CommunityQuestionEntity)
export class CommunityQuestionRepository extends ManageEntityAttachmentsRepository<
  CommunityQuestionFileEntity,
  CommunityQuestionEntity
> {}
