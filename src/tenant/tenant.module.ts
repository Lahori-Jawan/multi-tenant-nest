import {
  BadRequestException,
  Logger,
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { TenantService } from './tenant.service';
import { TenantController } from './tenant.controller';
import { Request, NextFunction } from 'express';
import { TenantConnectionProvider } from './tenant.provider';
import { Tenant } from './entities/tenant.entity';
import trycatch from 'src/utils/betterCatch';
import { Connection, createConnection, getConnectionManager } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { ormConfig } from 'src/app/config/ormConfig';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServerException } from 'src/app/common/exceptions/server';

@Module({
  imports: [TypeOrmModule.forFeature([Tenant])],
  exports: [TenantConnectionProvider],
  controllers: [TenantController],
  providers: [TenantService, TenantConnectionProvider],
})
export class TenantModule implements NestModule {
  logger = new Logger(TenantModule.name);

  constructor(
    private readonly connection: Connection,
    private readonly configService: ConfigService,
    private readonly tenantService: TenantService,
  ) {}

  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(async (req: Request, res: Response, next: NextFunction) => {
        //* 1: Tenant exist in DB else throw error
        //* 2: Tenant DB exist else create
        //* 3: DB connection exist else create
        const tenantName: string = req.params['tenant'];
        const tenantPromise = this.tenantService.findByName(tenantName);
        const [error, tenant] = await trycatch(tenantPromise);
        console.log({ tenantName, tenant, error });
        if (error || !tenant) {
          throw new BadRequestException(
            'Database Connection Error',
            'This tenant does not exists',
          );
        }

        try {
          this.logger.log('Getting connection');
          const connectionManager = getConnectionManager();

          if (connectionManager.has(tenant.name)) {
            const connection = connectionManager.get(tenant.name);
            !connection.isConnected && connection.connect();
            this.logger.log({
              connectionName: connection.name,
              connected: connection.isConnected,
            });
          } else {
            // Todo:: move DB Creation/Migration into queue when tenant is created
            this.logger.verbose(
              `no connection, creating db for tenant ${tenant.name} (if not exists)`,
            );
            const dbPromise = this.connection.query(
              `IF NOT EXISTS
              (
                SELECT name FROM master.dbo.sysdatabases
                WHERE name = '${tenant.name}'
              )
              CREATE DATABASE ${tenant.name}`,
            );

            const [error, db] = await trycatch(dbPromise);

            if (error) throw new ServerException();

            const config = {
              ...ormConfig,
              name: tenant.name,
              database: tenant.name,
              // password: this.configService.get('DB_PASSWORD')
            };

            this.logger.log('db created, now creating connection with config');
            this.logger.log({ config });

            const connection = await createConnection(config);
            //! comment this line for error 'object "users" already exists'
            await connection.runMigrations({ transaction: 'none' });

            this.logger.log(
              `connection created? ${connection?.isConnected}, connection name -> ${connection.name}`,
            );
          }

          next();
        } catch (e) {
          this.logger.error(`catch error message -> ${e}`);
          throw new ServerException();
        }
      })
      .exclude({
        path: '/api/(tenants|auth/login|auth/register|status/health)',
        method: RequestMethod.ALL,
      })
      .forRoutes('*');
  }
}
