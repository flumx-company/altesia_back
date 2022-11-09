import { ApiProperty } from '@nestjs/swagger';

export class PaginatedDto<TData> {
  @ApiProperty()
  items: TData[];

  @ApiProperty({
    example: {
      totalItems: 1,
      limit: 1,
      offset: 1,
    },
  })
  meta: {
    totalItems: number;
    limit: number;
    offset: number;
  };

  @ApiProperty({
    example: {
      first: 'string',
      previous: 'string',
      next: 'string',
      last: 'string',
    },
  })
  links: {
    first: string;
    previous: string;
    next: string;
    last: string;
  };
}
