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
exports.ProfileDataController = void 0;
const common_1 = require("@nestjs/common");
const profile_data_service_1 = require("./profile-data.service");
const roles_guard_1 = require("../../../../middlewares/roles.guard");
const passport_1 = require("@nestjs/passport");
let ProfileDataController = class ProfileDataController {
    constructor(profileDataService) {
        this.profileDataService = profileDataService;
    }
    async getBillingInfoEndpoint(req) {
        return await this.profileDataService.getBillingInfoData(req.user);
    }
    async updateBillingInfoEndpoint(body, req) {
        return await this.profileDataService.updateBillingInfoData(req.user, body);
    }
    async getTownsAndStatesEndpoint(req) {
        return await this.profileDataService.retrieveTownsAndStates(req.user.idUser);
    }
    async updateTownEndpoint(body, req) {
        return await this.profileDataService.updateTownInClient(req.user, body);
    }
    async deleteUserData(req) {
        return await this.profileDataService.deleteUserData(req.user.idUser);
    }
    async getAdminAccountData(req) {
        return await this.profileDataService.getClientAccountData(req.user.idUser);
    }
    async updateClientName(req, body) {
        return await this.profileDataService.updateClientName(req.user, body);
    }
    async updateClientPhone(req, body) {
        return await this.profileDataService.updateClientPhone(req.user, body);
    }
    async updateClientEmail(req, body) {
        return await this.profileDataService.updateClientEmail(req.user, body);
    }
    async addCardEndpoint(req, body) {
        return await this.profileDataService.addCard(body, req.user);
    }
    async deleteCardEndpoint(req, body) {
        return await this.profileDataService.deleteCard(body, req.user);
    }
    async getAllCardsEndpoint(req) {
        return await this.profileDataService.getAllCards(req.user);
    }
    async getCardEndpoint(req, idCard) {
        return await this.profileDataService.getCard(idCard, req.user);
    }
    async setCardAsDefaultEndpoint(req, body) {
        return await this.profileDataService.setCardAsDefault(body, req.user);
    }
    async payDeviceSubscription(req, body) {
        return await this.profileDataService.payDeviceSubscription(req.user.idUser, body);
    }
    async getPaymentsList(req, body) {
        return await this.profileDataService.getPaymentsList(req.user.idUser);
    }
    async getPaymentDetails(req, idHistoryPayments) {
        return await this.profileDataService.getPaymentDetails(req.user.idUser, idHistoryPayments);
    }
};
__decorate([
    common_1.Get('get-billing-info'),
    common_1.UseGuards(passport_1.AuthGuard(), roles_guard_1.RoleClientGuard),
    __param(0, common_1.Req()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ProfileDataController.prototype, "getBillingInfoEndpoint", null);
__decorate([
    common_1.Post('update-billing-info'),
    common_1.UseGuards(passport_1.AuthGuard(), roles_guard_1.RoleClientGuard),
    __param(0, common_1.Body()),
    __param(1, common_1.Req()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ProfileDataController.prototype, "updateBillingInfoEndpoint", null);
__decorate([
    common_1.Get('get-states-towns'),
    common_1.UseGuards(passport_1.AuthGuard(), roles_guard_1.RoleClientGuard),
    __param(0, common_1.Req()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ProfileDataController.prototype, "getTownsAndStatesEndpoint", null);
__decorate([
    common_1.Post('update-town'),
    common_1.UseGuards(passport_1.AuthGuard(), roles_guard_1.RoleClientGuard),
    __param(0, common_1.Body()),
    __param(1, common_1.Req()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ProfileDataController.prototype, "updateTownEndpoint", null);
__decorate([
    common_1.Get('delete-user-data'),
    common_1.UseGuards(passport_1.AuthGuard(), roles_guard_1.RoleClientGuard),
    __param(0, common_1.Req()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ProfileDataController.prototype, "deleteUserData", null);
__decorate([
    common_1.Get('get-client-account-data'),
    common_1.UseGuards(passport_1.AuthGuard(), roles_guard_1.RoleClientGuard),
    __param(0, common_1.Req()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ProfileDataController.prototype, "getAdminAccountData", null);
__decorate([
    common_1.Post('update-client-name'),
    common_1.UseGuards(passport_1.AuthGuard(), roles_guard_1.RoleClientGuard),
    __param(0, common_1.Req()),
    __param(1, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ProfileDataController.prototype, "updateClientName", null);
__decorate([
    common_1.Post('update-client-phone'),
    common_1.UseGuards(passport_1.AuthGuard(), roles_guard_1.RoleClientGuard),
    __param(0, common_1.Req()),
    __param(1, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ProfileDataController.prototype, "updateClientPhone", null);
__decorate([
    common_1.Post('update-client-email'),
    common_1.UseGuards(passport_1.AuthGuard(), roles_guard_1.RoleClientGuard),
    __param(0, common_1.Req()),
    __param(1, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ProfileDataController.prototype, "updateClientEmail", null);
__decorate([
    common_1.Post("add-card"),
    common_1.UseGuards(passport_1.AuthGuard(), roles_guard_1.RoleClientGuard),
    __param(0, common_1.Req()),
    __param(1, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ProfileDataController.prototype, "addCardEndpoint", null);
__decorate([
    common_1.Post("delete-card"),
    common_1.UseGuards(passport_1.AuthGuard(), roles_guard_1.RoleClientGuard),
    __param(0, common_1.Req()),
    __param(1, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ProfileDataController.prototype, "deleteCardEndpoint", null);
__decorate([
    common_1.Get("get-all-cards"),
    common_1.UseGuards(passport_1.AuthGuard(), roles_guard_1.RoleClientGuard),
    __param(0, common_1.Req()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ProfileDataController.prototype, "getAllCardsEndpoint", null);
__decorate([
    common_1.Get("get-card/:idCard"),
    common_1.UseGuards(passport_1.AuthGuard(), roles_guard_1.RoleClientGuard),
    __param(0, common_1.Req()),
    __param(1, common_1.Param('idCard')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number]),
    __metadata("design:returntype", Promise)
], ProfileDataController.prototype, "getCardEndpoint", null);
__decorate([
    common_1.Post("set-default-card"),
    common_1.UseGuards(passport_1.AuthGuard(), roles_guard_1.RoleClientGuard),
    __param(0, common_1.Req()),
    __param(1, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ProfileDataController.prototype, "setCardAsDefaultEndpoint", null);
__decorate([
    common_1.Post("pay-device-subscription"),
    common_1.UseGuards(passport_1.AuthGuard(), roles_guard_1.RoleClientGuard),
    __param(0, common_1.Req()),
    __param(1, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ProfileDataController.prototype, "payDeviceSubscription", null);
__decorate([
    common_1.Get("get-payments-list"),
    common_1.UseGuards(passport_1.AuthGuard(), roles_guard_1.RoleClientGuard),
    __param(0, common_1.Req()),
    __param(1, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ProfileDataController.prototype, "getPaymentsList", null);
__decorate([
    common_1.Get("get-payment/:idPayment"),
    common_1.UseGuards(passport_1.AuthGuard(), roles_guard_1.RoleClientGuard),
    __param(0, common_1.Req()),
    __param(1, common_1.Param('idPayment')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number]),
    __metadata("design:returntype", Promise)
], ProfileDataController.prototype, "getPaymentDetails", null);
ProfileDataController = __decorate([
    common_1.Controller('clients/profile-data'),
    __metadata("design:paramtypes", [profile_data_service_1.ProfileDataService])
], ProfileDataController);
exports.ProfileDataController = ProfileDataController;
//# sourceMappingURL=profile-data.controller.js.map