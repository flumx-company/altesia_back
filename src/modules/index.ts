import { AuthModule } from '../authentication/auth.module';

import { DatabaseModule } from './database/database.module';
import { UserModule } from './user/user.module';
import { UserFeatureModule } from './user-feature/user-feature.module';
import { EventModule } from './event/event.module';
import { CommunityCategoryModule } from './community-category/community-category.module';
import { CommunityQuestionModule } from './community-question/community-question.module';
import { CommunityResponseRatingModule } from './community-response-rating/community-response-rating.module';
import { CommunityResponseModule } from './community-response/community-response.module';
import { OpportunityModule } from './opportunity/opportunity.module';
import { MailModule } from './mail/mail.module';
import { HealthModule } from './health/health.module';
import { IndustryModule } from './industry/industry.module';
import { MissionModule } from './mission/mission.module';
import { SpecialtyModule } from './specialty/specialty.module';
import { CronModule } from './cron/cron.module';
import { RoleModule } from './role/role.module';
import { UserFeatureReplyModule } from './user-feature-reply/user-feature-reply.module';
import { OpportunityAlertReplyModule } from './opportunity-alert-reply/opportunity-alert-reply.module';

export const AppModules = [
  DatabaseModule,
  AuthModule,
  UserModule,
  UserFeatureModule,
  EventModule,
  CommunityCategoryModule,
  CommunityQuestionModule,
  CommunityResponseRatingModule,
  CommunityResponseModule,
  OpportunityModule,
  MailModule,
  HealthModule,
  IndustryModule,
  MissionModule,
  SpecialtyModule,
  CronModule,
  RoleModule,
  UserFeatureReplyModule,
  OpportunityAlertReplyModule,
];
