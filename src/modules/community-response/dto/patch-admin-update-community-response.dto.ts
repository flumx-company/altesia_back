import { ApiProperty } from '@nestjs/swagger';

import { CommunityResponseStatusEnum } from '../enums/community-response-status.enum';

export class PatchAdminUpdateCommunityResponseDto {
  @ApiProperty({
    required: false,
    description: 'Community question status',
    enum: [CommunityResponseStatusEnum],
    example: CommunityResponseStatusEnum.PUBLISHED,
  })
  status: CommunityResponseStatusEnum;
}
