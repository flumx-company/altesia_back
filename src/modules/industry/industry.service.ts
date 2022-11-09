import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { IndustryEntity } from '../../shared/models/industry.entity';
import { BulkDestroyDto } from '../../common/dto/bulk-destroy.dto';
import { IndustryRepository } from '../../shared/repositories/industry.repository';

import { CreateIndustryDto } from './dto/create-industry.dto';
import { UpdateIndustryDto } from './dto/update-industry.dto';

@Injectable()
export class IndustryService {
  constructor(
    @InjectRepository(IndustryRepository)
    private readonly industryRepository: IndustryRepository,
  ) {}

  async create(
    createIndustryDto: CreateIndustryDto,
  ): Promise<Record<string, number>> {
    const industry = await this.industryRepository.save(createIndustryDto);
    return {
      id: industry.id,
    };
  }

  findAll(): Promise<IndustryEntity[]> {
    return this.industryRepository.find({});
  }

  findOne(id: number): Promise<IndustryEntity> {
    return this.industryRepository.findOneOrFail(id);
  }

  async update(
    id: number,
    updateIndustryDto: UpdateIndustryDto,
  ): Promise<Record<string, number>> {
    await this.industryRepository.findOneOrFail(id);
    await this.industryRepository.update(id, updateIndustryDto);
    return {
      id,
    };
  }

  async remove(bulkDestroyDto: BulkDestroyDto): Promise<null> {
    await this.industryRepository.bulkDestroy(bulkDestroyDto);
    return null;
  }
}
