import { Injectable } from '@nestjs/common';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';

import { Entities } from '../models';

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
  constructor(private readonly config: ConfigService) {}

  createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      type: 'mysql',
      host: this.config.get('MYSQL_HOST'),
      port: +this.config.get<number>('MYSQL_PORT'),
      username: this.config.get('MYSQL_USER'),
      password: this.config.get('MYSQL_PASSWORD'),
      database: this.config.get('MYSQL_DATABASE'),
      entities: [...Entities],
      synchronize: true,
      logging: false,
    };
  }
}
