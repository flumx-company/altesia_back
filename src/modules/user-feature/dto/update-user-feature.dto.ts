import { PartialType } from '@nestjs/swagger';

import { CreateUserFeatureDto } from './create-user-feature.dto';

export class UpdateUserFeatureDto extends PartialType(CreateUserFeatureDto) {}
