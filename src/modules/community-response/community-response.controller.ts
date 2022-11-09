import {
  Controller,
  Get,
  Body,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  Post,
  UploadedFiles,
  Req,
  Query,
  DefaultValuePipe,
  ParseIntPipe,
  UseInterceptors,
  Patch,
} from '@nestjs/common';
import {
  ApiConsumes,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { IPaginationMeta, Pagination } from 'nestjs-typeorm-paginate';

import { RoleEnum } from '../role/enums/role.enum';
import { APP_CONSTANTS } from '../../common/constants/constants';
import { CreateCommunityRatingDto } from '../community-response-rating/dto/create-community-rating.dto';
import { CommunityResponseRatingService } from '../community-response-rating/community-response-rating.service';
import { ApiCommonResponseDecorator } from '../../shared/decorators/swagger/api-common-response.decorator';
import { AuthAndVerified } from '../../shared/decorators/auth-and-verified.decorator';
import { ApiPaginationParamsQueryDecorator } from '../../shared/decorators/swagger/api-pagination-params-query.decorator';
import { AppRoutes } from '../../app.routes';
import { FullRequestUrlDecorator } from '../../shared/decorators/full-request-url.decorator';
import { QueryWithoutPaginatingParams } from '../../shared/decorators/query-without-paginate-params.decorator';
import { FilesUploadDecorator } from '../../shared/decorators/files-upload.decorator';
import { CommunityResponseEntity } from '../../shared/models/community-response.entity';
import { AttachmentLinksToArrayInterceptor } from '../../shared/interceptors/attachment-links-to-array.interceptor';
import { BulkDestroyDto } from '../../common/dto/bulk-destroy.dto';
import { CheckPolicies } from '../../shared/decorators/check-policies.decorator';
import { UpdateCommunityResponseHandler } from '../../shared/policy-handlers/community-response/update-community-response.handler';
import { DestroyUploadedFilesExceptionInterceptor } from '../../shared/interceptors/destroy-uploaded-files-exception.interceptor';

import { UpdateCommunityResponseDto } from './dto/update-community-response.dto';
import { CommunityResponseService } from './community-response.service';
import { PatchAdminUpdateCommunityResponseDto } from './dto/patch-admin-update-community-response.dto';

@ApiTags('Community Response')
@Controller()
export class CommunityResponseController {
  constructor(
    private readonly communityResponseService: CommunityResponseService,
    private readonly communityRatingService: CommunityResponseRatingService,
  ) {}

  @Get(`${AppRoutes.COMMUNITY_RESPONSE_URL.CLIENT}`)
  @ApiOperation({
    summary: 'Fetch all community responses',
  })
  @ApiPaginationParamsQueryDecorator()
  @ApiCommonResponseDecorator({
    description: 'Community responses fetched successfully',
  })
  @ApiQuery({
    name: 'communityQuestionId',
    description: 'Fetch entities by community question iq',
    required: false,
  })
  @ApiQuery({
    name: 'answer',
    description: 'Fetch entities by answer',
    required: false,
  })
  @ApiQuery({
    name: 'orderBy',
    required: false,
    example: 'created_at desc',
  })
  @ApiQuery({
    name: 'responseType',
    description: 'response type',
    enum: ['all', 'direct'],
    example: 'all',
    required: false,
  })
  @AuthAndVerified(RoleEnum.USER, RoleEnum.ADMIN)
  fetchAll(
    @Req() req,
    @QueryWithoutPaginatingParams() query,
    @FullRequestUrlDecorator() fullRequestUrl: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page = 1,
    @Query('limit', new DefaultValuePipe(5), ParseIntPipe) limit = 5,
  ): Promise<Pagination<CommunityResponseEntity, IPaginationMeta>> {
    return this.communityResponseService.fetchAll(req.user, query, {
      page,
      limit,
      route: fullRequestUrl,
    });
  }

  @Get(`${AppRoutes.COMMUNITY_RESPONSE_URL.CLIENT}/:id`)
  @ApiOperation({
    summary: 'Fetch community response by id',
  })
  @ApiCommonResponseDecorator({
    description: 'Community response fetched successfully',
  })
  @ApiCommonResponseDecorator({
    success: false,
    description: 'Entity not found',
    status: HttpStatus.NOT_FOUND,
  })
  @AuthAndVerified(RoleEnum.USER, RoleEnum.ADMIN)
  findOne(@Req() req, @Param('id', ParseIntPipe) id: number) {
    return this.communityResponseService.findOne(req.user, id);
  }

  @Post(`${AppRoutes.COMMUNITY_RESPONSE_URL.CLIENT}/:id`)
  @ApiOperation({
    summary: 'Update community response by id',
  })
  @HttpCode(HttpStatus.OK)
  @ApiCommonResponseDecorator({
    description: 'Community response entity updated successfully',
  })
  @ApiCommonResponseDecorator({
    success: false,
    description: 'Entity not found',
    status: HttpStatus.NOT_FOUND,
  })
  @ApiConsumes('multipart/form-data')
  @CheckPolicies(new UpdateCommunityResponseHandler())
  @AuthAndVerified(RoleEnum.USER, RoleEnum.ADMIN)
  @UseInterceptors(
    AttachmentLinksToArrayInterceptor,
    DestroyUploadedFilesExceptionInterceptor,
  )
  @FilesUploadDecorator(APP_CONSTANTS.COMMUNITY_RESPONSE_ATTACHMENTS_DIR)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCommunityResponseDto: UpdateCommunityResponseDto,
    @UploadedFiles() attachments: Array<Express.Multer.File>,
  ) {
    return this.communityResponseService.update(
      id,
      updateCommunityResponseDto,
      attachments,
    );
  }

  @Patch(`${AppRoutes.COMMUNITY_RESPONSE_URL.ADMIN}/:id`)
  @ApiOperation({
    summary: 'Patch update community response by id',
  })
  @HttpCode(HttpStatus.OK)
  @ApiParam({
    name: 'id',
    description: 'Community response id',
    required: true,
  })
  @ApiResponse({
    description: 'Community response updated successfully',
    status: HttpStatus.OK,
  })
  @ApiCommonResponseDecorator({
    success: false,
    description: 'Entity not found',
    status: HttpStatus.NOT_FOUND,
  })
  @AuthAndVerified(RoleEnum.USER, RoleEnum.ADMIN)
  patchUpdate(
    @Param('id', ParseIntPipe) id: number,
    @Body()
    patchAdminUpdateCommunityResponseDto: PatchAdminUpdateCommunityResponseDto,
  ) {
    return this.communityResponseService.patchUpdate(
      id,
      patchAdminUpdateCommunityResponseDto,
    );
  }

  @Post(`${AppRoutes.COMMUNITY_RESPONSE_URL.CLIENT}/:id/rate`)
  @ApiOperation({
    summary: 'Rate community response by id',
  })
  @ApiResponse({
    description: 'Community question rating created successfully',
    status: HttpStatus.OK,
  })
  @ApiCommonResponseDecorator({
    success: false,
    description: 'Entity not found',
    status: HttpStatus.NOT_FOUND,
  })
  @AuthAndVerified(RoleEnum.USER, RoleEnum.ADMIN)
  rateCommunityQuestion(
    @Req() req,
    @Param('id', ParseIntPipe) communityResponseId: number,
    @Body() createCommunityRatingDto: CreateCommunityRatingDto,
  ) {
    return this.communityRatingService.create(
      req.user,
      communityResponseId,
      createCommunityRatingDto,
    );
  }

  @Delete(`${AppRoutes.COMMUNITY_RESPONSE_URL.CLIENT}`)
  @ApiOperation({
    summary: 'Destroy community response entities by ids',
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiCommonResponseDecorator({
    description: 'Community response entities were deleted successfully',
    status: HttpStatus.NO_CONTENT,
  })
  @AuthAndVerified(RoleEnum.USER, RoleEnum.ADMIN)
  remove(@Body() bulkDestroyDto: BulkDestroyDto) {
    return this.communityResponseService.remove(bulkDestroyDto);
  }
}
