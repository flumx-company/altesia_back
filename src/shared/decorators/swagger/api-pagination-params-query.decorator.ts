import { applyDecorators } from '@nestjs/common';
import { ApiQuery } from '@nestjs/swagger';

export function ApiPaginationParamsQueryDecorator() {
  return applyDecorators(
    ApiQuery({
      name: 'page',
      required: false,
      description: 'Pagination page',
    }),
    ApiQuery({
      name: 'limit',
      required: false,
      description: 'Pagination limit',
    }),
  );
}
