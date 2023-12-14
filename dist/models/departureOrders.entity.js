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
exports.DepartureOrder = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const organization_entity_1 = require("./organization.entity");
const user_entity_1 = require("./user.entity");
let DepartureOrder = class DepartureOrder extends sequelize_typescript_1.Model {
};
__decorate([
    sequelize_typescript_1.Column({
        type: sequelize_typescript_1.DataType.INTEGER({ length: 11 }),
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        unique: true,
    }),
    __metadata("design:type", Number)
], DepartureOrder.prototype, "idDepartureOrder", void 0);
__decorate([
    sequelize_typescript_1.ForeignKey(() => user_entity_1.User),
    sequelize_typescript_1.Column({
        type: sequelize_typescript_1.DataType.INTEGER({ length: 11 }),
        allowNull: false,
    }),
    __metadata("design:type", Number)
], DepartureOrder.prototype, "idUser", void 0);
__decorate([
    sequelize_typescript_1.ForeignKey(() => organization_entity_1.Organization),
    sequelize_typescript_1.Column({
        type: sequelize_typescript_1.DataType.INTEGER({ length: 11 }),
        allowNull: false,
    }),
    __metadata("design:type", Number)
], DepartureOrder.prototype, "idOrganization", void 0);
__decorate([
    sequelize_typescript_1.Column({
        type: sequelize_typescript_1.DataType.INTEGER({ length: 2 }),
        allowNull: false,
        defaultValue: 1,
        comment: '0 - cancelada, 1 - sin iniciar, 2 - en proceso, 3 - completada, 4 - cerrada',
    }),
    __metadata("design:type", Number)
], DepartureOrder.prototype, "status", void 0);
__decorate([
    sequelize_typescript_1.Column({
        type: sequelize_typescript_1.DataType.INTEGER({ length: 2 }),
        allowNull: false,
        defaultValue: 1,
        comment: '0 - dispositivo de gas, 1 - dispositivo de agua',
    }),
    __metadata("design:type", Number)
], DepartureOrder.prototype, "deviceType", void 0);
__decorate([
    sequelize_typescript_1.Column({
        type: sequelize_typescript_1.DataType.INTEGER({ length: 1 }),
        allowNull: true,
        defaultValue: 0,
    }),
    __metadata("design:type", Number)
], DepartureOrder.prototype, "deviceQuantity", void 0);
__decorate([
    sequelize_typescript_1.Column({
        type: sequelize_typescript_1.DataType.DATE,
        allowNull: true,
        defaultValue: () => {
            let date = new Date();
            return new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds()));
        },
    }),
    __metadata("design:type", Date)
], DepartureOrder.prototype, "createdAt", void 0);
__decorate([
    sequelize_typescript_1.Column({
        type: sequelize_typescript_1.DataType.DATE,
        allowNull: true,
    }),
    __metadata("design:type", Date)
], DepartureOrder.prototype, "deliveredAt", void 0);
__decorate([
    sequelize_typescript_1.BelongsTo(() => user_entity_1.User, 'idUser'),
    __metadata("design:type", user_entity_1.User)
], DepartureOrder.prototype, "user", void 0);
__decorate([
    sequelize_typescript_1.BelongsTo(() => organization_entity_1.Organization, 'idOrganization'),
    __metadata("design:type", organization_entity_1.Organization)
], DepartureOrder.prototype, "organization", void 0);
DepartureOrder = __decorate([
    sequelize_typescript_1.Table({
        tableName: 'departureOrders',
        timestamps: true,
        updatedAt: false,
        createdAt: false,
    })
], DepartureOrder);
exports.DepartureOrder = DepartureOrder;
//# sourceMappingURL=departureOrders.entity.js.map