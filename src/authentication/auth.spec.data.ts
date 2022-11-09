import * as faker from 'faker';

import { UserStatusEnum } from '../modules/user/enums/user-status.enum';

import { UserLoginDto } from './dto/user-login.dto';
import { UserRegistrationDto } from './dto/user-registration.dto';
import { PasswordResetRequest } from './dto/password-reset-request.dto';
import { PasswordResetVerification } from './dto/password-reset-verification.dto';
import { PasswordResetCompleteDto } from './dto/password-reset-complete.dto';

export const correctLoginDto: UserLoginDto = {
  email: 'someTestEmail@gmail.com',
  password: 'someHardPassword1',
};

export const registrationDto: UserRegistrationDto = {
  first_name: 'test first name',
  last_name: 'test last name',
  email: 'test@gmail.com',
  password: 'someHardPassword123',
  country: 'country name',
  phone_number: '+31636363634',
  degree: 'test degree',
  experience: 'test experience',
};

export const passwordResetDto: PasswordResetRequest = {
  email: faker.internet.email(),
};

export const passwordResetVerificationDto: PasswordResetVerification = {
  email: faker.internet.email(),
  token: 'someToken232',
};

export const passwordResetCompleteDto: PasswordResetCompleteDto = {
  email: faker.internet.email(),
  token: 'someToken232',
  password: 'someHardPassword1',
};

export const foundUser = {
  id: 1,
  first_name: faker.name.findName(),
  last_name: faker.name.lastName(),
  email: faker.internet.email(),
  password: 'someHardPassword1',
  internal_rating: 0,
  status: UserStatusEnum.PENDING,
};

export const userProfile = {
  country: faker.address.country(),
  phone_number: faker.phone.phoneNumber(),
  degree: faker.random.word(),
  experience: faker.random.word(),
  expertise: faker.random.word(),
};
