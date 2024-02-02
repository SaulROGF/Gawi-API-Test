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
exports.AdministratorController = void 0;
const common_1 = require("@nestjs/common");
const administrator_service_1 = require("./administrator.service");
const passport_1 = require("@nestjs/passport");
const roles_guard_1 = require("../../../../middlewares/roles.guard");
const platform_express_1 = require("@nestjs/platform-express");
const roles_guard_2 = require("../../../../middlewares/roles.guard");
const path = require("path");
const multer = require("multer");
const fs = require("fs");
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
ImgUtils.storageNewLogos = multer.diskStorage({
    destination: function (req, file, cb) {
        let storagePath = "./storage/logos/temp/";
        if (!fs.existsSync('./storage/'))
            fs.mkdirSync('./storage/');
        if (!fs.existsSync(storagePath))
            fs.mkdirSync(storagePath);
        cb(null, storagePath);
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});
ImgUtils.storageUpdateLogos = multer.diskStorage({
    destination: function (req, file, cb) {
        let indexDot = file.originalname.indexOf(".");
        let idOrganization = file.originalname.substr(0, indexDot);
        let storagePath = "./storage/logos/" + idOrganization + "/";
        if (!fs.existsSync('./storage/'))
            fs.mkdirSync('./storage/');
        if (!fs.existsSync(storagePath))
            fs.mkdirSync(storagePath);
        cb(null, storagePath);
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});
let AdministratorController = class AdministratorController {
    constructor(administratorService) {
        this.administratorService = administratorService;
    }
    getHomeAdminData(req) {
        return this.administratorService.getHomeAdminData();
    }
    getAllAccountUsersData(req) {
        return this.administratorService.getAllAccountUsersData();
    }
    getOrganizationClientsAdminData(req) {
        return this.administratorService.getOrganizationClientsAdminData(req.user.idOrganization);
    }
    getClientProfileData(req, idUser) {
        return this.administratorService.getClientProfileData(idUser, req.user.idOrganization, req.user.idRole);
    }
    getOrganizationTechnicianAdminData(req) {
        return this.administratorService.getOrganizationUsersAdminData(req.user.idOrganization, 6);
    }
    getOrganizationCountersAdminData(req) {
        return this.administratorService.getOrganizationUsersAdminData(req.user.idOrganization, 4);
    }
    getOrganizationWarehousesAdminData(req) {
        return this.administratorService.getOrganizationUsersAdminData(req.user.idOrganization, 3);
    }
    createUser(req, body) {
        return this.administratorService.createUser(req.user, body);
    }
    updateUser(req, body) {
        return this.administratorService.updateUser(req.user, body);
    }
    deleteUser(req, idUser) {
        return this.administratorService.deleteUser(req.user.idOrganization, idUser);
    }
    getAllDevicesList(req) {
        return this.administratorService.getAllDevicesList(req.user.idOrganization);
    }
    getAllOrganizationDevicesList(idOrganization) {
        return this.administratorService.getAllOrganizationDevicesList(idOrganization);
    }
    getAllHistoryNaturalGasDeviceData(body) {
        return this.administratorService.getAllHistoryNaturalGasDeviceData(body);
    }
    getAllHistoryWaterDeviceData(body) {
        return this.administratorService.getAllHistoryWaterDeviceData(body);
    }
    getAllHistoryGasDeviceData(body) {
        return this.administratorService.getAllHistoryGasDeviceData(body);
    }
    getAllHistoryLoggerDeviceData(body) {
        return this.administratorService.getAllHistoryLoggerDeviceData(body);
    }
    updateApnDeviceData(body) {
        return this.administratorService.updateApnDeviceData(body);
    }
    unlockDeviceToBeAssigned(body) {
        return this.administratorService.unlockDeviceToBeAssigned(body);
    }
    async getGasDeviceAlertsEndpoint(idDevice, period, req) {
        return await this.administratorService.getGasDeviceAlerts(req.user, idDevice, period);
    }
    async getWaterDeviceAlertsEndpoint(idDevice, period, req) {
        return await this.administratorService.getWaterDeviceAlerts(req.user, idDevice, period);
    }
    getOrganizationDataEndpoint(req) {
        return this.administratorService.getOrganizationsListData();
    }
    getOrganizationsData(req) {
        return this.administratorService.getOrganizationsData();
    }
    async deviceAssignments(body) {
        return await this.administratorService.deviceAssignments(body);
    }
    async getOrganizationAdminEndpoint(idOrganization) {
        return await this.administratorService.getOrganizationAdmin(idOrganization);
    }
    getOrganizationAdminChoicesEndpoint(choice) {
        return this.administratorService.getOrganizationAdminChoices(choice);
    }
    async createOrganizationEndpoint(logos, body) {
        return await this.administratorService.createOrganization(logos[0], body);
    }
    async updateOrganizationDataEndpoint(logos, body) {
        return await this.administratorService.updateOrganizationData(logos[0], body);
    }
    async deleteOrganizationEndpoint(idOrganization) {
        return await this.administratorService.deleteOrganization(idOrganization);
    }
};
__decorate([
    common_1.Get('get-home-admin'),
    common_1.UseGuards(passport_1.AuthGuard(), roles_guard_1.RoleAdminGuard),
    __param(0, common_1.Request()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AdministratorController.prototype, "getHomeAdminData", null);
__decorate([
    common_1.Get('get-all-account-users-data'),
    common_1.UseGuards(passport_1.AuthGuard(), roles_guard_2.RoleOrganizationAdminGuard),
    __param(0, common_1.Request()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AdministratorController.prototype, "getAllAccountUsersData", null);
__decorate([
    common_1.Get('get-clients-users-data'),
    common_1.UseGuards(passport_1.AuthGuard(), roles_guard_2.RoleOrganizationAdminGuard),
    __param(0, common_1.Request()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AdministratorController.prototype, "getOrganizationClientsAdminData", null);
__decorate([
    common_1.Get('get-client-profile-data/:idUser'),
    common_1.UseGuards(passport_1.AuthGuard(), roles_guard_2.RoleOrganizationAdminGuard),
    __param(0, common_1.Request()),
    __param(1, common_1.Param('idUser')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number]),
    __metadata("design:returntype", Promise)
], AdministratorController.prototype, "getClientProfileData", null);
__decorate([
    common_1.Get('get-technician-users-data'),
    common_1.UseGuards(passport_1.AuthGuard(), roles_guard_1.RoleAdminGuard),
    __param(0, common_1.Request()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AdministratorController.prototype, "getOrganizationTechnicianAdminData", null);
__decorate([
    common_1.Get('get-counters-users-data'),
    common_1.UseGuards(passport_1.AuthGuard(), roles_guard_1.RoleAdminGuard),
    __param(0, common_1.Request()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AdministratorController.prototype, "getOrganizationCountersAdminData", null);
__decorate([
    common_1.Get('get-warehouse-users-data'),
    common_1.UseGuards(passport_1.AuthGuard(), roles_guard_1.RoleAdminGuard),
    __param(0, common_1.Request()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AdministratorController.prototype, "getOrganizationWarehousesAdminData", null);
__decorate([
    common_1.Post('create-user'),
    common_1.UseGuards(passport_1.AuthGuard(), roles_guard_1.RoleAdminGuard),
    __param(0, common_1.Request()),
    __param(1, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], AdministratorController.prototype, "createUser", null);
__decorate([
    common_1.Post('update-user'),
    common_1.UseGuards(passport_1.AuthGuard(), roles_guard_1.RoleAdminGuard),
    __param(0, common_1.Request()),
    __param(1, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], AdministratorController.prototype, "updateUser", null);
__decorate([
    common_1.Get('delete-user/:idUser'),
    common_1.UseGuards(passport_1.AuthGuard(), roles_guard_1.RoleAdminGuard),
    __param(0, common_1.Request()),
    __param(1, common_1.Param('idUser')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number]),
    __metadata("design:returntype", Promise)
], AdministratorController.prototype, "deleteUser", null);
__decorate([
    common_1.Get('get-all-devices-list'),
    common_1.UseGuards(passport_1.AuthGuard(), roles_guard_1.RoleAdminGuard),
    __param(0, common_1.Request()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AdministratorController.prototype, "getAllDevicesList", null);
__decorate([
    common_1.Get('get-all-organization-devices-list/:idOrganization'),
    common_1.UseGuards(passport_1.AuthGuard(), roles_guard_2.RoleOrganizationAdminGuard),
    __param(0, common_1.Param('idOrganization')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], AdministratorController.prototype, "getAllOrganizationDevicesList", null);
__decorate([
    common_1.Post('get-all-history-natural-gas-device'),
    common_1.UseGuards(passport_1.AuthGuard(), roles_guard_1.RoleAdminGuard),
    __param(0, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AdministratorController.prototype, "getAllHistoryNaturalGasDeviceData", null);
__decorate([
    common_1.Post('get-all-history-water-device'),
    common_1.UseGuards(passport_1.AuthGuard(), roles_guard_1.RoleAdminGuard),
    __param(0, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AdministratorController.prototype, "getAllHistoryWaterDeviceData", null);
__decorate([
    common_1.Post('get-all-history-gas-device'),
    common_1.UseGuards(passport_1.AuthGuard(), roles_guard_2.RoleOrganizationAdminGuard),
    __param(0, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AdministratorController.prototype, "getAllHistoryGasDeviceData", null);
__decorate([
    common_1.Post('get-all-history-logger-device'),
    common_1.UseGuards(passport_1.AuthGuard(), roles_guard_2.RoleOrganizationAdminGuard),
    __param(0, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AdministratorController.prototype, "getAllHistoryLoggerDeviceData", null);
__decorate([
    common_1.Post('update-device-apn'),
    common_1.UseGuards(passport_1.AuthGuard(), roles_guard_1.RoleAdminGuard),
    __param(0, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AdministratorController.prototype, "updateApnDeviceData", null);
__decorate([
    common_1.Post('unlock-assigned-device'),
    common_1.UseGuards(passport_1.AuthGuard(), roles_guard_1.RoleAdminGuard),
    __param(0, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AdministratorController.prototype, "unlockDeviceToBeAssigned", null);
__decorate([
    common_1.Get('get-gas-device-alerts/:idDevice/:period'),
    common_1.UseGuards(passport_1.AuthGuard(), roles_guard_1.RoleAdminGuard),
    __param(0, common_1.Param('idDevice')),
    __param(1, common_1.Param('period')),
    __param(2, common_1.Req()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, Object]),
    __metadata("design:returntype", Promise)
], AdministratorController.prototype, "getGasDeviceAlertsEndpoint", null);
__decorate([
    common_1.Get('get-water-device-alerts/:idDevice/:period'),
    common_1.UseGuards(passport_1.AuthGuard(), roles_guard_1.RoleAdminGuard),
    __param(0, common_1.Param('idDevice')),
    __param(1, common_1.Param('period')),
    __param(2, common_1.Req()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, Object]),
    __metadata("design:returntype", Promise)
], AdministratorController.prototype, "getWaterDeviceAlertsEndpoint", null);
__decorate([
    common_1.Get('get-organizations-list-data/'),
    common_1.UseGuards(passport_1.AuthGuard(), roles_guard_1.RoleAdminGuard),
    __param(0, common_1.Request()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AdministratorController.prototype, "getOrganizationDataEndpoint", null);
__decorate([
    common_1.Get('get-organizations-data/'),
    common_1.UseGuards(passport_1.AuthGuard(), roles_guard_1.RoleAdminGuard),
    __param(0, common_1.Request()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AdministratorController.prototype, "getOrganizationsData", null);
__decorate([
    common_1.Post("manual-assignments"),
    common_1.UseGuards(passport_1.AuthGuard(), roles_guard_1.RoleAdminGuard),
    __param(0, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AdministratorController.prototype, "deviceAssignments", null);
__decorate([
    common_1.Get('get-organization-admin/:idOrganization'),
    common_1.UseGuards(passport_1.AuthGuard(), roles_guard_1.RoleAdminGuard),
    __param(0, common_1.Param('idOrganization')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], AdministratorController.prototype, "getOrganizationAdminEndpoint", null);
__decorate([
    common_1.Get('get-organization-admin-choices/:choice'),
    common_1.UseGuards(passport_1.AuthGuard(), roles_guard_1.RoleAdminGuard),
    __param(0, common_1.Param('choice')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdministratorController.prototype, "getOrganizationAdminChoicesEndpoint", null);
__decorate([
    common_1.Post('create-organization/'),
    common_1.UseGuards(passport_1.AuthGuard(), roles_guard_1.RoleAdminGuard),
    common_1.UseInterceptors(platform_express_1.FilesInterceptor("logo", 1, { fileFilter: ImgUtils.pngFileFilter, storage: ImgUtils.storageNewLogos })),
    __param(0, common_1.UploadedFiles()),
    __param(1, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AdministratorController.prototype, "createOrganizationEndpoint", null);
__decorate([
    common_1.Post('update-organization-data/'),
    common_1.UseGuards(passport_1.AuthGuard(), roles_guard_1.RoleAdminGuard),
    common_1.UseInterceptors(platform_express_1.FilesInterceptor("logo", 1, { fileFilter: ImgUtils.pngFileFilter, storage: ImgUtils.storageUpdateLogos })),
    __param(0, common_1.UploadedFiles()),
    __param(1, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AdministratorController.prototype, "updateOrganizationDataEndpoint", null);
__decorate([
    common_1.Get('delete-organization/:idOrganization'),
    common_1.UseGuards(passport_1.AuthGuard(), roles_guard_1.RoleAdminGuard),
    __param(0, common_1.Param('idOrganization')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], AdministratorController.prototype, "deleteOrganizationEndpoint", null);
AdministratorController = __decorate([
    common_1.Controller('administrator'),
    __metadata("design:paramtypes", [administrator_service_1.AdministratorService])
], AdministratorController);
exports.AdministratorController = AdministratorController;
//# sourceMappingURL=administrator.controller.js.map