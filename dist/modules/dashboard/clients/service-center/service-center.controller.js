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
exports.ServiceCenterController = void 0;
const common_1 = require("@nestjs/common");
const service_center_service_1 = require("./service-center.service");
const roles_guard_1 = require("../../../../middlewares/roles.guard");
const passport_1 = require("@nestjs/passport");
let ServiceCenterController = class ServiceCenterController {
    constructor(serviceCenterService) {
        this.serviceCenterService = serviceCenterService;
    }
    async homeEndpoint(req) {
        return await this.serviceCenterService.retrieveContacts(req.user);
    }
};
__decorate([
    common_1.Get('retrieve-contacts'),
    common_1.UseGuards(passport_1.AuthGuard(), roles_guard_1.RoleClientGuard),
    __param(0, common_1.Req()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ServiceCenterController.prototype, "homeEndpoint", null);
ServiceCenterController = __decorate([
    common_1.Controller('clients/service-center'),
    __metadata("design:paramtypes", [service_center_service_1.ServiceCenterService])
], ServiceCenterController);
exports.ServiceCenterController = ServiceCenterController;
//# sourceMappingURL=service-center.controller.js.map