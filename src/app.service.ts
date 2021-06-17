import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as os from 'os';

@Injectable()
export class AppService {
  constructor(private readonly configService: ConfigService) {}

  getStatus(): any {
    const cpus = os.cpus();
    return {
      status: 'OK',
      node_env: this.configService.get('NODE_ENV'),
      uptime: `${process.uptime()}s`,
      pid: process.pid,
      hostname: os.hostname(),
      memory: process.memoryUsage(),
      cores: cpus.length,
      cpus,
    };
  }
}
