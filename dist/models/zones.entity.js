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
exports.Zones = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const regions_entity_1 = require("./regions.entity");
const stations_entity_1 = require("./stations.entity");
const organization_entity_1 = require("./organization.entity");
let Zones = class Zones extends sequelize_typescript_1.Model {
};
__decorate([
    sequelize_typescript_1.PrimaryKey,
    sequelize_typescript_1.AutoIncrement,
    sequelize_typescript_1.Column({
        type: sequelize_typescript_1.DataType.INTEGER,
        allowNull: false,
        field: 'idZone'
    }),
    __metadata("design:type", Number)
], Zones.prototype, "idZone", void 0);
__decorate([
    sequelize_typescript_1.ForeignKey(() => regions_entity_1.Regions),
    sequelize_typescript_1.Column({
        type: sequelize_typescript_1.DataType.INTEGER,
        allowNull: false,
        field: 'idRegion'
    }),
    __metadata("design:type", Number)
], Zones.prototype, "idRegion", void 0);
__decorate([
    sequelize_typescript_1.ForeignKey(() => organization_entity_1.Organization),
    sequelize_typescript_1.Column({
        type: sequelize_typescript_1.DataType.INTEGER,
        allowNull: false,
        field: 'idOrganization'
    }),
    __metadata("design:type", Number)
], Zones.prototype, "idOrganization", void 0);
__decorate([
    sequelize_typescript_1.Column({
        type: sequelize_typescript_1.DataType.STRING(100),
        allowNull: false,
        field: 'name'
    }),
    __metadata("design:type", String)
], Zones.prototype, "name", void 0);
__decorate([
    sequelize_typescript_1.BelongsTo(() => regions_entity_1.Regions),
    __metadata("design:type", regions_entity_1.Regions)
], Zones.prototype, "region", void 0);
__decorate([
    sequelize_typescript_1.HasMany(() => stations_entity_1.Stations),
    __metadata("design:type", Array)
], Zones.prototype, "stations", void 0);
Zones = __decorate([
    sequelize_typescript_1.Table({
        tableName: 'zones',
        timestamps: true,
        createdAt: false,
        updatedAt: false,
    })
], Zones);
exports.Zones = Zones;
//# sourceMappingURL=zones.entity.js.map