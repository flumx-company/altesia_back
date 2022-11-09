import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const QueryWithoutPaginatingParams = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const { limit, page, ...rest } = request.query;
    return rest;
  },
);
