import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';
import {existsSync, mkdirSync} from "fs";
import * as express from "express";
import {join} from "path";
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Movies')
    .setDescription('The movies API description')
    .setVersion('1.0')
    .addTag('movies')
    .build();
  
  app.setGlobalPrefix('api');
  app.use(cookieParser());

  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);
  
  const storageDir = process.env.STORAGE_DIRECTORY;
  const uploadDir = join(process.cwd(), storageDir);
  
  if (!existsSync(uploadDir)) {
    mkdirSync(uploadDir);
  }
  
  app.use('/storage', express.static(join(process.cwd(), storageDir)));
  
  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    preflightContinue: false,
  });
  
  
  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();
