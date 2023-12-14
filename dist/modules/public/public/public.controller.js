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
exports.PublicController = void 0;
const common_1 = require("@nestjs/common");
const public_service_1 = require("./public.service");
const nestjs_real_ip_1 = require("nestjs-real-ip");
let PublicController = class PublicController {
    constructor(publicService) {
        this.publicService = publicService;
    }
    async resetPassword(body) {
        return await this.publicService.resetPassword(body);
    }
    async generateRecoveryEmailEndpoint(body) {
        const ans = await this.publicService.generateRecoveryEmail(body);
        console.log("</>", ans);
        return ans;
    }
    async createClient(ip, body) {
        return await this.publicService.createClient(body, ip);
    }
};
__decorate([
    common_1.Post('reset-password'),
    __param(0, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PublicController.prototype, "resetPassword", null);
__decorate([
    common_1.Post('generate-recovery-email'),
    __param(0, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PublicController.prototype, "generateRecoveryEmailEndpoint", null);
__decorate([
    common_1.Post('create-client'),
    __param(0, nestjs_real_ip_1.RealIP()),
    __param(1, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], PublicController.prototype, "createClient", null);
PublicController = __decorate([
    common_1.Controller('public'),
    __metadata("design:paramtypes", [public_service_1.PublicService])
], PublicController);
exports.PublicController = PublicController;
//# sourceMappingURL=public.controller.js.map