import { applyDecorators, Type } from '@nestjs/common';
import { ApiExtraModels, ApiOkResponse, getSchemaPath } from '@nestjs/swagger';

import { BaseSuccessResponseDto } from '../../../common/dto/base-success-response.dto';
import { PaginatedDto } from '../../../common/dto/paginated-data.dto';

type Nullable = null | undefined;

export const ApiPaginatedDecorator = <TModel extends Type<any>>(
  model: TModel | Nullable = null,
) => {
  return applyDecorators(
    ApiExtraModels(BaseSuccessResponseDto, PaginatedDto),
    ApiOkResponse({
      schema: {
        allOf: [
          { $ref: getSchemaPath(BaseSuccessResponseDto) },
          {
            properties: {
              data: {
                type: 'object',
                $ref: getSchemaPath(PaginatedDto),
                properties: {
                  items: {
                    type: 'array',
                    items: model ? { $ref: getSchemaPath(model) } : {},
                  },
                },
              },
            },
          },
        ],
      },
    }),
  );
};
