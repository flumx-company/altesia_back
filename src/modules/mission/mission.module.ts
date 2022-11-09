import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { MissionRepository } from '../../shared/repositories/mission.repository';

import { MissionService } from './mission.service';
import { MissionController } from './mission.controller';

@Module({
  imports: [TypeOrmModule.forFeature([MissionRepository])],
  controllers: [MissionController],
  providers: [MissionService],
})
export class MissionModule {}
