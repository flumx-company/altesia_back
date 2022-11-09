import { EntityRepository } from 'typeorm';

import { UserEntity } from '../models/user.entity';

import { BaseRepository } from './base-repository';

@EntityRepository(UserEntity)
export class UserRepository extends BaseRepository<UserEntity> {}
