import { Brackets, SelectQueryBuilder } from 'typeorm';

import { EntityFilterInterface } from '../../entity-filter.interface';
import { OpportunityEntity } from '../../../models/opportunity.entity';

export default class SearchFilter
  implements EntityFilterInterface<OpportunityEntity>
{
  apply(builder: SelectQueryBuilder<OpportunityEntity>, value: string) {
    return builder.andWhere(
      new Brackets((qb) => {
        qb.where('opportunities.title like :title', {
          title: `%${value}%`,
        })
          .orWhere('opportunities.location like :location', {
            location: `%${value}`,
          })
          .orWhere('opportunities.client_name like :client_name', {
            client_name: `%${value}%`,
          });
      }),
    );
  }
}
