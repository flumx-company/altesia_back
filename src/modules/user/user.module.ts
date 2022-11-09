import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { SpecialtyEntity } from '../../shared/models/specialty.entity';
import { UserProfileEntity } from '../../shared/models/user-profile.entity';
import { MissionEntity } from '../../shared/models/mission.entity';
import { IndustryEntity } from '../../shared/models/industry.entity';
import { RoleEntity } from '../../shared/models/role.entity';
import { UserRoleEntity } from '../../shared/models/user-role.entity';
import { UserRepository } from '../../shared/repositories/user.repository';
import { MailModule } from '../mail/mail.module';

import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserRepository,
      UserProfileEntity,
      SpecialtyEntity,
      MissionEntity,
      IndustryEntity,
      RoleEntity,
      UserRoleEntity,
    ]),
    MailModule,
  ],
  providers: [UserService],
  controllers: [UserController],
})
export class UserModule {}
