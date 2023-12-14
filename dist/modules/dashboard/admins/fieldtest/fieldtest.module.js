"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FieldtestModule = void 0;
const common_1 = require("@nestjs/common");
const fieldtest_controller_1 = require("./fieldtest.controller");
const fieldtest_service_1 = require("./fieldtest.service");
const passport_1 = require("@nestjs/passport");
const device_providers_1 = require("../../../../models/repositoriesModels/device.providers");
const waterHistory_providers_1 = require("../../../../models/repositoriesModels/waterHistory.providers");
const waterSettings_providers_1 = require("../../../../models/repositoriesModels/waterSettings.providers");
const database_module_1 = require("../../../../database/database.module");
const fieldDevice_providers_1 = require("../../../../models/repositoriesModels/fieldDevice.providers");
let FieldtestModule = class FieldtestModule {
};
FieldtestModule = __decorate([
    common_1.Module({
        imports: [
            passport_1.PassportModule.register({
                defaultStrategy: 'jwt',
                session: false
            }),
            database_module_1.DatabaseModule
        ],
        controllers: [fieldtest_controller_1.FieldtestController],
        providers: [
            fieldtest_service_1.FieldtestService,
            ...device_providers_1.deviceProviders,
            ...waterHistory_providers_1.waterHistoryProviders,
            ...waterSettings_providers_1.waterSettingsProviders,
            ...fieldDevice_providers_1.fieldDeviceProvider
        ]
    })
], FieldtestModule);
exports.FieldtestModule = FieldtestModule;
//# sourceMappingURL=fieldtest.module.js.map