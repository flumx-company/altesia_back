import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Transactional } from 'typeorm-transactional-cls-hooked';
import { Pagination } from 'nestjs-typeorm-paginate';

import { SpecialtyEntity } from '../../shared/models/specialty.entity';
import { UserProfileEntity } from '../../shared/models/user-profile.entity';
import { IndustryEntity } from '../../shared/models/industry.entity';
import { MissionEntity } from '../../shared/models/mission.entity';
import { UserEntity } from '../../shared/models/user.entity';
import { RoleEntity } from '../../shared/models/role.entity';
import { UserRoleEntity } from '../../shared/models/user-role.entity';
import { BulkDestroyDto } from '../../common/dto/bulk-destroy.dto';
import { UserRepository } from '../../shared/repositories/user.repository';
import { UserSearch } from '../../shared/query-filters/user-search/user.search';
import { MailService } from '../mail/mail.service';
import { IPaginationOptions } from '../../common/interfaces/pagination-options.interface';

import { UpdateUserProfileDto } from './dto/update-user-profile.dto';
import { PatchUserDto } from './dto/patch-user.dto';
import { UserStatusEnum } from './enums/user-status.enum';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserRoleEntity)
    private readonly userRoleRepository: Repository<UserRoleEntity>,
    @InjectRepository(RoleEntity)
    private readonly roleRepository: Repository<RoleEntity>,
    private readonly userRepository: UserRepository,
    @InjectRepository(UserProfileEntity)
    private readonly userProfileRepository: Repository<UserProfileEntity>,
    @InjectRepository(SpecialtyEntity)
    private readonly specialtyRepository: Repository<SpecialtyEntity>,
    @InjectRepository(IndustryEntity)
    private readonly industryRepository: Repository<IndustryEntity>,
    @InjectRepository(MissionEntity)
    private readonly missionRepository: Repository<MissionEntity>,
    private mailService: MailService,
  ) {}

  async allUsersPaginate(
    query: Record<string, string>,
    options: IPaginationOptions,
  ): Promise<Pagination<UserEntity>> {
    const queryBuilder = await new UserSearch().apply(
      this.userRepository,
      query,
    );

    return this.userRepository.paginateQueryBuilder(queryBuilder, options);
  }

  async updateUserRoles(userId: number, roleId: number) {
    const user = await this.userRepository.findOneOrFail(
      { id: userId },
      {
        relations: ['userRoles', 'userRoles.role'],
      },
    );
    const role = await this.roleRepository.findOneOrFail({
      id: roleId,
    });

    const userHasRole = user.userRoles.find(
      (userRole) => userRole.role.id === role.id,
    );

    if (userHasRole) {
      throw new BadRequestException('User already has this role');
    }

    user.userRoles.push({
      role,
      user,
    });

    await this.userRepository.save(user);

    return {
      id: user.id,
    };
  }

  async detachUserRole(userId: number, roleId: number): Promise<null> {
    const user = await this.userRepository.findOneOrFail(
      { id: userId },
      {
        relations: ['userRoles', 'userRoles.role'],
      },
    );
    const role = await this.roleRepository.findOneOrFail({
      id: roleId,
    });

    const userHasRole = user.userRoles.find(
      (userRole) => userRole.role.id === role.id,
    );

    if (!userHasRole) {
      throw new BadRequestException(`User hasn't this role`);
    }

    user.userRoles = user.userRoles.filter(
      (userRole) => userRole.role.id !== role.id,
    );

    await this.userRepository.save(user);

    return null;
  }

  @Transactional()
  async updateUserProfile(
    updateUserProfileDto: UpdateUserProfileDto,
    user: UserEntity,
  ): Promise<{ id: number; status: string }> {
    const { userProfile } = await this.userRepository.findOne({
      where: { id: user.id },
      relations: ['userProfile'],
    });

    const {
      specialties,
      preferredMissions,
      preferredIndustries,
      ...updateUserProfile
    } = updateUserProfileDto;

    if (specialties) {
      const specialtyIds = specialties.map((item) => item.specialty_id);
      const specialtyEntities = await this.specialtyRepository.find({
        where: { id: In(specialtyIds) },
      });
      userProfile.userProfileSpecialties = specialtyEntities.map(
        (specialtyEntity) => ({
          userProfile,
          specialty: specialtyEntity,
          level:
            specialties.find(
              (specialty) => specialty.specialty_id === specialtyEntity.id,
            )?.level || '',
        }),
      );
    }

    if (preferredIndustries) {
      const industryEntities = await this.industryRepository.find({
        where: { id: In(preferredIndustries) },
      });
      userProfile.userProfileIndustries = industryEntities.map((industry) => ({
        userProfile,
        industry,
      }));
    }

    if (preferredMissions) {
      const missionEntities = await this.missionRepository.find({
        where: { id: In(preferredMissions) },
      });
      userProfile.userProfileMissions = missionEntities.map((mission) => ({
        userProfile,
        mission,
      }));
    }

    await this.userProfileRepository.save({
      ...userProfile,
      ...updateUserProfile,
    });

    return {
      id: user.id,
      status: user.status,
    };
  }

  async fetchAuthenticatedUserStatus(user: UserEntity) {
    return user.status;
  }

  getCurrentUser(userId: number): Promise<UserEntity> {
    return this.userRepository.findOne({
      where: { id: userId },
      relations: [
        'userEvents',
        'userProfile',
        'userProfile.userProfileIndustries',
        'userProfile.userProfileIndustries.industry',
        'userProfile.userProfileSpecialties',
        'userProfile.userProfileSpecialties.specialty',
        'userProfile.userProfileMissions',
        'userProfile.userProfileMissions.mission',
      ],
    });
  }

  async patchUpdate(id: number, patchUserDto: PatchUserDto) {
    const user = await this.userRepository.updateByIdAndReturn(
      id,
      patchUserDto,
    );

    if (user.status === UserStatusEnum.VERIFIED) {
      await this.mailService.sendAccountVerifiedEmail(user.email);
    }

    return {
      id,
    };
  }

  async destroy(bulkDestroyDto: BulkDestroyDto): Promise<null> {
    await this.userRepository.bulkDestroy(bulkDestroyDto);
    return null;
  }
}
