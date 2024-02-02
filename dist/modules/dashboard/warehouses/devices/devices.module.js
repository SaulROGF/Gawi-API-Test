"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DevicesModule = void 0;
const device_providers_1 = require("./../../../../models/repositoriesModels/device.providers");
const common_1 = require("@nestjs/common");
const devices_controller_1 = require("./devices.controller");
const devices_service_1 = require("./devices.service");
const database_module_1 = require("../../../../database/database.module");
const passport_1 = require("@nestjs/passport");
const waterSettings_providers_1 = require("../../../../models/repositoriesModels/waterSettings.providers");
const gasSettings_providers_1 = require("../../../../models/repositoriesModels/gasSettings.providers");
const apn_entity_1 = require("../../../../models/apn.entity");
const dataloggerSettings_providers_1 = require("../../../../models/repositoriesModels/dataloggerSettings.providers");
const naturalGasSettings_providers_1 = require("../../../../models/repositoriesModels/naturalGasSettings.providers");
let DevicesModule = class DevicesModule {
};
DevicesModule = __decorate([
    common_1.Module({
        imports: [
            database_module_1.DatabaseModule,
            passport_1.PassportModule.register({ defaultStrategy: 'jwt', session: false })
        ],
        exports: [devices_service_1.DevicesService],
        controllers: [devices_controller_1.DevicesController],
        providers: [
            devices_service_1.DevicesService,
            ...device_providers_1.deviceProviders,
            ...waterSettings_providers_1.waterSettingsProviders,
            ...gasSettings_providers_1.gasSettingsProviders,
            ...apn_entity_1.apnProviders,
            ...dataloggerSettings_providers_1.dataloggerSettingsProviders,
            ...naturalGasSettings_providers_1.naturalGasSettingsProviders,
        ]
    })
], DevicesModule);
exports.DevicesModule = DevicesModule;
//# sourceMappingURL=devices.module.js.map