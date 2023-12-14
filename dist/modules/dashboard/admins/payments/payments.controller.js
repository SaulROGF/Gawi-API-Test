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
exports.PaymentsController = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const roles_guard_1 = require("../../../../middlewares/roles.guard");
const payments_service_1 = require("./payments.service");
let PaymentsController = class PaymentsController {
    constructor(paymentsService) {
        this.paymentsService = paymentsService;
    }
    async manualSubscriptionsActivations(body) {
        return await this.paymentsService.manualSubscriptionsActivations(body);
    }
    async deleteCardEndpoint(body) {
        return await this.paymentsService.paymentsListDeviceSubscription(body);
    }
    createInvoice(body) {
        return this.paymentsService.createPaymentSubscriptionInvoice(body);
    }
    async getAlreadyBillsList(body) {
        return await this.paymentsService.getAlreadyBillsList(body);
    }
};
__decorate([
    common_1.Post("manual-subscriptions-activations"),
    common_1.UseGuards(passport_1.AuthGuard(), roles_guard_1.RoleAdminGuard),
    __param(0, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PaymentsController.prototype, "manualSubscriptionsActivations", null);
__decorate([
    common_1.Post("get-subscription-payment-list"),
    common_1.UseGuards(passport_1.AuthGuard(), roles_guard_1.RoleAdminGuard),
    __param(0, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PaymentsController.prototype, "deleteCardEndpoint", null);
__decorate([
    common_1.Post('create-invoice'),
    common_1.UseGuards(passport_1.AuthGuard(), roles_guard_1.RoleAdminGuard),
    __param(0, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], PaymentsController.prototype, "createInvoice", null);
__decorate([
    common_1.Post("get-already-bills-list"),
    common_1.UseGuards(passport_1.AuthGuard(), roles_guard_1.RoleAdminGuard),
    __param(0, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PaymentsController.prototype, "getAlreadyBillsList", null);
PaymentsController = __decorate([
    common_1.Controller('administrator/payments'),
    __metadata("design:paramtypes", [payments_service_1.PaymentsService])
], PaymentsController);
exports.PaymentsController = PaymentsController;
//# sourceMappingURL=payments.controller.js.map