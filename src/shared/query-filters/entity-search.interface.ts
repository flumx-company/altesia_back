import { Repository, SelectQueryBuilder } from 'typeorm';

export interface EntitySearchInterface<Entity> {
  /**
   * Apply filters from request. Start point of filtering.
   *
   * @param {Repository} repository - Typeorm repository.
   * @param {Object} queryFilters - Request query filters.
   * @param options
   * @return {SelectQueryBuilder} builder - SelectQueryBuilder.
   */
  apply(
    repository: Repository<Entity>,
    queryFilters: Record<string, string>,
    options?: Record<string, any>,
  ): Promise<SelectQueryBuilder<Entity>>;

  /**
   * Path to filters directory.
   */
  getFiltersPath(): string;
}
