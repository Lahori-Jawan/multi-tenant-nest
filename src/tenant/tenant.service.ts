import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Connection, Repository } from 'typeorm';
import { CreateTenantDto } from './dto/create-tenant.dto';
import { UpdateTenantDto } from './dto/update-tenant.dto';
import { Tenant } from './entities/tenant.entity';

@Injectable()
export class TenantService {
  logger = new Logger(TenantService.name);

  constructor(
    private readonly connection: Connection,
    @InjectRepository(Tenant) private tenantRepository: Repository<Tenant>,
  ) {
    this.logger.verbose(`connectionName: ${connection.name}`);
  }

  async create(createTenantDto: CreateTenantDto) {
    return await this.tenantRepository.save(createTenantDto);
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
