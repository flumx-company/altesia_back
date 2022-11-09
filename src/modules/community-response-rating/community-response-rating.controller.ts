import { Controller, Body, Param, Put, ParseIntPipe } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { AuthAndVerified } from '../../shared/decorators/auth-and-verified.decorator';
import { RoleEnum } from '../role/enums/role.enum';
import { CheckPolicies } from '../../shared/decorators/check-policies.decorator';
import { CommunityResponseRatingHandler } from '../../shared/policy-handlers/community-response-rating/community-response-rating.handler';

import { UpdateCommunityRatingDto } from './dto/update-community-rating.dto';
import { CommunityResponseRatingService } from './community-response-rating.service';

@ApiTags('Community Response Ratings')
@Controller('client/community-response-ratings')
export class CommunityResponseRatingController {
  constructor(
    private readonly communityRatingService: CommunityResponseRatingService,
  ) {}

  @Put(':id')
  @ApiOperation({
    summary: 'Update community rating',
  })
  @CheckPolicies(new CommunityResponseRatingHandler())
  @AuthAndVerified(RoleEnum.USER, RoleEnum.ADMIN)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCommunityRatingDto: UpdateCommunityRatingDto,
  ) {
    return this.communityRatingService.update(id, updateCommunityRatingDto);
  }
}
