import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { TenantService } from './tenant.service';
import { CreateTenantDto } from './dto/create-tenant.dto';
import { UpdateTenantDto } from './dto/update-tenant.dto';
import { Public } from 'src/app/common/auth/public.meta';

@Controller('tenants')
export class TenantController {
  // Todo: finish CRUD for tenant resource
  constructor(private readonly tenantService: TenantService) {}

  @Public()
  @Post()
  async create(@Body() createTenantDto: CreateTenantDto) {
    const res = await this.tenantService.create(createTenantDto);
    return res;
  }

  @Get()
  findAll() {
    return this.tenantService.findAll();
  }
}
