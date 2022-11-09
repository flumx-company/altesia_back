import { Column, Entity, OneToMany } from 'typeorm';
import { IsNotEmpty } from 'class-validator';

import { BaseEntity } from '../../common/entities/base-entity.entity';

import { CommunityQuestionEntity } from './community-question.entity';

@Entity('community_categories')
export class CommunityCategoryEntity extends BaseEntity {
  @Column({
    unique: true,
  })
  @IsNotEmpty()
  name: string;

  @OneToMany(
    () => CommunityQuestionEntity,
    (communityQuestion) => communityQuestion.communityCategory,
  )
  communityQuestions: CommunityQuestionEntity[];
}
