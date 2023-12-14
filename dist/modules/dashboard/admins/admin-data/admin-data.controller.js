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
exports.AdminDataController = void 0;
const common_1 = require("@nestjs/common");
const admin_data_service_1 = require("./admin-data.service");
const passport_1 = require("@nestjs/passport");
const roles_guard_1 = require("./../../../../middlewares/roles.guard");
let AdminDataController = class AdminDataController {
    constructor(adminDataService) {
        this.adminDataService = adminDataService;
    }
    async getAdminAccountData(req) {
        return await this.adminDataService.getAdminAccountData(req.user);
    }
    async updateAdminAccountData(req, body) {
        return await this.adminDataService.updateAdminAccountData(req.user, body);
    }
    async getApnList(req) {
        return await this.adminDataService.getApnList(req.user.idOrganization);
    }
    async createNewApn(req, body) {
        return await this.adminDataService.createNewApn(body);
    }
    async updateAPNAdmin(req, body) {
        return await this.adminDataService.updateAPNAdmin(body);
    }
    async deleteAPNAdmin(req, body) {
        return await this.adminDataService.deleteAPNAdmin(body);
    }
};
__decorate([
    common_1.Get('get-admin-settings-data'),
    common_1.UseGuards(passport_1.AuthGuard(), roles_guard_1.RoleAdminGuard),
    __param(0, common_1.Req()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AdminDataController.prototype, "getAdminAccountData", null);
__decorate([
    common_1.Post('update-admin-profile-data'),
    common_1.UseGuards(passport_1.AuthGuard(), roles_guard_1.RoleAdminGuard),
    __param(0, common_1.Req()),
    __param(1, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AdminDataController.prototype, "updateAdminAccountData", null);
__decorate([
    common_1.Get('get-apn-list'),
    common_1.UseGuards(passport_1.AuthGuard(), roles_guard_1.RoleAdminGuard),
    __param(0, common_1.Req()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AdminDataController.prototype, "getApnList", null);
__decorate([
    common_1.Post('create-new-apn'),
    common_1.UseGuards(passport_1.AuthGuard(), roles_guard_1.RoleAdminGuard),
    __param(0, common_1.Req()),
    __param(1, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AdminDataController.prototype, "createNewApn", null);
__decorate([
    common_1.Post('update-apn'),
    common_1.UseGuards(passport_1.AuthGuard(), roles_guard_1.RoleAdminGuard),
    __param(0, common_1.Req()),
    __param(1, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AdminDataController.prototype, "updateAPNAdmin", null);
__decorate([
    common_1.Post('delete-apn'),
    common_1.UseGuards(passport_1.AuthGuard(), roles_guard_1.RoleAdminGuard),
    __param(0, common_1.Req()),
    __param(1, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AdminDataController.prototype, "deleteAPNAdmin", null);
AdminDataController = __decorate([
    common_1.Controller('administrator/admin-data'),
    __metadata("design:paramtypes", [admin_data_service_1.AdminDataService])
], AdminDataController);
exports.AdminDataController = AdminDataController;
//# sourceMappingURL=admin-data.controller.js.map