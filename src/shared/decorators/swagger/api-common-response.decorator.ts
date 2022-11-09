import { applyDecorators, HttpStatus, Type } from '@nestjs/common';
import {
  ApiExtraModels,
  ApiNoContentResponse,
  ApiResponse,
  getSchemaPath,
} from '@nestjs/swagger';

import { BaseSuccessResponseDto } from '../../../common/dto/base-success-response.dto';
import { BaseErrorResponseDto } from '../../../common/dto/base-error-response.dto';

type Nullable = null | undefined;

interface ApiCommonResponseInterface<TModel> {
  type?: TModel | Nullable;
  description?: string;
  status?: number;
  success?: boolean;
}

export const ApiCommonResponseDecorator = <TModel extends Type<any>>(
  options: ApiCommonResponseInterface<TModel>,
) => {
  const {
    success = true,
    type,
    description = 'Success',
    status = HttpStatus.OK,
  } = options;
  if (status === HttpStatus.NO_CONTENT) {
    return ApiNoContentResponse({
      description: 'Entity removed successfully',
    });
  }
  const baseDto = success ? BaseSuccessResponseDto : BaseErrorResponseDto;
  const $ref = type ? getSchemaPath(type) : '';
  const apiExtraModels = type
    ? ApiExtraModels(baseDto, type)
    : ApiExtraModels(baseDto);

  return applyDecorators(
    apiExtraModels,
    ApiResponse({
      schema: {
        allOf: [
          { $ref: getSchemaPath(baseDto) },
          {
            properties: {
              data: {
                type: 'object',
                $ref,
              },
            },
          },
        ],
      },
      description,
      status,
    }),
  );
};
