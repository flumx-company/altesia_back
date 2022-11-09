import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { MissionEntity } from '../../shared/models/mission.entity';
import { BulkDestroyDto } from '../../common/dto/bulk-destroy.dto';
import { MissionRepository } from '../../shared/repositories/mission.repository';

import { CreateMissionDto } from './dto/create-mission.dto';
import { UpdateMissionDto } from './dto/update-mission.dto';

@Injectable()
export class MissionService {
  constructor(
    @InjectRepository(MissionRepository)
    private readonly missionRepository: MissionRepository,
  ) {}
  async create(
    createMissionDto: CreateMissionDto,
  ): Promise<Record<string, number>> {
    const mission = await this.missionRepository.save(createMissionDto);
    return {
      id: mission.id,
    };
  }

  findAll(): Promise<MissionEntity[]> {
    return this.missionRepository.find({});
  }

  findOne(id: number): Promise<MissionEntity> {
    return this.missionRepository.findOneOrFail(id);
  }

  async update(
    id: number,
    updateMissionDto: UpdateMissionDto,
  ): Promise<Record<string, number>> {
    await this.missionRepository.findOneOrFail(id);
    await this.missionRepository.update(id, updateMissionDto);
    return {
      id,
    };
  }

  async remove(bulkDestroyDto: BulkDestroyDto): Promise<null> {
    await this.missionRepository.bulkDestroy(bulkDestroyDto);
    return null;
  }
}
