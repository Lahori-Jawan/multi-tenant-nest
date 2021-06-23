import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ServerException } from '@src/app/common/exceptions/server';
import { QueuesService } from '@src/queues/queues.service';
import trycatch from '@src/utils/betterCatch';
import { Connection, Repository } from 'typeorm';
import { CreateTenantDto } from './dto/create-tenant.dto';
import { Tenant } from './entities/tenant.entity';

@Injectable()
export class TenantService {
  logger = new Logger(TenantService.name);

  constructor(
    private readonly connection: Connection,
    @InjectRepository(Tenant) private tenantRepository: Repository<Tenant>,
    private tenantQueue: QueuesService,
  ) {
    this.logger.verbose(`connectionName: ${connection.name}`);
  }

  async create(createTenantDto: CreateTenantDto) {
    const promise = this.tenantRepository.save(createTenantDto);
    const [error, data] = await trycatch(promise);

    if (error || !data) throw new ServerException();

    this.tenantQueue.createTenant(createTenantDto);

    return data;
  }

  findAll() {
    return this.tenantRepository.find();
  }

  findByName(name: string) {
    this.logger.warn(
      `findByName: tenantName: ${name}, connectionName: ${this.connection.name}`,
    );
    return this.tenantRepository.findOne({ name });
  }
}
