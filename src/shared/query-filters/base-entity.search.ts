import * as path from 'path';

import { EntityTarget, getConnection, SelectQueryBuilder } from 'typeorm';

export class BaseEntitySearch<Entity> {
  /**
   * Handle request filters from request.
   *
   * @param {Object} filters - Request filters.
   * @param {SelectQueryBuilder} queryBuilder - SelectQueryBuilder.
   */
  public async applyDecoratorsFromRequest(
    filters: [string, string][],
    queryBuilder: SelectQueryBuilder<Entity>,
  ): Promise<SelectQueryBuilder<Entity>> {
    for (const [key, value] of filters) {
      const decorator: string = this.createFilterDecorator(key);
      try {
        const { default: decoratorClass } = await import(decorator);
        const instance = new decoratorClass();
        queryBuilder = instance.apply(queryBuilder, value);
      } catch (e) {}
    }
    return queryBuilder;
  }

  /**
   * @param {string} name - Filename.
   * @return {string} - Path to the file.
   */
  private createFilterDecorator(name: string): string {
    return path.join(this.getFiltersPath(), 'filters', `${name}.filter.js`);
  }

  /**
   * Get entity filters path.
   * @return {string} - Path to filters directory.
   */
  public getFiltersPath(): string {
    return __dirname;
  }

  /**
   * Get query builder results.
   *
   * @param {SelectQueryBuilder} builder - Query builder.
   * @return {SelectQueryBuilder} builder - Query builder.
   */
  public getResults(builder): SelectQueryBuilder<Entity> {
    return builder;
  }

  /**
   * Get selectable columns from request query.
   *
   * @param {EntityTarget} entity - Entity
   * @param {String }mapToRelation - Relation column name
   * @param {String[]} columnsToSelect - Request query columns
   */
  protected getEntitySelectableColumnsFromQueryRequest<E>(
    entity: EntityTarget<E>,
    mapToRelation: string,
    columnsToSelect: string[],
  ) {
    const columns = getConnection()
      .getMetadata(entity)
      .ownColumns.map((column) => column.propertyName)
      .filter((column) => columnsToSelect.includes(column))
      .map((column) => `${mapToRelation}.${column}`);
    return [`${mapToRelation}.id`, ...columns];
  }

  /**
   * Get columns that should be selected from query request.
   *
   * @param queryFilters
   * @return {Array} - Columns that should be selected.
   * @protected
   */
  protected getColumnsThatShouldBeSelected(
    queryFilters: Record<string, string>,
  ) {
    return queryFilters.column?.split(',') || [];
  }

  /**
   * Check if we need to do select by query request columns.
   *
   * @param {Array} columns - Query column to select.
   * @return {Boolean} - Do select or not.
   * @protected
   */
  protected doSelectByColumns(columns: string[]) {
    return columns.some((item) => item.split('.')[1] !== 'id');
  }
}
