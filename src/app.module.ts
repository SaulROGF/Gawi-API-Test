
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';
import { DatabaseModule } from './database/database.module';
import { UserModule } from './modules/public/user/user.module';
import { AuthModule } from './modules/public/auth/auth.module';
import { PublicModule } from './modules/public/public/public.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { AdministratorModule } from './modules/dashboard/admins/administrator/administrator.module';
import { GlobalServicesModule } from './modules/global/global-services.module';
import { DevicesModule } from './modules/dashboard/devices/devices/devices.module';
import { DevicesModule as WarehousesDevicesModule } from './modules/dashboard/warehouses/devices/devices.module';
import { AdminDataModule } from './modules/dashboard/admins/admin-data/admin-data.module';
import { ProfileDataClientModule } from './modules/dashboard/clients/profile-data/profile-data.module';
import { DevicesModule as ClientDevicesModule } from './modules/dashboard/clients/devices/devices.module';
import { ServiceCenterModule } from './modules/dashboard/clients/service-center/service-center.module';
import { OrganizationDataModule } from './modules/dashboard/organizations/organization-data/organization-data.module';
import { LogoImagesUploadsModule } from './modules/public/logo-images-uploads/logo-images-uploads.module';
import { DevicesModule as DevicesTechniciansModule } from './modules/dashboard/technicians/devices/devices.module';
import { DepartureOrdersModule } from './modules/dashboard/production/departure-orders/departure-orders.module';
import * as path from 'path';
import { PushNotificationsService } from './modules/global/push-notifications/push-notifications.service';
import { PaymentsModule } from './modules/dashboard/admins/payments/payments.module';
import { AlexaSkillModule } from './modules/dashboard/clients/alexaSkill/alexaSkill.module';
import { ConfigModule } from '@nestjs/config';


@Module({
  imports: [
    
    MailerModule.forRoot({
      transport: {
        host: 'gawi.mx', //Servidor correo SMTP
        port: 465, //Puerto del servidor del correo
        ignoreTLS: false,
        secure: true, // use SSL
        auth: {
          user: "no-reply@gawi.mx",
          pass: "ingmulti",
        },
        tls: {
          rejectUnauthorized: false
        }
      },
      defaults: {
        from: '"Contacto" <no-reply@gawi.mx>',
      },
      //preview: true,
      template: {
        dir: __dirname + '/templates/emails/',
        adapter: new HandlebarsAdapter(),
        options: {
          strict: true,
        },
      },
    }),
    WinstonModule.forRoot({
      transports: [
        new winston.transports.Console(),
        // logger for debugging
        new winston.transports.File({
          dirname: path.join(__dirname, './../log/debug/'),
          filename: 'debug.log',
          level: 'debug',
        }),
        // logger for console errors
        new winston.transports.File({
          dirname: path.join(__dirname, './../log/error/'),
          filename: 'error.log',
          level: 'error',
        }),
      ],
      format: winston.format.combine(
        /* winston.format.colorize({ all: true }),
        winston.format.printf(
          (info) => {
          return `[${msg.timestamp}] [${msg.filename}] [${msg.level}] [expressRequestId=${msg.expressRequestId}]: ${msg.message}`
          }
        ) */
        winston.format.timestamp({
          format: 'MMM-DD-YYYY HH:mm:ss'
        }),
        winston.format.printf(
          //(info) => 
          //  `${info.level}: ${info.filename} : ${info.timestamp}: ${info.message} : ${info.meta.stack}` 
          (info) => `${info.level}: ${[info.timestamp]}: ${info.message}`
        ),
      )
    }),
    DatabaseModule,
    AuthModule,
    GlobalServicesModule,
    UserModule,
    PublicModule,
    //Admin Modules
    AdministratorModule,
    DevicesModule,
    WarehousesDevicesModule,
    AdminDataModule,
    //Client Modules
    ProfileDataClientModule,
    ClientDevicesModule,
    ServiceCenterModule,
    OrganizationDataModule,
    LogoImagesUploadsModule,
    DevicesTechniciansModule,
    DepartureOrdersModule,
    PaymentsModule,
    AlexaSkillModule,
    ConfigModule.forRoot(),
   
   

  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
