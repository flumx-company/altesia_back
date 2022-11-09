import { define } from 'typeorm-seeding';
import Faker from 'faker';

import { UserProfileEntity } from '../../src/shared/models/user-profile.entity';

define(UserProfileEntity, (faker: typeof Faker) => {
  const userProfile = new UserProfileEntity();
  userProfile.country = faker.address.country();
  userProfile.phone_number = faker.phone.phoneNumber();
  userProfile.degree = '';
  userProfile.experience = '';
  userProfile.expertise = '';
  return userProfile;
});
