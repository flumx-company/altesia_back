import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  HttpCode,
  HttpStatus,
  Put,
  Delete,
} from '@nestjs/common';
import { ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';

import { AppRoutes } from '../../app.routes';
import { ApiCommonResponseDecorator } from '../../shared/decorators/swagger/api-common-response.decorator';
import { AuthAndVerified } from '../../shared/decorators/auth-and-verified.decorator';
import { RoleEnum } from '../role/enums/role.enum';
import { SpecialtyEntity } from '../../shared/models/specialty.entity';
import { BulkDestroyDto } from '../../common/dto/bulk-destroy.dto';

import { UpdateSpecialtyDto } from './dto/update-specialty.dto';
import { CreateSpecialtyDto } from './dto/create-specialty.dto';
import { SpecialtyService } from './specialty.service';

@ApiTags('Specialties')
@Controller()
export class SpecialtyController {
  constructor(private readonly specialtyService: SpecialtyService) {}

  @Post(AppRoutes.SPECIALTY_URL.ADMIN)
  @ApiOperation({ summary: 'Create a new specialty entity' })
  @HttpCode(HttpStatus.CREATED)
  @ApiCommonResponseDecorator({
    description: 'Specialty is created successfully',
    status: HttpStatus.CREATED,
  })
  @AuthAndVerified(RoleEnum.ADMIN)
  create(
    @Body() createSpecialtyDto: CreateSpecialtyDto,
  ): Promise<Record<string, number>> {
    return this.specialtyService.create(createSpecialtyDto);
  }

  @Get(AppRoutes.SPECIALTY_URL.CLIENT)
  @ApiOperation({ summary: 'Fetch all specialties' })
  @ApiCommonResponseDecorator({
    description: 'Specialty is fetched successfully',
  })
  findAll(): Promise<SpecialtyEntity[]> {
    return this.specialtyService.findAll();
  }

  @Get(`${AppRoutes.SPECIALTY_URL.CLIENT}/:id`)
  @ApiOperation({ summary: 'Fetch mission by id' })
  @ApiCommonResponseDecorator({
    description: 'Specialty is fetched successfully',
  })
  @ApiParam({
    name: 'id',
    description: 'Specialty id',
  })
  @ApiCommonResponseDecorator({
    success: false,
    description: 'Entity not found',
    status: HttpStatus.NOT_FOUND,
  })
  @AuthAndVerified(RoleEnum.USER, RoleEnum.ADMIN)
  findOne(@Param('id') id: string): Promise<SpecialtyEntity> {
    return this.specialtyService.findOne(+id);
  }

  @Put(`${AppRoutes.SPECIALTY_URL.ADMIN}/:id`)
  @ApiOperation({ summary: 'Update mission by id' })
  @ApiParam({
    name: 'id',
    description: 'Specialty id',
  })
  @ApiCommonResponseDecorator({
    description: 'Specialty is updated successfully',
  })
  @ApiCommonResponseDecorator({
    success: false,
    description: 'Entity not found',
    status: HttpStatus.NOT_FOUND,
  })
  @AuthAndVerified(RoleEnum.ADMIN)
  update(
    @Param('id') id: string,
    @Body() updateSpecialtyDto: UpdateSpecialtyDto,
  ): Promise<Record<string, number>> {
    return this.specialtyService.update(+id, updateSpecialtyDto);
  }

  @Delete(`${AppRoutes.SPECIALTY_URL.ADMIN}`)
  @ApiOperation({ summary: 'Delete specialty entities by ids' })
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiCommonResponseDecorator({
    description: 'Specialties were removed successfully',
    status: HttpStatus.NO_CONTENT,
  })
  @AuthAndVerified(RoleEnum.ADMIN)
  remove(@Body() bulkDestroyDto: BulkDestroyDto): Promise<null> {
    return this.specialtyService.remove(bulkDestroyDto);
  }
}
