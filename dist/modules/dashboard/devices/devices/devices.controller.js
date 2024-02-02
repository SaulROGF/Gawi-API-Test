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
const common_1 = require("@nestjs/common");
const devices_service_1 = require("./devices.service");
const jwt_1 = require("@nestjs/jwt");
let DevicesController = class DevicesController {
    constructor(devicesService, jwtService) {
        this.devicesService = devicesService;
        this.jwtService = jwtService;
    }
    async saveGasMeasuresEndpoint(body) {
        return this.devicesService.saveNaturalGasMeasures(body);
    }
    async markNaturalGasSettingsAsAppliedEndpoint(body) {
        return this.devicesService.markNaturalGasSettingsAsApplied(body);
    }
    async loginEndpoint(body) {
        return await this.devicesService.login(body);
    }
    async saveWaterDeviceDataEndpoint(body) {
        return this.devicesService.saveWaterDeviceData(body);
    }
    async markWaterDeviceSettingsAsAppliedEndpoint(body) {
        return this.devicesService.markWaterDeviceSettingsAsApplied(body);
    }
    async markGasSettingsAsAppliedEndpoint(serialNumber) {
        return await this.devicesService.markGasSettingsAsApplied(serialNumber);
    }
    async saveGasDeviceDataEndpoint(deviceDate, deviceTime, imei, serialNumber, measure, consumption, meanConsumption, alerts, bateryLevel, temperature, signalQuality) {
        return await this.devicesService.saveGasDeviceData(deviceDate, deviceTime, imei, serialNumber, measure, consumption, meanConsumption, alerts, bateryLevel, temperature, signalQuality);
    }
    async postSaveGasDeviceDataEndpoint(body) {
        return await this.devicesService.saveGasDeviceData(body.A, body.B, body.C, body.D, body.E, body.F, body.G, body.H, body.I, body.J, body.K);
    }
    async saveDataloggerMeasuresEndpoint(body) {
        return this.devicesService.saveDataloggerMeasures(body);
    }
    async serveByFTPEndpoint(idOrganization) {
        return await this.devicesService.serverByFTP(idOrganization);
    }
};
__decorate([
    common_1.Post('ng-save'),
    __param(0, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], DevicesController.prototype, "saveGasMeasuresEndpoint", null);
__decorate([
    common_1.Post('ng-mark'),
    __param(0, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], DevicesController.prototype, "markNaturalGasSettingsAsAppliedEndpoint", null);
__decorate([
    common_1.Post('login/'),
    __param(0, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], DevicesController.prototype, "loginEndpoint", null);
__decorate([
    common_1.Post('wd-save'),
    __param(0, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], DevicesController.prototype, "saveWaterDeviceDataEndpoint", null);
__decorate([
    common_1.Post('wd-mark'),
    __param(0, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], DevicesController.prototype, "markWaterDeviceSettingsAsAppliedEndpoint", null);
__decorate([
    common_1.Get('gd-mark/A=:A'),
    __param(0, common_1.Param('A')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], DevicesController.prototype, "markGasSettingsAsAppliedEndpoint", null);
__decorate([
    common_1.Get('gd-save/A=:A&B=:B&C=:C&D=:D&E=:E&F=:F&G=:G&H=:H&I=:I&J=:J&K=:K'),
    __param(0, common_1.Param('A')),
    __param(1, common_1.Param('B')),
    __param(2, common_1.Param('C')),
    __param(3, common_1.Param('D')),
    __param(4, common_1.Param('E')),
    __param(5, common_1.Param('F')),
    __param(6, common_1.Param('G')),
    __param(7, common_1.Param('H')),
    __param(8, common_1.Param('I')),
    __param(9, common_1.Param('J')),
    __param(10, common_1.Param('K')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, String, String, String, String, String, String, String]),
    __metadata("design:returntype", Promise)
], DevicesController.prototype, "saveGasDeviceDataEndpoint", null);
__decorate([
    common_1.Post('gd-save'),
    __param(0, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], DevicesController.prototype, "postSaveGasDeviceDataEndpoint", null);
__decorate([
    common_1.Post('dl-save'),
    __param(0, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], DevicesController.prototype, "saveDataloggerMeasuresEndpoint", null);
__decorate([
    common_1.Get('serve-by-FTP/:idOrganization'),
    __param(0, common_1.Param('idOrganization')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], DevicesController.prototype, "serveByFTPEndpoint", null);
DevicesController = __decorate([
    common_1.Controller('devs'),
    __metadata("design:paramtypes", [devices_service_1.DevicesService,
        jwt_1.JwtService])
], DevicesController);
exports.DevicesController = DevicesController;
//# sourceMappingURL=devices.controller.js.map