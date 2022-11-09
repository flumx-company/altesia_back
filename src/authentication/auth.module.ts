import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtStrategy } from 'src/authentication/strategies/jwt.strategy';

import { PasswordResetEntity } from '../shared/models/password-reset.entity';
import { RoleEntity } from '../shared/models/role.entity';
import { UserRoleEntity } from '../shared/models/user-role.entity';
import { UserProfileEntity } from '../shared/models/user-profile.entity';
import { MailModule } from '../modules/mail/mail.module';
import { UserRepository } from '../shared/repositories/user.repository';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserRepository,
      RoleEntity,
      UserRoleEntity,
      PasswordResetEntity,
      UserProfileEntity,
    ]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET_KEY'),
        signOptions: {
          expiresIn: `${configService.get('JWT_EXPIRATION_TIME')}s`,
        },
      }),
    }),
    MailModule,
  ],
  providers: [AuthService, JwtStrategy],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
