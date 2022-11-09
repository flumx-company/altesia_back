import * as dotenv from 'dotenv';

dotenv.config({ path: '.env' });

export = {
  type: 'mysql',
  host: process.env.MYSQL_HOST,
  port: parseInt(process.env.MYSQL_PORT, 10),
  username: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  entities: ['src/shared/models/index.ts'],
  migrations: ['database/migrations/**/*{.ts,.js}'],
  seeds: ['database/seeds/**/*{.ts,.js}'],
  factories: ['database/factories/**/*{.ts,.js}'],
  cli: {
    migrationsDir: 'database/migrations',
  },
  synchronize: true,
};
