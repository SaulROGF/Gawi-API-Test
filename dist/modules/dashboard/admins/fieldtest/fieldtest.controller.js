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
exports.FieldtestController = void 0;
const common_1 = require("@nestjs/common");
const fieldtest_service_1 = require("./fieldtest.service");
const passport_1 = require("@nestjs/passport");
const roles_guard_1 = require("../../../../middlewares/roles.guard");
const fildDevice_dto_1 = require("./dtos/fildDevice.dto");
const ServerMessage_class_1 = require("../../../../classes/ServerMessage.class");
let FieldtestController = class FieldtestController {
    constructor(fieldTestService) {
        this.fieldTestService = fieldTestService;
    }
    getDevicesInField() {
        return this.fieldTestService.getDevicesInField();
    }
    async addDeviceToFieldTable(fieldDeviceDto) {
        return this.fieldTestService.saveDeviceInField(fieldDeviceDto);
    }
    async removeDeviceToFieldTable(params) {
        const serialNumbers = params.serialNumbers;
        return await this.fieldTestService.deleteDeviceFromField(serialNumbers);
    }
};
__decorate([
    common_1.Get(),
    common_1.UseGuards(passport_1.AuthGuard(), roles_guard_1.RoleAdminGuard),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Object)
], FieldtestController.prototype, "getDevicesInField", null);
__decorate([
    common_1.Post(),
    common_1.UseGuards(passport_1.AuthGuard(), roles_guard_1.RoleAdminGuard),
    common_1.UsePipes(new common_1.ValidationPipe()),
    __param(0, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [fildDevice_dto_1.FieldDeviceDto]),
    __metadata("design:returntype", Promise)
], FieldtestController.prototype, "addDeviceToFieldTable", null);
__decorate([
    common_1.Delete(':serialNumbers'),
    common_1.UseGuards(passport_1.AuthGuard(), roles_guard_1.RoleAdminGuard),
    __param(0, common_1.Param()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], FieldtestController.prototype, "removeDeviceToFieldTable", null);
FieldtestController = __decorate([
    common_1.Controller('fieldtest'),
    __metadata("design:paramtypes", [fieldtest_service_1.FieldtestService])
], FieldtestController);
exports.FieldtestController = FieldtestController;
//# sourceMappingURL=fieldtest.controller.js.map