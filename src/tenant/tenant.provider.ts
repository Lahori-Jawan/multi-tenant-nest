import { Logger, Provider, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Connection, getConnection } from 'typeorm';
import { Request } from 'express';
import { Tenant } from './entities/tenant.entity';
import { DEFAULT_TENANT } from '@src/app/common/constants/app';

export const TENANT_CONNECTION = 'TENANT_CONNECTION';

const logger = new Logger('TenantConnectionProvider');

export const TenantConnectionProvider: Provider = {
  provide: TENANT_CONNECTION,
  inject: [REQUEST, Connection],
  scope: Scope.REQUEST,
  useFactory: async (req: Request, connection: Connection) => {
    console.log('req================', req.params);
    const connectionName: string = req.params['tenant']; //* req.headers['x-team-id']
    logger.log({ provider: connectionName });
    const tenant: Tenant = await connection
      .getRepository(Tenant)
      .findOne({ where: { name: connectionName } });

    req.params.tenant = req.params?.tenant || DEFAULT_TENANT;

    return getConnection(tenant?.name);
  },
};
