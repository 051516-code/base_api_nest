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
import { MailerConfigModule } from './shared/utils/mailer.module';


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
  
    MailerConfigModule,
    AuthModule,
    UsersModule,
    RoleModule,
 
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
    console.log( 'camino template' + __dirname, './templates')
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

