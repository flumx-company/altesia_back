import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { SpecialtyEntity } from '../../shared/models/specialty.entity';
import { BulkDestroyDto } from '../../common/dto/bulk-destroy.dto';
import { SpecialtyRepository } from '../../shared/repositories/specialty.repository';

import { CreateSpecialtyDto } from './dto/create-specialty.dto';
import { UpdateSpecialtyDto } from './dto/update-specialty.dto';

@Injectable()
export class SpecialtyService {
  constructor(
    @InjectRepository(SpecialtyRepository)
    private readonly specialtyRepository: SpecialtyRepository,
  ) {}
  async create(
    createSpecialtyDto: CreateSpecialtyDto,
  ): Promise<Record<string, number>> {
    const specialty = await this.specialtyRepository.save(createSpecialtyDto);
    return {
      id: specialty.id,
    };
  }

  findAll(): Promise<SpecialtyEntity[]> {
    return this.specialtyRepository.find({});
  }

  findOne(id: number): Promise<SpecialtyEntity> {
    return this.specialtyRepository.findOneOrFail(id);
  }

  async update(
    id: number,
    updateSpecialtyDto: UpdateSpecialtyDto,
  ): Promise<Record<string, number>> {
    await this.specialtyRepository.findOneOrFail(id);
    await this.specialtyRepository.update(id, updateSpecialtyDto);
    return {
      id,
    };
  }

  async remove(bulkDestroyDto: BulkDestroyDto): Promise<null> {
    await this.specialtyRepository.bulkDestroy(bulkDestroyDto);
    return null;
  }
}
