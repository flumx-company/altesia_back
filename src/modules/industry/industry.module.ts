import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { IndustryRepository } from '../../shared/repositories/industry.repository';

import { IndustryService } from './industry.service';
import { IndustryController } from './industry.controller';

@Module({
  imports: [TypeOrmModule.forFeature([IndustryRepository])],
  controllers: [IndustryController],
  providers: [IndustryService],
})
export class IndustryModule {}
