import { BadRequestException, Injectable } from '@nestjs/common';
import { paginate } from 'nestjs-typeorm-paginate';

import { AttachmentsService } from '../../shared/providers/attachments.service';
import { UserEntity } from '../../shared/models/user.entity';
import { UserFeatureEntity } from '../../shared/models/user-feature.entity';
import { UserFeatureRepository } from '../../shared/repositories/user-feature.repository';
import { MailService } from '../mail/mail.service';
import { BulkDestroyDto } from '../../common/dto/bulk-destroy.dto';
import { UserFeatureSearch } from '../../shared/query-filters/user-feature-search/user-feature.search';
import { IPaginationOptions } from '../../common/interfaces/pagination-options.interface';

import { CreateUserFeatureDto } from './dto/create-user-feature.dto';
import { ReplyUserFeatureDto } from './dto/reply-user-feature.dto';

@Injectable()
export class UserFeatureService {
  constructor(
    private readonly userFeatureRepository: UserFeatureRepository,
    private readonly attachmentsService: AttachmentsService,
    private readonly mailService: MailService,
  ) {}

  async fetchAllFeatureRequests(
    query: Record<string, string>,
    options: IPaginationOptions,
  ) {
    const queryBuilder = await new UserFeatureSearch().apply(
      this.userFeatureRepository,
      query,
    );

    return this.userFeatureRepository.paginateQueryBuilder(
      queryBuilder,
      options,
    );
  }

  async replyToUserFeatureRequest(
    user: UserEntity,
    id: number,
    replyUserFeatureDto: ReplyUserFeatureDto,
  ): Promise<null> {
    let userFeature = await this.userFeatureRepository.findOneOrFail(id, {
      relations: ['user'],
    });

    if (userFeature.is_replied) {
      throw new BadRequestException('User feature already has response');
    }

    await this.mailService.sendUserFeatureResponseEmail(
      userFeature.title,
      userFeature.description,
      userFeature.user.email,
      replyUserFeatureDto.answer,
    );

    userFeature = {
      ...userFeature,
      is_replied: true,
      replied_description: replyUserFeatureDto.answer,
      userFeatureReply: {
        userFeature,
        replier: user,
      },
    };

    await this.userFeatureRepository.save(userFeature);

    return null;
  }

  async fetchUserRequests(userId: number, options: IPaginationOptions) {
    return paginate<UserFeatureEntity>(this.userFeatureRepository, options, {
      where: { user: userId },
      relations: ['attachmentFiles'],
    });
  }

  async storeFeatureRequest(
    user: UserEntity,
    createUserFeatureDto: CreateUserFeatureDto,
    attachments: Array<Express.Multer.File>,
  ): Promise<Record<string, number>> {
    const userFeatureDto =
      this.userFeatureRepository.create(createUserFeatureDto);
    userFeatureDto.user = user;

    const userFeature = await this.userFeatureRepository.saveAndReturn(
      userFeatureDto,
      {},
      ['attachmentFiles'],
    );

    await this.userFeatureRepository.updateEntityAttachments(
      userFeature,
      attachments,
    );

    return {
      id: userFeature.id,
    };
  }

  async destroy(bulkDestroyDto: BulkDestroyDto): Promise<null> {
    await this.userFeatureRepository.bulkDestroy(bulkDestroyDto, [
      'attachmentFiles',
    ]);
    return null;
  }
}
