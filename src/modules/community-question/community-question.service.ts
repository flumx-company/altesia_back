import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import {
  IPaginationMeta,
  IPaginationOptions,
  paginate,
  Pagination,
} from 'nestjs-typeorm-paginate';
import { Transactional } from 'typeorm-transactional-cls-hooked';

import { UserEntity } from '../../shared/models/user.entity';
import { CommunityCategoryEntity } from '../../shared/models/community-category.entity';
import { AttachmentsService } from '../../shared/providers/attachments.service';
import { CommunityQuestionEntity } from '../../shared/models/community-question.entity';
import { CommunityQuestionRepository } from '../../shared/repositories/community-question.repository';
import { BulkDestroyDto } from '../../common/dto/bulk-destroy.dto';
import { CommunityQuestionSearch } from '../../shared/query-filters/community-question-search/community-question.search';
import { IPaginationOptions as ICustomPaginationOptions } from '../../common/interfaces/pagination-options.interface';
import { ReplyToCommunityResponseDto } from '../community-response/dto/reply-to-community-response.dto';
import { MailService } from '../mail/mail.service';

import { UpdateCommunityQuestionDto } from './dto/update-community-question.dto';
import { CreateCommunityQuestionDto } from './dto/create-community-question.dto';
import { PatchAdminUpdateCommunityQuestionDto } from './dto/patch-admin-update-community-question.dto';
import { CommunityQuestionStatusEnum } from './enums/community-question-status.enum';

@Injectable()
export class CommunityQuestionService {
  constructor(
    @InjectRepository(CommunityCategoryEntity)
    private readonly communityCategoryRepository: Repository<CommunityCategoryEntity>,
    private readonly communityQuestionRepository: CommunityQuestionRepository,
    private readonly attachmentsService: AttachmentsService,
    private readonly mailService: MailService,
  ) {}

  @Transactional()
  async create(
    communityCategoryId: number,
    createCommunityQuestionDto: CreateCommunityQuestionDto,
    user: UserEntity,
    attachments: Array<Express.Multer.File>,
  ): Promise<Record<string, number>> {
    const communityCategory =
      await this.communityCategoryRepository.findOneOrFail({
        id: communityCategoryId,
      });

    const communityQuestionDto = this.communityQuestionRepository.create(
      createCommunityQuestionDto,
    );

    communityQuestionDto.user = user;
    communityQuestionDto.communityCategory = communityCategory;

    const communityQuestion =
      await this.communityQuestionRepository.saveAndReturn(
        communityQuestionDto,
        {},
        ['attachmentFiles'],
      );

    await this.communityQuestionRepository.updateEntityAttachments(
      communityQuestion,
      attachments,
    );

    return {
      id: communityQuestion.id,
    };
  }

  fetchCommunityQuestionsByCommunityCategory(
    userId: number,
    fetchMine: string,
    communityCategoryId: number,
    options: IPaginationOptions,
  ) {
    const where = {
      communityCategory: communityCategoryId,
      status: CommunityQuestionStatusEnum.PUBLISHED,
      user: {},
    };
    if (fetchMine) {
      where.user = {
        id: userId,
      };
    }
    return paginate<CommunityQuestionEntity>(
      this.communityQuestionRepository,
      options,
      {
        where,
        relations: ['communityCategory', 'attachmentFiles', 'user'],
      },
    );
  }

  async findAll(
    communityCategoryId: number,
    mine: string,
    user: UserEntity,
    options: ICustomPaginationOptions,
  ): Promise<Pagination<CommunityQuestionEntity, IPaginationMeta>> {
    let queryBuilder = this.communityQuestionRepository
      .createQueryBuilder('communityQuestions')
      .leftJoinAndSelect(
        'communityQuestions.communityCategory',
        'communityCategory',
      )
      .leftJoinAndSelect(
        'communityQuestions.attachmentFiles',
        'attachmentFiles',
      )
      .leftJoinAndSelect('communityQuestions.user', 'user')
      .where('communityQuestions.status = :status', {
        status: CommunityQuestionStatusEnum.PUBLISHED,
      });

    if (communityCategoryId) {
      queryBuilder = queryBuilder.andWhere(
        'communityQuestions.communityCategory = :communityCategory',
        {
          communityCategory: communityCategoryId,
        },
      );
    }

    if (mine) {
      queryBuilder = queryBuilder.andWhere(
        'communityQuestions.user.id = :userId',
        {
          userId: user.id,
        },
      );
    }

    return this.communityQuestionRepository.paginateQueryBuilder(
      queryBuilder,
      options,
      (item) => {
        return {
          ...item,
          isMine: item.user?.id === user.id,
        };
      },
    );
  }

  async findAllForAdmin(
    query: Record<string, string>,
    options: ICustomPaginationOptions,
  ): Promise<Pagination<CommunityQuestionEntity>> {
    const queryBuilder: SelectQueryBuilder<CommunityQuestionEntity> =
      await new CommunityQuestionSearch().apply(
        this.communityQuestionRepository,
        query,
      );

    return this.communityQuestionRepository.paginateQueryBuilder(
      queryBuilder,
      options,
    );
  }

  async findOne(id: number): Promise<CommunityQuestionEntity> {
    return await this.communityQuestionRepository.findOneOrFail(id, {
      relations: ['communityCategory', 'attachmentFiles', 'user'],
    });
  }

  async sendAnswerToCommunityQuestion(
    id: number,
    replyToCommunityResponseDto: ReplyToCommunityResponseDto,
  ) {
    const communityQuestion =
      await this.communityQuestionRepository.findOneOrFail(id, {
        relations: ['user'],
      });

    if (communityQuestion.is_replied) {
      throw new BadRequestException('Community question has reply');
    }

    await this.mailService.sendAnswerToCommunityQuestion(
      communityQuestion.title,
      communityQuestion.description,
      communityQuestion.user.email,
      replyToCommunityResponseDto.answer,
    );

    communityQuestion.is_replied = true;

    await this.communityQuestionRepository.save(communityQuestion);

    return null;
  }

  @Transactional()
  async update(
    id: number,
    communityCategoryId: number,
    updateCommunityQuestionDto: UpdateCommunityQuestionDto,
    attachments: Array<Express.Multer.File>,
  ) {
    await this.communityCategoryRepository.findOneOrFail({
      id: communityCategoryId,
    });

    const updatedCommunityQuestion =
      await this.communityQuestionRepository.updateByIdAndReturn(
        id,
        updateCommunityQuestionDto,
        ['attachmentFiles'],
      );

    await this.communityQuestionRepository.updateEntityAttachments(
      updatedCommunityQuestion,
      attachments,
    );

    await this.communityQuestionRepository.destroyEntityAttachmentFromPaths(
      updatedCommunityQuestion,
      updateCommunityQuestionDto.attachmentLinksToRemove,
    );

    return {
      id,
    };
  }

  async patchUpdate(
    id: number,
    patchAdminUpdateCommunityQuestionDto:
      | PatchAdminUpdateCommunityQuestionDto
      | UpdateCommunityQuestionDto,
  ) {
    await this.communityQuestionRepository.findOneOrFail(id);
    await this.communityQuestionRepository.update(
      id,
      patchAdminUpdateCommunityQuestionDto,
    );

    return {
      id,
    };
  }

  async remove(bulkDestroyDto: BulkDestroyDto): Promise<null> {
    await this.communityQuestionRepository.bulkDestroy(bulkDestroyDto, [
      'attachmentFiles',
    ]);
    return null;
  }
}
