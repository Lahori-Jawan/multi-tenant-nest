import * as dotenv from 'dotenv';
import { join } from 'path';

const result = dotenv.config();

if (result.error) {
  console.log('Error while loading .env file @ ormconfig.ts');
  /* do nothing */
}

export const isProd = process.env.NODE_ENV === 'production';
console.log('environment', process.env.NODE_ENV, {isProd});

export const ormConfig = {
  type: 'mssql' as 'mssql',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  entities: [
    isProd
      ? 'dist/**/**.entity{.ts,.js}'
      : __dirname + './../../**/**.entity{.ts,.js}', //* path relative to ormConfig.ts
  ],
  keepConnectionAlive: true,
  synchronize: false,
  dropSchema: false,
  migrationsRun: false,
  logging: !isProd,
  maxQueryExecutionTime: 1000, // log queries that take too much time to execution
  options: {
    useUTC: true
  },
  extra: {
    trustServerCertificate: true,
  },
  migrations: [
    isProd
      ? 'dist/migrations/modules/*{.ts,.js}'
      : join(__dirname, './../../migrations/modules/**/*{.ts,.js}'), //* path relative to ormConfig.ts
  ],
  cli: {
    migrationsDir: 'src/migrations/modules',
  },
};
