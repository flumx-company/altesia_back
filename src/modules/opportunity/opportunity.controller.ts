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
  ApiBadRequestResponse,
  ApiConsumes,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AppRoutes } from 'src/app.routes';
import { APP_CONSTANTS } from 'src/common/constants/constants';

import { RoleEnum } from '../role/enums/role.enum';
import { AuthAndVerified } from '../../shared/decorators/auth-and-verified.decorator';
import { ApiCommonResponseDecorator } from '../../shared/decorators/swagger/api-common-response.decorator';
import { BaseErrorResponseDto } from '../../common/dto/base-error-response.dto';
import { FullRequestUrlDecorator } from '../../shared/decorators/full-request-url.decorator';
import { OpportunityAlertService } from '../opportunity-alert/opportunity-alert.service';
import { CreateOpportunityAlertDto } from '../opportunity-alert/dto/create-opportunity-alert.dto';
import { FilesUploadDecorator } from '../../shared/decorators/files-upload.decorator';
import { ApiPaginationParamsQueryDecorator } from '../../shared/decorators/swagger/api-pagination-params-query.decorator';
import { AttachmentLinksToArrayInterceptor } from '../../shared/interceptors/attachment-links-to-array.interceptor';
import { BulkDestroyDto } from '../../common/dto/bulk-destroy.dto';
import { ReplyOpportunityAlertDto } from '../opportunity-alert/dto/reply-opportunity-alert.dto';
import { QueryWithoutPaginatingParams } from '../../shared/decorators/query-without-paginate-params.decorator';
import { DestroyUploadedFilesExceptionInterceptor } from '../../shared/interceptors/destroy-uploaded-files-exception.interceptor';

import { CreateOpportunityDto } from './dto/create-opportunity.dto';
import { OpportunityService } from './opportunity.service';
import { UpdateOpportunityDto } from './dto/update-opportunity.dto';
import { AttachOpportunityToUserDto } from './dto/attach-opportunity-to-user.dto';
import { ChangeOpportunityStatusDto } from './dto/change-opportunity-status.dto';

@ApiTags('Opportunities')
@Controller()
export class OpportunityController {
  constructor(
    private readonly opportunityService: OpportunityService,
    private readonly opportunityAlertService: OpportunityAlertService,
  ) {}

  @Get(AppRoutes.OPPORTUNITY_URL.CLIENT)
  @ApiOperation({ summary: 'Fetch all opportunities' })
  @ApiPaginationParamsQueryDecorator()
  @ApiCommonResponseDecorator({
    description: 'Opportunities successfully fetched',
  })
  @ApiQuery({
    name: 'mine',
    description: 'fetch my opportunities',
    required: false,
  })
  @ApiQuery({
    name: 'search',
    required: false,
  })
  @AuthAndVerified(RoleEnum.USER, RoleEnum.ADMIN)
  findAll(
    @FullRequestUrlDecorator() fullRequestUrl: string,
    @Query('mine') mine: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page = 1,
    @Query('limit', new DefaultValuePipe(5), ParseIntPipe) limit = 5,
    @Req() req,
  ) {
    return this.opportunityService.findAll(req.user, mine, {
      page,
      limit,
      route: fullRequestUrl,
    });
  }

  @Get(AppRoutes.OPPORTUNITY_URL.ADMIN)
  @ApiOperation({ summary: 'Fetch all opportunities' })
  @ApiPaginationParamsQueryDecorator()
  @ApiCommonResponseDecorator({
    description: 'Opportunities successfully fetched',
  })
  @ApiQuery({
    name: 'search',
    required: false,
  })
  @ApiQuery({
    name: 'column',
    description: 'Columns that need to be fetched',
    required: false,
    example: 'created_at,title',
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
  findAllForAdmin(
    @FullRequestUrlDecorator() fullRequestUrl: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page = 1,
    @Query('limit', new DefaultValuePipe(5), ParseIntPipe) limit = 5,
    @Query() query: Record<string, string>,
  ) {
    return this.opportunityService.findAllForAdmin(query, {
      page,
      limit,
      route: fullRequestUrl,
    });
  }

  @Get(`${AppRoutes.OPPORTUNITY_URL.CLIENT}/:id`)
  @ApiOperation({ summary: 'Fetch opportunity by id' })
  @ApiCommonResponseDecorator({
    description: 'Opportunity successfully fetched',
  })
  @ApiCommonResponseDecorator({
    success: false,
    status: HttpStatus.NOT_FOUND,
    description: 'Entity not found',
  })
  @AuthAndVerified(RoleEnum.USER, RoleEnum.ADMIN)
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.opportunityService.findOne(id);
  }
  //
  @Patch(`${AppRoutes.OPPORTUNITY_URL.ADMIN}/:id`)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Change status for opportunity',
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
  changeOpportunityStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() changeOpportunityStatusDto: ChangeOpportunityStatusDto,
  ) {
    return this.opportunityService.changeOpportunityStatus(
      id,
      changeOpportunityStatusDto,
    );
  }

  @Get(`${AppRoutes.OPPORTUNITY_URL.ADMIN}/:id`)
  @ApiOperation({ summary: 'Fetch users that interesting in this opportunity' })
  @ApiParam({
    name: 'id',
    description: 'Opportunity id',
  })
  @ApiPaginationParamsQueryDecorator()
  @ApiCommonResponseDecorator({
    description: 'Users successfully fetched',
  })
  @ApiCommonResponseDecorator({
    success: false,
    status: HttpStatus.NOT_FOUND,
    description: 'Entity not found',
  })
  @AuthAndVerified(RoleEnum.USER, RoleEnum.ADMIN)
  fetchUsersThatInterestingInOpportunity(
    @Param('id', ParseIntPipe) id: number,
    @FullRequestUrlDecorator() fullRequestUrl: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page = 1,
    @Query('limit', new DefaultValuePipe(5), ParseIntPipe) limit = 5,
  ) {
    return this.opportunityService.fetchUsersThatInterestingInOpportunity(id, {
      page,
      limit,
      route: fullRequestUrl,
    });
  }

  @Get(`${AppRoutes.OPPORTUNITY_URL.CLIENT}/:id/alerts`)
  @ApiOperation({ summary: "Fetch opportunity's alerts" })
  @ApiParam({
    name: 'id',
    description: 'Opportunity id',
  })
  @ApiQuery({
    name: 'search',
    required: false,
  })
  @ApiQuery({
    name: 'orderBy',
    required: false,
    example: 'created_at desc',
  })
  @ApiPaginationParamsQueryDecorator()
  @ApiCommonResponseDecorator({
    description: 'Opportunity alerts successfully fetched',
    status: HttpStatus.OK,
  })
  @ApiCommonResponseDecorator({
    success: false,
    status: HttpStatus.NOT_FOUND,
    description: 'Entity not found',
  })
  @AuthAndVerified(RoleEnum.USER, RoleEnum.ADMIN)
  findAllAlertsBelongsToOpportunity(
    @Param('id', ParseIntPipe) id: number,
    @FullRequestUrlDecorator() fullRequestUrl: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page = 1,
    @Query('limit', new DefaultValuePipe(5), ParseIntPipe) limit = 5,
    @QueryWithoutPaginatingParams() query: Record<string, string>,
  ) {
    return this.opportunityAlertService.findAllAlertsBelongsToOpportunity(
      id,
      query,
      {
        page,
        limit,
        route: fullRequestUrl,
      },
    );
  }

  @Get(`${AppRoutes.OPPORTUNITY_URL.CLIENT}/user/alerts/fetch`)
  @ApiOperation({ summary: "Fetch opportunity's user alerts" })
  @ApiPaginationParamsQueryDecorator()
  @ApiCommonResponseDecorator({
    description: 'Opportunity alerts successfully fetched',
    status: HttpStatus.OK,
  })
  @ApiCommonResponseDecorator({
    success: false,
    status: HttpStatus.NOT_FOUND,
    description: 'Entity not found',
  })
  @AuthAndVerified(RoleEnum.USER)
  findAllAlertsForCurrentUser(
    @Req() req,
    @FullRequestUrlDecorator() fullRequestUrl: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page = 1,
    @Query('limit', new DefaultValuePipe(5), ParseIntPipe) limit = 5,
  ) {
    return this.opportunityAlertService.findAllAlertsForCurrentUser(
      +req.user.id,
      {
        page,
        limit,
        route: fullRequestUrl,
      },
    );
  }

  @Post(`${AppRoutes.OPPORTUNITY_URL.ADMIN}/alerts/:alertId/reply`)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Reply to opportunity alert request',
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
    @Req() req: any,
    @Param('alertId', ParseIntPipe) alertId: number,
    @Body() replyOpportunityAlertDto: ReplyOpportunityAlertDto,
  ) {
    return this.opportunityAlertService.replyOpportunityAlert(
      req.user,
      alertId,
      replyOpportunityAlertDto,
    );
  }

  @Post(AppRoutes.OPPORTUNITY_URL.ADMIN)
  @ApiOperation({ summary: 'Create a new opportunity' })
  @ApiCommonResponseDecorator({
    description: 'Opportunity successfully created',
    status: HttpStatus.CREATED,
  })
  @ApiConsumes('multipart/form-data')
  @AuthAndVerified(RoleEnum.ADMIN)
  @UseInterceptors(DestroyUploadedFilesExceptionInterceptor)
  @FilesUploadDecorator(APP_CONSTANTS.OPPORTUNITY_ATTACHMENTS_DIR)
  createOpportunity(
    @Body() body: CreateOpportunityDto,
    @UploadedFiles() attachments: Array<Express.Multer.File>,
  ): Promise<Record<string, number>> {
    return this.opportunityService.createOpportunity(body, attachments);
  }

  @Post(`${AppRoutes.OPPORTUNITY_URL.CLIENT}/:id/alerts`)
  @ApiOperation({
    summary: 'Create a new alert that belong to some opportunity',
  })
  @ApiParam({
    name: 'id',
    description: 'Opportunity id',
  })
  @ApiConsumes('multipart/form-data')
  @ApiCommonResponseDecorator({
    description: 'Alert successfully created',
    status: HttpStatus.CREATED,
  })
  @ApiCommonResponseDecorator({
    success: false,
    status: HttpStatus.NOT_FOUND,
    description: 'Entity not found',
  })
  @AuthAndVerified(RoleEnum.USER, RoleEnum.ADMIN)
  @UseInterceptors(DestroyUploadedFilesExceptionInterceptor)
  @FilesUploadDecorator(APP_CONSTANTS.OPPORTUNITY_ALERT_ATTACHMENTS_DIR)
  createAlertForOpportunity(
    @Req() req,
    @Param('id', ParseIntPipe) id: number,
    @Body() createAlertDto: CreateOpportunityAlertDto,
    @UploadedFiles() attachments: Array<Express.Multer.File>,
  ) {
    return this.opportunityAlertService.create(
      req.user,
      id,
      createAlertDto,
      attachments,
    );
  }

  @Post(`${AppRoutes.OPPORTUNITY_URL.ADMIN}/:id`)
  @ApiOperation({ summary: 'Update opportunity by id' })
  @HttpCode(HttpStatus.OK)
  @ApiConsumes('multipart/form-data')
  @ApiCommonResponseDecorator({
    description: 'Opportunity successfully updated',
  })
  @ApiCommonResponseDecorator({
    success: false,
    status: HttpStatus.NOT_FOUND,
    description: 'Entity not found',
  })
  @AuthAndVerified(RoleEnum.ADMIN)
  @UseInterceptors(
    AttachmentLinksToArrayInterceptor,
    DestroyUploadedFilesExceptionInterceptor,
  )
  @FilesUploadDecorator(APP_CONSTANTS.OPPORTUNITY_ATTACHMENTS_DIR)
  updateOpportunity(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateOpportunityDto: UpdateOpportunityDto,
    @UploadedFiles() attachments: Array<Express.Multer.File>,
  ) {
    return this.opportunityService.updateOpportunity(
      +id,
      updateOpportunityDto,
      attachments,
    );
  }

  @Patch(`${AppRoutes.OPPORTUNITY_URL.CLIENT}/:id/user-attach`)
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Attach opportunity to current (authenticated) user',
  })
  @ApiCommonResponseDecorator({
    description: 'Opportunity attached to user',
    status: HttpStatus.CREATED,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    type: BaseErrorResponseDto,
    description: 'You already have this opportunity',
  })
  @ApiCommonResponseDecorator({
    success: false,
    status: HttpStatus.NOT_FOUND,
    description: 'Entity not found',
  })
  @AuthAndVerified(RoleEnum.USER, RoleEnum.ADMIN)
  attachOpportunityToUser(
    @Req() req,
    @Body() attachOpportunityToUserDto: AttachOpportunityToUserDto,
    @Param('id') id: string,
  ) {
    return this.opportunityService.attachOpportunityToUser(
      req.user,
      attachOpportunityToUserDto,
      +id,
    );
  }

  @Delete(`${AppRoutes.OPPORTUNITY_URL.CLIENT}/:id/user-detach`)
  @ApiOperation({
    summary: 'Detach opportunity from current (authenticated) user',
  })
  @ApiCommonResponseDecorator({
    description: 'Opportunity has detached from user successfully',
    status: HttpStatus.NO_CONTENT,
  })
  @ApiBadRequestResponse({
    description: 'Bad request',
  })
  @AuthAndVerified(RoleEnum.USER, RoleEnum.ADMIN)
  detachOpportunityFromUser(@Req() req, @Param('id') id: string) {
    return this.opportunityService.detachOpportunityFromUser(req.user, +id);
  }

  @Delete(`${AppRoutes.OPPORTUNITY_URL.ADMIN}`)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Destroy opportunity by ids',
  })
  @ApiCommonResponseDecorator({
    description: 'Opportunity was deleted successfully',
    status: HttpStatus.NO_CONTENT,
  })
  @AuthAndVerified(RoleEnum.ADMIN)
  destroy(@Body() bulkDestroyDto: BulkDestroyDto) {
    return this.opportunityService.destroy(bulkDestroyDto);
  }
}
