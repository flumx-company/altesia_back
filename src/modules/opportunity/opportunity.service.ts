import { BadRequestException, Injectable } from '@nestjs/common';
import { Pagination } from 'nestjs-typeorm-paginate';
import { Transactional } from 'typeorm-transactional-cls-hooked';
import { SelectQueryBuilder } from 'typeorm';

import { UserEntity } from '../../shared/models/user.entity';
import { OpportunityRepository } from '../../shared/repositories/opportunity.repository';
import { OpportunityEntity } from '../../shared/models/opportunity.entity';
import { BulkDestroyDto } from '../../common/dto/bulk-destroy.dto';
import { UserOpportunityRepository } from '../../shared/repositories/user-opportunity.repository';
import { IPaginationOptions } from '../../common/interfaces/pagination-options.interface';
import { OpportunitySearch } from '../../shared/query-filters/opportunity-search/opportunity.search';
import { ReleasedStatusesEnum } from '../../common/enums/released-statuses.enum';

import { CreateOpportunityDto } from './dto/create-opportunity.dto';
import { UpdateOpportunityDto } from './dto/update-opportunity.dto';
import { AttachOpportunityToUserDto } from './dto/attach-opportunity-to-user.dto';
import { ChangeOpportunityStatusDto } from './dto/change-opportunity-status.dto';

@Injectable()
export class OpportunityService {
  constructor(
    private readonly opportunityRepository: OpportunityRepository,
    private readonly userOpportunityRepository: UserOpportunityRepository,
  ) {}

  async findAllForAdmin(
    query: Record<string, string>,
    options: IPaginationOptions,
  ): Promise<Pagination<OpportunityEntity>> {
    const queryBuilder: SelectQueryBuilder<OpportunityEntity> =
      await new OpportunitySearch().apply(this.opportunityRepository, query);

    return this.opportunityRepository.paginateQueryBuilder(
      queryBuilder,
      options,
    );
  }

  async findAll(
    user: UserEntity,
    fetchMine: string,
    options: IPaginationOptions,
  ): Promise<Pagination<OpportunityEntity>> {
    let queryBuilder: SelectQueryBuilder<OpportunityEntity>;
    if (fetchMine) {
      queryBuilder = this.opportunityRepository
        .createQueryBuilder('opportunities')
        .leftJoinAndSelect(
          'opportunities.opportunityAlerts',
          'opportunityAlerts',
        )
        .leftJoinAndSelect('opportunityAlerts.user', 'opportunityAlertUser')
        .leftJoinAndSelect('opportunities.attachmentFiles', 'attachmentFiles')
        .fetchPublished()
        .fetchMineInterestingRecords(user.id);
    } else {
      queryBuilder = this.opportunityRepository
        .createQueryBuilder('opportunities')
        .leftJoinAndSelect(
          'opportunities.opportunityAlerts',
          'opportunityAlerts',
        )
        .leftJoinAndSelect('opportunityAlerts.user', 'opportunityAlertUser')
        .leftJoinAndSelect('opportunities.attachmentFiles', 'attachmentFiles')
        .fetchPublished()
        .fetchNonInterestingUserRecordsWithAscendingInterestingField(user.id);
    }

    return this.opportunityRepository.paginateQueryBuilder(
      queryBuilder,
      options,
      (record) => {
        return {
          ...record,
          is_recommended: !!record.opportunityAlerts.find(
            (opportunityAlert) => opportunityAlert.user.id === user.id,
          ),
        };
      },
    );
  }

  async findOne(id: number): Promise<OpportunityEntity> {
    return this.opportunityRepository.findOneOrFail(id, {
      relations: ['attachmentFiles'],
      where: {
        status: ReleasedStatusesEnum.PUBLISHED,
      },
    });
  }

  async fetchUsersThatInterestingInOpportunity(
    id,
    options: IPaginationOptions,
  ) {
    const userOpportunities = await this.userOpportunityRepository
      .createQueryBuilder('userOpportunity')
      .leftJoinAndSelect('userOpportunity.user', 'user')
      .where({
        opportunity_id: id,
        is_interesting: true,
        status: ReleasedStatusesEnum.PUBLISHED,
      });

    return this.userOpportunityRepository.paginateQueryBuilder(
      userOpportunities,
      options,
    );
  }

  @Transactional()
  async createOpportunity(
    createOpportunityDto: CreateOpportunityDto,
    attachments: Array<Express.Multer.File>,
  ): Promise<Record<string, number>> {
    const opportunity = await this.opportunityRepository.saveAndReturn(
      createOpportunityDto,
      {},
      ['attachmentFiles'],
    );

    await this.opportunityRepository.updateEntityAttachments(
      opportunity,
      attachments,
    );

    return {
      id: opportunity.id,
    };
  }

  @Transactional()
  async updateOpportunity(
    id: number,
    updateOpportunityDto: UpdateOpportunityDto,
    attachments: Array<Express.Multer.File>,
  ) {
    const opportunity = await this.opportunityRepository.updateByIdAndReturn(
      id,
      updateOpportunityDto,
      ['attachmentFiles'],
    );

    await this.opportunityRepository.updateEntityAttachments(
      opportunity,
      attachments,
    );

    await this.opportunityRepository.destroyEntityAttachmentFromPaths(
      opportunity,
      updateOpportunityDto.attachmentLinksToRemove,
    );

    return {
      id: opportunity.id,
    };
  }

  async changeOpportunityStatus(
    id: number,
    changeOpportunityStatus: ChangeOpportunityStatusDto,
  ) {
    const opportunity = await this.opportunityRepository.updateByIdAndReturn(
      id,
      changeOpportunityStatus,
    );

    return {
      id: opportunity.id,
    };
  }

  async attachOpportunityToUser(
    user: UserEntity,
    attachOpportunityToUserDto: AttachOpportunityToUserDto,
    id: number,
  ) {
    const opportunity = await this.opportunityRepository.findOneOrFail(id, {
      relations: ['userOpportunities', 'userOpportunities.user'],
    });

    const userHasInterestingOpportunity = opportunity.userOpportunities.find(
      (userOpportunity) =>
        userOpportunity.opportunity_id === opportunity.id &&
        userOpportunity.user.id === user.id &&
        userOpportunity.is_interesting ===
          attachOpportunityToUserDto.is_interesting,
    );

    if (userHasInterestingOpportunity) {
      throw new BadRequestException({
        message: {
          error: `You already have this event. user events table id - ${userHasInterestingOpportunity.id}`,
          is_interesting: userHasInterestingOpportunity.is_interesting,
        },
      });
    }

    const theSameUserOpportunity = opportunity.userOpportunities.find(
      (userOpportunity) =>
        userOpportunity.opportunity_id === opportunity.id &&
        userOpportunity.user.id === user.id,
    );

    if (theSameUserOpportunity) {
      opportunity.userOpportunities = opportunity.userOpportunities.map(
        (userOpportunity) => {
          if (
            userOpportunity.opportunity_id === opportunity.id &&
            userOpportunity.user.id === user.id
          ) {
            userOpportunity.is_interesting =
              attachOpportunityToUserDto.is_interesting;
          }
          return userOpportunity;
        },
      );
    } else {
      opportunity.userOpportunities.push({
        opportunity,
        opportunity_id: opportunity.id,
        user,
        user_id: user.id,
        is_interesting: attachOpportunityToUserDto.is_interesting,
      });
    }

    await this.opportunityRepository.save(opportunity);

    return null;
  }

  async detachOpportunityFromUser(user: UserEntity, id: number) {
    const opportunity = await this.opportunityRepository.findOneOrFail(id, {
      relations: ['userOpportunities'],
    });

    const userHasOpportunity = opportunity.userOpportunities.find(
      (userOpportunity) => userOpportunity.opportunity_id === opportunity.id,
    );

    if (!userHasOpportunity) {
      throw new BadRequestException(`You don't have this opportunity`);
    }

    opportunity.userOpportunities = opportunity.userOpportunities.filter(
      (userOpportunity) => userOpportunity.opportunity_id !== opportunity.id,
    );

    await this.opportunityRepository.save(opportunity);

    return null;
  }

  @Transactional()
  async destroy(bulkDestroyDto: BulkDestroyDto): Promise<null> {
    await this.opportunityRepository.bulkDestroy(bulkDestroyDto, [
      'attachmentFiles',
    ]);
    return null;
  }
}
