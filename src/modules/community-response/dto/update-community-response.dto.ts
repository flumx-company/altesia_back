import { ApiProperty, PartialType } from '@nestjs/swagger';

import { CreateCommunityResponseDto } from './create-community-response.dto';

export class UpdateCommunityResponseDto extends PartialType(
  CreateCommunityResponseDto,
) {
  @ApiProperty({
    required: false,
    type: [String],
    description: 'Attachments to delete. Attachment path',
  })
  attachmentLinksToRemove: string[];
}
