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
exports.NaturalGasSettings = void 0;
const device_entity_1 = require("./device.entity");
const sequelize_typescript_1 = require("sequelize-typescript");
let NaturalGasSettings = class NaturalGasSettings extends sequelize_typescript_1.Model {
    calculateNewStatus(noSetting, isForApply) {
        let stringStatus = this.status.toString(2);
        while (stringStatus.length < 14) {
            stringStatus = "0" + stringStatus;
        }
        const newStatus = [];
        for (let index = 0; index < stringStatus.length; index++) {
            const element = parseInt(stringStatus[index]);
            newStatus.push(element);
        }
        if (noSetting < 14) {
            newStatus[13 - noSetting] = isForApply ? 0 : 1;
        }
        let newStringStatus = "";
        for (let index = 0; index < newStatus.length; index++) {
            const element = newStatus[index];
            newStringStatus = newStringStatus + element.toString();
        }
        return parseInt(newStringStatus, 2);
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
], NaturalGasSettings.prototype, "idNaturalGasSettings", void 0);
__decorate([
    sequelize_typescript_1.ForeignKey(() => device_entity_1.Device),
    sequelize_typescript_1.Column({
        type: sequelize_typescript_1.DataType.INTEGER({ length: 11 }),
        allowNull: false,
    }),
    __metadata("design:type", Number)
], NaturalGasSettings.prototype, "idDevice", void 0);
__decorate([
    sequelize_typescript_1.Column({
        type: sequelize_typescript_1.DataType.BOOLEAN,
        allowNull: true,
        defaultValue: false,
    }),
    __metadata("design:type", Boolean)
], NaturalGasSettings.prototype, "wereApplied", void 0);
__decorate([
    sequelize_typescript_1.Column({
        type: sequelize_typescript_1.DataType.INTEGER({ length: 11 }),
        allowNull: true,
        defaultValue: 0,
    }),
    __metadata("design:type", Number)
], NaturalGasSettings.prototype, "status", void 0);
__decorate([
    sequelize_typescript_1.Column({
        type: sequelize_typescript_1.DataType.STRING({ length: 100 }),
        allowNull: true,
        defaultValue: '0.0',
    }),
    __metadata("design:type", String)
], NaturalGasSettings.prototype, "firmwareVersion", void 0);
__decorate([
    sequelize_typescript_1.Column({
        type: sequelize_typescript_1.DataType.INTEGER({ length: 11 }),
        allowNull: true,
        defaultValue: 1,
    }),
    __metadata("design:type", Number)
], NaturalGasSettings.prototype, "serviceOutageDay", void 0);
__decorate([
    sequelize_typescript_1.Column({
        type: sequelize_typescript_1.DataType.FLOAT({ length: 10, decimals: 2 }),
        allowNull: true,
        defaultValue: 0.0,
    }),
    __metadata("design:type", Number)
], NaturalGasSettings.prototype, "monthMaxConsumption", void 0);
__decorate([
    sequelize_typescript_1.Column({
        type: sequelize_typescript_1.DataType.STRING({ length: 150 }),
        allowNull: true,
        defaultValue: '',
    }),
    __metadata("design:type", String)
], NaturalGasSettings.prototype, "apiUrl", void 0);
__decorate([
    sequelize_typescript_1.Column({
        type: sequelize_typescript_1.DataType.STRING({ length: 10 }),
        allowNull: true,
        defaultValue: '',
    }),
    __metadata("design:type", String)
], NaturalGasSettings.prototype, "consumptionUnits", void 0);
__decorate([
    sequelize_typescript_1.Column({
        type: sequelize_typescript_1.DataType.INTEGER({ length: 11 }),
        allowNull: true,
        defaultValue: 0,
    }),
    __metadata("design:type", Number)
], NaturalGasSettings.prototype, "storageFrequency", void 0);
__decorate([
    sequelize_typescript_1.Column({
        type: sequelize_typescript_1.DataType.TIME,
        allowNull: true,
        defaultValue: '00:00',
    }),
    __metadata("design:type", String)
], NaturalGasSettings.prototype, "storageTime", void 0);
__decorate([
    sequelize_typescript_1.Column({
        type: sequelize_typescript_1.DataType.TIME,
        allowNull: true,
        defaultValue: '00:00',
    }),
    __metadata("design:type", String)
], NaturalGasSettings.prototype, "dailyTime", void 0);
__decorate([
    sequelize_typescript_1.Column({
        type: sequelize_typescript_1.DataType.INTEGER({ length: 11 }),
        allowNull: true,
        defaultValue: 0,
    }),
    __metadata("design:type", Number)
], NaturalGasSettings.prototype, "customDailyTime", void 0);
__decorate([
    sequelize_typescript_1.Column({
        type: sequelize_typescript_1.DataType.INTEGER({ length: 11 }),
        allowNull: true,
        defaultValue: 0,
    }),
    __metadata("design:type", Number)
], NaturalGasSettings.prototype, "periodicFrequency", void 0);
__decorate([
    sequelize_typescript_1.Column({
        type: sequelize_typescript_1.DataType.TIME,
        allowNull: true,
        defaultValue: '00:00',
    }),
    __metadata("design:type", String)
], NaturalGasSettings.prototype, "periodicTime", void 0);
__decorate([
    sequelize_typescript_1.Column({
        type: sequelize_typescript_1.DataType.INTEGER({ length: 11 }),
        allowNull: true,
        defaultValue: 0,
    }),
    __metadata("design:type", Number)
], NaturalGasSettings.prototype, "ipProtocol", void 0);
__decorate([
    sequelize_typescript_1.Column({
        type: sequelize_typescript_1.DataType.INTEGER({ length: 11 }),
        allowNull: true,
        defaultValue: 0,
    }),
    __metadata("design:type", Number)
], NaturalGasSettings.prototype, "auth", void 0);
__decorate([
    sequelize_typescript_1.Column({
        type: sequelize_typescript_1.DataType.STRING({ length: 50 }),
        allowNull: true,
        defaultValue: '',
    }),
    __metadata("design:type", String)
], NaturalGasSettings.prototype, "label", void 0);
__decorate([
    sequelize_typescript_1.Column({
        type: sequelize_typescript_1.DataType.INTEGER({ length: 11 }),
        allowNull: true,
        defaultValue: 0,
    }),
    __metadata("design:type", Number)
], NaturalGasSettings.prototype, "consumptionAlertType", void 0);
__decorate([
    sequelize_typescript_1.Column({
        type: sequelize_typescript_1.DataType.INTEGER({ length: 11 }),
        allowNull: true,
        defaultValue: 0,
    }),
    __metadata("design:type", Number)
], NaturalGasSettings.prototype, "consumptionAlertSetPoint", void 0);
__decorate([
    sequelize_typescript_1.Column({
        type: sequelize_typescript_1.DataType.INTEGER({ length: 11 }),
        allowNull: true,
        defaultValue: 1,
    }),
    __metadata("design:type", Number)
], NaturalGasSettings.prototype, "consumptionExcessFlag", void 0);
__decorate([
    sequelize_typescript_1.Column({
        type: sequelize_typescript_1.DataType.INTEGER({ length: 11 }),
        allowNull: true,
        defaultValue: 1,
    }),
    __metadata("design:type", Number)
], NaturalGasSettings.prototype, "lowBatteryFlag", void 0);
__decorate([
    sequelize_typescript_1.Column({
        type: sequelize_typescript_1.DataType.INTEGER({ length: 11 }),
        allowNull: true,
        defaultValue: 1,
    }),
    __metadata("design:type", Number)
], NaturalGasSettings.prototype, "sensorFlag", void 0);
__decorate([
    sequelize_typescript_1.Column({
        type: sequelize_typescript_1.DataType.INTEGER({ length: 11 }),
        allowNull: true,
        defaultValue: 1,
    }),
    __metadata("design:type", Number)
], NaturalGasSettings.prototype, "darkSetPoint", void 0);
__decorate([
    sequelize_typescript_1.Column({
        type: sequelize_typescript_1.DataType.INTEGER({ length: 11 }),
        allowNull: true,
        defaultValue: 1,
    }),
    __metadata("design:type", Number)
], NaturalGasSettings.prototype, "darkFlag", void 0);
__decorate([
    sequelize_typescript_1.Column({
        type: sequelize_typescript_1.DataType.INTEGER({ length: 11 }),
        allowNull: true,
        defaultValue: 1,
    }),
    __metadata("design:type", Number)
], NaturalGasSettings.prototype, "lightSetPoint", void 0);
__decorate([
    sequelize_typescript_1.Column({
        type: sequelize_typescript_1.DataType.INTEGER({ length: 11 }),
        allowNull: true,
        defaultValue: 1,
    }),
    __metadata("design:type", Number)
], NaturalGasSettings.prototype, "lightFlag", void 0);
__decorate([
    sequelize_typescript_1.Column({
        type: sequelize_typescript_1.DataType.INTEGER({ length: 11 }),
        allowNull: true,
        defaultValue: 0,
    }),
    __metadata("design:type", Number)
], NaturalGasSettings.prototype, "isOn", void 0);
__decorate([
    sequelize_typescript_1.Column({
        type: sequelize_typescript_1.DataType.DATE,
        allowNull: true,
        defaultValue: () => {
            const date = new Date();
            return new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds()));
        },
        comment: '',
    }),
    __metadata("design:type", Date)
], NaturalGasSettings.prototype, "updatedAt", void 0);
__decorate([
    sequelize_typescript_1.Column({
        type: sequelize_typescript_1.DataType.DATE,
        allowNull: true,
        defaultValue: () => {
            const date = new Date();
            return new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds()));
        },
        comment: '',
    }),
    __metadata("design:type", Date)
], NaturalGasSettings.prototype, "createdAt", void 0);
__decorate([
    sequelize_typescript_1.BelongsTo(() => device_entity_1.Device, 'idDevice'),
    __metadata("design:type", device_entity_1.Device)
], NaturalGasSettings.prototype, "device", void 0);
NaturalGasSettings = __decorate([
    sequelize_typescript_1.Table({
        tableName: 'naturalGasSettings',
    })
], NaturalGasSettings);
exports.NaturalGasSettings = NaturalGasSettings;
//# sourceMappingURL=naturalGasSettings.entity.js.map