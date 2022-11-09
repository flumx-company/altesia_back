import { EntityRepository } from 'typeorm';

import { IndustryEntity } from '../models/industry.entity';

import { BaseRepository } from './base-repository';

@EntityRepository(IndustryEntity)
export class IndustryRepository extends BaseRepository<IndustryEntity> {}
