import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import * as express from 'express';
import {
  EntityNotFoundError,
  FindRelationsNotFoundError,
  QueryFailedError,
  TypeORMError,
} from 'typeorm';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse() as express.Response;
    const request = ctx.getRequest();

    let message = (exception as any).message.message;
    const code = exception.constructor.name;
    const error = (exception as any).response?.error;

    let status: HttpStatus;
    switch (true) {
      case exception instanceof HttpException:
        status = (exception as HttpException).getStatus();
        message = (exception as any).response?.message;
        break;
      case exception instanceof QueryFailedError:
        status = HttpStatus.UNPROCESSABLE_ENTITY;
        message = (exception as QueryFailedError).message;
        break;
      case exception instanceof EntityNotFoundError:
        status = HttpStatus.NOT_FOUND;
        message = (exception as EntityNotFoundError).message;
        break;
      case exception instanceof FindRelationsNotFoundError:
        status = HttpStatus.NOT_FOUND;
        message = (exception as EntityNotFoundError).message;
        break;
      case exception instanceof TypeORMError:
        status = HttpStatus.BAD_REQUEST;
        message = (exception as TypeORMError).message;
        break;
      default:
        status = HttpStatus.INTERNAL_SERVER_ERROR;
        message = (exception as any).message;
    }

    const body = {
      success: false,
      data: {
        statusCode: status,
        code,
        message,
        error,
        timestamp: new Date().toISOString(),
        endpoint: request.url,
        method: request.method,
      },
    };

    this.logger.error(
      `${status} ${message},`,
      (exception as any).stack,
      `${request.method} ${request.url}`,
    );

    response.status(status).json(body);
  }
}
