import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { PaginationBody } from './infrastructure/interfaces/pagination-body.interface';
import { PaginationResponse } from './infrastructure/interfaces/pagination-response.interface';
import { ValidationPipe } from './infrastructure/validator';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  app.useGlobalPipes(new ValidationPipe());

  const config = new DocumentBuilder()
    .setTitle('Tazkrtak')
    .setDescription('Tazkrtak API')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config, {
    extraModels: [PaginationBody, PaginationResponse],
  });

  SwaggerModule.setup('/', app, document);

  await app.listen(process.env.PORT);
}
bootstrap();
