import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MulterModule } from '@nestjs/platform-express';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { APP_CONSTANTS } from './common/constants/constants';
import { AppModules } from './modules';
import { CaslModule } from './modules/casl/casl.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
    }),
    MulterModule.register({
      dest: APP_CONSTANTS.BASE_UPLOAD_FILES_DIRECTORY,
    }),
    ...AppModules,
    CaslModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
