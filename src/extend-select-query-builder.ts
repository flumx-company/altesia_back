import { SelectQueryBuilder } from 'typeorm/query-builder/SelectQueryBuilder';
import { Brackets } from 'typeorm';

import { ReleasedStatusesEnum } from './common/enums/released-statuses.enum';
import { capitalizeFirstLetter } from './utils/utils';

declare module 'typeorm/query-builder/SelectQueryBuilder' {
  interface SelectQueryBuilder<Entity> {
    fetchPublished(
      this: SelectQueryBuilder<Entity>,
    ): SelectQueryBuilder<Entity>;
    fetchMineInterestingRecords(
      this: SelectQueryBuilder<Entity>,
      userId: number,
    ): SelectQueryBuilder<Entity>;
    fetchNonInterestingUserRecordsWithAscendingInterestingField(
      this: SelectQueryBuilder<Entity>,
      userId: number,
    ): SelectQueryBuilder<Entity>;
  }
}

SelectQueryBuilder.prototype.fetchPublished = function <Entity>(
  this: SelectQueryBuilder<Entity>,
): SelectQueryBuilder<Entity> {
  return this.andWhere(`${this.alias}.status = :status`, {
    status: ReleasedStatusesEnum.PUBLISHED,
  });
};

SelectQueryBuilder.prototype.fetchMineInterestingRecords = function <Entity>(
  this: SelectQueryBuilder<Entity>,
  userId,
): SelectQueryBuilder<Entity> {
  const aliasWithFirstUpperCase = capitalizeFirstLetter(this.alias);

  return this.leftJoinAndSelect(
    `${this.alias}.user${aliasWithFirstUpperCase}`,
    `user${aliasWithFirstUpperCase}`,
    `user${aliasWithFirstUpperCase}.user_id = :user_id`, // to join only that records where authenticated user is owner
    {
      user_id: userId,
    },
  ).andWhere(
    `user${aliasWithFirstUpperCase}.is_interesting = :is_interesting`,
    {
      is_interesting: true,
    },
  );
};

SelectQueryBuilder.prototype.fetchNonInterestingUserRecordsWithAscendingInterestingField =
  function <Entity>(
    this: SelectQueryBuilder<Entity>,
    userId,
  ): SelectQueryBuilder<Entity> {
    const aliasWithFirstUpperCase = capitalizeFirstLetter(this.alias);

    return this.leftJoinAndSelect(
      `${this.alias}.user${aliasWithFirstUpperCase}`,
      `user${aliasWithFirstUpperCase}`,
      `user${aliasWithFirstUpperCase}.user_id = :user_id`, // to join only that records where authenticated user is owner
      {
        user_id: userId,
      },
    )
      .andWhere(
        new Brackets((qb) => {
          qb.where(`user${aliasWithFirstUpperCase}.id IS NULL`).orWhere(
            `user${aliasWithFirstUpperCase}.is_interesting = :is_interesting`,
            {
              is_interesting: false,
            },
          );
        }),
      )
      .orderBy(`user${aliasWithFirstUpperCase}.is_interesting`, 'ASC');
  };
