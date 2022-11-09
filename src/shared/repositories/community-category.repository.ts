import { EntityRepository } from 'typeorm';

import { CommunityCategoryEntity } from '../models/community-category.entity';

import { BaseRepository } from './base-repository';

@EntityRepository(CommunityCategoryEntity)
export class CommunityCategoryRepository extends BaseRepository<CommunityCategoryEntity> {}
