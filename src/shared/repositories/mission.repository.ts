import { EntityRepository } from 'typeorm';

import { MissionEntity } from '../models/mission.entity';

import { BaseRepository } from './base-repository';

@EntityRepository(MissionEntity)
export class MissionRepository extends BaseRepository<MissionEntity> {}
