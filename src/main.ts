import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';
import * as express from 'express';
import { AppModule } from '@app/app.module';
import { Files } from '@app/utils';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    preflightContinue: false,
  });

  app.use('/storage', express.static(Files.init(process.cwd())));

  const config = new DocumentBuilder()
    .setTitle('Movies')
    .setDescription('The Movies API Documentation')
    .setVersion('1.0')
    .addTag('movies')
    .build();

  app.setGlobalPrefix('api');
  app.use(cookieParser());

  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);

  await app.listen(process.env.PORT ?? 3000);
}

void bootstrap();
