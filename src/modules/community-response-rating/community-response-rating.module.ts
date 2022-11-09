import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CommunityResponseEntity } from '../../shared/models/community-response.entity';
import { CommunityResponseRatingEntity } from '../../shared/models/community-response-rating.entity';
import { CaslModule } from '../casl/casl.module';

import { CommunityResponseRatingService } from './community-response-rating.service';
import { CommunityResponseRatingController } from './community-response-rating.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      CommunityResponseRatingEntity,
      CommunityResponseEntity,
    ]),
    CaslModule,
  ],
  controllers: [CommunityResponseRatingController],
  providers: [CommunityResponseRatingService],
  exports: [CommunityResponseRatingService],
})
export class CommunityResponseRatingModule {}
