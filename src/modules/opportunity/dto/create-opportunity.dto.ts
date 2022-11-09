import { ApiProperty } from '@nestjs/swagger';

export class CreateOpportunityDto {
  @ApiProperty({
    required: true,
    description: 'Title of opportunity',
    example: 'opportunity title',
  })
  title: string;

  @ApiProperty({
    required: true,
    description: 'Rate for opportunity',
    example: 300,
  })
  rate: number;

  @ApiProperty({
    required: true,
    description: 'Opportunity location',
    example: 'London',
  })
  location: string;

  @ApiProperty({
    required: true,
    description: 'Opportunity duration',
    example: '30 days',
  })
  duration: string;

  @ApiProperty({
    required: true,
    description: 'Client name',
    example: 'Client',
  })
  client_name: string;

  @ApiProperty({
    required: true,
    description: 'Opportunity industry',
    example: 'Some industry',
  })
  industry: string;

  @ApiProperty({
    required: true,
    description: 'Opportunity additional information',
    example: 'Some information',
  })
  info: string;

  @ApiProperty({
    required: false,
    format: 'binary',
  })
  attachments?: string;
}
