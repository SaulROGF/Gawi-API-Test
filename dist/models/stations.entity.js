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
exports.Stations = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const zones_entity_1 = require("./zones.entity");
const organization_entity_1 = require("./organization.entity");
const user_entity_1 = require("./user.entity");
let Stations = class Stations extends sequelize_typescript_1.Model {
};
__decorate([
    sequelize_typescript_1.PrimaryKey,
    sequelize_typescript_1.AutoIncrement,
    sequelize_typescript_1.Column({
        type: sequelize_typescript_1.DataType.INTEGER,
        allowNull: false,
        field: 'idStation'
    }),
    __metadata("design:type", Number)
], Stations.prototype, "idStation", void 0);
__decorate([
    sequelize_typescript_1.ForeignKey(() => zones_entity_1.Zones),
    sequelize_typescript_1.Column({
        type: sequelize_typescript_1.DataType.INTEGER,
        allowNull: true,
        field: 'idZone'
    }),
    __metadata("design:type", Number)
], Stations.prototype, "idZone", void 0);
__decorate([
    sequelize_typescript_1.ForeignKey(() => organization_entity_1.Organization),
    sequelize_typescript_1.Column({
        type: sequelize_typescript_1.DataType.INTEGER,
        allowNull: false,
        field: 'idOrganization'
    }),
    __metadata("design:type", Number)
], Stations.prototype, "idOrganization", void 0);
__decorate([
    sequelize_typescript_1.Column({
        type: sequelize_typescript_1.DataType.STRING(100),
        allowNull: false,
        field: 'name'
    }),
    __metadata("design:type", String)
], Stations.prototype, "name", void 0);
__decorate([
    sequelize_typescript_1.ForeignKey(() => user_entity_1.User),
    sequelize_typescript_1.Column({
        type: sequelize_typescript_1.DataType.INTEGER,
        allowNull: true,
        field: 'supervisorId'
    }),
    __metadata("design:type", Number)
], Stations.prototype, "supervisorId", void 0);
__decorate([
    sequelize_typescript_1.Column({
        type: sequelize_typescript_1.DataType.TIME,
        allowNull: true,
        defaultValue: '00:00:00',
        field: 'openingTime'
    }),
    __metadata("design:type", String)
], Stations.prototype, "openingTime", void 0);
__decorate([
    sequelize_typescript_1.Column({
        type: sequelize_typescript_1.DataType.TIME,
        allowNull: true,
        defaultValue: '00:00:00',
        field: 'closingTime'
    }),
    __metadata("design:type", String)
], Stations.prototype, "closingTime", void 0);
__decorate([
    sequelize_typescript_1.Column({
        type: sequelize_typescript_1.DataType.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        field: 'is24Hours'
    }),
    __metadata("design:type", Boolean)
], Stations.prototype, "is24Hours", void 0);
__decorate([
    sequelize_typescript_1.BelongsTo(() => zones_entity_1.Zones),
    __metadata("design:type", zones_entity_1.Zones)
], Stations.prototype, "zone", void 0);
__decorate([
    sequelize_typescript_1.BelongsTo(() => organization_entity_1.Organization),
    __metadata("design:type", organization_entity_1.Organization)
], Stations.prototype, "organization", void 0);
__decorate([
    sequelize_typescript_1.BelongsTo(() => user_entity_1.User),
    __metadata("design:type", user_entity_1.User)
], Stations.prototype, "supervisor", void 0);
Stations = __decorate([
    sequelize_typescript_1.Table({
        tableName: 'stations',
        timestamps: true,
        createdAt: false,
        updatedAt: false,
    })
], Stations);
exports.Stations = Stations;
//# sourceMappingURL=stations.entity.js.map