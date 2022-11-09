import { SelectQueryBuilder } from 'typeorm';

export interface EntityFilterInterface<Entity> {
  /**
   * Apply a given search value to the builder instance.
   *
   * @param {SelectQueryBuilder} builder - SelectQueryBuilder.
   * @param {string }value - Request value.
   * @return {SelectQueryBuilder} builder - SelectQueryBuilder.
   */
  apply(
    builder: SelectQueryBuilder<Entity>,
    value: string,
  ): SelectQueryBuilder<Entity>;
}
