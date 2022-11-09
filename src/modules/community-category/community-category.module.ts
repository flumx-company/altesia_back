import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CommunityQuestionModule } from '../community-question/community-question.module';
import { CommunityCategoryRepository } from '../../shared/repositories/community-category.repository';
import { CaslModule } from '../casl/casl.module';

import { CommunityCategoryService } from './community-category.service';
import { CommunityCategoryController } from './community-category.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([CommunityCategoryRepository]),
    CommunityQuestionModule,
    CaslModule,
  ],
  controllers: [CommunityCategoryController],
  providers: [CommunityCategoryService],
})
export class CommunityCategoryModule {}
