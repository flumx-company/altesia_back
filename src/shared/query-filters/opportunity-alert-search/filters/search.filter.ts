import { Brackets, SelectQueryBuilder } from 'typeorm';

import { EntityFilterInterface } from '../../entity-filter.interface';
import { OpportunityAlertEntity } from '../../../models/opportunity-alert.entity';

export default class SearchFilter
  implements EntityFilterInterface<OpportunityAlertEntity>
{
  apply(builder: SelectQueryBuilder<OpportunityAlertEntity>, value: string) {
    return builder.andWhere(
      new Brackets((qb) => {
        qb.where('alertOpportunities.title like :title', {
          title: `%${value}%`,
        }).orWhere('alertOpportunities.description like :location', {
          location: `%${value}`,
        });
      }),
    );
  }
}
