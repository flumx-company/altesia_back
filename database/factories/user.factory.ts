import Faker from 'faker';
import { define } from 'typeorm-seeding';
import { authenticator } from '@otplib/preset-default';

import { UserEntity } from '../../src/shared/models/user.entity';
import { RoleEntity } from '../../src/shared/models/role.entity';
import { UserStatusEnum } from '../../src/modules/user/enums/user-status.enum';
import { UserProfileEntity } from '../../src/shared/models/user-profile.entity';

define(
  UserEntity,
  (
    faker: typeof Faker,
    context: {
      roles: RoleEntity[];
      userProfile: UserProfileEntity;
      email: string;
      password: string;
    },
  ) => {
    const { roles, email = 'admin@gmail.com', password, userProfile } = context;
    const user = new UserEntity();
    user.first_name = faker.name.firstName();
    user.last_name = faker.name.lastName();
    user.userProfile = userProfile;
    user.email = email;
    user.password = password;
    user.confirmation_code = '';
    user.secret = authenticator.generateSecret();
    user.status = UserStatusEnum.VERIFIED;
    user.userRoles = [];

    roles.forEach((role) => {
      user.userRoles.push({
        user,
        role,
      });
    });
    return user;
  },
);
