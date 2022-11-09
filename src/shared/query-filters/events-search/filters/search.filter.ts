import { Brackets, SelectQueryBuilder } from 'typeorm';

import { EntityFilterInterface } from '../../entity-filter.interface';
import { EventEntity } from '../../../models/event.entity';

export default class SearchFilter
  implements EntityFilterInterface<EventEntity>
{
  apply(builder: SelectQueryBuilder<EventEntity>, value: string) {
    return builder.andWhere(
      new Brackets((qb) => {
        qb.where('events.title like :title', {
          title: `%${value}%`,
        }).orWhere('events.description like :description', {
          description: `%${value}`,
        });
      }),
    );
  }
}
