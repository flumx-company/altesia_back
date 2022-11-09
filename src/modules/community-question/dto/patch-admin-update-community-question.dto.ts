import { ApiProperty } from '@nestjs/swagger';

import { CommunityQuestionStatusEnum } from '../enums/community-question-status.enum';

export class PatchAdminUpdateCommunityQuestionDto {
  @ApiProperty({
    required: false,
    description: 'Community question status',
    enum: [CommunityQuestionStatusEnum],
    example: CommunityQuestionStatusEnum.PUBLISHED,
  })
  status: CommunityQuestionStatusEnum;
}
