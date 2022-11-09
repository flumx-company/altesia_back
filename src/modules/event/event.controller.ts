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

import { RoleEnum } from '../role/enums/role.enum';
import { FullRequestUrlDecorator } from '../../shared/decorators/full-request-url.decorator';
import { APP_CONSTANTS } from '../../common/constants/constants';
import { ApiPaginationParamsQueryDecorator } from '../../shared/decorators/swagger/api-pagination-params-query.decorator';
import { ApiPaginatedDecorator } from '../../shared/decorators/swagger/api-paginated.decorator';
import { AuthAndVerified } from '../../shared/decorators/auth-and-verified.decorator';
import { FilesUploadDecorator } from '../../shared/decorators/files-upload.decorator';
import { BaseErrorResponseDto } from '../../common/dto/base-error-response.dto';
import { ApiCommonResponseDecorator } from '../../shared/decorators/swagger/api-common-response.decorator';
import { BulkDestroyDto } from '../../common/dto/bulk-destroy.dto';
import { DestroyUploadedFilesExceptionInterceptor } from '../../shared/interceptors/destroy-uploaded-files-exception.interceptor';
import { AttachmentLinksToArrayInterceptor } from '../../shared/interceptors/attachment-links-to-array.interceptor';

import { EventService } from './event.service';
import { CreateEventDto } from './dto/create-event.dto';
import { AttachEventToUser } from './dto/attach-event-to-user';
import { ChangeEventStatusDto } from './dto/change-event-status.dto';
import { UpdateEventDto } from './dto/update-event.dto';

@ApiTags('Events')
@Controller()
export class EventController {
  constructor(private readonly eventsService: EventService) {}

  @Get(AppRoutes.EVENT_URL.CLIENT)
  @ApiOperation({
    summary: 'Fetch all events',
  })
  @ApiPaginationParamsQueryDecorator()
  @ApiPaginatedDecorator()
  @ApiQuery({
    name: 'mine',
    description: 'fetch my opportunities',
    required: false,
  })
  @ApiResponse({
    description: 'Events are fetched successfully',
    status: HttpStatus.OK,
  })
  @AuthAndVerified(RoleEnum.USER, RoleEnum.ADMIN)
  fetchAllEvents(
    @FullRequestUrlDecorator() fullRequestUrl: string,
    @Query('mine') mine: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page = 1,
    @Query('limit', new DefaultValuePipe(5), ParseIntPipe) limit = 5,
    @Req() req,
  ) {
    limit = limit > 100 ? 100 : limit;
    return this.eventsService.fetchAllEvents(req.user, mine, {
      page,
      limit,
      route: fullRequestUrl,
    });
  }

  @Get(AppRoutes.EVENT_URL.ADMIN)
  @ApiOperation({ summary: 'Fetch all events' })
  @ApiPaginationParamsQueryDecorator()
  @ApiCommonResponseDecorator({
    description: 'Events successfully fetched',
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
    example: 'status unpublished',
  })
  @AuthAndVerified(RoleEnum.ADMIN)
  findAllForAdmin(
    @FullRequestUrlDecorator() fullRequestUrl: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page = 1,
    @Query('limit', new DefaultValuePipe(5), ParseIntPipe) limit = 5,
    @Query() query: Record<string, string>,
  ) {
    return this.eventsService.findAllEventsForAdmin(query, {
      page,
      limit,
      route: fullRequestUrl,
    });
  }

  @Get(`${AppRoutes.EVENT_URL.CLIENT}/:id`)
  @ApiOperation({
    summary: 'Fetch event by id',
  })
  @ApiResponse({
    description: 'Event is fetched successfully',
    status: HttpStatus.OK,
  })
  @ApiResponse({
    type: BaseErrorResponseDto,
    status: HttpStatus.NOT_FOUND,
    description: 'Event not found',
  })
  @AuthAndVerified(RoleEnum.USER, RoleEnum.ADMIN)
  getById(@Param('id') id: string) {
    return this.eventsService.getById(+id);
  }

  @Post(AppRoutes.EVENT_URL.ADMIN)
  @ApiOperation({
    summary: 'Create a new event entity',
  })
  @ApiResponse({
    description: 'Event successfully created',
    status: HttpStatus.CREATED,
  })
  @ApiConsumes('multipart/form-data')
  @AuthAndVerified(RoleEnum.ADMIN)
  @UseInterceptors(DestroyUploadedFilesExceptionInterceptor)
  @FilesUploadDecorator(APP_CONSTANTS.EVENT_ATTACHMENTS_DIR)
  createEvent(
    @Body() body: CreateEventDto,
    @UploadedFiles() attachments: Array<Express.Multer.File>,
  ): Promise<Record<string, number>> {
    return this.eventsService.createEvent(body, attachments);
  }

  @Post(`${AppRoutes.EVENT_URL.ADMIN}/:id`)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Change record for event',
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
  @ApiConsumes('multipart/form-data')
  @AuthAndVerified(RoleEnum.ADMIN)
  @UseInterceptors(
    AttachmentLinksToArrayInterceptor,
    DestroyUploadedFilesExceptionInterceptor,
  )
  @FilesUploadDecorator(APP_CONSTANTS.EVENT_ATTACHMENTS_DIR)
  changeEvent(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateEventDto: UpdateEventDto,
    @UploadedFiles() attachments: Array<Express.Multer.File>,
  ) {
    return this.eventsService.updateEvent(id, updateEventDto, attachments);
  }

  @Patch(`${AppRoutes.EVENT_URL.ADMIN}/:id`)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Change status for event',
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
  changeEventStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() changeEventStatusDto: ChangeEventStatusDto,
  ) {
    return this.eventsService.changeEventStatus(id, changeEventStatusDto);
  }

  @Delete(`${AppRoutes.EVENT_URL.ADMIN}`)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Destroy event entity by id',
  })
  @ApiCommonResponseDecorator({
    description: 'Events removed successfully',
    status: HttpStatus.NO_CONTENT,
  })
  @AuthAndVerified(RoleEnum.ADMIN)
  deleteEvent(@Body() bulkDestroyDto: BulkDestroyDto) {
    return this.eventsService.deleteEvent(bulkDestroyDto);
  }

  @Patch(`${AppRoutes.EVENT_URL.CLIENT}/:id/participate`)
  @ApiOperation({
    summary: 'Attach event to current user (authenticated)',
  })
  @ApiCommonResponseDecorator({
    description: 'Participating event successfully',
    status: HttpStatus.OK,
  })
  @ApiResponse({
    type: BaseErrorResponseDto,
    status: HttpStatus.NOT_FOUND,
    description: 'Event not found',
  })
  @ApiParam({ name: 'id', description: 'Event id' })
  @AuthAndVerified(RoleEnum.USER, RoleEnum.ADMIN)
  participateEvent(
    @Req() req: any,
    @Body() attachEventToUser: AttachEventToUser,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.eventsService.participateEvent(id, attachEventToUser, req.user);
  }

  @Get(`${AppRoutes.EVENT_URL.CLIENT}/favorites/user`)
  @ApiOperation({
    summary: 'Fetch events that belong to user',
  })
  @ApiCommonResponseDecorator({
    description: 'User events fetched successfully',
    status: HttpStatus.OK,
  })
  @ApiResponse({
    type: BaseErrorResponseDto,
    status: HttpStatus.NOT_FOUND,
    description: 'User events not found',
  })
  @AuthAndVerified(RoleEnum.USER, RoleEnum.ADMIN)
  getUserEvents(@Req() req: any) {
    return this.eventsService.getUserEvents(req.user.id);
  }

  @Delete(`${AppRoutes.EVENT_URL.CLIENT}/:id/participate-cancel`)
  @ApiOperation({
    summary: 'Detach event to current user (authenticated)',
  })
  @ApiParam({ name: 'id', description: 'Event id' })
  @ApiCommonResponseDecorator({
    description: 'Canceling participating at the event successfully',
    status: HttpStatus.OK,
  })
  @ApiResponse({
    type: BaseErrorResponseDto,
    status: HttpStatus.NOT_FOUND,
    description: 'Events not found',
  })
  @ApiBadRequestResponse({
    description: 'Bad request',
  })
  @AuthAndVerified(RoleEnum.USER, RoleEnum.ADMIN)
  cancelParticipate(@Req() req: any, @Param('id') id: string) {
    return this.eventsService.cancelParticipate(+id, req.user.id);
  }
}
