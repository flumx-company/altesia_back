import { Repository, SelectQueryBuilder } from 'typeorm';

import { BaseEntitySearch } from '../base-entity.search';
import { EntitySearchInterface } from '../entity-search.interface';
import { UserFeatureEntity } from '../../models/user-feature.entity';

export class UserFeatureSearch
  extends BaseEntitySearch<UserFeatureEntity>
  implements EntitySearchInterface<UserFeatureEntity>
{
  public async apply(
    repository: Repository<UserFeatureEntity>,
    queryFilters: Record<string, string>,
  ): Promise<SelectQueryBuilder<UserFeatureEntity>> {
    const filtersToEntries = Object.entries(queryFilters);
    const columnsToSelect = this.getColumnsThatShouldBeSelected(queryFilters);

    const opportunitiesColumns =
      this.getEntitySelectableColumnsFromQueryRequest(
        UserFeatureEntity,
        'user_features',
        columnsToSelect,
      );

    let queryBuilder: SelectQueryBuilder<UserFeatureEntity> = repository
      .createQueryBuilder('user_features')
      .leftJoinAndSelect('user_features.attachmentFiles', 'attachmentFiles')
      .leftJoinAndSelect('user_features.user', 'user');

    if (this.doSelectByColumns(opportunitiesColumns)) {
      queryBuilder = queryBuilder.select(opportunitiesColumns);
    }

    const query: SelectQueryBuilder<UserFeatureEntity> =
      await this.applyDecoratorsFromRequest(filtersToEntries, queryBuilder);
    return this.getResults(query);
  }

  /**
   * Get user feature filters.
   * @return {string} - Path to filters directory.
   */
  public getFiltersPath(): string {
    return __dirname;
  }
}
