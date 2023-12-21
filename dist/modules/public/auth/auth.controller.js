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
exports.AuthController = void 0;
const passport_1 = require("@nestjs/passport");
const common_1 = require("@nestjs/common");
const auth_service_1 = require("./auth.service");
const loginUser_dto_1 = require("../user/dto/loginUser.dto");
const ServerMessage_class_1 = require("../../../classes/ServerMessage.class");
let AuthController = class AuthController {
    constructor(authService) {
        this.authService = authService;
    }
    async login(loginUserDto) {
        return await this.authService.validateUserByPassword(loginUserDto);
    }
    async storeNotificationsCredentialsEndpoint(credentials, req) {
        return await this.authService.storeNotificationCredentials(credentials, req.user.idUser);
    }
    async disableNotificationsEndpoint(credentials) {
        return await this.authService.disableNotifications(credentials);
    }
    async testAuthRoute(req) {
        return new ServerMessage_class_1.ServerMessage(false, 'Acceso a ruta de prueba correcto', {
            user: await this.authService.generateUserData(req.user),
        });
    }
};
__decorate([
    common_1.Post('login'),
    __param(0, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [loginUser_dto_1.LoginUserDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "login", null);
__decorate([
    common_1.Post('store-notification-credentials'),
    common_1.UseGuards(passport_1.AuthGuard()),
    __param(0, common_1.Body()),
    __param(1, common_1.Request()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "storeNotificationsCredentialsEndpoint", null);
__decorate([
    common_1.Post('disable-notifications'),
    common_1.UseGuards(passport_1.AuthGuard()),
    __param(0, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "disableNotificationsEndpoint", null);
__decorate([
    common_1.Get('validate-token'),
    common_1.UseGuards(passport_1.AuthGuard()),
    __param(0, common_1.Request()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "testAuthRoute", null);
AuthController = __decorate([
    common_1.Controller('auth'),
    __metadata("design:paramtypes", [auth_service_1.AuthService])
], AuthController);
exports.AuthController = AuthController;
//# sourceMappingURL=auth.controller.js.map