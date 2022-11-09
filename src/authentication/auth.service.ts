import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { totp } from '@otplib/preset-default';
import { v4 as uuidv4 } from 'uuid';
import { UserStatusEnum } from 'src/modules/user/enums/user-status.enum';
import { PasswordResetStatusEnum } from 'src/modules/password-reset/enums/password-reset-status.enum';
import { Transactional } from 'typeorm-transactional-cls-hooked';

import { UserEntity } from '../shared/models/user.entity';
import { PasswordResetEntity } from '../shared/models/password-reset.entity';
import { RoleEntity } from '../shared/models/role.entity';
import { UserRoleEntity } from '../shared/models/user-role.entity';
import { RoleEnum } from '../modules/role/enums/role.enum';
import { UserProfileEntity } from '../shared/models/user-profile.entity';
import { MailService } from '../modules/mail/mail.service';
import { UserRepository } from '../shared/repositories/user.repository';

import { UserRegistrationDto } from './dto/user-registration.dto';
import { UserLoginDto } from './dto/user-login.dto';
import { PasswordResetVerification } from './dto/password-reset-verification.dto';
import { PasswordResetCompleteDto } from './dto/password-reset-complete.dto';
import { LoggedInUserInterface } from './interfaces/logged-in-user.interface';
import { RegisteredUserInterface } from './interfaces/registered-user-.interface';
import { ResendConfirmationEmailCodeDto } from './dto/resend-confirmation-email-code.dto';
import { LoginErrorsEnum } from './enums/login-errors.enum';

@Injectable()
export class AuthService {
  constructor(
    private readonly config: ConfigService,
    @InjectRepository(UserRepository)
    private readonly userRepository: UserRepository,
    @InjectRepository(UserProfileEntity)
    private readonly userProfileRepository: Repository<UserProfileEntity>,
    @InjectRepository(RoleEntity)
    private readonly roleRepository: Repository<RoleEntity>,
    @InjectRepository(UserRoleEntity)
    private readonly userRoleRepository: Repository<UserRoleEntity>,
    @InjectRepository(PasswordResetEntity)
    private readonly passwordResetRepository: Repository<PasswordResetEntity>,
    private jwtService: JwtService,
    private mailService: MailService,
  ) {}

  async registration(
    userRegistrationDto: UserRegistrationDto,
  ): Promise<RegisteredUserInterface> {
    const userExist = await this.userRepository.findOne({
      email: userRegistrationDto.email,
    });

    if (userExist) {
      throw new BadRequestException('User with such email already exist.');
    }

    const userProfile = await this.userProfileRepository.save({
      country: userRegistrationDto.country,
      phone_number: userRegistrationDto.phone_number,
      degree: userRegistrationDto.degree,
      experience: userRegistrationDto.experience,
    });

    try {
      let createdUser = this.userRepository.create(userRegistrationDto);

      const role = await this.roleRepository.findOne({
        where: { name: RoleEnum.USER },
      });

      createdUser = await this.userRepository.save(createdUser);

      const userRole = this.userRoleRepository.create({
        role,
        user: createdUser,
      });

      createdUser.userProfile = userProfile;
      createdUser.userRoles = [userRole];
      await this.userRepository.save(createdUser);

      await this.mailService.sendConfirmationEmail(
        createdUser,
        createdUser.confirmation_code,
      );

      return {
        user_id: createdUser.id,
      };
    } catch (error) {
      throw new BadRequestException(error.sqlMessage);
    }
  }

  async confirmEmail(code: string): Promise<{ token: string }> {
    const user = await this.userRepository.findOne({
      confirmation_code: code,
    });

    if (!user) {
      throw new NotFoundException('Verification code is incorrect');
    }

    if (user.status === UserStatusEnum.WAITING_FOR_ACCESS) {
      throw new BadRequestException(
        'You already have been verified your email',
      );
    }

    user.status = UserStatusEnum.WAITING_FOR_ACCESS;
    await this.userRepository.save(user);

    const payload = { sub: user.id };
    const token = await this.jwtService.signAsync(payload);
    return {
      token,
    };
  }

  async login(loginUserDto: UserLoginDto): Promise<LoggedInUserInterface> {
    const user = await this.userRepository.findOne({
      where: { email: loginUserDto.email },
    });

    if (!user) {
      throw new NotFoundException(
        LoginErrorsEnum.USER_WITH_SUCH_EMAIL_DOES_NOT_EXIST,
      );
    }

    if (user.status === UserStatusEnum.PENDING) {
      throw new BadRequestException(LoginErrorsEnum.PENDING_STATUS);
    }

    if (user.status === UserStatusEnum.WAITING_FOR_ACCESS) {
      throw new BadRequestException(LoginErrorsEnum.WAITING_FOR_ACCESS);
    }

    if (!(await bcrypt.compare(loginUserDto.password, user.password))) {
      throw new BadRequestException(LoginErrorsEnum.INCORRECT_CREDENTIALS);
    }

    const payload = { sub: user.id };
    const token = await this.jwtService.signAsync(payload);
    return { token, loginStatus: LoginErrorsEnum.VERIFIED_STATUS };
  }

  async resendConfirmationEmailCode(
    resendConfirmationEmailCode: ResendConfirmationEmailCodeDto,
  ): Promise<null> {
    const user = await this.userRepository.findOneOrFail({
      where: { email: resendConfirmationEmailCode.email },
    });

    if (user.status !== UserStatusEnum.PENDING) {
      throw new BadRequestException('You already verified email');
    }

    const secret = uuidv4();

    totp.options = {
      step: Number(process.env.CODE_EXPIRE_TIME),
    };

    user.confirmation_code = totp.generate(secret);

    await this.userRepository.save(user);

    await this.mailService.sendConfirmationEmail(user, user.confirmation_code);

    return null;
  }

  async passwordResetInitFlow(email: string): Promise<Record<string, string>> {
    const user = await this.userRepository.findOneOrFail({ email });

    totp.options = {
      step: Number(process.env.CODE_EXPIRE_TIME),
    };

    const secret = uuidv4();
    const token = totp.generate(secret);

    await this.passwordResetRepository.update(
      {
        email,
        status: PasswordResetStatusEnum.PENDING,
      },
      { status: PasswordResetStatusEnum.CANCELED },
    );

    await this.passwordResetRepository.save({
      email,
      token,
      secret,
    });

    await this.mailService.sendPasswordRestEmail(user.email, token);

    return {
      message: 'Check your mail box',
    };
  }

  async passwordResetVerification(
    passwordResetCheck: PasswordResetVerification,
  ): Promise<boolean> {
    const { email, token } = passwordResetCheck;

    const passwordResetEntity =
      await this.passwordResetRepository.findOneOrFail({
        email,
        token,
        status: PasswordResetStatusEnum.PENDING,
      });

    return AuthService.passwordResetTokenVerification(
      token,
      passwordResetEntity.secret,
    );
  }

  @Transactional()
  async passwordResetComplete(
    passwordResetComplete: PasswordResetCompleteDto,
  ): Promise<null> {
    const { email, password, token } = passwordResetComplete;

    const passwordResetEntity =
      await this.passwordResetRepository.findOneOrFail({
        email,
        token,
        status: PasswordResetStatusEnum.PENDING,
      });

    AuthService.passwordResetTokenVerification(
      token,
      passwordResetEntity.secret,
    );

    await this.passwordResetRepository.update(
      {
        email,
        token,
        status: PasswordResetStatusEnum.PENDING,
      },
      { status: PasswordResetStatusEnum.COMPLETED },
    );

    const user = await this.userRepository.findOneOrFail({
      email,
    });
    const salt = await bcrypt.genSalt();
    user.password = await bcrypt.hash(password, salt);
    await this.userRepository.save(user);

    return null;
  }

  getUserById(id: number): Promise<UserEntity> {
    return this.userRepository.findOneOrFail({
      where: { id },
      relations: ['userRoles', 'userRoles.role'],
    });
  }

  private static passwordResetTokenVerification(token, secret): boolean {
    const isValid = totp.verify({
      token,
      secret,
    });

    if (!isValid) {
      throw new NotFoundException('Your code is expired or not valid');
    }

    return isValid;
  }
}
