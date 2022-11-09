import { ApiProperty } from '@nestjs/swagger';

export class CreateOpportunityAlertDto {
  @ApiProperty({
    example: 'opportunity-alert title',
  })
  title: string;

  @ApiProperty({
    example: 'opportunity-alert description',
  })
  description: string;

  @ApiProperty({
    required: false,
    format: 'binary',
  })
  attachments: string[];
}
