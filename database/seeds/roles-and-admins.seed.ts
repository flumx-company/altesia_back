import { Factory, Seeder } from 'typeorm-seeding';
import { Connection } from 'typeorm';

import { RoleEntity } from '../../src/shared/models/role.entity';
import { RoleEnum } from '../../src/modules/role/enums/role.enum';
import { UserEntity } from '../../src/shared/models/user.entity';
import { UserProfileEntity } from '../../src/shared/models/user-profile.entity';

export default class RolesAndAdminsSeed implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<any> {
    await connection
      .createQueryBuilder()
      .insert()
      .into(RoleEntity)
      .values([
        {
          name: RoleEnum.SUPER_ADMIN,
        },
        {
          name: RoleEnum.ADMIN,
        },
        {
          name: RoleEnum.USER,
        },
      ])
      .execute();

    const adminRole = await connection
      .getRepository(RoleEntity)
      .createQueryBuilder('roles')
      .where('roles.name = :roleName')
      .setParameters({ roleName: RoleEnum.ADMIN })
      .getOne();

    const adminUserInfo = await factory(UserProfileEntity)().create();

    const superAdminRole = await connection
      .getRepository(RoleEntity)
      .createQueryBuilder('roles')
      .where('roles.name = :roleName')
      .setParameters({ roleName: RoleEnum.SUPER_ADMIN })
      .getOne();

    const superAdminUserInfo = await factory(UserProfileEntity)().create();

    await factory(UserEntity)({
      roles: [adminRole],
      userProfile: adminUserInfo,
      password: 'someHardPassword1',
    }).create();

    await factory(UserEntity)({
      roles: [superAdminRole],
      userProfile: superAdminUserInfo,
      email: 'superadmin@gmail.com',
      password: 'someHardPassword1',
    }).create();
  }
}
