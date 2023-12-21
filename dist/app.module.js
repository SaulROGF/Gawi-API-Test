"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const nest_winston_1 = require("nest-winston");
const winston = require("winston");
const database_module_1 = require("./database/database.module");
const user_module_1 = require("./modules/public/user/user.module");
const auth_module_1 = require("./modules/public/auth/auth.module");
const public_module_1 = require("./modules/public/public/public.module");
const mailer_1 = require("@nestjs-modules/mailer");
const handlebars_adapter_1 = require("@nestjs-modules/mailer/dist/adapters/handlebars.adapter");
const administrator_module_1 = require("./modules/dashboard/admins/administrator/administrator.module");
const global_services_module_1 = require("./modules/global/global-services.module");
const devices_module_1 = require("./modules/dashboard/devices/devices/devices.module");
const devices_module_2 = require("./modules/dashboard/warehouses/devices/devices.module");
const admin_data_module_1 = require("./modules/dashboard/admins/admin-data/admin-data.module");
const profile_data_module_1 = require("./modules/dashboard/clients/profile-data/profile-data.module");
const devices_module_3 = require("./modules/dashboard/clients/devices/devices.module");
const service_center_module_1 = require("./modules/dashboard/clients/service-center/service-center.module");
const organization_data_module_1 = require("./modules/dashboard/organizations/organization-data/organization-data.module");
const logo_images_uploads_module_1 = require("./modules/public/logo-images-uploads/logo-images-uploads.module");
const devices_module_4 = require("./modules/dashboard/technicians/devices/devices.module");
const departure_orders_module_1 = require("./modules/dashboard/production/departure-orders/departure-orders.module");
const path = require("path");
const payments_module_1 = require("./modules/dashboard/admins/payments/payments.module");
const alexaSkill_module_1 = require("./modules/dashboard/clients/alexaSkill/alexaSkill.module");
const config_1 = require("@nestjs/config");
const fieldtest_module_1 = require("./modules/dashboard/admins/fieldtest/fieldtest.module");
let AppModule = class AppModule {
};
AppModule = __decorate([
    common_1.Module({
        imports: [
            mailer_1.MailerModule.forRoot({
                transport: {
                    host: 'mail.gawi.mx',
                    port: 465,
                    ignoreTLS: false,
                    secure: true,
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
                template: {
                    dir: __dirname + '/templates/emails/',
                    adapter: new handlebars_adapter_1.HandlebarsAdapter(),
                    options: {
                        strict: true,
                    },
                },
            }),
            nest_winston_1.WinstonModule.forRoot({
                transports: [
                    new winston.transports.Console(),
                    new winston.transports.File({
                        dirname: path.join(__dirname, './../log/debug/'),
                        filename: 'debug.log',
                        level: 'debug',
                    }),
                    new winston.transports.File({
                        dirname: path.join(__dirname, './../log/error/'),
                        filename: 'error.log',
                        level: 'error',
                    }),
                    new winston.transports.File({
                        dirname: path.join(__dirname, './../log/api/'),
                        filename: 'api.log',
                        level: 'info',
                    })
                ],
                format: winston.format.combine(winston.format.timestamp({
                    format: 'MMM-DD-YYYY HH:mm:ss'
                }), winston.format.printf((info) => `${info.level}: ${[info.timestamp]}: ${info.message}`))
            }),
            database_module_1.DatabaseModule,
            auth_module_1.AuthModule,
            global_services_module_1.GlobalServicesModule,
            user_module_1.UserModule,
            public_module_1.PublicModule,
            administrator_module_1.AdministratorModule,
            devices_module_1.DevicesModule,
            devices_module_2.DevicesModule,
            admin_data_module_1.AdminDataModule,
            profile_data_module_1.ProfileDataClientModule,
            devices_module_3.DevicesModule,
            service_center_module_1.ServiceCenterModule,
            organization_data_module_1.OrganizationDataModule,
            logo_images_uploads_module_1.LogoImagesUploadsModule,
            devices_module_4.DevicesModule,
            departure_orders_module_1.DepartureOrdersModule,
            payments_module_1.PaymentsModule,
            alexaSkill_module_1.AlexaSkillModule,
            config_1.ConfigModule.forRoot(),
            fieldtest_module_1.FieldtestModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService],
    })
], AppModule);
exports.AppModule = AppModule;
//# sourceMappingURL=app.module.js.map