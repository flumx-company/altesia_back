import { Repository, SelectQueryBuilder } from 'typeorm';

import { BaseEntitySearch } from '../base-entity.search';
import { EntitySearchInterface } from '../entity-search.interface';
import { CommunityResponseEntity } from '../../models/community-response.entity';

export class CommunityResponseSearch
  extends BaseEntitySearch<CommunityResponseEntity>
  implements EntitySearchInterface<CommunityResponseEntity>
{
  public async apply(
    repository: Repository<CommunityResponseEntity>,
    queryFilters: Record<string, string>,
    options?: Record<string, any>,
  ): Promise<SelectQueryBuilder<CommunityResponseEntity>> {
    const filtersToEntries = Object.entries(queryFilters);
    const columnsToSelect = this.getColumnsThatShouldBeSelected(queryFilters);

    const columns = this.getEntitySelectableColumnsFromQueryRequest(
      CommunityResponseEntity,
      'communityResponses',
      columnsToSelect,
    );

    let queryBuilder: SelectQueryBuilder<CommunityResponseEntity> = repository
      .createQueryBuilder('communityResponses')
      .leftJoinAndSelect('communityResponses.user', 'user')
      .leftJoinAndSelect(
        'communityResponses.attachmentFiles',
        'attachmentFiles',
      )
      .leftJoinAndSelect(
        'communityResponses.communityRatings',
        'communityRatings',
      )
      .loadRelationCountAndMap(
        'communityResponses.communityRatingsCount',
        'communityResponses.communityRatings',
        'communityRatingsCount',
      )
      .leftJoinAndSelect('communityRatings.user', 'userCommunityRating')
      .fetchPublished();

    if (this.doSelectByColumns(columns)) {
      queryBuilder = queryBuilder.select(columns);
    }

    const query: SelectQueryBuilder<CommunityResponseEntity> =
      await this.applyDecoratorsFromRequest(filtersToEntries, queryBuilder);
    return this.getResults(query);
  }

  /**
   * Get event filters.
   * @return {string} - Path to filters directory.
   */
  public getFiltersPath(): string {
    return __dirname;
  }
}
