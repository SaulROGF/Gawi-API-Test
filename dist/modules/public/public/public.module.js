"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PublicModule = void 0;
const auth_module_1 = require("./../auth/auth.module");
const common_1 = require("@nestjs/common");
const public_controller_1 = require("./public.controller");
const public_service_1 = require("./public.service");
const database_module_1 = require("../../../database/database.module");
const global_services_module_1 = require("../../global/global-services.module");
const user_providers_1 = require("./../../../models/repositoriesModels/user.providers");
const passport_1 = require("@nestjs/passport");
const jwt_1 = require("@nestjs/jwt");
let PublicModule = class PublicModule {
};
PublicModule = __decorate([
    common_1.Module({
        imports: [
            database_module_1.DatabaseModule,
            global_services_module_1.GlobalServicesModule,
            auth_module_1.AuthModule,
            passport_1.PassportModule.register({ defaultStrategy: 'jwt', session: false }),
            jwt_1.JwtModule.register({
                secretOrPrivateKey: 'ingMultiKey',
                signOptions: {
                    expiresIn: 15 * 60
                }
            }),
        ],
        controllers: [public_controller_1.PublicController],
        providers: [
            public_service_1.PublicService,
            ...user_providers_1.userProviders,
        ],
    })
], PublicModule);
exports.PublicModule = PublicModule;
//# sourceMappingURL=public.module.js.map