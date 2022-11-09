import { PartialType } from '@nestjs/swagger';

import { CreateCommunityCategoryDto } from './create-community-category.dto';

export class UpdateCommunityCategoryDto extends PartialType(
  CreateCommunityCategoryDto,
) {}
