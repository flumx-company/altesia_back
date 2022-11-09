import { Column, Entity, ManyToOne } from 'typeorm';

import { BaseEntity } from '../../common/entities/base-entity.entity';

import { UserEntity } from './user.entity';
import { CommunityResponseEntity } from './community-response.entity';

@Entity('community_response_ratings')
export class CommunityResponseRatingEntity extends BaseEntity {
  @Column()
  rating: number;

  @ManyToOne(() => UserEntity, {
    onDelete: 'CASCADE',
  })
  user: UserEntity;

  @ManyToOne(
    () => CommunityResponseEntity,
    (communityResponse) => communityResponse.communityRatings,
    {
      onDelete: 'CASCADE',
    },
  )
  communityResponse: CommunityResponseEntity;
}
