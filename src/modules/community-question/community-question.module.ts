import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CommunityCategoryEntity } from '../../shared/models/community-category.entity';
import { AttachmentsService } from '../../shared/providers/attachments.service';
import { CommunityResponseModule } from '../community-response/community-response.module';
import { CommunityResponseRatingModule } from '../community-response-rating/community-response-rating.module';
import { CommunityQuestionRepository } from '../../shared/repositories/community-question.repository';
import { MailModule } from '../mail/mail.module';

import { CommunityQuestionController } from './community-question.controller';
import { CommunityQuestionService } from './community-question.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      CommunityCategoryEntity,
      CommunityQuestionRepository,
    ]),
    CommunityResponseRatingModule,
    CommunityResponseModule,
    MailModule,
  ],
  controllers: [CommunityQuestionController],
  providers: [CommunityQuestionService, AttachmentsService],
  exports: [CommunityQuestionService],
})
export class CommunityQuestionModule {}
