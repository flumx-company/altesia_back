import { Injectable } from '@nestjs/common';

import { UserFeatureReplyRepository } from '../../shared/repositories/user-feature-reply.repository';

@Injectable()
export class UserFeatureReplyService {
  constructor(
    private readonly userFeatureReplyRepository: UserFeatureReplyRepository,
  ) {}

  fetchUserFeatureRepliesThatBelongToUserFeature(userFeatureId: number) {
    return this.userFeatureReplyRepository
      .createQueryBuilder('userFeatureReply')
      .leftJoinAndSelect('userFeatureReply.userFeature', 'userFeature')
      .leftJoinAndSelect('userFeatureReply.replier', 'replier')
      .where('userFeatureReply.userFeature = :userFeatureId', {
        userFeatureId,
      })
      .getOne();
  }
}
