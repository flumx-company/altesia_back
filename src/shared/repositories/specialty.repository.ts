import { EntityRepository } from 'typeorm';

import { SpecialtyEntity } from '../models/specialty.entity';

import { BaseRepository } from './base-repository';

@EntityRepository(SpecialtyEntity)
export class SpecialtyRepository extends BaseRepository<SpecialtyEntity> {}
