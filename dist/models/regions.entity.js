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
exports.Regions = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const organization_entity_1 = require("./organization.entity");
const zones_entity_1 = require("./zones.entity");
let Regions = class Regions extends sequelize_typescript_1.Model {
};
__decorate([
    sequelize_typescript_1.PrimaryKey,
    sequelize_typescript_1.AutoIncrement,
    sequelize_typescript_1.Column({
        type: sequelize_typescript_1.DataType.INTEGER,
        allowNull: false,
        field: 'idRegion'
    }),
    __metadata("design:type", Number)
], Regions.prototype, "idRegion", void 0);
__decorate([
    sequelize_typescript_1.ForeignKey(() => organization_entity_1.Organization),
    sequelize_typescript_1.Column({
        type: sequelize_typescript_1.DataType.INTEGER,
        allowNull: false,
        field: 'idOrganization'
    }),
    __metadata("design:type", Number)
], Regions.prototype, "idOrganization", void 0);
__decorate([
    sequelize_typescript_1.Column({
        type: sequelize_typescript_1.DataType.STRING(100),
        allowNull: false,
        field: 'name'
    }),
    __metadata("design:type", String)
], Regions.prototype, "name", void 0);
__decorate([
    sequelize_typescript_1.BelongsTo(() => organization_entity_1.Organization),
    __metadata("design:type", organization_entity_1.Organization)
], Regions.prototype, "organization", void 0);
__decorate([
    sequelize_typescript_1.HasMany(() => zones_entity_1.Zones),
    __metadata("design:type", Array)
], Regions.prototype, "zones", void 0);
Regions = __decorate([
    sequelize_typescript_1.Table({
        tableName: 'regions',
        timestamps: true,
        createdAt: false,
        updatedAt: false,
    })
], Regions);
exports.Regions = Regions;
//# sourceMappingURL=regions.entity.js.map