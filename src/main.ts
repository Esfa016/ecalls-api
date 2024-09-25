import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { AllExceptionsFilter } from './Global/sharables';
import * as parser from 'body-parser';
import helmet from 'helmet';
import * as express from 'express';
async function bootstrap() {
    const rawBodyBuffer = (req, res, buffer, encoding) => {
      if (!req.headers['stripe-signature']) {
        return;
      }

      if (buffer && buffer.length) {
        req.rawBody = buffer.toString(encoding || 'utf8');
      }
    };
    const app = await NestFactory.create(AppModule);
    app.useGlobalPipes(new ValidationPipe());
    app.use(parser.urlencoded({ verify: rawBodyBuffer, extended: true }));
    app.use(parser.json({ verify: rawBodyBuffer }));
    app.enableCors({ origin: '*' });
    app.use(helmet());
    app.setGlobalPrefix('/api');
    app.enableVersioning({
      type: VersioningType.URI,
    });
    const port = process.env.PORT || 8080;
    app.use(parser.json({ limit: '10mb' }));
    app.use(express.urlencoded({ limit: '10mb', extended: true }));
    const { httpAdapter } = app.get(HttpAdapterHost);
    app.useGlobalFilters(new AllExceptionsFilter(httpAdapter));

  const configService = app.get(ConfigService)
  
  await app.listen(configService.get('port'));
}
bootstrap();
