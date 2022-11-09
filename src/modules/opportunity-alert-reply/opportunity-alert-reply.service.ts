import { Injectable } from '@nestjs/common';

import { OpportunityAlertReplyRepository } from '../../shared/repositories/opportunity-alert-reply.repository';

@Injectable()
export class OpportunityAlertReplyService {
  constructor(
    private readonly opportunityAlertReplyRepository: OpportunityAlertReplyRepository,
  ) {}

  fetchOpportunityAlertRepliesThatBelongToOpportunityAlert(
    opportunityAlertId: number,
  ) {
    return this.opportunityAlertReplyRepository
      .createQueryBuilder('opportunityAlertReply')
      .leftJoinAndSelect(
        'opportunityAlertReply.opportunityAlert',
        'opportunityAlert',
      )
      .leftJoinAndSelect('opportunityAlertReply.replier', 'replier')
      .where('opportunityAlertReply.opportunityAlert = :opportunityAlertId', {
        opportunityAlertId,
      })
      .getOne();
  }
}
