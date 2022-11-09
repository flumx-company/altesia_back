import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Req,
  UploadedFiles,
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

import { RoleEnum } from '../role/enums/role.enum';
import { AppRoutes } from '../../app.routes';
import { CreateCommunityQuestionDto } from '../community-question/dto/create-community-question.dto';
import { CommunityQuestionService } from '../community-question/community-question.service';
import { APP_CONSTANTS } from '../../common/constants/constants';
import { FullRequestUrlDecorator } from '../../shared/decorators/full-request-url.decorator';
import { ApiPaginationParamsQueryDecorator } from '../../shared/decorators/swagger/api-pagination-params-query.decorator';
import { ApiPaginatedDecorator } from '../../shared/decorators/swagger/api-paginated.decorator';
import { AuthAndVerified } from '../../shared/decorators/auth-and-verified.decorator';
import { FilesUploadDecorator } from '../../shared/decorators/files-upload.decorator';
import { BulkDestroyDto } from '../../common/dto/bulk-destroy.dto';
import { AttachmentLinksToArrayInterceptor } from '../../shared/interceptors/attachment-links-to-array.interceptor';
import { UpdateCommunityQuestionDto } from '../community-question/dto/update-community-question.dto';
import { ApiCommonResponseDecorator } from '../../shared/decorators/swagger/api-common-response.decorator';
import { CheckPolicies } from '../../shared/decorators/check-policies.decorator';
import { UpdateCommunityQuestionHandler } from '../../shared/policy-handlers/community-question/update-community-question.handler';
import { DestroyUploadedFilesExceptionInterceptor } from '../../shared/interceptors/destroy-uploaded-files-exception.interceptor';

import { UpdateCommunityCategoryDto } from './dto/update-community-category.dto';
import { CreateCommunityCategoryDto } from './dto/create-community-category.dto';
import { CommunityCategoryService } from './community-category.service';

@ApiTags('Community Categories')
@Controller()
export class CommunityCategoryController {
  constructor(
    private readonly communityCategoryService: CommunityCategoryService,
    private readonly communityQuestionService: CommunityQuestionService,
  ) {}

  @Post(AppRoutes.COMMUNITY_CATEGORY_URL.ADMIN)
  @ApiOperation({
    summary: 'Create a new community category',
  })
  @ApiResponse({
    description: 'Community category created successfully',
    status: HttpStatus.CREATED,
  })
  @AuthAndVerified(RoleEnum.ADMIN)
  create(@Body() createCommunityCategoryDto: CreateCommunityCategoryDto) {
    return this.communityCategoryService.create(createCommunityCategoryDto);
  }

  @Post(
    `${AppRoutes.COMMUNITY_CATEGORY_URL.CLIENT}/:communityCategoryId/community-questions`,
  )
  @ApiOperation({
    summary:
      'Create a new community question with specific community category id',
  })
  @ApiResponse({
    description: 'Community question created successfully',
    status: HttpStatus.CREATED,
  })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(DestroyUploadedFilesExceptionInterceptor)
  @AuthAndVerified(RoleEnum.USER, RoleEnum.ADMIN)
  @FilesUploadDecorator(APP_CONSTANTS.COMMUNITY_QUESTION_ATTACHMENTS_DIR)
  createCommunityQuestionByCommunityId(
    @Param('communityCategoryId', ParseIntPipe) communityCategoryId: number,
    @Body() createCommunityQuestionDto: CreateCommunityQuestionDto,
    @Req() req,
    @UploadedFiles() attachments: Array<Express.Multer.File>,
  ) {
    return this.communityQuestionService.create(
      communityCategoryId,
      createCommunityQuestionDto,
      req.user,
      attachments,
    );
  }

  @Post(
    `${AppRoutes.COMMUNITY_CATEGORY_URL.CLIENT}/:communityCategoryId/community-questions/:id`,
  )
  @ApiOperation({
    summary:
      'Update community question by community category id and community question id',
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
  @ApiConsumes('multipart/form-data')
  @CheckPolicies(new UpdateCommunityQuestionHandler())
  @AuthAndVerified(RoleEnum.USER, RoleEnum.ADMIN)
  @UseInterceptors(
    AttachmentLinksToArrayInterceptor,
    DestroyUploadedFilesExceptionInterceptor,
  )
  @FilesUploadDecorator(APP_CONSTANTS.COMMUNITY_QUESTION_ATTACHMENTS_DIR)
  communityQuestionUpdate(
    @Param('id', ParseIntPipe) id: number,
    @Param('communityCategoryId', ParseIntPipe) communityCategoryId: number,
    @Body() updateCommunityQuestionDto: UpdateCommunityQuestionDto,
    @UploadedFiles() attachments: Array<Express.Multer.File>,
  ) {
    return this.communityQuestionService.update(
      id,
      communityCategoryId,
      updateCommunityQuestionDto,
      attachments,
    );
  }

  @Get(
    `${AppRoutes.COMMUNITY_CATEGORY_URL.CLIENT}/:communityCategoryId/community-questions`,
  )
  @ApiQuery({
    name: 'mine',
    description: 'fetch my community questions',
    required: false,
  })
  @ApiOperation({
    summary: 'Fetch community questions by community category id',
  })
  @ApiPaginationParamsQueryDecorator()
  @ApiPaginatedDecorator()
  @ApiResponse({
    description:
      'Community questions fetched by community category successfully',
    status: HttpStatus.OK,
  })
  @AuthAndVerified(RoleEnum.USER, RoleEnum.ADMIN)
  fetchCommunityQuestionsByCommunityCategory(
    @Param('communityCategoryId', ParseIntPipe) communityCategoryId: number,
    @FullRequestUrlDecorator() fullRequestUrl: string,
    @Query('mine') mine: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page = 1,
    @Query('limit', new DefaultValuePipe(5), ParseIntPipe) limit = 5,
    @Req() req: any,
  ) {
    return this.communityQuestionService.fetchCommunityQuestionsByCommunityCategory(
      req.user.id,
      mine,
      communityCategoryId,
      {
        page,
        limit,
        route: fullRequestUrl,
      },
    );
  }

  @Get(AppRoutes.COMMUNITY_CATEGORY_URL.CLIENT)
  @ApiOperation({
    summary: 'Fetch community categories',
  })
  @ApiResponse({
    description: 'Community categories fetched successfully',
    status: HttpStatus.OK,
  })
  @AuthAndVerified(RoleEnum.USER, RoleEnum.ADMIN)
  findAll() {
    return this.communityCategoryService.findAll();
  }

  @Get(`${AppRoutes.COMMUNITY_CATEGORY_URL.CLIENT}/:id`)
  @ApiOperation({
    summary: 'Fetch community category by id',
  })
  @ApiResponse({
    description: 'Community category fetched successfully',
    status: HttpStatus.OK,
  })
  @ApiCommonResponseDecorator({
    success: false,
    description: 'Entity not found',
    status: HttpStatus.NOT_FOUND,
  })
  @AuthAndVerified(RoleEnum.USER, RoleEnum.ADMIN)
  findOne(@Param('id') id: string) {
    return this.communityCategoryService.findOne(+id);
  }

  @Patch(`${AppRoutes.COMMUNITY_CATEGORY_URL.ADMIN}/:id`)
  @ApiOperation({
    summary: 'Update community category by id',
  })
  @ApiResponse({
    description: 'Community category updated successfully',
    status: HttpStatus.OK,
  })
  @ApiCommonResponseDecorator({
    success: false,
    description: 'Entity not found',
    status: HttpStatus.NOT_FOUND,
  })
  @AuthAndVerified(RoleEnum.ADMIN)
  update(
    @Param('id') id: string,
    @Body() updateCommunityCategoryDto: UpdateCommunityCategoryDto,
  ) {
    return this.communityCategoryService.update(
      +id,
      updateCommunityCategoryDto,
    );
  }

  @Delete(`${AppRoutes.COMMUNITY_CATEGORY_URL.ADMIN}`)
  @ApiOperation({
    summary: 'Destroy community category entities by ids',
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiResponse({
    description: 'Community category entities removed successfully',
    status: HttpStatus.NO_CONTENT,
  })
  @AuthAndVerified(RoleEnum.ADMIN)
  remove(@Body() bulkDestroyDto: BulkDestroyDto) {
    return this.communityCategoryService.remove(bulkDestroyDto);
  }
}
