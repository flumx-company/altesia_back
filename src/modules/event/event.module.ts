import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserEntity } from '../../shared/models/user.entity';
import { AttachmentsService } from '../../shared/providers/attachments.service';
import { EventRepository } from '../../shared/repositories/event.repository';

import { EventService } from './event.service';
import { EventController } from './event.controller';

@Module({
  imports: [TypeOrmModule.forFeature([EventRepository, UserEntity])],
  providers: [EventService, AttachmentsService],
  controllers: [EventController],
})
export class EventModule {}
