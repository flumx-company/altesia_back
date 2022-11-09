import { Controller, Get, HttpStatus, Param } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { AppRoutes } from '../../app.routes';
import { AuthAndVerified } from '../../shared/decorators/auth-and-verified.decorator';

import { RoleEnum } from './enums/role.enum';
import { RoleService } from './role.service';

@ApiTags('Roles')
@Controller()
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Get(`${AppRoutes.ROLE_URL.ADMIN}`)
  @ApiOperation({ summary: 'Fetch all roles' })
  @ApiResponse({
    description: 'All roles are fetched successfully',
    status: HttpStatus.OK,
  })
  @AuthAndVerified(RoleEnum.ADMIN)
  findAll() {
    return this.roleService.findAll();
  }

  @Get(`${AppRoutes.ROLE_URL.ADMIN}/:id`)
  @ApiOperation({ summary: 'Fetch role by id' })
  @ApiResponse({
    description: 'Role is fetched successfully',
    status: HttpStatus.OK,
  })
  @AuthAndVerified(RoleEnum.ADMIN)
  findOne(@Param('id') id: string) {
    return this.roleService.findOne(+id);
  }
}
