"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminDataModule = void 0;
const common_1 = require("@nestjs/common");
const admin_data_controller_1 = require("./admin-data.controller");
const admin_data_service_1 = require("./admin-data.service");
const database_module_1 = require("./../../../../database/database.module");
const passport_1 = require("@nestjs/passport");
const user_providers_1 = require("./../../../../models/repositoriesModels/user.providers");
const state_providers_1 = require("./../../../../models/repositoriesModels/state.providers");
const apn_entity_1 = require("../../../../models/apn.entity");
const device_providers_1 = require("../../../../models/repositoriesModels/device.providers");
let AdminDataModule = class AdminDataModule {
};
AdminDataModule = __decorate([
    common_1.Module({
        imports: [
            database_module_1.DatabaseModule,
            passport_1.PassportModule.register({
                defaultStrategy: 'jwt',
                session: false
            }),
        ],
        controllers: [admin_data_controller_1.AdminDataController],
        providers: [
            admin_data_service_1.AdminDataService,
            ...user_providers_1.userProviders,
            ...state_providers_1.stateProviders,
            ...apn_entity_1.apnProviders,
            ...device_providers_1.deviceProviders,
        ],
    })
], AdminDataModule);
exports.AdminDataModule = AdminDataModule;
//# sourceMappingURL=admin-data.module.js.map