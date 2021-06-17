import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AppService } from './app.service';
import { Public } from './app/common/auth/public.meta';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Public()
  @Get('/status/health')
  @ApiOperation({ summary: 'Health check route' })
  @ApiResponse({ status: 200, description: 'Ok' })
  healthCheck(): string {
    return this.appService.getStatus();
  }
}
