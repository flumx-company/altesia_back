import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AttachmentsService } from '../../shared/providers/attachments.service';
import { UserFeatureRepository } from '../../shared/repositories/user-feature.repository';
import { MailModule } from '../mail/mail.module';
import { UserFeatureReplyRepository } from '../../shared/repositories/user-feature-reply.repository';
import { UserFeatureReplyModule } from '../user-feature-reply/user-feature-reply.module';

import { UserFeatureService } from './user-feature.service';
import { UserFeatureController } from './user-feature.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserFeatureRepository,
      UserFeatureReplyRepository,
    ]),
    MailModule,
    UserFeatureReplyModule,
  ],
  providers: [UserFeatureService, AttachmentsService],
  controllers: [UserFeatureController],
})
export class UserFeatureModule {}
