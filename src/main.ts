import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
// import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
import * as morgan from 'morgan';
import { ValidationPipe } from '@nestjs/common';

dotenv.config({ path: __dirname + '/../.env' });

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Configuración de Swagger
  const config = new DocumentBuilder()
    .setTitle('base-api')
    .setDescription('API base')
    .setVersion('1.0')
    .addTag('api')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  // Configuración de Helmet para seguridad
  app.use(helmet());
  app.use(morgan('tiny'))
  
  // Configuración de CORS
  app.enableCors({
    origin: 'http://localhost:8100',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    allowedHeaders: 'Content-Type, Authorization'
  });
  

  // ruta global prefijo
  app.setGlobalPrefix('api/v1');

 // validacion de formularios
 app.useGlobalPipes(
  new ValidationPipe({
    whitelist: true,         // Elimina propiedades no permitidas
    forbidNonWhitelisted: true,  // Lanza error si hay propiedades no permitidas
    transform: true,         // Transforma automáticamente los datos a los tipos definidos en los DTOs
  })
);

  const port = process.env.PORT || 4000;
  await app.listen(port);
  console.log(`Application is running on: http://localhost:${port}`);
}

bootstrap();
