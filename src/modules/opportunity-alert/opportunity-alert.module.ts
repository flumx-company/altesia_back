import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AttachmentsService } from '../../shared/providers/attachments.service';
import { OpportunityAlertRepository } from '../../shared/repositories/opportunity-alert.repository';
import { OpportunityRepository } from '../../shared/repositories/opportunity.repository';
import { MailModule } from '../mail/mail.module';
import { OpportunityAlertReplyModule } from '../opportunity-alert-reply/opportunity-alert-reply.module';

import { OpportunityAlertService } from './opportunity-alert.service';
import { OpportunityAlertController } from './opportunity-alert.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      OpportunityAlertRepository,
      OpportunityRepository,
    ]),
    MailModule,
    OpportunityAlertReplyModule,
  ],
  controllers: [OpportunityAlertController],
  providers: [OpportunityAlertService, AttachmentsService],
  exports: [OpportunityAlertService],
})
export class OpportunityAlertModule {}
