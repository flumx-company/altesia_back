import { EntityRepository } from 'typeorm';

import { UserFeatureReplyEntity } from '../models/user-feature-reply.entity';

import { BaseRepository } from './base-repository';

@EntityRepository(UserFeatureReplyEntity)
export class UserFeatureReplyRepository extends BaseRepository<UserFeatureReplyEntity> {}
