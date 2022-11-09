## Altesia Api

Backend for Altesia application

## Setup

```bash
1. Clone the repo
2. cp .env.example .env  
3. fill .env  
4. npm ci
5. npm run seed:run - to seed local database
```

## Running the app

### Local development

```bash
$ npm run start:dev - start application in dev mode
```

### Docker development

> :warning: **Docker development**:
> Please make a sure that:
1. `MYSQL_HOST` in `.env` is set to `mysql-db` (mysql docker container),  
   the rest fields you can leave how it is now.
2. `QUEUE_HOST` should be set to `redis`

```bash
$ sudo docker-compose up   
```

After, go to `nestjs` container shell and execute `npm run seed:run` in the project directory,
to seed the database

Phpmyadmin can be reached at `http://localhost`

For more details, please take a look `docker-compose.yml`

## Code style documentation
See documentation [here](MDfiles/CODESTYLE.md)

## Migrations

### How to work with migration?

$ npm run migrate:create <Filename> - to create a new migration.  
$ npm run migrate:up - to run the new migrations.  
$ npm run migrate:down - to rollback migrations.

### How to work with seeds?

Create a new `seeder` file in `./database/seeds` folder

$ npm run seed:run - to seed the database with new seeds.

For more details take a look the documentation:

- Migrations - https://github.com/typeorm/typeorm/blob/master/docs/migrations.md
- Seeding - https://www.npmjs.com/package/typeorm-seeding#cli-options