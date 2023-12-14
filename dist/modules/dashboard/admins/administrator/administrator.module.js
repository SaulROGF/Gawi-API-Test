"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdministratorModule = void 0;
const organization_providers_1 = require("./../../../../models/repositoriesModels/organization.providers");
const devices_module_1 = require("./../../clients/devices/devices.module");
const state_providers_1 = require("./../../../../models/repositoriesModels/state.providers");
const user_providers_1 = require("./../../../../models/repositoriesModels/user.providers");
const passport_1 = require("@nestjs/passport");
const database_module_1 = require("./../../../../database/database.module");
const common_1 = require("@nestjs/common");
const administrator_service_1 = require("./administrator.service");
const administrator_controller_1 = require("./administrator.controller");
const device_providers_1 = require("../../../../models/repositoriesModels/device.providers");
const waterHistory_providers_1 = require("../../../../models/repositoriesModels/waterHistory.providers");
const gasHistory_providers_1 = require("../../../../models/repositoriesModels/gasHistory.providers");
const apn_entity_1 = require("../../../../models/apn.entity");
const global_services_module_1 = require("../../../..//modules/global/global-services.module");
const dataloggerHistory_providers_1 = require("../../../../models/repositoriesModels/dataloggerHistory.providers");
const naturalGasHistory_providers_1 = require("../../../../models/repositoriesModels/naturalGasHistory.providers");
let AdministratorModule = class AdministratorModule {
};
AdministratorModule = __decorate([
    common_1.Module({
        imports: [
            database_module_1.DatabaseModule,
            passport_1.PassportModule.register({
                defaultStrategy: 'jwt',
                session: false
            }),
            devices_module_1.DevicesModule,
            global_services_module_1.GlobalServicesModule,
        ],
        exports: [administrator_service_1.AdministratorService],
        controllers: [administrator_controller_1.AdministratorController],
        providers: [
            administrator_service_1.AdministratorService,
            ...user_providers_1.userProviders,
            ...organization_providers_1.organizationProviders,
            ...state_providers_1.stateProviders,
            ...device_providers_1.deviceProviders,
            ...waterHistory_providers_1.waterHistoryProviders,
            ...gasHistory_providers_1.gasHistoryProviders,
            ...apn_entity_1.apnProviders,
            ...dataloggerHistory_providers_1.dataloggerHistoryProviders,
            ...naturalGasHistory_providers_1.naturalGasHistoryProviders,
        ]
    })
], AdministratorModule);
exports.AdministratorModule = AdministratorModule;
//# sourceMappingURL=administrator.module.js.map