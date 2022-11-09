import { EntityRepository } from 'typeorm';

import { UserOpportunityEntity } from '../models/user-opportunity.entity';

import { BaseRepository } from './base-repository';

@EntityRepository(UserOpportunityEntity)
export class UserOpportunityRepository extends BaseRepository<UserOpportunityEntity> {}
