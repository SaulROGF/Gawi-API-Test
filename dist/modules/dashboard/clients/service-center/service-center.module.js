"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServiceCenterModule = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const database_module_1 = require("./../../../../database/database.module");
const service_center_controller_1 = require("./service-center.controller");
const service_center_service_1 = require("./service-center.service");
const user_providers_1 = require("../../../../models/repositoriesModels/user.providers");
const device_providers_1 = require("./../../../../models/repositoriesModels/device.providers");
const organization_providers_1 = require("./../../../../models/repositoriesModels/organization.providers");
let ServiceCenterModule = class ServiceCenterModule {
};
ServiceCenterModule = __decorate([
    common_1.Module({
        imports: [
            database_module_1.DatabaseModule,
            passport_1.PassportModule.register({
                defaultStrategy: 'jwt',
                session: false,
            }),
        ],
        exports: [service_center_service_1.ServiceCenterService],
        controllers: [service_center_controller_1.ServiceCenterController],
        providers: [
            service_center_service_1.ServiceCenterService,
            ...user_providers_1.userProviders,
            ...device_providers_1.deviceProviders,
            ...organization_providers_1.organizationProviders,
        ]
    })
], ServiceCenterModule);
exports.ServiceCenterModule = ServiceCenterModule;
//# sourceMappingURL=service-center.module.js.map