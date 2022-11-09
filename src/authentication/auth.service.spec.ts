import { Test } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';
import { getRepositoryToken } from '@nestjs/typeorm';
import { EntityNotFoundError, Repository, UpdateResult } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import * as faker from 'faker';
import { v4 as uuidv4 } from 'uuid';
import { totp } from '@otplib/preset-default';

import { UserProfileEntity } from '../shared/models/user-profile.entity';
import { RoleEntity } from '../shared/models/role.entity';
import { UserRoleEntity } from '../shared/models/user-role.entity';
import { PasswordResetEntity } from '../shared/models/password-reset.entity';
import { MailService } from '../modules/mail/mail.service';
import { UserEntity } from '../shared/models/user.entity';
import { UserRepository } from '../shared/repositories/user.repository';
import { UserStatusEnum } from '../modules/user/enums/user-status.enum';
import { RoleEnum } from '../modules/role/enums/role.enum';
import { PasswordResetStatusEnum } from '../modules/password-reset/enums/password-reset-status.enum';
import { FakeRepository } from '../shared/repositories/fake.repository';

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
  userProfile,
} from './auth.spec.data';
import { ResendConfirmationEmailCodeDto } from './dto/resend-confirmation-email-code.dto';

jest.mock('typeorm-transactional-cls-hooked', () => ({
  Transactional: () => () => ({}),
  BaseRepository: class {},
}));

class JwtFakerService {
  public signAsync(): void {
    return;
  }
}

class MailerFakerService {
  public sendConfirmationEmail(user: UserEntity, code: string) {
    return;
  }
  public sendPasswordRestEmail(email: string, code: string) {
    return;
  }
}

describe('AuthService', () => {
  let authController: AuthController;
  let authService: AuthService;
  let jwtService: JwtService;
  let mailService: MailService;
  let userRepository: UserRepository;
  let userProfileRepository: Repository<UserProfileEntity>;
  let roleRepository: Repository<RoleEntity>;
  let userRoleRepository: Repository<UserRoleEntity>;
  let passwordResetRepository: Repository<PasswordResetEntity>;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [ConfigModule.forRoot()],
      controllers: [AuthController],
      providers: [
        AuthService,
        {
          provide: UserRepository,
          useClass: FakeRepository,
        },
        {
          provide: getRepositoryToken(UserProfileEntity),
          useClass: FakeRepository,
        },
        {
          provide: getRepositoryToken(RoleEntity),
          useClass: FakeRepository,
        },
        {
          provide: getRepositoryToken(UserRoleEntity),
          useClass: FakeRepository,
        },
        {
          provide: getRepositoryToken(PasswordResetEntity),
          useClass: FakeRepository,
        },
        {
          provide: JwtService,
          useClass: JwtFakerService,
        },
        {
          provide: MailService,
          useClass: MailerFakerService,
        },
      ],
    }).compile();

    authService = moduleRef.get<AuthService>(AuthService);
    authController = moduleRef.get<AuthController>(AuthController);
    jwtService = moduleRef.get<JwtService>(JwtService);
    mailService = moduleRef.get<MailService>(MailService);
    userRepository = moduleRef.get<UserRepository>(UserRepository);
    userProfileRepository = moduleRef.get(
      getRepositoryToken(UserProfileEntity),
    );
    roleRepository = moduleRef.get(getRepositoryToken(RoleEntity));
    userRoleRepository = moduleRef.get(getRepositoryToken(UserRoleEntity));
    passwordResetRepository = moduleRef.get(
      getRepositoryToken(PasswordResetEntity),
    );
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  describe('registering', () => {
    it('should register user. valid data', async () => {
      jest
        .spyOn(userProfileRepository, 'save')
        .mockImplementation(() =>
          Promise.resolve(UserProfileEntity.of(userProfile)),
        );

      const user = UserEntity.of({
        ...foundUser,
        userProfile: null,
      });

      jest.spyOn(userRepository, 'create').mockImplementation(() => user);
      jest.spyOn(userRepository, 'save').mockImplementation(() => {
        user.confirmation_code = uuidv4();
        return Promise.resolve(user);
      });

      const role = RoleEntity.of({
        name: RoleEnum.USER,
      });

      jest
        .spyOn(roleRepository, 'findOne')
        .mockImplementation(() => Promise.resolve(role));

      jest.spyOn(userRoleRepository, 'create').mockImplementation(() =>
        UserRoleEntity.of({
          role,
        }),
      );

      jest
        .spyOn(mailService, 'sendConfirmationEmail')
        .mockImplementation(() => {
          return Promise.resolve(true);
        });

      const response = await authController.registration(registrationDto);
      expect(response).toEqual({
        user_id: user.id,
      });

      expect(mailService.sendConfirmationEmail).toHaveBeenCalledWith(
        user,
        user.confirmation_code,
      );
      expect(mailService.sendConfirmationEmail).toHaveBeenCalledTimes(1);
    });

    it('should not register. user already exists', async () => {
      const exception = new BadRequestException(
        'User with such email already exist.',
      );
      jest.spyOn(userRepository, 'findOne').mockImplementation(() => {
        return Promise.reject(exception);
      });

      await expect(async () => {
        await authController.registration(registrationDto);
      }).rejects.toThrowError(exception);
    });
  });

  describe('logging', () => {
    it('should login user. valid credentials', async () => {
      const result = {
        loginStatus: LoginErrorsEnum.VERIFIED_STATUS,
        token: 'someToken',
      };

      jest.spyOn(jwtService, 'signAsync').mockImplementation(() => {
        return Promise.resolve('someToken');
      });

      jest
        .spyOn(userRepository, 'findOneOrFail')
        .mockImplementation(() => Promise.resolve(UserEntity.of(foundUser)));

      jest.spyOn(authService, 'login').mockImplementation(() => {
        return Promise.resolve(result);
      });

      const response = await authController.login(correctLoginDto);
      expect(response).toBe(result);
      expect(authService.login).toHaveBeenCalledWith(correctLoginDto);
      expect(authService.login).toHaveBeenCalledTimes(1);
    });

    it('should not login user. User has pending status', async () => {
      jest
        .spyOn(userRepository, 'findOne')
        .mockImplementation(() => Promise.resolve(UserEntity.of(foundUser)));

      await expect(async () => {
        await authController.login(correctLoginDto);
      }).rejects.toThrowError(
        new BadRequestException(LoginErrorsEnum.PENDING_STATUS),
      );
    });

    it('should not login user. User has waiting for access status', async () => {
      const user = UserEntity.of({
        ...foundUser,
        status: UserStatusEnum.WAITING_FOR_ACCESS,
      });

      jest
        .spyOn(userRepository, 'findOne')
        .mockImplementation(() => Promise.resolve(user));

      await expect(async () => {
        await authController.login(correctLoginDto);
      }).rejects.toThrowError(
        new BadRequestException(LoginErrorsEnum.WAITING_FOR_ACCESS),
      );
    });

    it('should not login user. Incorrect credentials', async () => {
      const user = UserEntity.of({
        ...foundUser,
        status: UserStatusEnum.VERIFIED,
      });

      jest
        .spyOn(userRepository, 'findOne')
        .mockImplementation(() => Promise.resolve(user));

      (bcrypt.compare as jest.Mock) = jest.fn().mockResolvedValue(false);

      await expect(async () => {
        await authController.login({
          ...correctLoginDto,
          password: 'someHardPassword12',
        });
      }).rejects.toThrowError(
        new BadRequestException(LoginErrorsEnum.INCORRECT_CREDENTIALS),
      );
    });

    it('should not login user. Entity with such email not found', async () => {
      jest
        .spyOn(userRepository, 'findOne')
        .mockImplementation(() =>
          Promise.reject(
            new NotFoundException(
              LoginErrorsEnum.USER_WITH_SUCH_EMAIL_DOES_NOT_EXIST,
            ),
          ),
        );

      await expect(async () => {
        await authController.login(correctLoginDto);
      }).rejects.toThrowError(
        new NotFoundException(
          LoginErrorsEnum.USER_WITH_SUCH_EMAIL_DOES_NOT_EXIST,
        ),
      );
    });
  });

  describe('confirmation email', () => {
    it('should not confirm email. user has waiting for access status', async () => {
      const user = UserEntity.of({
        ...foundUser,
        status: UserStatusEnum.WAITING_FOR_ACCESS,
      });

      jest
        .spyOn(userRepository, 'findOne')
        .mockImplementation(() => Promise.resolve(user));

      await expect(async () => {
        await authController.confirmEmail(faker.random.word());
      }).rejects.toThrowError(
        new BadRequestException('You already have been verified your email'),
      );
    });

    it('should confirm email', async () => {
      const confirmationEmailCode = faker.random.word();
      const user = UserEntity.of({
        ...foundUser,
      });

      jest
        .spyOn(userRepository, 'findOne')
        .mockImplementation(() => Promise.resolve(user));

      const token = 'someToken';
      jest.spyOn(jwtService, 'signAsync').mockImplementation(() => {
        return Promise.resolve(token);
      });

      const response = await authController.confirmEmail(confirmationEmailCode);
      expect(response).toEqual({
        token,
      });
    });
  });

  describe('resend confirmation email', () => {
    it('should not resend confirmation email. User already verified email', async () => {
      const resendConfirmationEmailCodeDto: ResendConfirmationEmailCodeDto = {
        email: foundUser.email,
      };

      const user = UserEntity.of({
        ...foundUser,
        status: UserStatusEnum.VERIFIED,
      });

      jest
        .spyOn(userRepository, 'findOneOrFail')
        .mockImplementation(() => Promise.resolve(user));

      await expect(async () => {
        await authController.resendConfirmationEmailCode(
          resendConfirmationEmailCodeDto,
        );
      }).rejects.toThrowError(
        new BadRequestException('You already verified email'),
      );
    });

    it('should resend confirmation email', async () => {
      const resendConfirmationEmailCodeDto: ResendConfirmationEmailCodeDto = {
        email: foundUser.email,
      };

      const user = UserEntity.of({
        ...foundUser,
        status: UserStatusEnum.PENDING,
      });

      jest
        .spyOn(userRepository, 'findOneOrFail')
        .mockImplementation(() => Promise.resolve(user));

      jest
        .spyOn(mailService, 'sendConfirmationEmail')
        .mockImplementation(() => {
          return Promise.resolve(true);
        });

      const response = await authController.resendConfirmationEmailCode(
        resendConfirmationEmailCodeDto,
      );

      expect(mailService.sendConfirmationEmail).toHaveBeenCalledWith(
        user,
        user.confirmation_code,
      );
      expect(mailService.sendConfirmationEmail).toHaveBeenCalledTimes(1);
      expect(response).toEqual(null);
    });
  });

  describe('password reset init flow', () => {
    it('should init password reset. user not found', async () => {
      jest.spyOn(userRepository, 'findOneOrFail').mockImplementation(() =>
        Promise.reject(
          new EntityNotFoundError(UserEntity, {
            where: { email: passwordResetDto.email },
          }),
        ),
      );

      await expect(async () => {
        await authController.passwordResetInitFlow(passwordResetDto);
      }).rejects.toThrowError(EntityNotFoundError);
    });

    it('should init password reset', async () => {
      jest
        .spyOn(userRepository, 'findOneOrFail')
        .mockImplementation(() => Promise.resolve(UserEntity.of(foundUser)));

      const token = 'someToken';
      const secret = 'someSecret';

      (totp.generate as jest.Mock) = jest.fn().mockReturnValue(token);

      jest
        .spyOn(passwordResetRepository, 'update')
        .mockImplementation(() => Promise.resolve({} as UpdateResult));

      jest.spyOn(passwordResetRepository, 'save').mockImplementation(() =>
        Promise.resolve(
          PasswordResetEntity.of({
            email: foundUser.email,
            token,
            secret,
          }),
        ),
      );

      jest
        .spyOn(mailService, 'sendPasswordRestEmail')
        .mockImplementation(() => {
          return Promise.resolve(true);
        });

      const response = await authController.passwordResetInitFlow(foundUser);

      expect(response).toEqual({
        message: 'Check your mail box',
      });

      expect(mailService.sendPasswordRestEmail).toHaveBeenCalledWith(
        foundUser.email,
        token,
      );
      expect(mailService.sendPasswordRestEmail).toHaveBeenCalledTimes(1);
    });
  });

  describe('password reset verification', () => {
    it('should verify password reset. entity not found', async () => {
      jest
        .spyOn(passwordResetRepository, 'findOneOrFail')
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
    });

    it('should verify password reset (fail case)', async () => {
      jest
        .spyOn(passwordResetRepository, 'findOneOrFail')
        .mockImplementation(() =>
          Promise.resolve(
            PasswordResetEntity.of({
              email: passwordResetVerificationDto.email,
              token: passwordResetVerificationDto.token,
              secret: 'some secret',
              status: PasswordResetStatusEnum.PENDING,
            }),
          ),
        );

      (totp.verify as jest.Mock) = jest.fn().mockReturnValue(false);

      await expect(async () => {
        await authController.passwordResetVerification(
          passwordResetVerificationDto,
        );
      }).rejects.toThrowError(
        new NotFoundException('Your code is expired or not valid'),
      );
    });

    it('should verify password reset (success case)', async () => {
      jest
        .spyOn(passwordResetRepository, 'findOneOrFail')
        .mockImplementation(() =>
          Promise.resolve(
            PasswordResetEntity.of({
              email: passwordResetVerificationDto.email,
              token: passwordResetVerificationDto.token,
              secret: 'some secret',
              status: PasswordResetStatusEnum.PENDING,
            }),
          ),
        );

      (totp.verify as jest.Mock) = jest.fn().mockReturnValue(true);

      const response = await authController.passwordResetVerification(
        passwordResetVerificationDto,
      );

      expect(response).toBeTruthy();
    });
  });

  describe('password reset complete flow', () => {
    it('should reset password complete. entity not found', async () => {
      jest
        .spyOn(passwordResetRepository, 'findOneOrFail')
        .mockImplementation(() =>
          Promise.reject(
            new EntityNotFoundError(UserEntity, {
              where: { email: passwordResetCompleteDto.email },
            }),
          ),
        );

      await expect(async () => {
        await authController.passwordResetComplete(passwordResetCompleteDto);
      }).rejects.toThrowError(EntityNotFoundError);
    });

    it('should reset password complete (fail case)', async () => {
      jest
        .spyOn(passwordResetRepository, 'findOneOrFail')
        .mockImplementation(() =>
          Promise.resolve(
            PasswordResetEntity.of({
              email: passwordResetCompleteDto.email,
              token: passwordResetCompleteDto.token,
              secret: 'some secret',
              status: PasswordResetStatusEnum.PENDING,
            }),
          ),
        );

      (totp.verify as jest.Mock) = jest.fn().mockReturnValue(false);

      await expect(async () => {
        await authController.passwordResetComplete(passwordResetCompleteDto);
      }).rejects.toThrowError(
        new NotFoundException('Your code is expired or not valid'),
      );
    });

    it('should reset password complete (success case)', async () => {
      jest
        .spyOn(passwordResetRepository, 'findOneOrFail')
        .mockImplementation(() =>
          Promise.resolve(
            PasswordResetEntity.of({
              email: passwordResetCompleteDto.email,
              token: passwordResetCompleteDto.token,
              secret: 'some secret',
              status: PasswordResetStatusEnum.PENDING,
            }),
          ),
        );

      jest
        .spyOn(passwordResetRepository, 'update')
        .mockImplementation(() => Promise.resolve({} as UpdateResult));

      jest
        .spyOn(userRepository, 'findOneOrFail')
        .mockImplementation(() => Promise.resolve(UserEntity.of(foundUser)));

      jest
        .spyOn(userRepository, 'save')
        .mockImplementation(() => Promise.resolve(UserEntity.of(foundUser)));

      (totp.verify as jest.Mock) = jest.fn().mockReturnValue(true);

      const response = await authController.passwordResetComplete(
        passwordResetCompleteDto,
      );
      expect(response).toBe(null);
    });
  });

  describe('get user by id', () => {
    it('should not return user by id. throw an exception', async () => {
      jest.spyOn(userRepository, 'findOneOrFail').mockImplementation(() =>
        Promise.reject(
          new EntityNotFoundError(UserEntity, {
            where: { email: foundUser.email },
          }),
        ),
      );

      await expect(async () => {
        await authService.getUserById(foundUser.id);
      }).rejects.toThrowError(EntityNotFoundError);
    });

    it('should return user by id', async () => {
      jest
        .spyOn(userRepository, 'findOneOrFail')
        .mockImplementation(() => Promise.resolve(UserEntity.of(foundUser)));

      const response = await authService.getUserById(foundUser.id);
      expect(response).toEqual(foundUser);
    });
  });
});
