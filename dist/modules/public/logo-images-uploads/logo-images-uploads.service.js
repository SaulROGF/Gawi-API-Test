"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LogoImagesUploadsService = void 0;
const common_1 = require("@nestjs/common");
const ServerMessage_class_1 = require("../../../classes/ServerMessage.class");
let LogoImagesUploadsService = class LogoImagesUploadsService {
    constructor(organizationRepository) {
        this.organizationRepository = organizationRepository;
    }
    async downloadLogoFromOrganization(idOrganization) {
        try {
            let organization = await this.organizationRepository.findOne({
                where: {
                    idOrganization: idOrganization,
                }
            });
            return new ServerMessage_class_1.ServerMessage(false, "datos obtenidos correctamente", {
                filename: organization.logoUrl.replace("storage/logos/orgs/", ""),
                path: organization.logoUrl,
            });
        }
        catch (error) {
            return new ServerMessage_class_1.ServerMessage(true, "ha ocurrido un error", error);
        }
    }
    async compressImageLogoFile(logoFileName) {
        return new Promise(async (resolve, reject) => {
            if (logoFileName == undefined ||
                logoFileName == null) {
                resolve(new ServerMessage_class_1.ServerMessage(true, "Campos inválidos", {}));
            }
            try {
                let indexPoint = logoFileName.indexOf(".");
                let idOrganization = logoFileName.substr(0, indexPoint);
                let organizationForUpdate = await this.organizationRepository.findOne({
                    where: {
                        idOrganization: idOrganization
                    }
                });
                if (!organizationForUpdate) {
                    resolve(new ServerMessage_class_1.ServerMessage(true, "Organizacion no disponible", {}));
                }
                organizationForUpdate.logoUrl = 'logo-images-uploads/logo-organization-image/' + idOrganization;
                await organizationForUpdate.save();
                resolve(new ServerMessage_class_1.ServerMessage(false, "Logo actualizado", {}));
            }
            catch (error) {
                resolve(new ServerMessage_class_1.ServerMessage(true, "Error comprimiendo imagen", error));
            }
        });
    }
    async deleteBannerById(idAdsBanner) {
        return new Promise(async (resolve, reject) => {
        });
    }
};
LogoImagesUploadsService = __decorate([
    common_1.Injectable(),
    __param(0, common_1.Inject('OrganizationRepository')),
    __metadata("design:paramtypes", [Object])
], LogoImagesUploadsService);
exports.LogoImagesUploadsService = LogoImagesUploadsService;
//# sourceMappingURL=logo-images-uploads.service.js.map