import { ApiProperty } from '@nestjs/swagger';

import { CommunityResponseTypeEnum } from '../enums/community-response-type.enum';

export class CreateCommunityResponseDto {
  @ApiProperty({
    example: 'some answer',
  })
  answer: string;

  @ApiProperty({
    enum: ['all', 'direct'],
  })
  responseType: CommunityResponseTypeEnum;

  @ApiProperty({
    required: false,
    format: 'binary',
  })
  attachments: string[];
}
