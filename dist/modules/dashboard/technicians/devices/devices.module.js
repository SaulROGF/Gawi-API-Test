"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DevicesModule = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const database_module_1 = require("../../../../database/database.module");
const apn_entity_1 = require("../../../../models/apn.entity");
const device_providers_1 = require("../../../../models/repositoriesModels/device.providers");
const gasHistory_providers_1 = require("../../../../models/repositoriesModels/gasHistory.providers");
const gasSettings_providers_1 = require("../../../../models/repositoriesModels/gasSettings.providers");
const state_providers_1 = require("../../../../models/repositoriesModels/state.providers");
const town_providers_1 = require("../../../../models/repositoriesModels/town.providers");
const user_providers_1 = require("../../../../models/repositoriesModels/user.providers");
const waterHistory_providers_1 = require("../../../../models/repositoriesModels/waterHistory.providers");
const waterSettings_providers_1 = require("../../../../models/repositoriesModels/waterSettings.providers");
const devices_controller_1 = require("./devices.controller");
const devices_service_1 = require("./devices.service");
const gas_natural_module_1 = require("./gas-natural/gas-natural.module");
let DevicesModule = class DevicesModule {
};
DevicesModule = __decorate([
    common_1.Module({
        imports: [
            database_module_1.DatabaseModule,
            passport_1.PassportModule.register({
                defaultStrategy: 'jwt',
                session: false,
            }),
            gas_natural_module_1.GasNaturalModule,
        ],
        exports: [devices_service_1.DevicesService],
        controllers: [devices_controller_1.DevicesController],
        providers: [
            devices_service_1.DevicesService,
            ...town_providers_1.townProviders,
            ...state_providers_1.stateProviders,
            ...user_providers_1.userProviders,
            ...device_providers_1.deviceProviders,
            ...waterSettings_providers_1.waterSettingsProviders,
            ...gasSettings_providers_1.gasSettingsProviders,
            ...waterHistory_providers_1.waterHistoryProviders,
            ...gasHistory_providers_1.gasHistoryProviders,
            ...state_providers_1.stateProviders,
            ...apn_entity_1.apnProviders,
        ],
    })
], DevicesModule);
exports.DevicesModule = DevicesModule;
//# sourceMappingURL=devices.module.js.map