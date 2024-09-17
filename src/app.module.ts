import { Module, OnModuleInit } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule, InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { APP_FILTER } from '@nestjs/core';
import { AllExceptionsFilter } from './common/filters/all-exeptions.filter';

// TODO > imports necesarios

import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { RoleModule } from './modules/roles/roles.module';


import { MailerModule } from '@nestjs-modules/mailer';
import { join } from 'path';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { CompanyModule } from './modules/company/company.module';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Hace que las variables de entorno estén disponibles en toda la aplicación
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get<string>('DATABASE_HOST') ,
        port: parseInt(configService.get<string>('DATABASE_PORT'), 10),
        username: configService.get<string>('DATABASE_USER'),
        password: configService.get<string>('DATABASE_PASSWORD'),
        database: configService.get<string>('DATABASE_NAME'),
        autoLoadEntities: true,
        synchronize: true, // Cambia a false en producción
      }),
      inject: [ConfigService],

    }),
    MailerModule.forRoot({
      transport: {
        host: process.env.MAIL_HOST,
        port: parseInt(process.env.MAIL_PORT, 10),
        secure: process.env.MAIL_SECURE === 'true', // Usa true si es necesario
        auth: {
          user: process.env.MAIL_USER,
          pass: process.env.MAIL_PASS,
        },
      },
      defaults: {
        from: process.env.MAIL_FROM,
      },
      template: {
        dir: join(__dirname, './templates'), // Ajusta la ruta relativa al directorio template
        adapter: new HandlebarsAdapter(),
        options: {
          strict: true,
        },
      },
    }),


    AuthModule,
    UsersModule,
    RoleModule,
    CompanyModule,
 
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide : APP_FILTER,
      useClass : AllExceptionsFilter
    }
  ],
})
export class AppModule implements OnModuleInit {
  constructor(
    @InjectDataSource() private readonly dataSource: DataSource,
  ) {}

  async onModuleInit() {
    await this.checkDatabaseConnection();
  }

  private async checkDatabaseConnection() {
    try {
      if (this.dataSource.isInitialized) {
        console.log(`********* Connected to MYSQL database: ${process.env.DATABASE_NAME} **************`);
      } else {
        await this.dataSource.initialize();
        console.log('********* Connection to MYSQL database initialized **************');
      }
    } catch (error) {
      console.error(`Failed to Connect to MySQL database: ${error.message}`);
      
    } 
  }

  
}

