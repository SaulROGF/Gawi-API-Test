"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GlobalServicesModule = void 0;
const common_1 = require("@nestjs/common");
const database_module_1 = require("../../database/database.module");
const factur_api_service_1 = require("./factur-api/factur-api.service");
const geo_location_service_1 = require("./geo-location/geo-location.service");
const conekta_service_service_1 = require("./conekta-service/conekta-service.service");
const emails_service_1 = require("./emails/emails.service");
const user_providers_1 = require("../../models/repositoriesModels/user.providers");
const town_providers_1 = require("../../models/repositoriesModels/town.providers");
const billingInformation_providers_1 = require("../../models/repositoriesModels/billingInformation.providers");
const dashboard_calibration_gateway_1 = require("./live-data/dashboard-calibration.gateway");
const push_notifications_service_1 = require("./push-notifications/push-notifications.service");
const notifications_entity_1 = require("./../../models/notifications.entity");
let GlobalServicesModule = class GlobalServicesModule {
};
GlobalServicesModule = __decorate([
    common_1.Module({
        imports: [database_module_1.DatabaseModule],
        exports: [
            geo_location_service_1.GeoLocationService,
            conekta_service_service_1.ConektaService,
            factur_api_service_1.FacturApiService,
            emails_service_1.EmailsService,
            dashboard_calibration_gateway_1.DashboardCalibrationGateway,
        ],
        controllers: [],
        providers: [
            conekta_service_service_1.ConektaService,
            factur_api_service_1.FacturApiService,
            geo_location_service_1.GeoLocationService,
            emails_service_1.EmailsService,
            dashboard_calibration_gateway_1.DashboardCalibrationGateway,
            push_notifications_service_1.PushNotificationsService,
            ...user_providers_1.userProviders,
            ...town_providers_1.townProviders,
            ...billingInformation_providers_1.billingInformationProviders,
            ...notifications_entity_1.notificationProviders,
        ],
    })
], GlobalServicesModule);
exports.GlobalServicesModule = GlobalServicesModule;
//# sourceMappingURL=global-services.module.js.map