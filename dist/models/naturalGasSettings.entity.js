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
        type: sequelize_typescript_1.DataType.INTEGER,
        allowNull: true,
        defaultValue: 1,
        comment: 'Fecha de corte con default primer dia de cada mes',
    }),
    __metadata("design:type", Number)
], NaturalGasSettings.prototype, "serviceOutageDay", void 0);
__decorate([
    sequelize_typescript_1.Column({
        type: sequelize_typescript_1.DataType.FLOAT,
        allowNull: true,
        defaultValue: 0.0,
        comment: 'Limite para mandar la alerta de consumo exedido',
    }),
    __metadata("design:type", Number)
], NaturalGasSettings.prototype, "monthMaxConsumption", void 0);
__decorate([
    sequelize_typescript_1.Column({
        type: sequelize_typescript_1.DataType.STRING(150),
        allowNull: false,
        comment: 'Url a la cual el dispositivo esta transmitiendo continuamente',
    }),
    __metadata("design:type", String)
], NaturalGasSettings.prototype, "apiUrl", void 0);
__decorate([
    sequelize_typescript_1.Column({
        type: sequelize_typescript_1.DataType.STRING(5),
        allowNull: false,
        comment: 'valores permitidos M3 , L y G',
    }),
    __metadata("design:type", String)
], NaturalGasSettings.prototype, "consumptionUnits", void 0);
__decorate([
    sequelize_typescript_1.Column({
        type: sequelize_typescript_1.DataType.INTEGER,
        allowNull: true,
        defaultValue: 0,
        comment: 'del 0 al 2 donde 0 = ipv4, 1 = ipv6 y 2 = ipv6v4',
    }),
    __metadata("design:type", Number)
], NaturalGasSettings.prototype, "ipProtocol", void 0);
__decorate([
    sequelize_typescript_1.Column({
        type: sequelize_typescript_1.DataType.INTEGER,
        allowNull: true,
        defaultValue: 0,
        comment: 'del 0 al 3 donde 0 = none, 1 = PAP, 2 = CHAP, 3 = PAP/CHAP',
    }),
    __metadata("design:type", Number)
], NaturalGasSettings.prototype, "auth", void 0);
__decorate([
    sequelize_typescript_1.Column({
        type: sequelize_typescript_1.DataType.STRING(50),
        allowNull: true,
        defaultValue: "",
        comment: 'Comentario o pequeña descripción para identificar el dispositivo',
    }),
    __metadata("design:type", String)
], NaturalGasSettings.prototype, "label", void 0);
__decorate([
    sequelize_typescript_1.Column({
        type: sequelize_typescript_1.DataType.BOOLEAN,
        allowNull: true,
        defaultValue: 1,
        comment: 'Variable para apagar o prender el medidor de agua',
    }),
    __metadata("design:type", Boolean)
], NaturalGasSettings.prototype, "isOn", void 0);
__decorate([
    sequelize_typescript_1.Column({
        type: sequelize_typescript_1.DataType.DATE,
        allowNull: true,
        defaultValue: () => {
            let date = new Date();
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
            let date = new Date();
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