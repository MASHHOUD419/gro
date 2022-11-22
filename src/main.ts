import { Logger, NestApplicationOptions, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import {
  utilities as nestWinstonModuleUtilities,
  WinstonModule,
} from 'nest-winston';
import * as winston from 'winston';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import setupDocumentation from './app.documentation';

import { config } from 'aws-sdk';

async function bootstrap() {

  const opt: NestApplicationOptions = {
    logger: WinstonModule.createLogger({
      transports: [
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.timestamp(),
            nestWinstonModuleUtilities.format.nestLike(),
          ),
        }),
      ],
      level: process.env.LOG_LEVEL,
    }),
  };

  config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION
  });

  const app = await NestFactory.create<NestExpressApplication>(AppModule, opt);

  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    // disableErrorMessages: true
  }));
  app.enableCors();
  app.enableShutdownHooks();
  app.setGlobalPrefix('api');
  setupDocumentation(app);

  const port = process.env.PORT;

  const logger = new Logger('NestApplication');

  await app.listen(port, () =>
    logger.log(`Server(${process.env.NODE_ENV}) initialized on port ${port}`),
  );
}

bootstrap();
