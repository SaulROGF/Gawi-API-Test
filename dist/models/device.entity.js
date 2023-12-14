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
exports.Device = void 0;
const apn_entity_1 = require("./apn.entity");
const gasSettings_entity_1 = require("./gasSettings.entity");
const waterSettings_entity_1 = require("./waterSettings.entity");
const bcrypt = require("bcrypt");
const town_entity_1 = require("./town.entity");
const organization_entity_1 = require("./organization.entity");
const user_entity_1 = require("./user.entity");
const sequelize_typescript_1 = require("sequelize-typescript");
const gasHistory_entity_1 = require("./gasHistory.entity");
const waterHistory_entity_1 = require("./waterHistory.entity");
const dataloggerSettings_entity_1 = require("./dataloggerSettings.entity");
const dataloggerHistory_entity_1 = require("./dataloggerHistory.entity");
const naturalGasHistory_entity_1 = require("./naturalGasHistory.entity");
const naturalGasSettings_entity_1 = require("./naturalGasSettings.entity");
let Device = class Device extends sequelize_typescript_1.Model {
    static async hashImei(device) {
        device.imei = await bcrypt.hash(device.imei, bcrypt.genSaltSync(10));
    }
    validateImei(imei) {
        return bcrypt.compare(imei, this.imei);
    }
    async hashNewImei(imei) {
        return await bcrypt.hash(imei, bcrypt.genSaltSync(10));
    }
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
], Device.prototype, "idDevice", void 0);
__decorate([
    sequelize_typescript_1.ForeignKey(() => user_entity_1.User),
    sequelize_typescript_1.Column({
        type: sequelize_typescript_1.DataType.INTEGER({ length: 11 }),
        allowNull: false,
    }),
    __metadata("design:type", Number)
], Device.prototype, "idUser", void 0);
__decorate([
    sequelize_typescript_1.ForeignKey(() => town_entity_1.Town),
    sequelize_typescript_1.Column({
        type: sequelize_typescript_1.DataType.INTEGER({ length: 11 }),
        allowNull: false,
    }),
    __metadata("design:type", Number)
], Device.prototype, "idTown", void 0);
__decorate([
    sequelize_typescript_1.ForeignKey(() => organization_entity_1.Organization),
    sequelize_typescript_1.Column({
        type: sequelize_typescript_1.DataType.INTEGER({ length: 11 }),
        allowNull: false,
    }),
    __metadata("design:type", Number)
], Device.prototype, "idOrganization", void 0);
__decorate([
    sequelize_typescript_1.ForeignKey(() => apn_entity_1.Apn),
    sequelize_typescript_1.Column({
        type: sequelize_typescript_1.DataType.INTEGER({ length: 11 }),
        allowNull: false,
    }),
    __metadata("design:type", Number)
], Device.prototype, "idApn", void 0);
__decorate([
    sequelize_typescript_1.Column({
        type: sequelize_typescript_1.DataType.STRING(100),
        allowNull: false,
    }),
    __metadata("design:type", String)
], Device.prototype, "imei", void 0);
__decorate([
    sequelize_typescript_1.Column({
        type: sequelize_typescript_1.DataType.STRING(150),
        allowNull: true,
        defaultValue: '',
    }),
    __metadata("design:type", String)
], Device.prototype, "name", void 0);
__decorate([
    sequelize_typescript_1.Column({
        type: sequelize_typescript_1.DataType.STRING(100),
        allowNull: false,
    }),
    __metadata("design:type", String)
], Device.prototype, "serialNumber", void 0);
__decorate([
    sequelize_typescript_1.Column({
        type: sequelize_typescript_1.DataType.INTEGER({ length: 1 }),
        allowNull: false,
        comment: '0 - gas, 1 - agua, 2 - datalogger',
    }),
    __metadata("design:type", Number)
], Device.prototype, "type", void 0);
__decorate([
    sequelize_typescript_1.Column({
        type: sequelize_typescript_1.DataType.STRING(10),
        allowNull: true,
        defaultValue: '',
    }),
    __metadata("design:type", String)
], Device.prototype, "boardVersion", void 0);
__decorate([
    sequelize_typescript_1.Column({
        type: sequelize_typescript_1.DataType.INTEGER({ length: 1 }),
        allowNull: true,
        defaultValue: 0,
    }),
    __metadata("design:type", Number)
], Device.prototype, "version", void 0);
__decorate([
    sequelize_typescript_1.Column({
        type: sequelize_typescript_1.DataType.DOUBLE({ length: 10, decimals: 2 }),
        allowNull: false,
    }),
    __metadata("design:type", Number)
], Device.prototype, "tankCapacity", void 0);
__decorate([
    sequelize_typescript_1.Column({
        type: sequelize_typescript_1.DataType.DOUBLE({ length: 15, decimals: 8 }),
        allowNull: false,
    }),
    __metadata("design:type", Number)
], Device.prototype, "latitude", void 0);
__decorate([
    sequelize_typescript_1.Column({
        type: sequelize_typescript_1.DataType.DOUBLE({ length: 15, decimals: 8 }),
        allowNull: false,
    }),
    __metadata("design:type", Number)
], Device.prototype, "longitude", void 0);
__decorate([
    sequelize_typescript_1.Column({
        type: sequelize_typescript_1.DataType.STRING(300),
        allowNull: true,
        defaultValue: '',
    }),
    __metadata("design:type", String)
], Device.prototype, "address", void 0);
__decorate([
    sequelize_typescript_1.Column({
        type: sequelize_typescript_1.DataType.STRING(10),
        allowNull: true,
        defaultValue: '',
    }),
    __metadata("design:type", String)
], Device.prototype, "extNumber", void 0);
__decorate([
    sequelize_typescript_1.Column({
        type: sequelize_typescript_1.DataType.STRING(10),
        allowNull: true,
        defaultValue: '',
    }),
    __metadata("design:type", String)
], Device.prototype, "intNumber", void 0);
__decorate([
    sequelize_typescript_1.Column({
        type: sequelize_typescript_1.DataType.STRING(30),
        allowNull: true,
        defaultValue: '',
    }),
    __metadata("design:type", String)
], Device.prototype, "suburb", void 0);
__decorate([
    sequelize_typescript_1.Column({
        type: sequelize_typescript_1.DataType.STRING(20),
        allowNull: true,
        defaultValue: '',
    }),
    __metadata("design:type", String)
], Device.prototype, "zipCode", void 0);
__decorate([
    sequelize_typescript_1.Column({
        type: sequelize_typescript_1.DataType.STRING(100),
        allowNull: true,
        defaultValue: '',
    }),
    __metadata("design:type", String)
], Device.prototype, "firmwareVersion", void 0);
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
], Device.prototype, "batteryDate", void 0);
__decorate([
    sequelize_typescript_1.Column({
        type: sequelize_typescript_1.DataType.BOOLEAN,
        allowNull: true,
        defaultValue: false
    }),
    __metadata("design:type", Boolean)
], Device.prototype, "isActive", void 0);
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
], Device.prototype, "validUntil", void 0);
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
], Device.prototype, "createdAt", void 0);
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
], Device.prototype, "updatedAt", void 0);
__decorate([
    sequelize_typescript_1.BelongsTo(() => user_entity_1.User, 'idUser'),
    __metadata("design:type", user_entity_1.User)
], Device.prototype, "user", void 0);
__decorate([
    sequelize_typescript_1.BelongsTo(() => apn_entity_1.Apn, 'idApn'),
    __metadata("design:type", apn_entity_1.Apn)
], Device.prototype, "apn", void 0);
__decorate([
    sequelize_typescript_1.BelongsTo(() => organization_entity_1.Organization, 'idOrganization'),
    __metadata("design:type", organization_entity_1.Organization)
], Device.prototype, "organization", void 0);
__decorate([
    sequelize_typescript_1.HasMany(() => gasHistory_entity_1.GasHistory, 'idDevice'),
    __metadata("design:type", Array)
], Device.prototype, "gasHistory", void 0);
__decorate([
    sequelize_typescript_1.HasMany(() => waterHistory_entity_1.WaterHistory, 'idDevice'),
    __metadata("design:type", Array)
], Device.prototype, "waterHistory", void 0);
__decorate([
    sequelize_typescript_1.HasMany(() => dataloggerHistory_entity_1.DataloggerHistory, 'idDevice'),
    __metadata("design:type", Array)
], Device.prototype, "dataloggerHistory", void 0);
__decorate([
    sequelize_typescript_1.HasMany(() => naturalGasHistory_entity_1.NaturalGasHistory, 'idDevice'),
    __metadata("design:type", Array)
], Device.prototype, "naturalGasHistory", void 0);
__decorate([
    sequelize_typescript_1.HasOne(() => waterSettings_entity_1.WaterSettings, 'idDevice'),
    __metadata("design:type", waterSettings_entity_1.WaterSettings)
], Device.prototype, "waterSettings", void 0);
__decorate([
    sequelize_typescript_1.HasOne(() => gasSettings_entity_1.GasSettings, 'idDevice'),
    __metadata("design:type", gasSettings_entity_1.GasSettings)
], Device.prototype, "gasSettings", void 0);
__decorate([
    sequelize_typescript_1.HasOne(() => naturalGasSettings_entity_1.NaturalGasSettings, 'idDevice'),
    __metadata("design:type", naturalGasSettings_entity_1.NaturalGasSettings)
], Device.prototype, "naturalGasSettings", void 0);
__decorate([
    sequelize_typescript_1.HasOne(() => dataloggerSettings_entity_1.DataloggerSettings, 'idDevice'),
    __metadata("design:type", dataloggerSettings_entity_1.DataloggerSettings)
], Device.prototype, "dataloggerSettings", void 0);
__decorate([
    sequelize_typescript_1.BelongsTo(() => town_entity_1.Town, 'idTown'),
    __metadata("design:type", town_entity_1.Town)
], Device.prototype, "town", void 0);
__decorate([
    sequelize_typescript_1.BeforeCreate,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Device]),
    __metadata("design:returntype", Promise)
], Device, "hashImei", null);
Device = __decorate([
    sequelize_typescript_1.Table({
        tableName: 'devices',
        timestamps: true,
        updatedAt: false,
        createdAt: false,
    })
], Device);
exports.Device = Device;
//# sourceMappingURL=device.entity.js.map