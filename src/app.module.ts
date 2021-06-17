import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ormConfig } from './app/config/ormConfig';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { TenantModule } from './tenant/tenant.module';

@Module({
  imports: [
    AuthModule,
    UserModule,
    TenantModule,
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot(ormConfig),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  static port: number;
  static hostname: string;
  static isProduction: boolean;

  constructor(private readonly configService: ConfigService) {
    AppModule.port = configService.get('APP_PORT');
    AppModule.hostname = configService.get('APP_URL');
    AppModule.isProduction = configService.get('NODE_ENV') === 'production';
  }
}
