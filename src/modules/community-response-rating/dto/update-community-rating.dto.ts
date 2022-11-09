import { PartialType } from '@nestjs/swagger';

import { CreateCommunityRatingDto } from './create-community-rating.dto';

export class UpdateCommunityRatingDto extends PartialType(
  CreateCommunityRatingDto,
) {}
