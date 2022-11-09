import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';

import { AppRoutes } from '../../app.routes';
import { AuthAndVerified } from '../../shared/decorators/auth-and-verified.decorator';
import { RoleEnum } from '../role/enums/role.enum';
import { IndustryEntity } from '../../shared/models/industry.entity';
import { ApiCommonResponseDecorator } from '../../shared/decorators/swagger/api-common-response.decorator';
import { BulkDestroyDto } from '../../common/dto/bulk-destroy.dto';

import { IndustryService } from './industry.service';
import { CreateIndustryDto } from './dto/create-industry.dto';
import { UpdateIndustryDto } from './dto/update-industry.dto';

@ApiTags('Industries')
@Controller()
export class IndustryController {
  constructor(private readonly industryService: IndustryService) {}

  @Post(AppRoutes.INDUSTRY_URL.ADMIN)
  @ApiOperation({ summary: 'Create a new industry entity' })
  @HttpCode(HttpStatus.CREATED)
  @ApiCommonResponseDecorator({
    description: 'Industry is created successfully',
    status: HttpStatus.CREATED,
  })
  @AuthAndVerified(RoleEnum.ADMIN)
  create(
    @Body() createIndustryDto: CreateIndustryDto,
  ): Promise<Record<string, number>> {
    return this.industryService.create(createIndustryDto);
  }

  @Get(AppRoutes.INDUSTRY_URL.CLIENT)
  @ApiOperation({ summary: 'Fetch all industries' })
  @ApiCommonResponseDecorator({
    description: 'Industries is fetched successfully',
  })
  findAll(): Promise<IndustryEntity[]> {
    return this.industryService.findAll();
  }

  @Get(`${AppRoutes.INDUSTRY_URL.CLIENT}/:id`)
  @ApiOperation({ summary: 'Fetch industry by id' })
  @ApiParam({
    name: 'id',
    description: 'Industry id',
  })
  @ApiCommonResponseDecorator({
    description: 'Industry is fetched successfully',
  })
  @ApiCommonResponseDecorator({
    success: false,
    description: 'Entity not found',
    status: HttpStatus.NOT_FOUND,
  })
  @AuthAndVerified(RoleEnum.USER, RoleEnum.ADMIN)
  findOne(@Param('id') id: string): Promise<IndustryEntity> {
    return this.industryService.findOne(+id);
  }

  @Put(`${AppRoutes.INDUSTRY_URL.ADMIN}/:id`)
  @ApiOperation({ summary: 'Update industry by id' })
  @ApiParam({
    name: 'id',
    description: 'Industry id',
  })
  @ApiCommonResponseDecorator({
    description: 'Industry is updated successfully',
  })
  @ApiCommonResponseDecorator({
    success: false,
    description: 'Entity not found',
    status: HttpStatus.NOT_FOUND,
  })
  @AuthAndVerified(RoleEnum.ADMIN)
  update(
    @Param('id') id: string,
    @Body() updateIndustryDto: UpdateIndustryDto,
  ): Promise<Record<string, number>> {
    return this.industryService.update(+id, updateIndustryDto);
  }

  @Delete(`${AppRoutes.INDUSTRY_URL.ADMIN}`)
  @ApiOperation({ summary: 'Destroy industries by ids' })
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiCommonResponseDecorator({
    description: 'Industries were removed successfully',
    status: HttpStatus.NO_CONTENT,
  })
  @AuthAndVerified(RoleEnum.ADMIN)
  remove(@Body() bulkDestroyDto: BulkDestroyDto): Promise<null> {
    return this.industryService.remove(bulkDestroyDto);
  }
}
