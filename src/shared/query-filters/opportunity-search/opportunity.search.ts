import { Repository, SelectQueryBuilder } from 'typeorm';

import { BaseEntitySearch } from '../base-entity.search';
import { EntitySearchInterface } from '../entity-search.interface';
import { OpportunityEntity } from '../../models/opportunity.entity';

export class OpportunitySearch
  extends BaseEntitySearch<OpportunityEntity>
  implements EntitySearchInterface<OpportunityEntity>
{
  public async apply(
    repository: Repository<OpportunityEntity>,
    queryFilters: Record<string, string>,
  ): Promise<SelectQueryBuilder<OpportunityEntity>> {
    const filtersToEntries = Object.entries(queryFilters);
    const columnsToSelect = this.getColumnsThatShouldBeSelected(queryFilters);

    const opportunitiesColumns =
      this.getEntitySelectableColumnsFromQueryRequest(
        OpportunityEntity,
        'opportunities',
        columnsToSelect,
      );

    let queryBuilder: SelectQueryBuilder<OpportunityEntity> = repository
      .createQueryBuilder('opportunities')
      .leftJoinAndSelect('opportunities.userOpportunities', 'userOpportunities')
      .leftJoinAndSelect('opportunities.attachmentFiles', 'attachmentFiles');

    if (this.doSelectByColumns(opportunitiesColumns)) {
      queryBuilder = queryBuilder.select(opportunitiesColumns);
    }

    const query: SelectQueryBuilder<OpportunityEntity> =
      await this.applyDecoratorsFromRequest(filtersToEntries, queryBuilder);
    return this.getResults(query);
  }

  /**
   * Get opportunity filters.
   * @return {string} - Path to filters directory.
   */
  public getFiltersPath(): string {
    return __dirname;
  }
}
