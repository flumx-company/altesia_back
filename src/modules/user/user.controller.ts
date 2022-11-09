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
  Put,
  Query,
  Req,
} from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { Pagination } from 'nestjs-typeorm-paginate';

import { AppRoutes } from '../../app.routes';
import { FullRequestUrlDecorator } from '../../shared/decorators/full-request-url.decorator';
import { RoleEnum } from '../role/enums/role.enum';
import { ApiPaginationParamsQueryDecorator } from '../../shared/decorators/swagger/api-pagination-params-query.decorator';
import { ApiPaginatedDecorator } from '../../shared/decorators/swagger/api-paginated.decorator';
import { AuthAndVerified } from '../../shared/decorators/auth-and-verified.decorator';
import { ApiCommonResponseDecorator } from '../../shared/decorators/swagger/api-common-response.decorator';
import { BulkDestroyDto } from '../../common/dto/bulk-destroy.dto';
import { CanEnter } from '../../shared/decorators/can-enter.decorator';
import { UserEntity } from '../../shared/models/user.entity';

import { UserService } from './user.service';
import { UpdateUserProfileDto } from './dto/update-user-profile.dto';
import { PatchUserDto } from './dto/patch-user.dto';

@ApiTags('User')
@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get(`${AppRoutes.USER_URL(true).ADMIN}`)
  @ApiOperation({ summary: 'Fetch all users' })
  @ApiPaginationParamsQueryDecorator()
  @ApiPaginatedDecorator()
  @ApiQuery({
    name: 'role',
    required: false,
    enum: ['admin', 'super admin', 'user'],
  })
  @ApiQuery({
    name: 'column',
    description: 'Columns that need to be fetched',
    required: false,
    example: 'email,status',
  })
  @ApiQuery({
    name: 'orderBy',
    required: false,
    example: 'email asc',
  })
  @ApiQuery({
    name: 'sortBy',
    required: false,
    example: 'status pending',
  })
  @ApiQuery({
    name: 'search',
    required: false,
  })
  @ApiCommonResponseDecorator({
    success: false,
    description: 'Unprocessable Entity',
    status: HttpStatus.UNPROCESSABLE_ENTITY,
  })
  @AuthAndVerified(RoleEnum.ADMIN)
  async getAllUsers(
    @FullRequestUrlDecorator() fullRequestUrl: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page = 1,
    @Query('limit', new DefaultValuePipe(5), ParseIntPipe) limit = 5,
    @Query() query: Record<string, string>,
  ): Promise<Pagination<UserEntity>> {
    limit = limit > 100 ? 100 : limit;
    return this.userService.allUsersPaginate(query, {
      page,
      limit,
      route: fullRequestUrl,
    });
  }

  @Patch(`${AppRoutes.USER_URL(true).ADMIN}/:userId/roles/:roleId`)
  @ApiOperation({ summary: 'Set user role' })
  @ApiCommonResponseDecorator({
    description: 'User role updated',
  })
  @ApiCommonResponseDecorator({
    success: false,
    description: 'Entity not found',
    status: HttpStatus.NOT_FOUND,
  })
  @ApiCommonResponseDecorator({
    success: false,
    description: 'User already has this role',
    status: HttpStatus.BAD_REQUEST,
  })
  @AuthAndVerified(RoleEnum.ADMIN)
  attachUserRole(
    @Param('userId', ParseIntPipe) userId: number,
    @Param('roleId', ParseIntPipe) roleId: number,
  ) {
    return this.userService.updateUserRoles(userId, roleId);
  }

  @Delete(`${AppRoutes.USER_URL(true).ADMIN}/:userId/roles/:roleId`)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Destroy user role' })
  @ApiCommonResponseDecorator({
    description: 'User role destroyed',
    status: HttpStatus.NO_CONTENT,
  })
  @ApiCommonResponseDecorator({
    success: false,
    description: 'Entity not found',
    status: HttpStatus.NOT_FOUND,
  })
  @ApiCommonResponseDecorator({
    success: false,
    description: `User hasn't this role`,
    status: HttpStatus.BAD_REQUEST,
  })
  @AuthAndVerified(RoleEnum.ADMIN)
  detachUserRole(
    @Param('userId', ParseIntPipe) userId: number,
    @Param('roleId', ParseIntPipe) roleId: number,
  ) {
    return this.userService.detachUserRole(userId, roleId);
  }

  @Put(`${AppRoutes.USER_URL().CLIENT}/profile`)
  @ApiOperation({ summary: 'Update own profile' })
  @ApiCommonResponseDecorator({
    description: 'Profile updated successfully',
  })
  @ApiCommonResponseDecorator({
    success: false,
    description: 'Entity not found',
    status: HttpStatus.NOT_FOUND,
  })
  @AuthAndVerified(RoleEnum.USER, RoleEnum.ADMIN)
  async updateUserProfile(
    @Req() req,
    @Body() userProfile: UpdateUserProfileDto,
  ): Promise<{ id: number; status: string }> {
    return this.userService.updateUserProfile(userProfile, req.user);
  }

  @Get(`${AppRoutes.USER_URL().CLIENT}`)
  @ApiOperation({ summary: 'Fetch own profile' })
  @ApiCommonResponseDecorator({ description: 'Profile fetched successfully' })
  @ApiCommonResponseDecorator({
    success: false,
    description: 'Entity not found',
    status: HttpStatus.NOT_FOUND,
  })
  @AuthAndVerified(RoleEnum.USER, RoleEnum.ADMIN)
  getCurrentUser(@Req() req: any) {
    return this.userService.getCurrentUser(req.user.id);
  }

  @Get(`${AppRoutes.USER_URL().CLIENT}/status`)
  @ApiOperation({ summary: 'Fetch authenticated user status' })
  @ApiCommonResponseDecorator({
    description: 'User status fetched successfully',
  })
  @CanEnter(RoleEnum.USER, RoleEnum.ADMIN)
  async fetchAuthenticatedUserStatus(@Req() req) {
    return this.userService.fetchAuthenticatedUserStatus(req.user);
  }

  @Patch(`${AppRoutes.USER_URL().ADMIN}/:id`)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update user by patch' })
  @ApiCommonResponseDecorator({
    description: 'User record was updated',
  })
  @ApiCommonResponseDecorator({
    success: false,
    description: 'Entity not found',
    status: HttpStatus.NOT_FOUND,
  })
  @ApiCommonResponseDecorator({
    success: false,
    description: 'Bad request',
    status: HttpStatus.BAD_REQUEST,
  })
  @AuthAndVerified(RoleEnum.ADMIN)
  patchUpdate(
    @Param('id', ParseIntPipe) id: number,
    @Body() patchUserDto: PatchUserDto,
  ) {
    return this.userService.patchUpdate(id, patchUserDto);
  }

  @Delete(`${AppRoutes.USER_URL().ADMIN}`)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Destroy users' })
  @ApiCommonResponseDecorator({
    description: 'User records were destroyed',
    status: HttpStatus.NO_CONTENT,
  })
  @AuthAndVerified(RoleEnum.ADMIN)
  destroy(@Body() bulkDestroyDto: BulkDestroyDto) {
    return this.userService.destroy(bulkDestroyDto);
  }
}
