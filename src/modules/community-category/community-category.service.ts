import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { CommunityCategoryEntity } from '../../shared/models/community-category.entity';
import { BulkDestroyDto } from '../../common/dto/bulk-destroy.dto';
import { CommunityCategoryRepository } from '../../shared/repositories/community-category.repository';

import { CreateCommunityCategoryDto } from './dto/create-community-category.dto';
import { UpdateCommunityCategoryDto } from './dto/update-community-category.dto';

@Injectable()
export class CommunityCategoryService {
  constructor(
    @InjectRepository(CommunityCategoryRepository)
    private readonly communityCategoryRepository: CommunityCategoryRepository,
  ) {}
  async create(createCommunityCategoryDto: CreateCommunityCategoryDto) {
    const communityCategory = await this.communityCategoryRepository.save(
      createCommunityCategoryDto,
    );
    return {
      id: communityCategory.id,
    };
  }

  async findAll(): Promise<CommunityCategoryEntity[]> {
    return await this.communityCategoryRepository.find({});
  }

  async findOne(id: number): Promise<CommunityCategoryEntity> {
    return await this.communityCategoryRepository.findOneOrFail({
      id,
    });
  }

  async update(
    id: number,
    updateCommunityCategoryDto: UpdateCommunityCategoryDto,
  ) {
    await this.communityCategoryRepository.findOneOrFail({
      id,
    });

    await this.communityCategoryRepository.update(
      id,
      updateCommunityCategoryDto,
    );

    return {
      id,
    };
  }

  async remove(bulkDestroyDto: BulkDestroyDto): Promise<null> {
    await this.communityCategoryRepository.bulkDestroy(bulkDestroyDto);
    return null;
  }
}
