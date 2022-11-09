import { applyDecorators } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import { BaseErrorResponseDto } from '../../../common/dto/base-error-response.dto';

export function SwaggerAuth() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiUnauthorizedResponse({
      type: BaseErrorResponseDto,
      description: 'Unauthorized',
    }),
    ApiForbiddenResponse({
      type: BaseErrorResponseDto,
      description: 'Permission denied',
    }),
  );
}
