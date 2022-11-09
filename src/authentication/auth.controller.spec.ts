import { Test } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';
import { getRepositoryToken } from '@nestjs/typeorm';
import { EntityNotFoundError, Repository } from 'typeorm';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import * as faker from 'faker';
import { MailerService } from '@nestjs-modules/mailer';

import { UserProfileEntity } from '../shared/models/user-profile.entity';
import { RoleEntity } from '../shared/models/role.entity';
import { UserRoleEntity } from '../shared/models/user-role.entity';
import { PasswordResetEntity } from '../shared/models/password-reset.entity';
import { MailService } from '../modules/mail/mail.service';
import { UserEntity } from '../shared/models/user.entity';
import { UserRepository } from '../shared/repositories/user.repository';
import { MailModule } from '../modules/mail/mail.module';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { LoginErrorsEnum } from './enums/login-errors.enum';
import {
  correctLoginDto,
  foundUser,
  passwordResetCompleteDto,
  passwordResetDto,
  passwordResetVerificationDto,
  registrationDto,
} from './auth.spec.data';
import { ResendConfirmationEmailCodeDto } from './dto/resend-confirmation-email-code.dto';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [ConfigModule.forRoot()],
      controllers: [AuthController],
      providers: [
        AuthService,
        {
          provide: UserRepository,
          useValue: UserRepository,
        },
        {
          provide: getRepositoryToken(UserProfileEntity),
          useValue: Repository,
        },
        {
          provide: getRepositoryToken(RoleEntity),
          useValue: Repository,
        },
        {
          provide: getRepositoryToken(UserRoleEntity),
          useValue: Repository,
        },
        {
          provide: getRepositoryToken(PasswordResetEntity),
          useValue: Repository,
        },
        {
          provide: JwtService,
          useValue: JwtModule,
        },
        {
          provide: MailerService,
          useValue: MailModule,
        },
        {
          provide: MailService,
          useValue: MailModule,
        },
      ],
    }).compile();

    authService = moduleRef.get<AuthService>(AuthService);
    authController = moduleRef.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(authController).toBeDefined();
  });

  describe('registering', () => {
    it('should register user. valid data', async () => {
      const result = {
        user_id: 1,
      };

      jest.spyOn(authService, 'registration').mockResolvedValue(result);

      const response = await authController.registration(registrationDto);
      expect(response).toEqual(result);
      expect(authService.registration).toHaveBeenCalledWith(registrationDto);
      expect(authService.registration).toHaveBeenCalledTimes(1);
    });

    it('should not register. user already exists', async () => {
      jest.spyOn(authService, 'registration').mockImplementation(() => {
        return Promise.reject(
          new BadRequestException('User with such email already exist.'),
        );
      });

      await expect(async () => {
        await authController.registration(registrationDto);
      }).rejects.toThrow();

      expect(authService.registration).toHaveBeenCalledWith(registrationDto);
      expect(authService.registration).toHaveBeenCalledTimes(1);
    });
  });

  describe('logging', () => {
    it('should login user. valid credentials', async () => {
      const result = {
        loginStatus: LoginErrorsEnum.VERIFIED_STATUS,
        token: 'someToken',
      };

      jest.spyOn(authService, 'login').mockResolvedValue(result);

      const response = await authController.login(correctLoginDto);
      expect(response).toEqual(result);

      expect(authService.login).toHaveBeenCalledWith(correctLoginDto);
      expect(authService.login).toHaveBeenCalledTimes(1);
    });

    it('should not login user. User has pending status', async () => {
      jest.spyOn(authService, 'login').mockImplementation(() => {
        return Promise.reject(
          new BadRequestException(LoginErrorsEnum.PENDING_STATUS),
        );
      });

      await expect(async () => {
        await authController.login(correctLoginDto);
      }).rejects.toThrowError(
        new BadRequestException(LoginErrorsEnum.PENDING_STATUS),
      );

      expect(authService.login).toHaveBeenCalledWith(correctLoginDto);
      expect(authService.login).toHaveBeenCalledTimes(1);
    });

    it('should not login user. User has waiting for access status', async () => {
      jest.spyOn(authService, 'login').mockImplementation(() => {
        return Promise.reject(
          new BadRequestException(LoginErrorsEnum.WAITING_FOR_ACCESS),
        );
      });

      await expect(async () => {
        await authController.login(correctLoginDto);
      }).rejects.toThrowError(
        new BadRequestException(LoginErrorsEnum.WAITING_FOR_ACCESS),
      );

      expect(authService.login).toHaveBeenCalledWith(correctLoginDto);
      expect(authService.login).toHaveBeenCalledTimes(1);
    });

    it('should not login user. Incorrect credentials', async () => {
      jest.spyOn(authService, 'login').mockImplementation(() => {
        return Promise.reject(
          new BadRequestException(LoginErrorsEnum.INCORRECT_CREDENTIALS),
        );
      });

      await expect(async () => {
        await authController.login(correctLoginDto);
      }).rejects.toThrowError(
        new BadRequestException(LoginErrorsEnum.INCORRECT_CREDENTIALS),
      );

      expect(authService.login).toHaveBeenCalledWith(correctLoginDto);
      expect(authService.login).toHaveBeenCalledTimes(1);
    });

    it('should not login user. Entity with such email not found', async () => {
      jest.spyOn(authService, 'login').mockImplementation(() =>
        Promise.reject(
          new EntityNotFoundError(UserEntity, {
            where: { email: correctLoginDto.email },
          }),
        ),
      );

      await expect(async () => {
        await authController.login(correctLoginDto);
      }).rejects.toThrowError(EntityNotFoundError);

      expect(authService.login).toHaveBeenCalledWith(correctLoginDto);
      expect(authService.login).toHaveBeenCalledTimes(1);
    });
  });

  describe('confirmation email', () => {
    it('should not confirm email. user has waiting for access status', async () => {
      jest.spyOn(authService, 'confirmEmail').mockImplementation(() => {
        return Promise.reject(
          new BadRequestException('You already have been verified your email'),
        );
      });
      const confirmationCode = faker.random.word();
      await expect(async () => {
        await authController.confirmEmail(confirmationCode);
      }).rejects.toThrowError(
        new BadRequestException('You already have been verified your email'),
      );

      expect(authService.confirmEmail).toHaveBeenCalledWith(confirmationCode);
      expect(authService.confirmEmail).toHaveBeenCalledTimes(1);
    });

    it('should confirm email', async () => {
      const confirmationEmailCode = faker.random.word();
      const token = 'someToken';
      jest.spyOn(authService, 'confirmEmail').mockResolvedValue({ token });

      const response = await authController.confirmEmail(confirmationEmailCode);
      expect(response).toEqual({
        token,
      });

      expect(authService.confirmEmail).toHaveBeenCalledWith(
        confirmationEmailCode,
      );
      expect(authService.confirmEmail).toHaveBeenCalledTimes(1);
    });
  });

  describe('resend confirmation email', () => {
    it('should not resend confirmation email. User already verified email', async () => {
      const resendConfirmationEmailCodeDto: ResendConfirmationEmailCodeDto = {
        email: foundUser.email,
      };

      jest
        .spyOn(authService, 'resendConfirmationEmailCode')
        .mockImplementation(() => {
          return Promise.reject(
            new BadRequestException('You already verified email'),
          );
        });

      await expect(async () => {
        await authController.resendConfirmationEmailCode(
          resendConfirmationEmailCodeDto,
        );
      }).rejects.toThrowError(
        new BadRequestException('You already verified email'),
      );

      expect(authService.resendConfirmationEmailCode).toHaveBeenCalledWith(
        resendConfirmationEmailCodeDto,
      );
      expect(authService.resendConfirmationEmailCode).toHaveBeenCalledTimes(1);
    });

    it('should resend confirmation email', async () => {
      const resendConfirmationEmailCodeDto: ResendConfirmationEmailCodeDto = {
        email: foundUser.email,
      };

      jest
        .spyOn(authService, 'resendConfirmationEmailCode')
        .mockReturnValue(null);

      const response = await authController.resendConfirmationEmailCode(
        resendConfirmationEmailCodeDto,
      );

      expect(response).toEqual(null);

      expect(authService.resendConfirmationEmailCode).toHaveBeenCalledWith(
        resendConfirmationEmailCodeDto,
      );
      expect(authService.resendConfirmationEmailCode).toHaveBeenCalledTimes(1);
    });
  });

  describe('password reset init flow', () => {
    it('should init password reset. user not found', async () => {
      jest.spyOn(authService, 'passwordResetInitFlow').mockImplementation(() =>
        Promise.reject(
          new EntityNotFoundError(UserEntity, {
            where: { email: passwordResetDto.email },
          }),
        ),
      );

      await expect(async () => {
        await authController.passwordResetInitFlow(passwordResetDto);
      }).rejects.toThrowError(EntityNotFoundError);

      expect(authService.passwordResetInitFlow).toHaveBeenCalledWith(
        passwordResetDto.email,
      );
      expect(authService.passwordResetInitFlow).toHaveBeenCalledTimes(1);
    });

    it('should init password reset', async () => {
      jest.spyOn(authService, 'passwordResetInitFlow').mockResolvedValue({
        message: 'Check your mail box',
      });

      const response = await authController.passwordResetInitFlow(foundUser);

      expect(response).toEqual({
        message: 'Check your mail box',
      });

      expect(authService.passwordResetInitFlow).toHaveBeenCalledWith(
        foundUser.email,
      );
      expect(authService.passwordResetInitFlow).toHaveBeenCalledTimes(1);
    });
  });

  describe('password reset verification', () => {
    it('should verify password reset. entity not found', async () => {
      jest
        .spyOn(authService, 'passwordResetVerification')
        .mockImplementation(() =>
          Promise.reject(
            new EntityNotFoundError(UserEntity, {
              where: { email: passwordResetVerificationDto.email },
            }),
          ),
        );

      await expect(async () => {
        await authController.passwordResetVerification(
          passwordResetVerificationDto,
        );
      }).rejects.toThrowError(EntityNotFoundError);

      expect(authService.passwordResetVerification).toHaveBeenCalledWith(
        passwordResetVerificationDto,
      );
      expect(authService.passwordResetVerification).toHaveBeenCalledTimes(1);
    });

    it('should verify password reset (success case)', async () => {
      jest
        .spyOn(authService, 'passwordResetVerification')
        .mockResolvedValue(true);

      const response = await authController.passwordResetVerification(
        passwordResetVerificationDto,
      );

      expect(response).toBeTruthy();

      expect(authService.passwordResetVerification).toHaveBeenCalledWith(
        passwordResetVerificationDto,
      );
      expect(authService.passwordResetVerification).toHaveBeenCalledTimes(1);
    });
  });

  describe('password reset complete flow', () => {
    it('should reset password complete. entity not found', async () => {
      jest.spyOn(authService, 'passwordResetComplete').mockImplementation(() =>
        Promise.reject(
          new EntityNotFoundError(UserEntity, {
            where: { email: passwordResetCompleteDto.email },
          }),
        ),
      );

      await expect(async () => {
        await authController.passwordResetComplete(passwordResetCompleteDto);
      }).rejects.toThrowError(EntityNotFoundError);

      expect(authService.passwordResetComplete).toHaveBeenCalledWith(
        passwordResetCompleteDto,
      );
      expect(authService.passwordResetComplete).toHaveBeenCalledTimes(1);
    });

    it('should reset password complete (fail case)', async () => {
      jest
        .spyOn(authService, 'passwordResetComplete')
        .mockImplementation(() =>
          Promise.reject(
            new NotFoundException('Your code is expired or not valid'),
          ),
        );

      await expect(async () => {
        await authController.passwordResetComplete(passwordResetCompleteDto);
      }).rejects.toThrowError(
        new NotFoundException('Your code is expired or not valid'),
      );

      expect(authService.passwordResetComplete).toHaveBeenCalledWith(
        passwordResetCompleteDto,
      );
      expect(authService.passwordResetComplete).toHaveBeenCalledTimes(1);
    });

    it('should reset password complete (success case)', async () => {
      jest.spyOn(authService, 'passwordResetComplete').mockReturnValue(null);
      const response = await authController.passwordResetComplete(
        passwordResetCompleteDto,
      );
      expect(response).toBe(null);
    });
  });
});
