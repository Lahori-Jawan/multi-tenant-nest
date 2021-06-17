import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const logger = new Logger('main');
  const app = await NestFactory.create(AppModule, {
    logger: ['log', 'error', 'warn', 'debug', 'verbose'],
  });
  const APP_URL = `${AppModule.hostname}:${AppModule.port}`;

  app.setGlobalPrefix(':tenant?/api');
  // app.useGlobalFilters();
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  if (!AppModule.isProduction) {
    const options = new DocumentBuilder()
      .setTitle('NestJS Realworld Example App')
      .setDescription('The Realworld API description')
      .setVersion('1.0')
      .addTag('api')
      .addBearerAuth()
      .build();

    const document = SwaggerModule.createDocument(app, options);

    SwaggerModule.setup('/docs', app, document);

    logger.debug(`App docs available at ${APP_URL}/docs url`);
  }
  logger.verbose(`App started on ${APP_URL}`);

  await app.listen(AppModule.port);
}
bootstrap();
