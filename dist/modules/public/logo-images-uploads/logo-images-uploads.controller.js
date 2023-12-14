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
exports.LogoImagesUploadsController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const path = require("path");
const multer = require("multer");
const fs = require("fs");
const ServerMessage_class_1 = require("./../../../classes/ServerMessage.class");
const passport_1 = require("@nestjs/passport");
const logo_images_uploads_service_1 = require("./logo-images-uploads.service");
const roles_guard_1 = require("./../../../middlewares/roles.guard");
class ImgUtils {
}
ImgUtils.pngFileFilter = (req, file, callback) => {
    let ext = path.extname(file.originalname);
    if (ext !== '.png') {
        req.fileValidationError = 'Invalid file type';
        return callback(new Error('Invalid file type'), false);
    }
    return callback(null, true);
};
ImgUtils.storageLogos = multer.diskStorage({
    destination: function (req, file, cb) {
        let storagePath = "./storage/logos/";
        if (!fs.existsSync('./storage/'))
            fs.mkdirSync('./storage/');
        if (!fs.existsSync(storagePath))
            fs.mkdirSync(storagePath);
        if (!fs.existsSync(storagePath + req.user.dataValues.idOrganization + '/'))
            fs.mkdirSync(storagePath + req.user.dataValues.idOrganization + '/');
        cb(null, storagePath + req.user.dataValues.idOrganization + '/');
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});
let LogoImagesUploadsController = class LogoImagesUploadsController {
    constructor(logoImagesUploadsService) {
        this.logoImagesUploadsService = logoImagesUploadsService;
    }
    async addLogoImageFileUpload(images, req) {
        return await this.logoImagesUploadsService.compressImageLogoFile(images[0].originalname);
    }
    async serveLogoOrganizationImage(idOrganization, res) {
        try {
            res.sendFile(idOrganization + '.png', { root: 'storage/logos/' + idOrganization + '/' }, (err) => {
                if (err) {
                    return new ServerMessage_class_1.ServerMessage(true, "Imagen slider " + idOrganization + " no encontrada.", err);
                }
                else {
                    return new ServerMessage_class_1.ServerMessage(false, "Imagen slider " + idOrganization + " enviada.", {});
                }
            });
        }
        catch (error) {
            return new ServerMessage_class_1.ServerMessage(true, "Imagen slider " + idOrganization + " no encontrada.", error);
        }
    }
};
__decorate([
    common_1.Post('add-logo-image-file'),
    common_1.UseGuards(passport_1.AuthGuard(), roles_guard_1.RoleOrganizationAdminGuard),
    common_1.UseInterceptors(platform_express_1.FilesInterceptor("files[]", 1, { fileFilter: ImgUtils.pngFileFilter, storage: ImgUtils.storageLogos })),
    __param(0, common_1.UploadedFiles()),
    __param(1, common_1.Req()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], LogoImagesUploadsController.prototype, "addLogoImageFileUpload", null);
__decorate([
    common_1.Get('logo-organization-image/:idOrganization'),
    __param(0, common_1.Param('idOrganization')),
    __param(1, common_1.Res()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], LogoImagesUploadsController.prototype, "serveLogoOrganizationImage", null);
LogoImagesUploadsController = __decorate([
    common_1.Controller('logo-images-uploads'),
    __metadata("design:paramtypes", [logo_images_uploads_service_1.LogoImagesUploadsService])
], LogoImagesUploadsController);
exports.LogoImagesUploadsController = LogoImagesUploadsController;
//# sourceMappingURL=logo-images-uploads.controller.js.map