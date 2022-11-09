import { SelectQueryBuilder } from 'typeorm';

import { EntityFilterInterface } from '../../entity-filter.interface';
import { CommunityResponseEntity } from '../../../models/community-response.entity';

export default class AnswerFilter
  implements EntityFilterInterface<CommunityResponseEntity>
{
  apply(builder: SelectQueryBuilder<CommunityResponseEntity>, value: string) {
    return builder.andWhere('communityResponses.answer like :title', {
      title: `%${value}%`,
    });
  }
}
