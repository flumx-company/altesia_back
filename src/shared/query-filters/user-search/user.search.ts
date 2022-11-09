import { Repository, SelectQueryBuilder } from 'typeorm';

import { UserEntity } from '../../models/user.entity';
import { BaseEntitySearch } from '../base-entity.search';
import { EntitySearchInterface } from '../entity-search.interface';
import { UserProfileEntity } from '../../models/user-profile.entity';

export class UserSearch
  extends BaseEntitySearch<UserEntity>
  implements EntitySearchInterface<UserEntity>
{
  public async apply(
    repository: Repository<UserEntity>,
    queryFilters: Record<string, string>,
  ): Promise<SelectQueryBuilder<UserEntity>> {
    const filtersToEntries = Object.entries(queryFilters);
    const columnsToSelect = this.getColumnsThatShouldBeSelected(queryFilters);

    const userColumns = this.getEntitySelectableColumnsFromQueryRequest(
      UserEntity,
      'user',
      columnsToSelect,
    );
    const userProfileColumns = this.getEntitySelectableColumnsFromQueryRequest(
      UserProfileEntity,
      'userProfile',
      columnsToSelect,
    );
    const selectableFields = [...userColumns, ...userProfileColumns];

    let queryBuilder: SelectQueryBuilder<UserEntity> = repository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.userRoles', 'userRoles')
      .leftJoinAndSelect('userRoles.role', 'roleDetails')
      .leftJoinAndSelect('user.userProfile', 'userProfile')
      .leftJoinAndSelect(
        'userProfile.userProfileIndustries',
        'userProfileIndustries',
      )
      .leftJoinAndSelect('userProfileIndustries.industry', 'industry')
      .leftJoinAndSelect(
        'userProfile.userProfileSpecialties',
        'userProfileSpecialties',
      )
      .leftJoinAndSelect('userProfileSpecialties.specialty', 'specialty')
      .leftJoinAndSelect(
        'userProfile.userProfileMissions',
        'userProfileMissions',
      )
      .leftJoinAndSelect('userProfileMissions.mission', 'mission');

    if (this.doSelectByColumns(selectableFields)) {
      queryBuilder = queryBuilder.select(selectableFields);
    }

    const query: SelectQueryBuilder<UserEntity> =
      await this.applyDecoratorsFromRequest(filtersToEntries, queryBuilder);
    return this.getResults(query);
  }

  /**
   * Get user filters.
   * @return {string} - Path to filters directory.
   */
  public getFiltersPath(): string {
    return __dirname;
  }
}
