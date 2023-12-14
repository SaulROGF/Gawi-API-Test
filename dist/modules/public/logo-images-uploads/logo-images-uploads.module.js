"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LogoImagesUploadsModule = void 0;
const global_services_module_1 = require("./../../global/global-services.module");
const database_module_1 = require("./../../../database/database.module");
const user_providers_1 = require("./../../../models/repositoriesModels/user.providers");
const common_1 = require("@nestjs/common");
const logo_images_uploads_controller_1 = require("./logo-images-uploads.controller");
const logo_images_uploads_service_1 = require("./logo-images-uploads.service");
const passport_1 = require("@nestjs/passport");
const organization_providers_1 = require("../../../models/repositoriesModels/organization.providers");
let LogoImagesUploadsModule = class LogoImagesUploadsModule {
};
LogoImagesUploadsModule = __decorate([
    common_1.Module({
        imports: [
            database_module_1.DatabaseModule,
            passport_1.PassportModule.register({ defaultStrategy: 'jwt', session: false }),
            global_services_module_1.GlobalServicesModule,
        ],
        exports: [logo_images_uploads_service_1.LogoImagesUploadsService],
        controllers: [logo_images_uploads_controller_1.LogoImagesUploadsController],
        providers: [
            logo_images_uploads_service_1.LogoImagesUploadsService,
            ...user_providers_1.userProviders,
            ...organization_providers_1.organizationProviders,
        ],
    })
], LogoImagesUploadsModule);
exports.LogoImagesUploadsModule = LogoImagesUploadsModule;
//# sourceMappingURL=logo-images-uploads.module.js.map