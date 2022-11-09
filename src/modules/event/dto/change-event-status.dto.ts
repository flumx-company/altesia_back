import { ApiProperty } from '@nestjs/swagger';

export class ChangeEventStatusDto {
  @ApiProperty({
    required: false,
    type: [String],
    description: 'Set some status, published or unpublished',
    example: 'unpublished',
  })
  status: string;
}
