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
exports.DevicesController = void 0;
const passport_1 = require("@nestjs/passport");
const roles_guard_1 = require("./../../../../middlewares/roles.guard");
const devices_service_1 = require("./devices.service");
const common_1 = require("@nestjs/common");
let DevicesController = class DevicesController {
    constructor(devicesService) {
        this.devicesService = devicesService;
    }
    async getApnCatalog() {
        return await this.devicesService.getApnCatalog();
    }
    async getCheckDeviceExist(body, req) {
        return await this.devicesService.getCheckDeviceExist(req.user, body);
    }
    async getWaterDeviceSettingsEndpoint(idDevice, req) {
        return await this.devicesService.getWaterDeviceSettings(req.user, idDevice);
    }
    async syncSettingsNewData(body, req) {
        return await this.devicesService.syncWaterSettingsNewData(req.user, body, true);
    }
    async syncSettingsCloudNewData(body, req) {
        return await this.devicesService.syncWaterSettingsNewData(req.user, body, false);
    }
    async getDeviceClientAddressSettings(idDevice, req) {
        return await this.devicesService.getDeviceTechnicianAddressSettings(req.user, idDevice);
    }
    async updateDeviceClientAddressSettings(body, req) {
        return await this.devicesService.updateDeviceTechnicianAddressSettings(req.user, body);
    }
    async updateDeviceOnOffSettingsNFCEndpoint(body, req) {
        return await this.devicesService.updateDeviceOnOffSettingsNFC(req.user, body);
    }
};
__decorate([
    common_1.Get('get-apn-catalog'),
    common_1.UseGuards(passport_1.AuthGuard(), roles_guard_1.RoleTechnicianGuard),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], DevicesController.prototype, "getApnCatalog", null);
__decorate([
    common_1.Post('get-device-by-serial-number'),
    common_1.UseGuards(passport_1.AuthGuard(), roles_guard_1.RoleTechnicianGuard),
    __param(0, common_1.Body()),
    __param(1, common_1.Req()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], DevicesController.prototype, "getCheckDeviceExist", null);
__decorate([
    common_1.Get('get-water-device-settings/:idDevice'),
    common_1.UseGuards(passport_1.AuthGuard(), roles_guard_1.RoleTechnicianGuard),
    __param(0, common_1.Param('idDevice')),
    __param(1, common_1.Req()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], DevicesController.prototype, "getWaterDeviceSettingsEndpoint", null);
__decorate([
    common_1.Post('update-device-water-settings-nfc'),
    common_1.UseGuards(passport_1.AuthGuard(), roles_guard_1.RoleTechnicianGuard),
    __param(0, common_1.Body()),
    __param(1, common_1.Req()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], DevicesController.prototype, "syncSettingsNewData", null);
__decorate([
    common_1.Post('update-device-water-settings-cloud'),
    common_1.UseGuards(passport_1.AuthGuard(), roles_guard_1.RoleTechnicianGuard),
    __param(0, common_1.Body()),
    __param(1, common_1.Req()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], DevicesController.prototype, "syncSettingsCloudNewData", null);
__decorate([
    common_1.Get('get-device-address-settings/:idDevice'),
    common_1.UseGuards(passport_1.AuthGuard(), roles_guard_1.RoleTechnicianGuard),
    __param(0, common_1.Param('idDevice')),
    __param(1, common_1.Req()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], DevicesController.prototype, "getDeviceClientAddressSettings", null);
__decorate([
    common_1.Post('update-device-address-settings'),
    common_1.UseGuards(passport_1.AuthGuard(), roles_guard_1.RoleTechnicianGuard),
    __param(0, common_1.Body()),
    __param(1, common_1.Req()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], DevicesController.prototype, "updateDeviceClientAddressSettings", null);
__decorate([
    common_1.Post('update-device-on-off-settings-nfc'),
    common_1.UseGuards(passport_1.AuthGuard(), roles_guard_1.RoleTechnicianGuard),
    __param(0, common_1.Body()),
    __param(1, common_1.Req()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], DevicesController.prototype, "updateDeviceOnOffSettingsNFCEndpoint", null);
DevicesController = __decorate([
    common_1.Controller('technician/devices'),
    __metadata("design:paramtypes", [devices_service_1.DevicesService])
], DevicesController);
exports.DevicesController = DevicesController;
//# sourceMappingURL=devices.controller.js.map