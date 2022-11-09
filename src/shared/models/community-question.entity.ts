import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { IsNotEmpty } from 'class-validator';

import { HasRemoveAttachmentsHook } from '../../common/entities/has-remove-attachments.hook';
import { CommunityQuestionStatusEnum } from '../../modules/community-question/enums/community-question-status.enum';
import { EntityHasAttachmentsInterface } from '../../common/interfaces/entity-has-attachments.interface';

import { UserEntity } from './user.entity';
import { CommunityCategoryEntity } from './community-category.entity';
import { CommunityResponseEntity } from './community-response.entity';
import { CommunityQuestionFileEntity } from './community-question-file.entity';

@Entity('community_questions')
export class CommunityQuestionEntity
  extends HasRemoveAttachmentsHook
  implements EntityHasAttachmentsInterface<CommunityQuestionFileEntity>
{
  @Column({
    type: 'varchar',
    length: 1024,
  })
  @IsNotEmpty()
  title: string;

  @Column({
    type: 'text',
  })
  @IsNotEmpty()
  description: string;

  @Column({
    default: 0,
  })
  rating: number;

  @Column({
    type: 'enum',
    enum: CommunityQuestionStatusEnum,
    default: CommunityQuestionStatusEnum.UNPUBLISHED,
  })
  status: CommunityQuestionStatusEnum;

  @Column({ default: false })
  is_replied: boolean;

  // relations
  @ManyToOne(() => UserEntity, (user) => user.communityQuestions, {
    onDelete: 'CASCADE',
  })
  user: UserEntity;

  @ManyToOne(
    () => CommunityCategoryEntity,
    (communityCategory) => communityCategory.communityQuestions,
    {
      onDelete: 'CASCADE',
    },
  )
  communityCategory: CommunityCategoryEntity;

  @OneToMany(
    () => CommunityQuestionFileEntity,
    (communityQuestionFile) => communityQuestionFile.communityQuestion,
    {
      cascade: true,
    },
  )
  attachmentFiles: CommunityQuestionFileEntity[];

  @OneToMany(
    () => CommunityResponseEntity,
    (communityResponse) => communityResponse.communityQuestion,
  )
  communityResponses: CommunityResponseEntity[];
}
