import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AttachmentsService } from '../../shared/providers/attachments.service';
import { CommunityResponseRatingModule } from '../community-response-rating/community-response-rating.module';
import { CommunityResponseRepository } from '../../shared/repositories/community-response.repository';
import { CommunityQuestionRepository } from '../../shared/repositories/community-question.repository';
import { CaslModule } from '../casl/casl.module';

import { CommunityResponseService } from './community-response.service';
import { CommunityResponseController } from './community-response.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      CommunityResponseRepository,
      CommunityQuestionRepository,
    ]),
    CommunityResponseRatingModule,
    CaslModule,
  ],
  controllers: [CommunityResponseController],
  providers: [CommunityResponseService, AttachmentsService],
  exports: [CommunityResponseService],
})
export class CommunityResponseModule {}
