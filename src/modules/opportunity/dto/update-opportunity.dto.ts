import { ApiProperty, PartialType } from '@nestjs/swagger';

import { CreateOpportunityDto } from './create-opportunity.dto';

export class UpdateOpportunityDto extends PartialType(CreateOpportunityDto) {
  @ApiProperty({
    required: false,
    type: [String],
    description: 'Attachments to delete. Attachment path',
  })
  attachmentLinksToRemove: string[];
}
