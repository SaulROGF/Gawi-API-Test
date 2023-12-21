"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrganizationDataModule = void 0;
const common_1 = require("@nestjs/common");
const organization_data_controller_1 = require("./organization-data.controller");
const organization_data_service_1 = require("./organization-data.service");
const database_module_1 = require("./../../../../database/database.module");
const passport_1 = require("@nestjs/passport");
const organization_providers_1 = require("./../../../../models/repositoriesModels/organization.providers");
const user_providers_1 = require("./../../../../models/repositoriesModels/user.providers");
let OrganizationDataModule = class OrganizationDataModule {
};
OrganizationDataModule = __decorate([
    common_1.Module({
        imports: [
            database_module_1.DatabaseModule,
            passport_1.PassportModule.register({
                defaultStrategy: 'jwt',
                session: false,
            }),
        ],
        controllers: [organization_data_controller_1.OrganizationDataController],
        providers: [
            organization_data_service_1.OrganizationDataService,
            ...organization_providers_1.organizationProviders,
            ...user_providers_1.userProviders,
        ],
    })
], OrganizationDataModule);
exports.OrganizationDataModule = OrganizationDataModule;
//# sourceMappingURL=organization-data.module.js.map