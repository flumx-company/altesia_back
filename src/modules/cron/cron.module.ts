import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';

import { PasswordResetEntity } from '../../shared/models/password-reset.entity';

import { CronService } from './cron.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([PasswordResetEntity]),
    ScheduleModule.forRoot(),
  ],
  providers: [CronService],
})
export class CronModule {}
