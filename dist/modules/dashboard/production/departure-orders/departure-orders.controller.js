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
exports.DepartureOrdersController = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const departure_orders_service_1 = require("./departure-orders.service");
const roles_guard_1 = require("./../../../../middlewares/roles.guard");
let DepartureOrdersController = class DepartureOrdersController {
    constructor(departureOrdersService) {
        this.departureOrdersService = departureOrdersService;
    }
    async getAllOrganizationsEndpoint(req) {
        return await this.departureOrdersService.getAllOrganizations();
    }
    async getDevicesInStockEndpoint(req) {
        return await this.departureOrdersService.getDevicesInStock();
    }
    async createDepartureorderEndpoint(req, body) {
        return await this.departureOrdersService.createDepartureOrder(req.user, body);
    }
    async getAllOrdersEndpoint(req) {
        return await this.departureOrdersService.getAllOrders();
    }
    async getDevicesOnDemmandEndpoint(req) {
        return await this.departureOrdersService.getDevicesOnDemmand();
    }
    async cancelDepartureOrderEndpoint(idDepartureOrder) {
        return await this.departureOrdersService.cancelDepartureOrder(idDepartureOrder);
    }
    async completeDepartureOrderEndpoint(idDepartureOrder) {
        return await this.departureOrdersService.completeDepartureOrder(idDepartureOrder);
    }
};
__decorate([
    common_1.Get('get-all-organizations'),
    common_1.UseGuards(passport_1.AuthGuard(), roles_guard_1.RoleProductionGuard),
    __param(0, common_1.Request()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], DepartureOrdersController.prototype, "getAllOrganizationsEndpoint", null);
__decorate([
    common_1.Get('get-devs-in-stock'),
    common_1.UseGuards(passport_1.AuthGuard(), roles_guard_1.RoleProductionGuard),
    __param(0, common_1.Request()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], DepartureOrdersController.prototype, "getDevicesInStockEndpoint", null);
__decorate([
    common_1.Post('create-order'),
    common_1.UseGuards(passport_1.AuthGuard(), roles_guard_1.RoleProductionGuard),
    __param(0, common_1.Request()),
    __param(1, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], DepartureOrdersController.prototype, "createDepartureorderEndpoint", null);
__decorate([
    common_1.Get('get-all-orders'),
    common_1.UseGuards(passport_1.AuthGuard(), roles_guard_1.RoleProductionGuard),
    __param(0, common_1.Request()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], DepartureOrdersController.prototype, "getAllOrdersEndpoint", null);
__decorate([
    common_1.Get('get-devs-on-demmand'),
    common_1.UseGuards(passport_1.AuthGuard(), roles_guard_1.RoleProductionGuard),
    __param(0, common_1.Request()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], DepartureOrdersController.prototype, "getDevicesOnDemmandEndpoint", null);
__decorate([
    common_1.Get('cancel-order/:idDepartureOrder'),
    common_1.UseGuards(passport_1.AuthGuard(), roles_guard_1.RoleProductionGuard),
    __param(0, common_1.Param('idDepartureOrder')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], DepartureOrdersController.prototype, "cancelDepartureOrderEndpoint", null);
__decorate([
    common_1.Get('complete-order/:idDepartureOrder'),
    common_1.UseGuards(passport_1.AuthGuard(), roles_guard_1.RoleProductionGuard),
    __param(0, common_1.Param('idDepartureOrder')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], DepartureOrdersController.prototype, "completeDepartureOrderEndpoint", null);
DepartureOrdersController = __decorate([
    common_1.Controller('production/departure-orders'),
    __metadata("design:paramtypes", [departure_orders_service_1.DepartureOrdersService])
], DepartureOrdersController);
exports.DepartureOrdersController = DepartureOrdersController;
//# sourceMappingURL=departure-orders.controller.js.map