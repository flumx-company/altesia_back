import { Repository, SelectQueryBuilder } from 'typeorm';

import { BaseEntitySearch } from '../base-entity.search';
import { EntitySearchInterface } from '../entity-search.interface';
import { CommunityQuestionEntity } from '../../models/community-question.entity';

export class CommunityQuestionSearch
  extends BaseEntitySearch<CommunityQuestionEntity>
  implements EntitySearchInterface<CommunityQuestionEntity>
{
  public async apply(
    repository: Repository<CommunityQuestionEntity>,
    queryFilters: Record<string, string>,
  ): Promise<SelectQueryBuilder<CommunityQuestionEntity>> {
    const filtersToEntries = Object.entries(queryFilters);
    const columnsToSelect = this.getColumnsThatShouldBeSelected(queryFilters);

    const opportunitiesColumns =
      this.getEntitySelectableColumnsFromQueryRequest(
        CommunityQuestionEntity,
        'community_questions',
        columnsToSelect,
      );

    let queryBuilder: SelectQueryBuilder<CommunityQuestionEntity> = repository
      .createQueryBuilder('community_questions')
      .loadRelationIdAndMap(
        'community_questions.communityCategory',
        'community_questions.communityCategory',
      )
      .leftJoinAndSelect('community_questions.user', 'user')
      .leftJoinAndSelect(
        'community_questions.attachmentFiles',
        'attachmentFiles',
      );

    if (queryFilters.communityCategoryId) {
      queryBuilder.where('community_questions.communityCategory = :id', {
        id: queryFilters.communityCategoryId,
      });
    }

    if (this.doSelectByColumns(opportunitiesColumns)) {
      queryBuilder = queryBuilder.select(opportunitiesColumns);
    }

    const query: SelectQueryBuilder<CommunityQuestionEntity> =
      await this.applyDecoratorsFromRequest(filtersToEntries, queryBuilder);
    return this.getResults(query);
  }

  /**
   * Get community question filters.
   * @return {string} - Path to filters directory.
   */
  public getFiltersPath(): string {
    return __dirname;
  }
}
