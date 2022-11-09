import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CommunityResponseEntity } from '../../shared/models/community-response.entity';
import { UserEntity } from '../../shared/models/user.entity';
import { CommunityResponseRatingEntity } from '../../shared/models/community-response-rating.entity';

import { CreateCommunityRatingDto } from './dto/create-community-rating.dto';
import { UpdateCommunityRatingDto } from './dto/update-community-rating.dto';

@Injectable()
export class CommunityResponseRatingService {
  constructor(
    @InjectRepository(CommunityResponseRatingEntity)
    private readonly communityResponseRatingRepository: Repository<CommunityResponseRatingEntity>,
    @InjectRepository(CommunityResponseEntity)
    private readonly communityResponseRepository: Repository<CommunityResponseEntity>,
  ) {}

  async create(
    user: UserEntity,
    communityResponseId: number,
    createCommunityRatingDto: CreateCommunityRatingDto,
  ) {
    const communityResponse =
      await this.communityResponseRepository.findOneOrFail(communityResponseId);

    const [_, countOfRatedCommunityResponses] =
      await this.communityResponseRatingRepository.findAndCount({
        where: {
          user: user.id,
          communityResponse: communityResponse.id,
        },
      });

    if (countOfRatedCommunityResponses > 0) {
      throw new BadRequestException('You already has rated it');
    }

    let communityRating = this.communityResponseRatingRepository.create(
      createCommunityRatingDto,
    );
    communityRating.user = user;
    communityRating.communityResponse = communityResponse;
    communityRating = await this.communityResponseRatingRepository.save(
      communityRating,
    );
    return {
      id: communityRating.id,
    };
  }

  async update(id: number, updateCommunityRatingDto: UpdateCommunityRatingDto) {
    const communityRating =
      await this.communityResponseRatingRepository.findOneOrFail(id);
    await this.communityResponseRatingRepository.update(
      id,
      updateCommunityRatingDto,
    );
    return {
      id: communityRating.id,
    };
  }
}
