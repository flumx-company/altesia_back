import { ApiProperty } from '@nestjs/swagger';

export class CreateCommunityQuestionDto {
  @ApiProperty({
    required: true,
    description: 'Community question name',
    example: 'question name',
  })
  title: string;

  @ApiProperty({
    required: true,
    description: 'Community question description',
    example: 'question description',
  })
  description: string;

  @ApiProperty({
    required: false,
    format: 'binary',
  })
  attachments: string[];
}
