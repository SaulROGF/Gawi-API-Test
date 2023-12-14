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
const devices_service_1 = require("./devices.service");
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const roles_guard_1 = require("../../../../middlewares/roles.guard");
let DevicesController = class DevicesController {
    constructor(devicesService) {
        this.devicesService = devicesService;
    }
    loadHomeDataWarehouse(req) {
        return this.devicesService.loadHomeDataWarehouse(req.user);
    }
    async getApnList() {
        return await this.devicesService.getApnList();
    }
    createWaterDevice(req, body) {
        return this.devicesService.createDevice(req.user, body);
    }
    createMultipleDevices(req, body) {
        return this.devicesService.createMultipleDevices(req.user, body);
    }
    checkAlreadyDevice(body) {
        return this.devicesService.checkAlreadyDevice(body);
    }
};
__decorate([
    common_1.Get('get-home-data'),
    common_1.UseGuards(passport_1.AuthGuard(), roles_guard_1.RoleWarehouseGuard),
    __param(0, common_1.Request()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], DevicesController.prototype, "loadHomeDataWarehouse", null);
__decorate([
    common_1.Get('get-apn-list'),
    common_1.UseGuards(passport_1.AuthGuard(), roles_guard_1.RoleWarehouseGuard),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], DevicesController.prototype, "getApnList", null);
__decorate([
    common_1.Post('create-device'),
    common_1.UseGuards(passport_1.AuthGuard(), roles_guard_1.RoleWarehouseGuard),
    __param(0, common_1.Request()),
    __param(1, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], DevicesController.prototype, "createWaterDevice", null);
__decorate([
    common_1.Post('create-multiple-devices'),
    common_1.UseGuards(passport_1.AuthGuard(), roles_guard_1.RoleWarehouseGuard),
    __param(0, common_1.Request()),
    __param(1, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], DevicesController.prototype, "createMultipleDevices", null);
__decorate([
    common_1.Post('check-already-device'),
    common_1.UseGuards(passport_1.AuthGuard(), roles_guard_1.RoleWarehouseGuard),
    __param(0, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], DevicesController.prototype, "checkAlreadyDevice", null);
DevicesController = __decorate([
    common_1.Controller('wharehouse-devices-admin'),
    __metadata("design:paramtypes", [devices_service_1.DevicesService])
], DevicesController);
exports.DevicesController = DevicesController;
//# sourceMappingURL=devices.controller.js.map