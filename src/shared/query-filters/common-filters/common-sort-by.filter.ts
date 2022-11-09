import { SelectQueryBuilder } from 'typeorm';

export class CommonSortByFilter<Entity> {
  sortBy(builder: SelectQueryBuilder<Entity>, value: string, enumEntity: any) {
    const [field, ...rest] = value.split(' ');
    const fieldValue = rest.join(' ');
    if (!Object.values(enumEntity).includes(fieldValue)) {
      return builder;
    }
    return builder.andWhere({ [field]: fieldValue });
  }
}
