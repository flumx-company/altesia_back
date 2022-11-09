import { In, Repository, SaveOptions, SelectQueryBuilder } from 'typeorm';

import { BulkDestroyDto } from '../../common/dto/bulk-destroy.dto';
import { IPaginationOptions } from '../../common/interfaces/pagination-options.interface';
import { BaseEntity } from '../../common/entities/base-entity.entity';

export class BaseRepository<E> extends Repository<E> {
  /**
   * Save and return saved entity.
   *
   * @param {Object} dto - Input object.
   * @param {SaveOptions} options - SaveOptions.
   * @param {Array} relations - Relations to fetch.
   */
  public async saveAndReturn<Dto>(
    dto: Dto,
    options?: SaveOptions,
    relations: string[] = [],
  ): Promise<E> {
    const entityDto = this.create(dto);
    const record: BaseEntity = await this.save(entityDto, options);
    return await this.findOne(record.id, {
      relations,
    });
  }

  /**
   * Bulk destroy of entities.
   *
   * @param {Object} bulkDestroyDto - BulkDestroyDto
   * @param {Array} relations - Relations.
   */
  public async bulkDestroy(
    bulkDestroyDto: BulkDestroyDto,
    relations: string[] = [],
  ) {
    const records = await this.find({
      where: { id: In(bulkDestroyDto.ids) },
      relations,
    });
    await this.remove(records);
  }

  /**
   * Update record by id and return updated entity.
   *
   * @param {number} id - Id record.
   * @param {Object} dto - Update dto.
   * @param {Array} relations - Relations.
   */
  public async updateByIdAndReturn<Dto>(
    id: number,
    dto: Dto,
    relations: string[] = [],
  ): Promise<E> {
    await this.findOneOrFail(id);
    const dtoInstance = Object.fromEntries(
      Object.entries(this.create(dto)).filter(([_, v]) => !!v),
    ) as E;
    await this.update(id, dtoInstance);
    return this.findOneOrFail(id, {
      relations,
    });
  }

  /**
   * Paginate query builder.
   *
   * @param {SelectQueryBuilder} queryBuilder - SelectQueryBuilder.
   * @param {IPaginationOptions} options - Pagination options.
   * @param {Function|null} mapperFn - Mapper function.
   */
  public async paginateQueryBuilder(
    queryBuilder: SelectQueryBuilder<E>,
    options: IPaginationOptions,
    mapperFn: (record: E) => E = null,
  ) {
    const entitiesPromise = queryBuilder
      .skip(options.limit * (options.page - 1))
      .take(options.limit)
      .getMany();
    const [entities, totalItems] = await Promise.all([
      entitiesPromise,
      queryBuilder.getCount(),
    ]);
    const items = mapperFn ? entities.map(mapperFn) : entities;
    return {
      items,
      meta: BaseRepository.getPaginationMetaData(totalItems, items, options),
    };
  }

  /**
   * Get pagination meta data.
   *
   * @param {number} totalItems - Total count of items.
   * @param {Array} items - Items that need to be paginated.
   * @param {IPaginationOptions} options - Pagination options.
   * @private
   */
  private static getPaginationMetaData<T>(
    totalItems: number,
    items: T[],
    options: IPaginationOptions,
  ) {
    return {
      totalItems,
      itemCount: items.length,
      itemsPerPage: options.limit,
      totalPages: Math.ceil(totalItems / options.limit),
      currentPage: options.page,
    };
  }
}
