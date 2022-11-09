import { ApiProperty } from '@nestjs/swagger';

export class ChangeOpportunityStatusDto {
  @ApiProperty({
    required: false,
    type: [String],
    description: 'Set some status, published or published',
    example: 'published',
  })
  status: string;
}
