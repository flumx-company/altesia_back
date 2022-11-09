import { SelectQueryBuilder } from 'typeorm';

import { EntityFilterInterface } from '../../entity-filter.interface';
import { CommonOrderByFilter } from '../../common-filters/common-order-by.filter';
import { CommunityResponseEntity } from '../../../models/community-response.entity';

export default class OrderByFilter
  extends CommonOrderByFilter<CommunityResponseEntity>
  implements EntityFilterInterface<CommunityResponseEntity>
{
  apply(builder: SelectQueryBuilder<CommunityResponseEntity>, value: string) {
    return this.handleOrderBy(builder, value, 'communityRatings');
  }
}
