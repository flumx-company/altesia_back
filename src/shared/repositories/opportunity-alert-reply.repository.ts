import { EntityRepository } from 'typeorm';

import { OpportunityAlertReplyEntity } from '../models/opportunity-alert-reply.entity';

import { BaseRepository } from './base-repository';

@EntityRepository(OpportunityAlertReplyEntity)
export class OpportunityAlertReplyRepository extends BaseRepository<OpportunityAlertReplyEntity> {}
