import { EntityRepository } from 'typeorm';

import { UserFeatureEntity } from '../models/user-feature.entity';
import { UserFeatureFileEntity } from '../models/user-feature-file.entity';

import { ManageEntityAttachmentsRepository } from './manage-entity-attachments.repository';

@EntityRepository(UserFeatureEntity)
export class UserFeatureRepository extends ManageEntityAttachmentsRepository<
  UserFeatureFileEntity,
  UserFeatureEntity
> {}
