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
import { ApiCommonResponseDecorator } from '../../shared/decorators/swagger/api-common-response.decorator';
import { MissionEntity } from '../../shared/models/mission.entity';
import { BulkDestroyDto } from '../../common/dto/bulk-destroy.dto';

import { MissionService } from './mission.service';
import { CreateMissionDto } from './dto/create-mission.dto';
import { UpdateMissionDto } from './dto/update-mission.dto';

@ApiTags('Missions')
@Controller()
export class MissionController {
  constructor(private readonly missionService: MissionService) {}

  @Post(AppRoutes.MISSION_URL.ADMIN)
  @HttpCode(HttpStatus.CREATED)
  @ApiCommonResponseDecorator({
    description: 'Mission is created successfully',
    status: HttpStatus.CREATED,
  })
  @AuthAndVerified(RoleEnum.ADMIN)
  @ApiOperation({ summary: 'Create a new mission entity' })
  create(
    @Body() createMissionDto: CreateMissionDto,
  ): Promise<Record<string, number>> {
    return this.missionService.create(createMissionDto);
  }

  @Get(AppRoutes.MISSION_URL.CLIENT)
  @ApiCommonResponseDecorator({
    description: 'Missions is fetched successfully',
  })
  @ApiOperation({ summary: 'Fetch all missions' })
  findAll(): Promise<MissionEntity[]> {
    return this.missionService.findAll();
  }

  @Get(`${AppRoutes.MISSION_URL.CLIENT}/:id`)
  @ApiOperation({ summary: 'Fetch mission by id' })
  @ApiCommonResponseDecorator({
    description: 'Mission is fetched successfully',
  })
  @ApiParam({
    name: 'id',
    description: 'Mission id',
  })
  @ApiCommonResponseDecorator({
    success: false,
    description: 'Entity not found',
    status: HttpStatus.NOT_FOUND,
  })
  @AuthAndVerified(RoleEnum.USER, RoleEnum.ADMIN)
  findOne(@Param('id') id: string): Promise<MissionEntity> {
    return this.missionService.findOne(+id);
  }

  @Put(`${AppRoutes.MISSION_URL.ADMIN}/:id`)
  @ApiOperation({ summary: 'Update mission by id' })
  @ApiParam({
    name: 'id',
    description: 'Mission id',
  })
  @ApiCommonResponseDecorator({
    description: 'Mission is updated successfully',
  })
  @ApiCommonResponseDecorator({
    success: false,
    description: 'Entity not found',
    status: HttpStatus.NOT_FOUND,
  })
  @AuthAndVerified(RoleEnum.ADMIN)
  update(
    @Param('id') id: string,
    @Body() updateMissionDto: UpdateMissionDto,
  ): Promise<Record<string, number>> {
    return this.missionService.update(+id, updateMissionDto);
  }

  @Delete(`${AppRoutes.MISSION_URL.ADMIN}`)
  @ApiOperation({ summary: 'Destroy mission entities by ids' })
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiCommonResponseDecorator({
    description: 'Missions were removed successfully',
    status: HttpStatus.NO_CONTENT,
  })
  @AuthAndVerified(RoleEnum.ADMIN)
  remove(@Body() bulkDestroyDto: BulkDestroyDto): Promise<null> {
    return this.missionService.remove(bulkDestroyDto);
  }
}
