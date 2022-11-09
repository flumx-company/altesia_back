import { Injectable } from '@nestjs/common';
import { IPaginationMeta, Pagination } from 'nestjs-typeorm-paginate';
import { getRepository, SelectQueryBuilder } from 'typeorm';

import { UserEntity } from '../../shared/models/user.entity';
import { CommunityResponseEntity } from '../../shared/models/community-response.entity';
import { CommunityResponseRepository } from '../../shared/repositories/community-response.repository';
import { CommunityQuestionRepository } from '../../shared/repositories/community-question.repository';
import { BulkDestroyDto } from '../../common/dto/bulk-destroy.dto';
import { IPaginationOptions } from '../../common/interfaces/pagination-options.interface';
import { CommunityResponseSearch } from '../../shared/query-filters/community-response-search/community-response.search';
import { CommunityResponseRatingEntity } from '../../shared/models/community-response-rating.entity';

import { CreateCommunityResponseDto } from './dto/create-community-response.dto';
import { UpdateCommunityResponseDto } from './dto/update-community-response.dto';
import { PatchAdminUpdateCommunityResponseDto } from './dto/patch-admin-update-community-response.dto';

@Injectable()
export class CommunityResponseService {
  constructor(
    private readonly communityResponseRepository: CommunityResponseRepository,
    private readonly communityQuestionRepository: CommunityQuestionRepository,
  ) {}

  async fetchAll(
    authenticatedUser: UserEntity,
    query,
    options: IPaginationOptions,
  ): Promise<Pagination<CommunityResponseEntity, IPaginationMeta>> {
    const queryBuilder: SelectQueryBuilder<CommunityResponseEntity> =
      await new CommunityResponseSearch().apply(
        this.communityResponseRepository,
        query,
        { userId: authenticatedUser.id },
      );

    return await this.communityResponseRepository.paginateQueryBuilder(
      queryBuilder,
      options,
      (record: CommunityResponseEntity & { communityRatingsCount: number }) => {
        const communityRatingsSum = record.communityRatings.reduce(
          (acc, currentItem) => currentItem.rating + acc,
          0,
        );
        const userHasRatedCommunityResponse = !!record.communityRatings.find(
          (communityRating) => communityRating.user.id === record.user.id,
        );

        return {
          ...record,
          userHasRatedCommunityResponse,
          averageRating:
            (communityRatingsSum &&
              Math.ceil(communityRatingsSum / record.communityRatingsCount)) ||
            0,
          communityRatings: [...record.communityRatings].filter(
            (communityRating) =>
              communityRating.user.id === authenticatedUser.id,
          ),
        };
      },
    );
  }

  async create(
    user: UserEntity,
    communityQuestionId: number,
    createCommunityResponseDto: CreateCommunityResponseDto,
    attachments: Array<Express.Multer.File>,
  ) {
    const communityQuestion =
      await this.communityQuestionRepository.findOneOrFail({
        id: communityQuestionId,
      });

    const communityResponseInstance =
      await this.communityResponseRepository.create(createCommunityResponseDto);

    communityResponseInstance.user = user;
    communityResponseInstance.communityQuestion = communityQuestion;

    const communityResponse =
      await this.communityResponseRepository.saveAndReturn(
        communityResponseInstance,
      );

    await this.communityResponseRepository.updateEntityAttachments(
      communityResponse,
      attachments,
    );

    return {
      id: communityResponse.id,
    };
  }

  async findOne(
    authenticatedUser: UserEntity,
    communityResponseId: number,
  ): Promise<
    CommunityResponseEntity & {
      averageRating: number;
    }
  > {
    const { averageCommunityRating } = await getRepository(
      CommunityResponseRatingEntity,
    )
      .createQueryBuilder('communityRatings')
      .select('AVG(communityRatings.rating)', 'averageCommunityRating')
      .where('communityRatings.communityResponse = :id', {
        id: communityResponseId,
      })
      .getRawOne();

    const communityResponse = await this.communityResponseRepository
      .createQueryBuilder('communityResponse')
      .leftJoinAndSelect('communityResponse.user', 'user')
      .leftJoinAndSelect(
        'communityResponse.communityQuestion',
        'communityQuestion',
      )
      .leftJoinAndSelect(
        'communityResponse.communityRatings',
        'communityRatings',
        'communityRatings.user = :userId', // to join only that records where authenticated user is owner
        { userId: authenticatedUser.id },
      )
      .leftJoinAndSelect('communityResponse.attachmentFiles', 'attachmentFiles')
      .where('communityResponse.id = :communityResponseId', {
        communityResponseId,
      })
      .getOne();

    return {
      ...communityResponse,
      averageRating: parseInt(averageCommunityRating),
    };
  }

  async update(
    id: number,
    updateCommunityResponseDto: UpdateCommunityResponseDto,
    attachments: Array<Express.Multer.File>,
  ) {
    const updatedCommunityResponse =
      await this.communityResponseRepository.updateByIdAndReturn(
        id,
        updateCommunityResponseDto,
      );

    await this.communityResponseRepository.updateEntityAttachments(
      updatedCommunityResponse,
      attachments,
    );

    return {
      id: updatedCommunityResponse.id,
    };
  }

  async patchUpdate(
    id: number,
    patchAdminUpdateCommunityResponseDto: PatchAdminUpdateCommunityResponseDto,
  ) {
    await this.communityResponseRepository.findOneOrFail(id);
    await this.communityResponseRepository.update(
      id,
      patchAdminUpdateCommunityResponseDto,
    );

    return {
      id,
    };
  }

  async remove(bulkDestroyDto: BulkDestroyDto): Promise<null> {
    await this.communityResponseRepository.bulkDestroy(bulkDestroyDto, [
      'attachmentFiles',
    ]);
    return null;
  }
}
