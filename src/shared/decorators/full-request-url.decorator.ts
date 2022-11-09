import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const FullRequestUrlDecorator = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return `${request.protocol}://${request.get('host')}${request.route.path}`;
  },
);
