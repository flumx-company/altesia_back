import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';

import { CommunityResponseTypeEnum } from '../../modules/community-response/enums/community-response-type.enum';
import { HasRemoveAttachmentsHook } from '../../common/entities/has-remove-attachments.hook';
import { CommunityResponseStatusEnum } from '../../modules/community-response/enums/community-response-status.enum';
import { EntityHasAttachmentsInterface } from '../../common/interfaces/entity-has-attachments.interface';

import { CommunityResponseRatingEntity } from './community-response-rating.entity';
import { UserEntity } from './user.entity';
import { CommunityQuestionEntity } from './community-question.entity';
import { CommunityResponseFileEntity } from './community-response-file.entity';

@Entity('community_responses')
export class CommunityResponseEntity
  extends HasRemoveAttachmentsHook
  implements EntityHasAttachmentsInterface<CommunityResponseFileEntity>
{
  @Column({
    type: 'text',
  })
  answer: string;

  @Column({
    type: 'enum',
    enum: CommunityResponseTypeEnum,
    default: CommunityResponseTypeEnum.DIRECT,
  })
  responseType: CommunityResponseTypeEnum;

  @Column({
    type: 'enum',
    enum: CommunityResponseStatusEnum,
    default: CommunityResponseStatusEnum.UNPUBLISHED,
  })
  status: CommunityResponseStatusEnum;

  // relations

  @ManyToOne(() => UserEntity, (user) => user.communityResponses, {
    onDelete: 'CASCADE',
  })
  user: UserEntity;

  @ManyToOne(
    () => CommunityQuestionEntity,
    (communityQuestion) => communityQuestion.communityResponses,
    {
      onDelete: 'CASCADE',
    },
  )
  communityQuestion: CommunityQuestionEntity;

  @OneToMany(
    () => CommunityResponseFileEntity,
    (communityResponseFile) => communityResponseFile.communityResponse,
    {
      cascade: true,
    },
  )
  attachmentFiles: CommunityResponseFileEntity[];

  @OneToMany(
    () => CommunityResponseRatingEntity,
    (communityRating) => communityRating.communityResponse,
  )
  communityRatings: CommunityResponseRatingEntity[];
}
