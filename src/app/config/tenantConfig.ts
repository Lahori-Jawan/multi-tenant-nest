import { join } from 'path';
import { ormConfig } from './ormConfig';
import { isProd } from './ormConfig';

export = Object.assign({}, ormConfig, {
  migrations: [
    isProd
      ? 'dist/migrations/tenant/*{.ts,.js}'
      : join(__dirname, './../../migrations/tenant/*{.ts,.js}'), //* path relative to ormConfig.ts
  ],
  cli: {
    migrationsDir: 'src/migrations/tenant',
  },
})
