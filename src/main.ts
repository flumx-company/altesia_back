import { join } from 'path';

import { INestApplication, Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import * as express from 'express';
import {
  initializeTransactionalContext,
  patchTypeORMRepositoryWithBaseRepository,
} from 'typeorm-transactional-cls-hooked';
import { GlobalExceptionFilter } from 'src/shared/filters/http-exceptions.filter';
import './extend-select-query-builder';

import { AppModule } from './app.module';
import { TransformResponseInterceptor } from './shared/interceptors/transform-response.interceptor';
import { APP_CONSTANTS } from './common/constants/constants';
import { ExcludeModelPropertyInterceptor } from './shared/interceptors/exclude-model-property.interceptor';

async function createApplication() {
  initializeTransactionalContext(); // Initialize cls-hooked
  patchTypeORMRepositoryWithBaseRepository(); // patch Repository with BaseRepository.

  const app = await NestFactory.create(AppModule, { cors: true });
  app.setGlobalPrefix('api/v1');

  app.useGlobalFilters(new GlobalExceptionFilter());
  app.useGlobalInterceptors(new TransformResponseInterceptor());
  app.useGlobalInterceptors(new ExcludeModelPropertyInterceptor());
  app.useGlobalPipes(new ValidationPipe());

  const relativePathToFiles = '../..'; // in prod mode or start:dev we are in dist folder.
  app.use(
    '/files',
    express.static(
      join(
        __dirname,
        relativePathToFiles,
        APP_CONSTANTS.BASE_UPLOAD_FILES_DIRECTORY,
      ),
    ),
  );

  return app;
}

function swaggerInitialization(app: INestApplication) {
  const documentBuilder = new DocumentBuilder()
    .setTitle('Altesia docs')
    .setDescription('Open API documentation for Altesia service')
    .setVersion('1.4')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, documentBuilder);
  SwaggerModule.setup('api/documentation', app, document);
}

async function bootstrap() {
  const app = await createApplication();
  swaggerInitialization(app);
  const configService = app.get(ConfigService);
  const port = configService.get('APP_PORT');

  await app.listen(port, () => {
    Logger.log(
      `Listening at port: ${port}. In ${configService.get('NODE_ENV')} mode.`,
    );
  });
}

bootstrap().catch((err) => Logger.error(`Error in bootstrap function ${err}`));
