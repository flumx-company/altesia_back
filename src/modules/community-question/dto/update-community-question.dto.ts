import { ApiProperty, PartialType } from '@nestjs/swagger';

import { CreateCommunityQuestionDto } from './create-community-question.dto';

export class UpdateCommunityQuestionDto extends PartialType(
  CreateCommunityQuestionDto,
) {
  @ApiProperty({
    required: false,
    type: [String],
    description: 'Attachments to delete. Attachment path',
  })
  attachmentLinksToRemove: string[];

  @ApiProperty({
    required: false,
    description: 'Community question rating',
    example: 5,
  })
  rating: number;
}
