import {
  Controller,
  Get,
  Body,
  Param,
  Delete,
  HttpStatus,
  HttpCode,
  Post,
  UploadedFiles,
  Query,
  DefaultValuePipe,
  ParseIntPipe,
  Req,
  Patch,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiConsumes,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { AppRoutes } from '../../app.routes';
import { RoleEnum } from '../role/enums/role.enum';
import { APP_CONSTANTS } from '../../common/constants/constants';
import { CommunityResponseService } from '../community-response/community-response.service';
import { CreateCommunityResponseDto } from '../community-response/dto/create-community-response.dto';
import { ApiPaginationParamsQueryDecorator } from '../../shared/decorators/swagger/api-pagination-params-query.decorator';
import { ApiPaginatedDecorator } from '../../shared/decorators/swagger/api-paginated.decorator';
import { AuthAndVerified } from '../../shared/decorators/auth-and-verified.decorator';
import { FullRequestUrlDecorator } from '../../shared/decorators/full-request-url.decorator';
import { FilesUploadDecorator } from '../../shared/decorators/files-upload.decorator';
import { CommunityQuestionEntity } from '../../shared/models/community-question.entity';
import { BulkDestroyDto } from '../../common/dto/bulk-destroy.dto';
import { ApiCommonResponseDecorator } from '../../shared/decorators/swagger/api-common-response.decorator';
import { ReplyToCommunityResponseDto } from '../community-response/dto/reply-to-community-response.dto';
import { DestroyUploadedFilesExceptionInterceptor } from '../../shared/interceptors/destroy-uploaded-files-exception.interceptor';

import { CommunityQuestionService } from './community-question.service';
import { PatchAdminUpdateCommunityQuestionDto } from './dto/patch-admin-update-community-question.dto';

@ApiTags('Community Questions')
@Controller()
export class CommunityQuestionController {
  constructor(
    private readonly communityQuestionService: CommunityQuestionService,
    private readonly communityResponseService: CommunityResponseService,
  ) {}

  @Get(AppRoutes.COMMUNITY_QUESTION_URL.CLIENT)
  @ApiOperation({
    summary: 'Fetch all community questions with published status.',
  })
  @ApiPaginationParamsQueryDecorator()
  @ApiPaginatedDecorator()
  @ApiResponse({
    description: 'Community questions fetched successfully',
    status: HttpStatus.OK,
  })
  @ApiQuery({
    name: 'mine',
    description: 'fetch community questions',
    required: false,
  })
  @ApiQuery({
    name: 'communityCategoryId',
    description: 'fetch community questions by communityCategoryId',
    required: false,
  })
  @AuthAndVerified(RoleEnum.USER)
  findAll(
    @Req() req,
    @FullRequestUrlDecorator() fullRequestUrl: string,
    @Query('communityCategoryId') communityCategoryId: number,
    @Query('mine') mine: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page = 1,
    @Query('limit', new DefaultValuePipe(5), ParseIntPipe) limit = 5,
  ) {
    return this.communityQuestionService.findAll(
      communityCategoryId,
      mine,
      req.user,
      {
        page,
        limit,
        route: fullRequestUrl,
      },
    );
  }

  @Get(AppRoutes.COMMUNITY_QUESTION_URL.ADMIN)
  @ApiOperation({ summary: 'Fetch all community questions' })
  @ApiPaginationParamsQueryDecorator()
  @ApiCommonResponseDecorator({
    description: 'Community questions fetched successfully',
  })
  @ApiQuery({
    name: 'communityCategoryId',
    description: 'fetch community questions by communityCategoryId',
    required: false,
  })
  @ApiQuery({
    name: 'search',
    required: false,
  })
  @ApiQuery({
    name: 'column',
    description: 'Columns that need to be fetched',
    required: false,
    example: 'created_at,description',
  })
  @ApiQuery({
    name: 'orderBy',
    required: false,
    example: 'created_at desc',
  })
  @ApiQuery({
    name: 'sortBy',
    required: false,
    example: 'status published',
  })
  @AuthAndVerified(RoleEnum.ADMIN)
  findAllForAdmin(
    @FullRequestUrlDecorator() fullRequestUrl: string,
    @Query('communityCategoryId') communityCategoryId: number,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page = 1,
    @Query('limit', new DefaultValuePipe(5), ParseIntPipe) limit = 5,
    @Query() query: Record<string, string>,
  ) {
    return this.communityQuestionService.findAllForAdmin(query, {
      page,
      limit,
      route: fullRequestUrl,
    });
  }

  @Get(`${AppRoutes.COMMUNITY_QUESTION_URL.CLIENT}/:id`)
  @ApiOperation({
    summary: 'Fetch community question by id',
  })
  @ApiParam({ name: 'id', description: 'Community Question id' })
  @ApiResponse({
    description: 'Community question fetched successfully',
    status: HttpStatus.OK,
  })
  @ApiCommonResponseDecorator({
    success: false,
    description: 'Entity not found',
    status: HttpStatus.NOT_FOUND,
  })
  @AuthAndVerified(RoleEnum.USER, RoleEnum.ADMIN)
  findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<CommunityQuestionEntity> {
    return this.communityQuestionService.findOne(id);
  }

  @Post(`${AppRoutes.COMMUNITY_QUESTION_URL.CLIENT}/:id/response/reply`)
  @ApiOperation({
    summary: 'Reply to community question',
  })
  @HttpCode(HttpStatus.OK)
  @ApiCommonResponseDecorator({
    description: 'Community question answer has been sent',
  })
  @ApiCommonResponseDecorator({
    success: false,
    description: 'Entity not found',
    status: HttpStatus.NOT_FOUND,
  })
  @AuthAndVerified(RoleEnum.ADMIN)
  sendAnswerToCommunityQuestion(
    @Param('id', ParseIntPipe) id: number,
    @Body() replyToCommunityResponseDto: ReplyToCommunityResponseDto,
  ) {
    return this.communityQuestionService.sendAnswerToCommunityQuestion(
      id,
      replyToCommunityResponseDto,
    );
  }

  @Patch(`${AppRoutes.COMMUNITY_QUESTION_URL.ADMIN}/:id`)
  @ApiOperation({
    summary: 'Patch update community question by id',
  })
  @HttpCode(HttpStatus.OK)
  @ApiParam({
    name: 'id',
    description: 'Community question id',
    required: true,
  })
  @ApiResponse({
    description: 'Community question updated successfully',
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
    patchAdminUpdateCommunityQuestionDto: PatchAdminUpdateCommunityQuestionDto,
  ) {
    return this.communityQuestionService.patchUpdate(
      id,
      patchAdminUpdateCommunityQuestionDto,
    );
  }

  @Post(
    `${AppRoutes.COMMUNITY_QUESTION_URL.CLIENT}/:communityQuestionId/community-responses`,
  )
  @ApiOperation({
    summary:
      'Create a new community response that belongs to specific community question id',
  })
  @ApiParam({
    name: 'communityQuestionId',
    description: 'Community Question id',
  })
  @ApiResponse({
    description: 'Community response created successfully',
    status: HttpStatus.CREATED,
  })
  @ApiConsumes('multipart/form-data')
  @AuthAndVerified(RoleEnum.USER, RoleEnum.ADMIN)
  @UseInterceptors(DestroyUploadedFilesExceptionInterceptor)
  @FilesUploadDecorator(APP_CONSTANTS.COMMUNITY_RESPONSE_ATTACHMENTS_DIR)
  createCommunityResponse(
    @Req() req,
    @Param('communityQuestionId', ParseIntPipe) communityQuestionId: number,
    @Body() createCommunityResponseDto: CreateCommunityResponseDto,
    @UploadedFiles() attachments: Array<Express.Multer.File>,
  ) {
    return this.communityResponseService.create(
      req.user,
      communityQuestionId,
      createCommunityResponseDto,
      attachments,
    );
  }

  @Delete(`${AppRoutes.COMMUNITY_QUESTION_URL.CLIENT}`)
  @ApiOperation({
    summary: 'Destroy community question entities by ids',
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiResponse({
    description: 'Community question entities were deleted successfully',
    status: HttpStatus.NO_CONTENT,
  })
  @AuthAndVerified(RoleEnum.USER, RoleEnum.ADMIN)
  remove(@Body() bulkDestroyDto: BulkDestroyDto) {
    return this.communityQuestionService.remove(bulkDestroyDto);
  }
}
