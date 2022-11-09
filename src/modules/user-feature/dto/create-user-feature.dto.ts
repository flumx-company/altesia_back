import { ApiProperty } from '@nestjs/swagger';

export class CreateUserFeatureDto {
  @ApiProperty({
    required: true,
  })
  title: string;

  @ApiProperty({
    required: true,
  })
  description: string;

  @ApiProperty({
    required: false,
    format: 'binary',
  })
  attachments: string;
}
