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
exports.Organization = void 0;
const user_entity_1 = require("./user.entity");
const device_entity_1 = require("./device.entity");
const sequelize_typescript_1 = require("sequelize-typescript");
const regions_entity_1 = require("./regions.entity");
const stations_entity_1 = require("./stations.entity");
let Organization = class Organization extends sequelize_typescript_1.Model {
};
__decorate([
    sequelize_typescript_1.Column({
        type: sequelize_typescript_1.DataType.INTEGER({ length: 11 }),
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
    }),
    __metadata("design:type", Number)
], Organization.prototype, "idOrganization", void 0);
__decorate([
    sequelize_typescript_1.Column({
        type: sequelize_typescript_1.DataType.STRING(200),
        allowNull: false,
    }),
    __metadata("design:type", String)
], Organization.prototype, "comercialName", void 0);
__decorate([
    sequelize_typescript_1.Column({
        type: sequelize_typescript_1.DataType.STRING(200),
        allowNull: false,
    }),
    __metadata("design:type", String)
], Organization.prototype, "fiscalName", void 0);
__decorate([
    sequelize_typescript_1.Column({
        type: sequelize_typescript_1.DataType.STRING(20),
        allowNull: false,
    }),
    __metadata("design:type", String)
], Organization.prototype, "rfc", void 0);
__decorate([
    sequelize_typescript_1.Column({
        type: sequelize_typescript_1.DataType.STRING(10),
        allowNull: true,
        defaultValue: '',
    }),
    __metadata("design:type", String)
], Organization.prototype, "phone", void 0);
__decorate([
    sequelize_typescript_1.Column({
        type: sequelize_typescript_1.DataType.STRING(50),
        allowNull: false,
    }),
    __metadata("design:type", String)
], Organization.prototype, "email", void 0);
__decorate([
    sequelize_typescript_1.Column({
        type: sequelize_typescript_1.DataType.STRING(50),
        allowNull: false,
    }),
    __metadata("design:type", String)
], Organization.prototype, "state", void 0);
__decorate([
    sequelize_typescript_1.Column({
        type: sequelize_typescript_1.DataType.STRING(50),
        allowNull: false,
    }),
    __metadata("design:type", String)
], Organization.prototype, "city", void 0);
__decorate([
    sequelize_typescript_1.Column({
        type: sequelize_typescript_1.DataType.STRING(20),
        allowNull: false,
    }),
    __metadata("design:type", String)
], Organization.prototype, "zipCode", void 0);
__decorate([
    sequelize_typescript_1.Column({
        type: sequelize_typescript_1.DataType.STRING(30),
        allowNull: false,
    }),
    __metadata("design:type", String)
], Organization.prototype, "suburb", void 0);
__decorate([
    sequelize_typescript_1.Column({
        type: sequelize_typescript_1.DataType.STRING(300),
        allowNull: false,
    }),
    __metadata("design:type", String)
], Organization.prototype, "street", void 0);
__decorate([
    sequelize_typescript_1.Column({
        type: sequelize_typescript_1.DataType.STRING(10),
        allowNull: false,
    }),
    __metadata("design:type", String)
], Organization.prototype, "addressNumber", void 0);
__decorate([
    sequelize_typescript_1.Column({
        type: sequelize_typescript_1.DataType.STRING(50),
        allowNull: false,
    }),
    __metadata("design:type", String)
], Organization.prototype, "facturapiToken", void 0);
__decorate([
    sequelize_typescript_1.Column({
        type: sequelize_typescript_1.DataType.STRING(300),
        allowNull: false,
    }),
    __metadata("design:type", String)
], Organization.prototype, "fiscalAddress", void 0);
__decorate([
    sequelize_typescript_1.Column({
        type: sequelize_typescript_1.DataType.STRING(50),
        allowNull: false,
    }),
    __metadata("design:type", String)
], Organization.prototype, "contactPhone", void 0);
__decorate([
    sequelize_typescript_1.Column({
        type: sequelize_typescript_1.DataType.STRING(50),
        allowNull: false,
    }),
    __metadata("design:type", String)
], Organization.prototype, "contactEmail", void 0);
__decorate([
    sequelize_typescript_1.Column({
        type: sequelize_typescript_1.DataType.STRING(100),
        allowNull: false,
    }),
    __metadata("design:type", String)
], Organization.prototype, "logoUrl", void 0);
__decorate([
    sequelize_typescript_1.Column({
        type: sequelize_typescript_1.DataType.STRING(15),
        allowNull: false,
    }),
    __metadata("design:type", String)
], Organization.prototype, "primaryColor", void 0);
__decorate([
    sequelize_typescript_1.Column({
        type: sequelize_typescript_1.DataType.STRING(15),
        allowNull: false,
    }),
    __metadata("design:type", String)
], Organization.prototype, "secondaryColor", void 0);
__decorate([
    sequelize_typescript_1.Column({
        type: sequelize_typescript_1.DataType.DATE,
        allowNull: false,
    }),
    __metadata("design:type", Date)
], Organization.prototype, "validUntil", void 0);
__decorate([
    sequelize_typescript_1.Column({
        type: sequelize_typescript_1.DataType.INTEGER({ length: 11 }),
        allowNull: false,
    }),
    __metadata("design:type", Number)
], Organization.prototype, "type", void 0);
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
], Organization.prototype, "createdAt", void 0);
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
], Organization.prototype, "updatedAt", void 0);
__decorate([
    sequelize_typescript_1.Column({
        type: sequelize_typescript_1.DataType.BOOLEAN,
        allowNull: true,
        defaultValue: false,
    }),
    __metadata("design:type", Boolean)
], Organization.prototype, "deleted", void 0);
__decorate([
    sequelize_typescript_1.HasMany(() => device_entity_1.Device, 'idOrganization'),
    __metadata("design:type", Array)
], Organization.prototype, "devices", void 0);
__decorate([
    sequelize_typescript_1.HasMany(() => user_entity_1.User, 'idOrganization'),
    __metadata("design:type", Array)
], Organization.prototype, "users", void 0);
__decorate([
    sequelize_typescript_1.HasMany(() => regions_entity_1.Regions, 'idOrganization'),
    __metadata("design:type", Array)
], Organization.prototype, "regions", void 0);
__decorate([
    sequelize_typescript_1.HasMany(() => stations_entity_1.Stations),
    __metadata("design:type", Array)
], Organization.prototype, "stations", void 0);
Organization = __decorate([
    sequelize_typescript_1.Table({
        tableName: 'organizations',
        timestamps: true,
        createdAt: false,
        updatedAt: false,
    })
], Organization);
exports.Organization = Organization;
//# sourceMappingURL=organization.entity.js.map