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
    async getAlertsEndpoint(req) {
        return await this.devicesService.getAlerts(req.user);
    }
    async getTownsAndStates(req) {
        return await this.devicesService.getDevices(req.user);
    }
    async updateTown(body, req) {
        return await this.devicesService.addDevice(req.user, body);
    }
    async getNaturalGasDeviceData(idDevice, period, req) {
        return await this.devicesService.getNaturalGasDeviceData(req.user, idDevice, period);
    }
    async getNaturalGasDeviceSettings(idDevice, req) {
        return await this.devicesService.getNaturalGasDeviceSettings(req.user, idDevice);
    }
    async updateSettingsNaturalServiceMonthMaxConsumption(body, req) {
        return await this.devicesService.updateSettingsNaturalServiceMonthMaxConsumption(req.user, body);
    }
    async getDeviceWaterData(idDevice, period, req) {
        return await this.devicesService.getDeviceWaterData(req.user, idDevice, period);
    }
    getIndividualLoggerDeviceData(req, body) {
        return this.devicesService.getIndividualLoggerDeviceData(body, req.user.idUser);
    }
    getLoggerFromToDeviceData(req, body) {
        return this.devicesService.getQueryHistoryFromTOLoggerDeviceData(body, req.user.idUser);
    }
    async getLoggerDeviceSettingsEndpoint(idDevice, req) {
        return await this.devicesService.getLoggerDeviceSettingsEndpoint(req.user, idDevice);
    }
    async updateLoggerNotificationRepeatTime(body, req) {
        return await this.devicesService.updateLoggerNotificationRepeatTime(req.user, body);
    }
    async getWaterDeviceAlertsEndpoint(idDevice, period, req) {
        return await this.devicesService.getWaterDeviceAlerts(req.user, idDevice, period);
    }
    async getWaterDeviceSettingsEndpoint(idDevice, req) {
        return await this.devicesService.getWaterDeviceSettings(req.user, idDevice);
    }
    async updateDeviceName(body, req) {
        return await this.devicesService.updateDeviceName(req.user, body);
    }
    async getGasDeviceDataEndpoint(idDevice, period, req) {
        return await this.devicesService.getGasDeviceData(req.user, idDevice, period);
    }
    async getGasDeviceAlertsEndpoint(idDevice, period, req) {
        return await this.devicesService.getGasDeviceAlerts(req.user, idDevice, period);
    }
    async getGasDeviceSettingsEndpoint(idDevice, req) {
        return await this.devicesService.getGasDeviceSettings(req.user, idDevice);
    }
    async updateSettingsGasInterval(body, req) {
        return await this.devicesService.updateSettingsGasInterval(req.user, body);
    }
    async updateGasOffset(body, req) {
        return await this.devicesService.updateGasOffset(req.user, body);
    }
    async updateGasOffsetTime(body, req) {
        return await this.devicesService.updateGasOffsetTime(req.user, body);
    }
    async updateSettingsTankCapacity(body, req) {
        return await this.devicesService.updateSettingsTankCapacity(req.user, body);
    }
    async updateSettingsGasMinFillingPercentage(body, req) {
        return await this.devicesService.updateSettingsGasMinFillingPercentage(req.user, body);
    }
    async updateConsumptionUnitsPeriod(body, req) {
        return await this.devicesService.updateConsumptionUnitsPeriod(req.user, body);
    }
    async updateTravelModeEndpoint(body, req) {
        const ans = await this.devicesService.updateTravelMode(req.user, body);
        console.log(ans);
        return ans;
    }
    async updateSettingsServiceOutageDay(body, req) {
        return await this.devicesService.updateSettingsServiceOutageDay(req.user, body);
    }
    async updateSettingsWaterServiceConsumptionUnits(body, req) {
        return await this.devicesService.updateSettingsWaterServiceConsumptionUnits(req.user, body);
    }
    async updateSettingsWaterServiceSpendingUnits(body, req) {
        return await this.devicesService.updateSettingsWaterServiceSpendingUnits(req.user, body);
    }
    async updateSettingsWaterServiceStorageFrequency(body, req) {
        return await this.devicesService.updateSettingsWaterServiceStorageFrequency(req.user, body);
    }
    async updateSettingsWaterServiceDailyTransmission(body, req) {
        return await this.devicesService.updateSettingsWaterServiceDailyTransmission(req.user, body);
    }
    async updateSettingsWaterServiceCustomDailyTime(body, req) {
        return await this.devicesService.updateSettingsWaterServiceCustomDailyTime(req.user, body);
    }
    async updateSettingsWaterServiceIpProtocol(body, req) {
        return await this.devicesService.updateSettingsWaterServiceIpProtocol(req.user, body);
    }
    async updateSettingsWaterAuthenticationProtocol(body, req) {
        return await this.devicesService.updateSettingsWaterAuthenticationProtocol(req.user, body);
    }
    async updateSettingsWaterServiceDescriptionLabel(body, req) {
        return await this.devicesService.updateSettingsWaterServiceDescriptionLabel(req.user, body);
    }
    async updateSettingsWaterConsumptionAlertType(body, req) {
        return await this.devicesService.updateSettingsWaterConsumptionAlertType(req.user, body);
    }
    async updateSettingsWaterServicePeriodicFrequency(body, req) {
        return await this.devicesService.updateSettingsWaterServicePeriodicFrequency(req.user, body);
    }
    async updateSettingsWaterServiceDripSetpoint(body, req) {
        return await this.devicesService.updateSettingsWaterServiceDripSetpoint(req.user, body);
    }
    async updateSettingsWaterServiceBurstSetpoint(body, req) {
        return await this.devicesService.updateSettingsWaterServiceBurstSetpoint(req.user, body);
    }
    async updateSettingsWaterServiceFlowSetpoint(body, req) {
        return await this.devicesService.updateSettingsWaterServiceFlowSetpoint(req.user, body);
    }
    async updateSettingsWaterServiceConsumptionSetpoint(body, req) {
        return await this.devicesService.updateSettingsWaterServiceConsumptionSetpoint(req.user, body);
    }
    async updateSettingsWaterServicePeriodicTime(body, req) {
        return await this.devicesService.updateSettingsWaterServicePeriodicTime(req.user, body);
    }
    async updateSettingsWaterServiceDailyTime(body, req) {
        return await this.devicesService.updateSettingsWaterServiceDailyTime(req.user, body);
    }
    async updateSettingsWaterServiceStorageTime(body, req) {
        return await this.devicesService.updateSettingsWaterServiceStorageTime(req.user, body);
    }
    async updateSettingsWaterServiceMonthMaxConsumption(body, req) {
        return await this.devicesService.updateSettingsWaterServiceMonthMaxConsumption(req.user, body);
    }
    async updateSettingsWaterServiceUpdateFlags(body, req) {
        return await this.devicesService.updateSettingsWaterServiceUpdateFlags(req.user, body);
    }
    async getDeviceClientAddressSettings(idDevice, req) {
        return await this.devicesService.getDeviceClientAddressSettings(req.user, idDevice);
    }
    async updateDeviceClientAddressSettings(body, req) {
        return await this.devicesService.updateDeviceClientAddressSettings(req.user, body);
    }
    async detachDeviceEndpoint(req, body) {
        return await this.devicesService.detachDevice(req.user, body);
    }
};
__decorate([
    common_1.Get('get-alerts'),
    common_1.UseGuards(passport_1.AuthGuard(), roles_guard_1.RoleClientGuard),
    __param(0, common_1.Req()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], DevicesController.prototype, "getAlertsEndpoint", null);
__decorate([
    common_1.Get('get-devices'),
    common_1.UseGuards(passport_1.AuthGuard(), roles_guard_1.RoleClientGuard),
    __param(0, common_1.Req()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], DevicesController.prototype, "getTownsAndStates", null);
__decorate([
    common_1.Post('add-device'),
    common_1.UseGuards(passport_1.AuthGuard(), roles_guard_1.RoleClientGuard),
    __param(0, common_1.Body()),
    __param(1, common_1.Req()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], DevicesController.prototype, "updateTown", null);
__decorate([
    common_1.Get('get-device-natural-gas-data/:idDevice/:period'),
    common_1.UseGuards(passport_1.AuthGuard(), roles_guard_1.RoleClientGuard),
    __param(0, common_1.Param('idDevice')),
    __param(1, common_1.Param('period')),
    __param(2, common_1.Req()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, Object]),
    __metadata("design:returntype", Promise)
], DevicesController.prototype, "getNaturalGasDeviceData", null);
__decorate([
    common_1.Get('get-natural-gas-device-settings/:idDevice'),
    common_1.UseGuards(passport_1.AuthGuard(), roles_guard_1.RoleClientGuard),
    __param(0, common_1.Param('idDevice')),
    __param(1, common_1.Req()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], DevicesController.prototype, "getNaturalGasDeviceSettings", null);
__decorate([
    common_1.Post('update-device-natural-gas-month-max-consumption'),
    common_1.UseGuards(passport_1.AuthGuard(), roles_guard_1.RoleClientGuard),
    __param(0, common_1.Body()),
    __param(1, common_1.Req()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], DevicesController.prototype, "updateSettingsNaturalServiceMonthMaxConsumption", null);
__decorate([
    common_1.Get('get-device-water-data/:idDevice/:period'),
    common_1.UseGuards(passport_1.AuthGuard(), roles_guard_1.RoleClientGuard),
    __param(0, common_1.Param('idDevice')),
    __param(1, common_1.Param('period')),
    __param(2, common_1.Req()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, Object]),
    __metadata("design:returntype", Promise)
], DevicesController.prototype, "getDeviceWaterData", null);
__decorate([
    common_1.Post('get-device-logger-data'),
    common_1.UseGuards(passport_1.AuthGuard(), roles_guard_1.RoleClientGuard),
    __param(0, common_1.Req()),
    __param(1, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], DevicesController.prototype, "getIndividualLoggerDeviceData", null);
__decorate([
    common_1.Post('get-device-logger-from-to-data'),
    common_1.UseGuards(passport_1.AuthGuard(), roles_guard_1.RoleClientGuard),
    __param(0, common_1.Req()),
    __param(1, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], DevicesController.prototype, "getLoggerFromToDeviceData", null);
__decorate([
    common_1.Get('get-logger-device-settings/:idDevice'),
    common_1.UseGuards(passport_1.AuthGuard(), roles_guard_1.RoleClientGuard),
    __param(0, common_1.Param('idDevice')),
    __param(1, common_1.Req()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], DevicesController.prototype, "getLoggerDeviceSettingsEndpoint", null);
__decorate([
    common_1.Post('update-device-gas-notification-repeat-time'),
    common_1.UseGuards(passport_1.AuthGuard(), roles_guard_1.RoleClientGuard),
    __param(0, common_1.Body()),
    __param(1, common_1.Req()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], DevicesController.prototype, "updateLoggerNotificationRepeatTime", null);
__decorate([
    common_1.Get('get-water-device-alerts/:idDevice/:period'),
    common_1.UseGuards(passport_1.AuthGuard(), roles_guard_1.RoleClientGuard),
    __param(0, common_1.Param('idDevice')),
    __param(1, common_1.Param('period')),
    __param(2, common_1.Req()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, Object]),
    __metadata("design:returntype", Promise)
], DevicesController.prototype, "getWaterDeviceAlertsEndpoint", null);
__decorate([
    common_1.Get('get-water-device-settings/:idDevice'),
    common_1.UseGuards(passport_1.AuthGuard(), roles_guard_1.RoleClientGuard),
    __param(0, common_1.Param('idDevice')),
    __param(1, common_1.Req()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], DevicesController.prototype, "getWaterDeviceSettingsEndpoint", null);
__decorate([
    common_1.Post('update-device-name'),
    common_1.UseGuards(passport_1.AuthGuard(), roles_guard_1.RoleClientGuard),
    __param(0, common_1.Body()),
    __param(1, common_1.Req()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], DevicesController.prototype, "updateDeviceName", null);
__decorate([
    common_1.Get('get-gas-device-data/:idDevice/:period'),
    common_1.UseGuards(passport_1.AuthGuard(), roles_guard_1.RoleClientGuard),
    __param(0, common_1.Param('idDevice')),
    __param(1, common_1.Param('period')),
    __param(2, common_1.Req()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, Object]),
    __metadata("design:returntype", Promise)
], DevicesController.prototype, "getGasDeviceDataEndpoint", null);
__decorate([
    common_1.Get('get-gas-device-alerts/:idDevice/:period'),
    common_1.UseGuards(passport_1.AuthGuard(), roles_guard_1.RoleClientGuard),
    __param(0, common_1.Param('idDevice')),
    __param(1, common_1.Param('period')),
    __param(2, common_1.Req()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, Object]),
    __metadata("design:returntype", Promise)
], DevicesController.prototype, "getGasDeviceAlertsEndpoint", null);
__decorate([
    common_1.Get('get-gas-device-settings/:idDevice'),
    common_1.UseGuards(passport_1.AuthGuard(), roles_guard_1.RoleClientGuard),
    __param(0, common_1.Param('idDevice')),
    __param(1, common_1.Req()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], DevicesController.prototype, "getGasDeviceSettingsEndpoint", null);
__decorate([
    common_1.Post('update-device-gas-interval'),
    common_1.UseGuards(passport_1.AuthGuard(), roles_guard_1.RoleClientGuard),
    __param(0, common_1.Body()),
    __param(1, common_1.Req()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], DevicesController.prototype, "updateSettingsGasInterval", null);
__decorate([
    common_1.Post('update-device-gas-offset'),
    common_1.UseGuards(passport_1.AuthGuard(), roles_guard_1.RoleClientGuard),
    __param(0, common_1.Body()),
    __param(1, common_1.Req()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], DevicesController.prototype, "updateGasOffset", null);
__decorate([
    common_1.Post('update-device-gas-offset-time'),
    common_1.UseGuards(passport_1.AuthGuard(), roles_guard_1.RoleClientGuard),
    __param(0, common_1.Body()),
    __param(1, common_1.Req()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], DevicesController.prototype, "updateGasOffsetTime", null);
__decorate([
    common_1.Post('update-device-gas-tank-capacity'),
    common_1.UseGuards(passport_1.AuthGuard(), roles_guard_1.RoleClientGuard),
    __param(0, common_1.Body()),
    __param(1, common_1.Req()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], DevicesController.prototype, "updateSettingsTankCapacity", null);
__decorate([
    common_1.Post('update-device-gas-min-filling-percentage'),
    common_1.UseGuards(passport_1.AuthGuard(), roles_guard_1.RoleClientGuard),
    __param(0, common_1.Body()),
    __param(1, common_1.Req()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], DevicesController.prototype, "updateSettingsGasMinFillingPercentage", null);
__decorate([
    common_1.Post('update-device-gas-consumption-units-period'),
    common_1.UseGuards(passport_1.AuthGuard(), roles_guard_1.RoleClientGuard),
    __param(0, common_1.Body()),
    __param(1, common_1.Req()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], DevicesController.prototype, "updateConsumptionUnitsPeriod", null);
__decorate([
    common_1.Post('update-device-gas-travel-mode'),
    common_1.UseGuards(passport_1.AuthGuard(), roles_guard_1.RoleClientGuard),
    __param(0, common_1.Body()),
    __param(1, common_1.Req()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], DevicesController.prototype, "updateTravelModeEndpoint", null);
__decorate([
    common_1.Post('update-device-water-outage-day'),
    common_1.UseGuards(passport_1.AuthGuard(), roles_guard_1.RoleClientGuard),
    __param(0, common_1.Body()),
    __param(1, common_1.Req()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], DevicesController.prototype, "updateSettingsServiceOutageDay", null);
__decorate([
    common_1.Post('update-device-water-consumption-units'),
    common_1.UseGuards(passport_1.AuthGuard(), roles_guard_1.RoleClientGuard),
    __param(0, common_1.Body()),
    __param(1, common_1.Req()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], DevicesController.prototype, "updateSettingsWaterServiceConsumptionUnits", null);
__decorate([
    common_1.Post('update-device-water-spending-units'),
    common_1.UseGuards(passport_1.AuthGuard(), roles_guard_1.RoleClientGuard),
    __param(0, common_1.Body()),
    __param(1, common_1.Req()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], DevicesController.prototype, "updateSettingsWaterServiceSpendingUnits", null);
__decorate([
    common_1.Post('update-device-water-storage-frequency'),
    common_1.UseGuards(passport_1.AuthGuard(), roles_guard_1.RoleClientGuard),
    __param(0, common_1.Body()),
    __param(1, common_1.Req()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], DevicesController.prototype, "updateSettingsWaterServiceStorageFrequency", null);
__decorate([
    common_1.Post('update-device-water-daily-transmission'),
    common_1.UseGuards(passport_1.AuthGuard(), roles_guard_1.RoleClientGuard),
    __param(0, common_1.Body()),
    __param(1, common_1.Req()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], DevicesController.prototype, "updateSettingsWaterServiceDailyTransmission", null);
__decorate([
    common_1.Post('update-device-water-custom-daily-time'),
    common_1.UseGuards(passport_1.AuthGuard(), roles_guard_1.RoleClientGuard),
    __param(0, common_1.Body()),
    __param(1, common_1.Req()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], DevicesController.prototype, "updateSettingsWaterServiceCustomDailyTime", null);
__decorate([
    common_1.Post('update-device-water-ip-protocol'),
    common_1.UseGuards(passport_1.AuthGuard(), roles_guard_1.RoleClientGuard),
    __param(0, common_1.Body()),
    __param(1, common_1.Req()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], DevicesController.prototype, "updateSettingsWaterServiceIpProtocol", null);
__decorate([
    common_1.Post('update-device-water-authentication-protocol'),
    common_1.UseGuards(passport_1.AuthGuard(), roles_guard_1.RoleClientGuard),
    __param(0, common_1.Body()),
    __param(1, common_1.Req()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], DevicesController.prototype, "updateSettingsWaterAuthenticationProtocol", null);
__decorate([
    common_1.Post('update-device-water-description-label'),
    common_1.UseGuards(passport_1.AuthGuard(), roles_guard_1.RoleClientGuard),
    __param(0, common_1.Body()),
    __param(1, common_1.Req()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], DevicesController.prototype, "updateSettingsWaterServiceDescriptionLabel", null);
__decorate([
    common_1.Post('update-device-water-consumption-alert-type'),
    common_1.UseGuards(passport_1.AuthGuard(), roles_guard_1.RoleClientGuard),
    __param(0, common_1.Body()),
    __param(1, common_1.Req()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], DevicesController.prototype, "updateSettingsWaterConsumptionAlertType", null);
__decorate([
    common_1.Post('update-device-water-periodic-frequency'),
    common_1.UseGuards(passport_1.AuthGuard(), roles_guard_1.RoleClientGuard),
    __param(0, common_1.Body()),
    __param(1, common_1.Req()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], DevicesController.prototype, "updateSettingsWaterServicePeriodicFrequency", null);
__decorate([
    common_1.Post('update-device-water-drip-setpoint'),
    common_1.UseGuards(passport_1.AuthGuard(), roles_guard_1.RoleClientGuard),
    __param(0, common_1.Body()),
    __param(1, common_1.Req()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], DevicesController.prototype, "updateSettingsWaterServiceDripSetpoint", null);
__decorate([
    common_1.Post('update-device-water-burst-setpoint'),
    common_1.UseGuards(passport_1.AuthGuard(), roles_guard_1.RoleClientGuard),
    __param(0, common_1.Body()),
    __param(1, common_1.Req()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], DevicesController.prototype, "updateSettingsWaterServiceBurstSetpoint", null);
__decorate([
    common_1.Post('update-device-water-flow-setpoint'),
    common_1.UseGuards(passport_1.AuthGuard(), roles_guard_1.RoleClientGuard),
    __param(0, common_1.Body()),
    __param(1, common_1.Req()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], DevicesController.prototype, "updateSettingsWaterServiceFlowSetpoint", null);
__decorate([
    common_1.Post('update-device-water-consumption-setpoint'),
    common_1.UseGuards(passport_1.AuthGuard(), roles_guard_1.RoleClientGuard),
    __param(0, common_1.Body()),
    __param(1, common_1.Req()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], DevicesController.prototype, "updateSettingsWaterServiceConsumptionSetpoint", null);
__decorate([
    common_1.Post('update-device-water-periodic-time'),
    common_1.UseGuards(passport_1.AuthGuard(), roles_guard_1.RoleClientGuard),
    __param(0, common_1.Body()),
    __param(1, common_1.Req()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], DevicesController.prototype, "updateSettingsWaterServicePeriodicTime", null);
__decorate([
    common_1.Post('update-device-water-daily-time'),
    common_1.UseGuards(passport_1.AuthGuard(), roles_guard_1.RoleClientGuard),
    __param(0, common_1.Body()),
    __param(1, common_1.Req()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], DevicesController.prototype, "updateSettingsWaterServiceDailyTime", null);
__decorate([
    common_1.Post('update-device-water-storage-time'),
    common_1.UseGuards(passport_1.AuthGuard(), roles_guard_1.RoleClientGuard),
    __param(0, common_1.Body()),
    __param(1, common_1.Req()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], DevicesController.prototype, "updateSettingsWaterServiceStorageTime", null);
__decorate([
    common_1.Post('update-device-water-month-max-consumption'),
    common_1.UseGuards(passport_1.AuthGuard(), roles_guard_1.RoleClientGuard),
    __param(0, common_1.Body()),
    __param(1, common_1.Req()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], DevicesController.prototype, "updateSettingsWaterServiceMonthMaxConsumption", null);
__decorate([
    common_1.Post('update-device-water-flags'),
    common_1.UseGuards(passport_1.AuthGuard(), roles_guard_1.RoleClientGuard),
    __param(0, common_1.Body()),
    __param(1, common_1.Req()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], DevicesController.prototype, "updateSettingsWaterServiceUpdateFlags", null);
__decorate([
    common_1.Get('get-device-address-settings/:idDevice'),
    common_1.UseGuards(passport_1.AuthGuard(), roles_guard_1.RoleClientGuard),
    __param(0, common_1.Param('idDevice')),
    __param(1, common_1.Req()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], DevicesController.prototype, "getDeviceClientAddressSettings", null);
__decorate([
    common_1.Post('update-device-address-settings'),
    common_1.UseGuards(passport_1.AuthGuard(), roles_guard_1.RoleClientGuard),
    __param(0, common_1.Body()),
    __param(1, common_1.Req()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], DevicesController.prototype, "updateDeviceClientAddressSettings", null);
__decorate([
    common_1.Post('detach-device'),
    common_1.UseGuards(passport_1.AuthGuard(), roles_guard_1.RoleClientGuard),
    __param(0, common_1.Req()),
    __param(1, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], DevicesController.prototype, "detachDeviceEndpoint", null);
DevicesController = __decorate([
    common_1.Controller('clients/devices-data'),
    __metadata("design:paramtypes", [devices_service_1.DevicesService])
], DevicesController);
exports.DevicesController = DevicesController;
//# sourceMappingURL=devices.controller.js.map