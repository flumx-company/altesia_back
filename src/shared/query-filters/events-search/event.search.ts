import { Repository, SelectQueryBuilder } from 'typeorm';

import { BaseEntitySearch } from '../base-entity.search';
import { EntitySearchInterface } from '../entity-search.interface';
import { EventEntity } from '../../models/event.entity';

export class EventSearch
  extends BaseEntitySearch<EventEntity>
  implements EntitySearchInterface<EventEntity>
{
  public async apply(
    repository: Repository<EventEntity>,
    queryFilters: Record<string, string>,
  ): Promise<SelectQueryBuilder<EventEntity>> {
    const filtersToEntries = Object.entries(queryFilters);
    const columnsToSelect = this.getColumnsThatShouldBeSelected(queryFilters);

    const opportunitiesColumns =
      this.getEntitySelectableColumnsFromQueryRequest(
        EventEntity,
        'events',
        columnsToSelect,
      );

    let queryBuilder: SelectQueryBuilder<EventEntity> = repository
      .createQueryBuilder('events')
      .loadRelationCountAndMap('events.userEvents', 'events.userEvents')
      .leftJoinAndSelect('events.attachmentFiles', 'attachmentFiles');

    if (this.doSelectByColumns(opportunitiesColumns)) {
      queryBuilder = queryBuilder.select(opportunitiesColumns);
    }

    const query: SelectQueryBuilder<EventEntity> =
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
