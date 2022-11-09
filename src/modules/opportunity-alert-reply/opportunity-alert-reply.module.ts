import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { OpportunityAlertReplyRepository } from '../../shared/repositories/opportunity-alert-reply.repository';

import { OpportunityAlertReplyService } from './opportunity-alert-reply.service';

@Module({
  imports: [TypeOrmModule.forFeature([OpportunityAlertReplyRepository])],
  providers: [OpportunityAlertReplyService],
  controllers: [],
  exports: [OpportunityAlertReplyService],
})
export class OpportunityAlertReplyModule {}
