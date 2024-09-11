import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { join } from 'path';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';

@Module({
  imports: [
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
        dir: join(__dirname, './template'), // Ajusta la ruta relativa al directorio template
        adapter: new HandlebarsAdapter(),
        options: {
          strict: true,
        },
      },
    }),
  ],
  exports: [MailerModule],
})
export class MailerConfigModule {
  constructor() {
    // Imprimir la ruta de las plantillas en la consola
    console.log('Ruta de las plantillas:', join(__dirname, './template'));
  }
}
