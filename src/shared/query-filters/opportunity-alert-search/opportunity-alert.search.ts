import { Repository, SelectQueryBuilder } from 'typeorm';

import { BaseEntitySearch } from '../base-entity.search';
import { EntitySearchInterface } from '../entity-search.interface';
import { OpportunityAlertEntity } from '../../models/opportunity-alert.entity';

export class OpportunityAlertSearch
  extends BaseEntitySearch<OpportunityAlertEntity>
  implements EntitySearchInterface<OpportunityAlertEntity>
{
  public async apply(
    repository: Repository<OpportunityAlertEntity>,
    queryFilters: Record<string, string>,
    { opportunityId },
  ): Promise<SelectQueryBuilder<OpportunityAlertEntity>> {
    const filtersToEntries = Object.entries(queryFilters);
    const columnsToSelect = this.getColumnsThatShouldBeSelected(queryFilters);

    const columns = this.getEntitySelectableColumnsFromQueryRequest(
      OpportunityAlertEntity,
      'alertOpportunities',
      columnsToSelect,
    );

    let queryBuilder: SelectQueryBuilder<OpportunityAlertEntity> = repository
      .createQueryBuilder('alertOpportunities')
      .where('alertOpportunities.opportunityId = :opportunityId', {
        opportunityId,
      })
      .leftJoinAndSelect(
        'alertOpportunities.attachmentFiles',
        'attachmentFiles',
      );

    if (this.doSelectByColumns(columns)) {
      queryBuilder = queryBuilder.select(columns);
    }

    const query: SelectQueryBuilder<OpportunityAlertEntity> =
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
