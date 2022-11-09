import { SelectQueryBuilder } from 'typeorm';

import { OrderByEnum } from '../../../common/enums/order-by.enum';

export class CommonOrderByFilter<Entity> {
  handleOrderBy(
    builder: SelectQueryBuilder<Entity>,
    value: string,
    aliasName: string,
  ) {
    const orderByParams = value.split(',');

    orderByParams.forEach((param, idx) => {
      const [field, orderBy] = param.trim().split(' ');
      const order =
        orderBy === OrderByEnum.ASC.toLowerCase()
          ? OrderByEnum.ASC
          : OrderByEnum.DESC;

      builder =
        idx === 0
          ? builder.orderBy(`${aliasName}.${field}`, order)
          : builder.addOrderBy(`${aliasName}.${field}`, order);
    });
    return builder;
  }
}
