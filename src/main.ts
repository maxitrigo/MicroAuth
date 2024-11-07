import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as morgan from 'morgan';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  const config = new DocumentBuilder()
    .setTitle('MicroAuth')
    .setDescription('The MicroAuth API documentation')
    .setVersion('1.0')
    .addTag('auth')
    .addBearerAuth()
    .build();
  
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  app.use(morgan('dev'))
  app.enableCors();
  await app.listen(3001);
}
bootstrap();
