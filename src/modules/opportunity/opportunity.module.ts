import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AttachmentsService } from 'src/shared/providers/attachments.service';

import { UserOpportunityEntity } from '../../shared/models/user-opportunity.entity';
import { OpportunityAlertModule } from '../opportunity-alert/opportunity-alert.module';
import { OpportunityRepository } from '../../shared/repositories/opportunity.repository';
import { UserOpportunityRepository } from '../../shared/repositories/user-opportunity.repository';

import { OpportunityController } from './opportunity.controller';
import { OpportunityService } from './opportunity.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      OpportunityRepository,
      UserOpportunityRepository,
      UserOpportunityEntity,
    ]),
    OpportunityAlertModule,
  ],
  controllers: [OpportunityController],
  providers: [OpportunityService, AttachmentsService],
})
export class OpportunityModule {}
