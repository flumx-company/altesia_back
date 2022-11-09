import { Entity, ManyToOne } from 'typeorm';

import { AttachmentEmbeddedColumnsEntity } from '../../common/entities/attachment-embedded-columns.entity';

import { CommunityQuestionEntity } from './community-question.entity';

@Entity('community_question_files')
export class CommunityQuestionFileEntity extends AttachmentEmbeddedColumnsEntity {
  @ManyToOne(
    () => CommunityQuestionEntity,
    (communityQuestion) => communityQuestion.attachmentFiles,
    { onDelete: 'CASCADE', orphanedRowAction: 'delete' },
  )
  communityQuestion: CommunityQuestionEntity;
}
