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
  Post,
  Query,
  Req,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiConsumes,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { IPaginationMeta, Pagination } from 'nestjs-typeorm-paginate';

import { RoleEnum } from '../role/enums/role.enum';
import { APP_CONSTANTS } from '../../common/constants/constants';
import { FullRequestUrlDecorator } from '../../shared/decorators/full-request-url.decorator';
import { AppRoutes } from '../../app.routes';
import { ApiPaginatedDecorator } from '../../shared/decorators/swagger/api-paginated.decorator';
import { ApiPaginationParamsQueryDecorator } from '../../shared/decorators/swagger/api-pagination-params-query.decorator';
import { AuthAndVerified } from '../../shared/decorators/auth-and-verified.decorator';
import { FilesUploadDecorator } from '../../shared/decorators/files-upload.decorator';
import { UserFeatureEntity } from '../../shared/models/user-feature.entity';
import { ApiCommonResponseDecorator } from '../../shared/decorators/swagger/api-common-response.decorator';
import { BulkDestroyDto } from '../../common/dto/bulk-destroy.dto';
import { UserFeatureReplyEntity } from '../../shared/models/user-feature-reply.entity';
import { UserFeatureReplyService } from '../user-feature-reply/user-feature-reply.service';
import { DestroyUploadedFilesExceptionInterceptor } from '../../shared/interceptors/destroy-uploaded-files-exception.interceptor';

import { CreateUserFeatureDto } from './dto/create-user-feature.dto';
import { UserFeatureService } from './user-feature.service';
import { ReplyUserFeatureDto } from './dto/reply-user-feature.dto';

@ApiTags('User Features')
@Controller()
export class UserFeatureController {
  constructor(
    private readonly userFeatureService: UserFeatureService,
    private readonly userFeatureReplyService: UserFeatureReplyService,
  ) {}

  @Get(AppRoutes.USER_FEATURE_URL.ADMIN)
  @ApiOperation({
    summary: 'Fetch all feature requests (users feature requests)',
  })
  @ApiPaginationParamsQueryDecorator()
  @ApiPaginatedDecorator()
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
    example: 'status unpublished',
  })
  @AuthAndVerified(RoleEnum.ADMIN)
  fetchAllFeatureRequests(
    @FullRequestUrlDecorator() fullRequestUrl: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page = 1,
    @Query('limit', new DefaultValuePipe(5), ParseIntPipe) limit = 5,
    @Query() query: Record<string, string>,
  ): Promise<Pagination<UserFeatureEntity>> {
    limit = limit > 100 ? 100 : limit;
    return this.userFeatureService.fetchAllFeatureRequests(query, {
      page,
      limit,
      route: fullRequestUrl,
    });
  }

  @Get(`${AppRoutes.USER_FEATURE_URL.ADMIN}/:userFeatureId/replies`)
  @ApiOperation({
    summary: 'Fetch all feature request replies',
  })
  @AuthAndVerified(RoleEnum.ADMIN)
  fetchUserFeatureRepliesThatBelongToUserFeature(
    @Param('userFeatureId', ParseIntPipe) userFeatureId: number,
  ): Promise<UserFeatureReplyEntity> {
    return this.userFeatureReplyService.fetchUserFeatureRepliesThatBelongToUserFeature(
      userFeatureId,
    );
  }

  @Post(`${AppRoutes.USER_FEATURE_URL.ADMIN}/:id`)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Reply to user feature request',
  })
  @ApiResponse({
    description: 'Response sent successfully',
    status: HttpStatus.OK,
  })
  @ApiCommonResponseDecorator({
    success: false,
    description: 'Entity not found',
    status: HttpStatus.NOT_FOUND,
  })
  @AuthAndVerified(RoleEnum.ADMIN)
  replyToUserFeatureRequest(
    @Param('id', ParseIntPipe) id: number,
    @Body() replyUserFeatureDto: ReplyUserFeatureDto,
    @Req() req,
  ) {
    return this.userFeatureService.replyToUserFeatureRequest(
      req.user,
      id,
      replyUserFeatureDto,
    );
  }

  @Get(AppRoutes.USER_FEATURE_URL.CLIENT)
  @ApiOperation({ summary: 'Fetch own feature requests' })
  @ApiPaginationParamsQueryDecorator()
  @ApiPaginatedDecorator()
  @AuthAndVerified(RoleEnum.USER, RoleEnum.ADMIN)
  fetchUserRequests(
    @Req() req: any,
    @FullRequestUrlDecorator() fullRequestUrl: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page = 1,
    @Query('limit', new DefaultValuePipe(5), ParseIntPipe) limit = 5,
  ): Promise<Pagination<UserFeatureEntity, IPaginationMeta>> {
    limit = limit > 100 ? 100 : limit;
    return this.userFeatureService.fetchUserRequests(req.user.id, {
      page,
      limit,
      route: fullRequestUrl,
    });
  }

  @Post(AppRoutes.USER_FEATURE_URL.CLIENT)
  @ApiOperation({ summary: 'Offer some feature request' })
  @ApiResponse({
    description: 'Your request created successfully',
    status: HttpStatus.CREATED,
  })
  @ApiConsumes('multipart/form-data')
  @AuthAndVerified(RoleEnum.USER, RoleEnum.ADMIN)
  @UseInterceptors(DestroyUploadedFilesExceptionInterceptor)
  @FilesUploadDecorator(APP_CONSTANTS.USER_FEATURE_ATTACHMENTS_DIR)
  storeFeatureRequest(
    @Req() req: any,
    @Body() createUserFeatureDto: CreateUserFeatureDto,
    @UploadedFiles() attachments: Array<Express.Multer.File>,
  ): Promise<Record<string, number>> {
    return this.userFeatureService.storeFeatureRequest(
      req.user,
      createUserFeatureDto,
      attachments,
    );
  }

  @Delete(`${AppRoutes.USER_FEATURE_URL.ADMIN}`)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Destroy user features by ids',
  })
  @ApiCommonResponseDecorator({
    description: 'User features were deleted successfully',
    status: HttpStatus.NO_CONTENT,
  })
  @AuthAndVerified(RoleEnum.ADMIN)
  destroy(@Body() bulkDestroyDto: BulkDestroyDto) {
    return this.userFeatureService.destroy(bulkDestroyDto);
  }
}
