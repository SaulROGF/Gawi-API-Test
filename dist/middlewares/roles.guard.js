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
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoleTechnicianGuard = exports.RoleGasDeviceGuard = exports.RoleWaterDeviceGuard = exports.RoleDeviceGuard = exports.RoleProductionGuard = exports.RoleClientGuard = exports.RoleOrganizationAdminGuard = exports.RoleWarehouseGuard = exports.RoleAdminGuard = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
let RoleAdminGuard = class RoleAdminGuard {
    constructor(reflector) {
        this.reflector = reflector;
    }
    canActivate(context) {
        const request = context.switchToHttp().getRequest();
        const userRole = request.user.dataValues.idRole;
        const isActive = request.user.dataValues.active == true;
        const isDeleted = request.user.dataValues.deleted == true;
        return userRole == 1 && isActive && !isDeleted ? true : false;
    }
};
RoleAdminGuard = __decorate([
    common_1.Injectable(),
    __metadata("design:paramtypes", [core_1.Reflector])
], RoleAdminGuard);
exports.RoleAdminGuard = RoleAdminGuard;
let RoleWarehouseGuard = class RoleWarehouseGuard {
    constructor(reflector) {
        this.reflector = reflector;
    }
    canActivate(context) {
        const request = context.switchToHttp().getRequest();
        const userRole = request.user.dataValues.idRole;
        const isActive = request.user.dataValues.active == true;
        const isDeleted = request.user.dataValues.deleted == true;
        return userRole == 3 && isActive && !isDeleted ? true : false;
    }
};
RoleWarehouseGuard = __decorate([
    common_1.Injectable(),
    __metadata("design:paramtypes", [core_1.Reflector])
], RoleWarehouseGuard);
exports.RoleWarehouseGuard = RoleWarehouseGuard;
let RoleOrganizationAdminGuard = class RoleOrganizationAdminGuard {
    constructor(reflector) {
        this.reflector = reflector;
    }
    canActivate(context) {
        const request = context.switchToHttp().getRequest();
        const userRole = request.user.dataValues.idRole;
        const isActive = request.user.dataValues.active == true;
        const isDeleted = request.user.dataValues.deleted == true;
        return (userRole == 1 || userRole == 2) && isActive && !isDeleted ? true : false;
    }
};
RoleOrganizationAdminGuard = __decorate([
    common_1.Injectable(),
    __metadata("design:paramtypes", [core_1.Reflector])
], RoleOrganizationAdminGuard);
exports.RoleOrganizationAdminGuard = RoleOrganizationAdminGuard;
let RoleClientGuard = class RoleClientGuard {
    constructor(reflector) {
        this.reflector = reflector;
    }
    canActivate(context) {
        const request = context.switchToHttp().getRequest();
        const userRole = request.user.dataValues.idRole;
        const isActive = request.user.dataValues.active == true;
        const isDeleted = request.user.dataValues.deleted == true;
        return userRole == 7 && isActive && !isDeleted ? true : false;
    }
};
RoleClientGuard = __decorate([
    common_1.Injectable(),
    __metadata("design:paramtypes", [core_1.Reflector])
], RoleClientGuard);
exports.RoleClientGuard = RoleClientGuard;
let RoleProductionGuard = class RoleProductionGuard {
    constructor(reflector) {
        this.reflector = reflector;
    }
    canActivate(context) {
        const request = context.switchToHttp().getRequest();
        const userRole = request.user.dataValues.idRole;
        const isActive = request.user.dataValues.active == true;
        const isDeleted = request.user.dataValues.deleted == true;
        return userRole == 8 && isActive && !isDeleted ? true : false;
    }
};
RoleProductionGuard = __decorate([
    common_1.Injectable(),
    __metadata("design:paramtypes", [core_1.Reflector])
], RoleProductionGuard);
exports.RoleProductionGuard = RoleProductionGuard;
let RoleDeviceGuard = class RoleDeviceGuard {
    constructor(reflector) {
        this.reflector = reflector;
    }
    canActivate(context) {
        const request = context.switchToHttp().getRequest();
        return request.user.idDevice ? true : false;
    }
};
RoleDeviceGuard = __decorate([
    common_1.Injectable(),
    __metadata("design:paramtypes", [core_1.Reflector])
], RoleDeviceGuard);
exports.RoleDeviceGuard = RoleDeviceGuard;
let RoleWaterDeviceGuard = class RoleWaterDeviceGuard {
    constructor(reflector) {
        this.reflector = reflector;
    }
    canActivate(context) {
        const request = context.switchToHttp().getRequest();
        return request.user.type == 1 ? true : false;
    }
};
RoleWaterDeviceGuard = __decorate([
    common_1.Injectable(),
    __metadata("design:paramtypes", [core_1.Reflector])
], RoleWaterDeviceGuard);
exports.RoleWaterDeviceGuard = RoleWaterDeviceGuard;
let RoleGasDeviceGuard = class RoleGasDeviceGuard {
    constructor(reflector) {
        this.reflector = reflector;
    }
    canActivate(context) {
        const request = context.switchToHttp().getRequest();
        return request.user.type == 0 ? true : false;
    }
};
RoleGasDeviceGuard = __decorate([
    common_1.Injectable(),
    __metadata("design:paramtypes", [core_1.Reflector])
], RoleGasDeviceGuard);
exports.RoleGasDeviceGuard = RoleGasDeviceGuard;
let RoleTechnicianGuard = class RoleTechnicianGuard {
    constructor(reflector) {
        this.reflector = reflector;
    }
    canActivate(context) {
        const request = context.switchToHttp().getRequest();
        const userRole = request.user.dataValues.idRole;
        const isActive = request.user.dataValues.active == true;
        const isDeleted = request.user.dataValues.deleted == true;
        return userRole == 6 && isActive && !isDeleted ? true : false;
    }
};
RoleTechnicianGuard = __decorate([
    common_1.Injectable(),
    __metadata("design:paramtypes", [core_1.Reflector])
], RoleTechnicianGuard);
exports.RoleTechnicianGuard = RoleTechnicianGuard;
//# sourceMappingURL=roles.guard.js.map