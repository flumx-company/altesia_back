import { BadRequestException, Injectable } from '@nestjs/common';
import { Transactional } from 'typeorm-transactional-cls-hooked';
import { IPaginationMeta, paginate, Pagination } from 'nestjs-typeorm-paginate';
import { SelectQueryBuilder } from 'typeorm';

import { UserEntity } from '../../shared/models/user.entity';
import { OpportunityAlertEntity } from '../../shared/models/opportunity-alert.entity';
import { OpportunityAlertRepository } from '../../shared/repositories/opportunity-alert.repository';
import { OpportunityRepository } from '../../shared/repositories/opportunity.repository';
import { MailService } from '../mail/mail.service';
import { OpportunityAlertSearch } from '../../shared/query-filters/opportunity-alert-search/opportunity-alert.search';
import { IPaginationOptions } from '../../common/interfaces/pagination-options.interface';

import { CreateOpportunityAlertDto } from './dto/create-opportunity-alert.dto';
import { ReplyOpportunityAlertDto } from './dto/reply-opportunity-alert.dto';

@Injectable()
export class OpportunityAlertService {
  constructor(
    private readonly opportunityAlertRepository: OpportunityAlertRepository,
    private readonly opportunityRepository: OpportunityRepository,
    private mailService: MailService,
  ) {}

  async findAllAlertsForCurrentUser(
    userID: number,
    options: IPaginationOptions,
  ): Promise<Pagination<OpportunityAlertEntity, IPaginationMeta>> {
    const where = {
      user: {
        id: userID,
      },
    };

    return paginate<OpportunityAlertEntity>(
      this.opportunityAlertRepository,
      options,
      {
        where,
        relations: ['attachmentFiles', 'opportunity'],
      },
    );
  }

  async findOpportunityAlerts(options: IPaginationOptions) {
    const records = await this.opportunityAlertRepository
      .createQueryBuilder('opportunityAlerts')
      .leftJoinAndSelect('opportunityAlerts.opportunity', 'opportunity');

    return this.opportunityAlertRepository.paginateQueryBuilder(
      records,
      options,
    );
  }

  async findAllAlertsBelongsToOpportunity(
    opportunityId: number,
    query: Record<string, string>,
    options: IPaginationOptions,
  ): Promise<Pagination<OpportunityAlertEntity>> {
    const queryBuilder: SelectQueryBuilder<OpportunityAlertEntity> =
      await new OpportunityAlertSearch().apply(
        this.opportunityAlertRepository,
        query,
        { opportunityId },
      );

    return this.opportunityAlertRepository.paginateQueryBuilder(
      queryBuilder,
      options,
    );
  }

  @Transactional()
  async create(
    user: UserEntity,
    opportunityId: number,
    createAlertDto: CreateOpportunityAlertDto,
    attachments: Array<Express.Multer.File>,
  ) {
    const opportunity = await this.opportunityRepository.findOneOrFail({
      where: { id: opportunityId },
      relations: ['opportunityAlerts', 'opportunityAlerts.user'],
    });

    const userHasOpportunityAlert = opportunity.opportunityAlerts.find(
      (opportunityAlert) => opportunityAlert.user.id === user.id,
    );

    if (userHasOpportunityAlert) {
      throw new BadRequestException('You already has this opportunity alert');
    }

    const opportunityAlertDto =
      this.opportunityAlertRepository.create(createAlertDto);

    opportunityAlertDto.user = user;
    opportunityAlertDto.opportunity = opportunity;

    const opportunityAlert =
      await this.opportunityAlertRepository.saveAndReturn(
        opportunityAlertDto,
        {},
        ['attachmentFiles'],
      );

    await this.opportunityAlertRepository.updateEntityAttachments(
      opportunityAlert,
      attachments,
    );

    return {
      id: opportunityAlert.id,
    };
  }

  async replyOpportunityAlert(
    user: UserEntity,
    alertId: number,
    replyOpportunityAlertDto: ReplyOpportunityAlertDto,
  ) {
    let opportunityAlert = await this.opportunityAlertRepository.findOneOrFail(
      alertId,
      {
        relations: ['user'],
      },
    );

    if (opportunityAlert.is_replied) {
      throw new BadRequestException('Opportunity alert already has response');
    }

    if (opportunityAlert.user) {
      await this.mailService.sendOpportunityAlertResponseEmail(
        opportunityAlert.title,
        opportunityAlert.description,
        opportunityAlert.user.email,
        replyOpportunityAlertDto.answer,
      );
    }

    opportunityAlert = {
      ...opportunityAlert,
      is_replied: true,
      replied_description: replyOpportunityAlertDto.answer,
      opportunityAlertReply: {
        opportunityAlert,
        replier: user,
      },
    };

    await this.opportunityAlertRepository.save(opportunityAlert);

    return null;
  }
}
