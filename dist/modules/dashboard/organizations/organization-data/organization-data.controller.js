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
exports.OrganizationDataController = void 0;
const common_1 = require("@nestjs/common");
const organization_data_service_1 = require("./organization-data.service");
const passport_1 = require("@nestjs/passport");
const roles_guard_1 = require("./../../../../middlewares/roles.guard");
const createOrganization_dto_1 = require("./dto/createOrganization.dto");
const editOrganizationRegion_dto_1 = require("./dto/editOrganizationRegion.dto");
const createRegionZone_dto_1 = require("./dto/createRegionZone.dto");
const editZone_dto_1 = require("./dto/editZone.dto");
const station_dtos_1 = require("./dto/station.dtos");
const createDeviceStation_dto_1 = require("./dto/createDeviceStation.dto");
let OrganizationDataController = class OrganizationDataController {
    constructor(organizationDataService) {
        this.organizationDataService = organizationDataService;
    }
    async getAdminAccountData(req) {
        return await this.organizationDataService.getOrganizationData(req.user);
    }
    async findRegionsByOrganization(idOrganization) {
        return await this.organizationDataService.findRegionsByOrganization(idOrganization);
    }
    async createOrganizationRegion(body) {
        return await this.organizationDataService.createOrganizationRegion(body);
    }
    async editOrganizationRegion(idRegion, editOrganizationRegionDto) {
        return await this.organizationDataService.updateOrganizationRegion(idRegion, editOrganizationRegionDto);
    }
    async deleteOrganizationRegion(idRegion) {
        return await this.organizationDataService.deleteOrganizationRegion(idRegion);
    }
    async findZonesByRegion(idRegion) {
        return await this.organizationDataService.findZoneByRegion(idRegion);
    }
    async findZoneByOrganization(idOrganization) {
        return await this.organizationDataService.findZoneByOrganization(idOrganization);
    }
    async createRegionZone(createZoneDto) {
        return await this.organizationDataService.createRegionZone(createZoneDto);
    }
    async editZone(idZone, editZoneDto) {
        return await this.organizationDataService.updateZone(idZone, editZoneDto);
    }
    async deleteZone(idZone) {
        return await this.organizationDataService.deleteZone(idZone);
    }
    async getStationsByOrganization(idOrganization) {
        return await this.organizationDataService.getStationsByOrganization(idOrganization);
    }
    async getStationsByZone(idZone) {
        return await this.organizationDataService.getStationsByZone(idZone);
    }
    async creationStation(createStationDto) {
        return await this.organizationDataService.createStation(createStationDto);
    }
    async updateStation(idStation, updateStationDto) {
        return await this.organizationDataService.updateStation(idStation, updateStationDto);
    }
    async deleteStation(idStation) {
        return await this.organizationDataService.deleteStation(idStation);
    }
    async findDeviceByStation(idStation) {
        return await this.organizationDataService.findDeviceByStation(idStation);
    }
    async findDeviceByZone(idZone) {
        return await this.organizationDataService.findDeviceByZone(idZone);
    }
    async findDeviceByRegion(idRegion) {
        return await this.organizationDataService.findDeviceByRegion(idRegion);
    }
    async findAllDevicesByOrganization(idOrganization) {
        return await this.organizationDataService.findAllDevicesByOrganization(idOrganization);
    }
    async createDeviceInStation(device, createDeviceStationDto) {
        return await this.organizationDataService.createDeviceInStation(createDeviceStationDto, device);
    }
    async deleteDeviceInStation(idDevice) {
        return await this.organizationDataService.deleteDeviceInStation(idDevice);
    }
    async findSupervisorList(idOrganization) {
        return await this.organizationDataService.findSupervisorList(idOrganization);
    }
};
__decorate([
    common_1.Get('get-organization-settings-data'),
    common_1.UseGuards(passport_1.AuthGuard(), roles_guard_1.RoleOrganizationAdminGuard),
    __param(0, common_1.Req()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], OrganizationDataController.prototype, "getAdminAccountData", null);
__decorate([
    common_1.Get('find-regions/:idOrganization'),
    common_1.UseGuards(passport_1.AuthGuard(), roles_guard_1.RoleOrganizationAdminGuard),
    __param(0, common_1.Param('idOrganization')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], OrganizationDataController.prototype, "findRegionsByOrganization", null);
__decorate([
    common_1.Post('create-region'),
    common_1.UseGuards(passport_1.AuthGuard(), roles_guard_1.RoleOrganizationAdminGuard),
    common_1.UsePipes(new common_1.ValidationPipe()),
    __param(0, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [createOrganization_dto_1.CreateOrganizationRegionDto]),
    __metadata("design:returntype", Promise)
], OrganizationDataController.prototype, "createOrganizationRegion", null);
__decorate([
    common_1.Patch('edit-region/:idRegion'),
    common_1.UseGuards(passport_1.AuthGuard(), roles_guard_1.RoleOrganizationAdminGuard),
    common_1.UsePipes(new common_1.ValidationPipe()),
    __param(0, common_1.Param('idRegion')),
    __param(1, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, editOrganizationRegion_dto_1.EditOrganizationRegionDto]),
    __metadata("design:returntype", Promise)
], OrganizationDataController.prototype, "editOrganizationRegion", null);
__decorate([
    common_1.Delete('delete-region/:idRegion'),
    common_1.UseGuards(passport_1.AuthGuard(), roles_guard_1.RoleOrganizationAdminGuard),
    __param(0, common_1.Param('idRegion')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], OrganizationDataController.prototype, "deleteOrganizationRegion", null);
__decorate([
    common_1.Get('find-zones-region/:idRegion'),
    common_1.UseGuards(passport_1.AuthGuard(), roles_guard_1.RoleOrganizationAdminGuard),
    __param(0, common_1.Param('idRegion')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], OrganizationDataController.prototype, "findZonesByRegion", null);
__decorate([
    common_1.Get('find-zones-organization/:idOrganization'),
    common_1.UseGuards(passport_1.AuthGuard(), roles_guard_1.RoleOrganizationAdminGuard),
    __param(0, common_1.Param('idOrganization')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], OrganizationDataController.prototype, "findZoneByOrganization", null);
__decorate([
    common_1.Post('create-zone'),
    common_1.UseGuards(passport_1.AuthGuard(), roles_guard_1.RoleOrganizationAdminGuard),
    common_1.UsePipes(new common_1.ValidationPipe()),
    __param(0, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [createRegionZone_dto_1.CreateRegionZoneDto]),
    __metadata("design:returntype", Promise)
], OrganizationDataController.prototype, "createRegionZone", null);
__decorate([
    common_1.Patch('edit-zone/:idZone'),
    common_1.UseGuards(passport_1.AuthGuard(), roles_guard_1.RoleOrganizationAdminGuard),
    common_1.UsePipes(new common_1.ValidationPipe()),
    __param(0, common_1.Param('idZone')),
    __param(1, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, editZone_dto_1.EditZoneDto]),
    __metadata("design:returntype", Promise)
], OrganizationDataController.prototype, "editZone", null);
__decorate([
    common_1.Delete('delete-zone/:idZone'),
    common_1.UseGuards(passport_1.AuthGuard()),
    __param(0, common_1.Param('idZone')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], OrganizationDataController.prototype, "deleteZone", null);
__decorate([
    common_1.Get('find-stations-byOrganization/:idOrganization'),
    common_1.UseGuards(passport_1.AuthGuard(), roles_guard_1.RoleOrganizationAdminGuard),
    common_1.UsePipes(new common_1.ValidationPipe()),
    __param(0, common_1.Param('idOrganization')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], OrganizationDataController.prototype, "getStationsByOrganization", null);
__decorate([
    common_1.Get('find-stations-byZone/:idZone'),
    common_1.UseGuards(passport_1.AuthGuard(), roles_guard_1.RoleOrganizationAdminGuard),
    common_1.UsePipes(new common_1.ValidationPipe()),
    __param(0, common_1.Param('idZone')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], OrganizationDataController.prototype, "getStationsByZone", null);
__decorate([
    common_1.Post('create-station'),
    common_1.UseGuards(passport_1.AuthGuard(), roles_guard_1.RoleOrganizationAdminGuard),
    common_1.UsePipes(new common_1.ValidationPipe()),
    __param(0, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [station_dtos_1.CreateStationDto]),
    __metadata("design:returntype", Promise)
], OrganizationDataController.prototype, "creationStation", null);
__decorate([
    common_1.Patch('edit-station/:idStation'),
    common_1.UseGuards(passport_1.AuthGuard(), roles_guard_1.RoleOrganizationAdminGuard),
    common_1.UsePipes(new common_1.ValidationPipe()),
    __param(0, common_1.Param('idStation')),
    __param(1, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, station_dtos_1.UpdateStationDto]),
    __metadata("design:returntype", Promise)
], OrganizationDataController.prototype, "updateStation", null);
__decorate([
    common_1.Delete('delete-station/:idStation'),
    common_1.UseGuards(passport_1.AuthGuard(), roles_guard_1.RoleOrganizationAdminGuard),
    common_1.UsePipes(new common_1.ValidationPipe()),
    __param(0, common_1.Param('idStation')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], OrganizationDataController.prototype, "deleteStation", null);
__decorate([
    common_1.Get('find-devices-byStation/:idStation'),
    common_1.UseGuards(passport_1.AuthGuard(), roles_guard_1.RoleOrganizationAdminGuard),
    common_1.UsePipes(new common_1.ValidationPipe()),
    __param(0, common_1.Param('idStation')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], OrganizationDataController.prototype, "findDeviceByStation", null);
__decorate([
    common_1.Get('find-devices-byZone/:idZone'),
    common_1.UseGuards(passport_1.AuthGuard(), roles_guard_1.RoleOrganizationAdminGuard),
    common_1.UsePipes(new common_1.ValidationPipe()),
    __param(0, common_1.Param('idZone')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], OrganizationDataController.prototype, "findDeviceByZone", null);
__decorate([
    common_1.Get('find-devices-byRegion/:idRegion'),
    common_1.UseGuards(passport_1.AuthGuard(), roles_guard_1.RoleOrganizationAdminGuard),
    common_1.UsePipes(new common_1.ValidationPipe()),
    __param(0, common_1.Param('idRegion')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], OrganizationDataController.prototype, "findDeviceByRegion", null);
__decorate([
    common_1.Get('find-devices-byOrganization/:idOrganization'),
    common_1.UseGuards(passport_1.AuthGuard(), roles_guard_1.RoleOrganizationAdminGuard),
    common_1.UsePipes(new common_1.ValidationPipe()),
    __param(0, common_1.Param('idOrganization')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], OrganizationDataController.prototype, "findAllDevicesByOrganization", null);
__decorate([
    common_1.Post('create-devices-InStation/:device'),
    common_1.UseGuards(passport_1.AuthGuard(), roles_guard_1.RoleOrganizationAdminGuard),
    common_1.UsePipes(new common_1.ValidationPipe()),
    __param(0, common_1.Param('device')),
    __param(1, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, createDeviceStation_dto_1.createDeviceStationDto]),
    __metadata("design:returntype", Promise)
], OrganizationDataController.prototype, "createDeviceInStation", null);
__decorate([
    common_1.Delete('delete-devices-InStation/:idDevice'),
    common_1.UseGuards(passport_1.AuthGuard(), roles_guard_1.RoleOrganizationAdminGuard),
    common_1.UsePipes(new common_1.ValidationPipe()),
    __param(0, common_1.Param('idDevice')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], OrganizationDataController.prototype, "deleteDeviceInStation", null);
__decorate([
    common_1.Get('find-supervisorList/:idOrganization'),
    common_1.UseGuards(passport_1.AuthGuard(), roles_guard_1.RoleOrganizationAdminGuard),
    common_1.UsePipes(new common_1.ValidationPipe()),
    __param(0, common_1.Param('idOrganization')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], OrganizationDataController.prototype, "findSupervisorList", null);
OrganizationDataController = __decorate([
    common_1.Controller('organization/organization-data'),
    __metadata("design:paramtypes", [organization_data_service_1.OrganizationDataService])
], OrganizationDataController);
exports.OrganizationDataController = OrganizationDataController;
//# sourceMappingURL=organization-data.controller.js.map