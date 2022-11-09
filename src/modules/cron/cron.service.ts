import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cron } from '@nestjs/schedule';

import { PasswordResetEntity } from '../../shared/models/password-reset.entity';
import { LessThanDate } from '../../utils/utils';

@Injectable()
export class CronService {
  constructor(
    @InjectRepository(PasswordResetEntity)
    private readonly passwordResetRepository: Repository<PasswordResetEntity>,
  ) {}
  private readonly logger = new Logger(CronService.name);

  // On Monday at 11:30am.
  @Cron('0 30 11 * * 1')
  async removeOldRecordsFromPasswordResetsTable() {
    this.logger.debug(
      'Cron job to find and remove old password resets records',
    );
    const oldPasswordResets = await this.passwordResetRepository.find({
      where: {
        created_at: LessThanDate(),
      },
    });
    if (oldPasswordResets.length) {
      await this.passwordResetRepository.remove(oldPasswordResets);
    }
  }
}
