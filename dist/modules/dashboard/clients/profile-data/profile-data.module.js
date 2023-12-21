"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProfileDataClientModule = void 0;
const common_1 = require("@nestjs/common");
const profile_data_controller_1 = require("./profile-data.controller");
const profile_data_service_1 = require("./profile-data.service");
const database_module_1 = require("./../../../../database/database.module");
const passport_1 = require("@nestjs/passport");
const global_services_module_1 = require("../../../global/global-services.module");
const state_providers_1 = require("./../../../../models/repositoriesModels/state.providers");
const town_providers_1 = require("./../../../../models/repositoriesModels/town.providers");
const user_providers_1 = require("../../../../models/repositoriesModels/user.providers");
const billingInformation_providers_1 = require("./../../../../models/repositoriesModels/billingInformation.providers");
const cards_providers_1 = require("./../../../../models/repositoriesModels/cards.providers");
const historyPayments_providers_1 = require("../../../../models/repositoriesModels/historyPayments.providers");
let ProfileDataClientModule = class ProfileDataClientModule {
};
ProfileDataClientModule = __decorate([
    common_1.Module({
        imports: [
            database_module_1.DatabaseModule,
            global_services_module_1.GlobalServicesModule,
            passport_1.PassportModule.register({
                defaultStrategy: 'jwt',
                session: false,
            }),
        ],
        exports: [profile_data_service_1.ProfileDataService],
        controllers: [profile_data_controller_1.ProfileDataController],
        providers: [
            profile_data_service_1.ProfileDataService,
            ...town_providers_1.townProviders,
            ...state_providers_1.stateProviders,
            ...user_providers_1.userProviders,
            ...billingInformation_providers_1.billingInformationProviders,
            ...historyPayments_providers_1.historyPaymentsProviders,
            ...cards_providers_1.cardProviders,
        ],
    })
], ProfileDataClientModule);
exports.ProfileDataClientModule = ProfileDataClientModule;
//# sourceMappingURL=profile-data.module.js.map