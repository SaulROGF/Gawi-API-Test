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
const devices_controller_1 = require("./devices.controller");
const devices_service_1 = require("./devices.service");
const passport_1 = require("@nestjs/passport");
const jwt_1 = require("@nestjs/jwt");
const device_providers_1 = require("./../../../../models/repositoriesModels/device.providers");
const waterHistory_providers_1 = require("./../../../../models/repositoriesModels/waterHistory.providers");
const waterSettings_providers_1 = require("./../../../../models/repositoriesModels/waterSettings.providers");
const gasHistory_providers_1 = require("./../../../../models/repositoriesModels/gasHistory.providers");
const gasSettings_providers_1 = require("./../../../../models/repositoriesModels/gasSettings.providers");
const dataloggerHistory_providers_1 = require("../../../../models/repositoriesModels/dataloggerHistory.providers");
const dataloggerSettings_providers_1 = require("../../../../models/repositoriesModels/dataloggerSettings.providers");
const naturalGasHistory_providers_1 = require("../../../../models/repositoriesModels/naturalGasHistory.providers");
const town_providers_1 = require("./../../../../models/repositoriesModels/town.providers");
const global_services_module_1 = require("./../../../../modules/global/global-services.module");
const notifications_entity_1 = require("../../../../models/notifications.entity");
const apn_entity_1 = require("../../../../models/apn.entity");
const push_notifications_service_1 = require("../../../global/push-notifications/push-notifications.service");
let DevicesModule = class DevicesModule {
};
DevicesModule = __decorate([
    common_1.Module({
        imports: [
            global_services_module_1.GlobalServicesModule,
            passport_1.PassportModule.register({ defaultStrategy: 'jwt', session: false }),
            jwt_1.JwtModule.register({
                secretOrPrivateKey: 'ingMultiKey',
                signOptions: {
                    expiresIn: 2 * 365 * 24 * 60 * 60
                }
            }),
        ],
        controllers: [devices_controller_1.DevicesController],
        providers: [
            devices_service_1.DevicesService,
            push_notifications_service_1.PushNotificationsService,
            ...device_providers_1.deviceProviders,
            ...waterHistory_providers_1.waterHistoryProviders,
            ...waterSettings_providers_1.waterSettingsProviders,
            ...gasHistory_providers_1.gasHistoryProviders,
            ...gasSettings_providers_1.gasSettingsProviders,
            ...dataloggerHistory_providers_1.dataloggerHistoryProviders,
            ...dataloggerSettings_providers_1.dataloggerSettingsProviders,
            ...naturalGasHistory_providers_1.naturalGasHistoryProviders,
            ...town_providers_1.townProviders,
            ...apn_entity_1.apnProviders,
            ...notifications_entity_1.notificationProviders,
        ],
        exports: [
            devices_service_1.DevicesService,
        ]
    })
], DevicesModule);
exports.DevicesModule = DevicesModule;
//# sourceMappingURL=devices.module.js.map