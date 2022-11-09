import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserFeatureReplyRepository } from '../../shared/repositories/user-feature-reply.repository';

import { UserFeatureReplyService } from './user-feature-reply.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserFeatureReplyRepository])],
  providers: [UserFeatureReplyService],
  controllers: [],
  exports: [UserFeatureReplyService],
})
export class UserFeatureReplyModule {}
