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
exports.WaterSettings = void 0;
const device_entity_1 = require("./device.entity");
const sequelize_typescript_1 = require("sequelize-typescript");
let WaterSettings = class WaterSettings extends sequelize_typescript_1.Model {
    calculateNewStatus(noSetting, isForApply) {
        let stringStatus = this.status.toString(2);
        while (stringStatus.length < 14) {
            stringStatus = "0" + stringStatus;
        }
        let newStatus = [];
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
], WaterSettings.prototype, "idWaterSettings", void 0);
__decorate([
    sequelize_typescript_1.ForeignKey(() => device_entity_1.Device),
    sequelize_typescript_1.Column({
        type: sequelize_typescript_1.DataType.INTEGER({ length: 11 }),
        allowNull: false,
    }),
    __metadata("design:type", Number)
], WaterSettings.prototype, "idDevice", void 0);
__decorate([
    sequelize_typescript_1.Column({
        type: sequelize_typescript_1.DataType.STRING(100),
        allowNull: true,
        defaultValue: '1.0.0',
        comment: '',
    }),
    __metadata("design:type", String)
], WaterSettings.prototype, "firmwareVersion", void 0);
__decorate([
    sequelize_typescript_1.Column({
        type: sequelize_typescript_1.DataType.INTEGER,
        allowNull: true,
        defaultValue: 1,
        comment: 'Fecha de corte con default primer dia de cada mes',
    }),
    __metadata("design:type", Number)
], WaterSettings.prototype, "serviceOutageDay", void 0);
__decorate([
    sequelize_typescript_1.Column({
        type: sequelize_typescript_1.DataType.FLOAT,
        allowNull: true,
        defaultValue: 0.0,
        comment: 'Limite para mandar la alerta de consumo exedido',
    }),
    __metadata("design:type", Number)
], WaterSettings.prototype, "monthMaxConsumption", void 0);
__decorate([
    sequelize_typescript_1.Column({
        type: sequelize_typescript_1.DataType.BOOLEAN,
        allowNull: true,
        defaultValue: false,
        comment: 'Si todos los campos de status son 1 (16383 o aplicados) el valor es true',
    }),
    __metadata("design:type", Boolean)
], WaterSettings.prototype, "wereApplied", void 0);
__decorate([
    sequelize_typescript_1.Column({
        type: sequelize_typescript_1.DataType.INTEGER,
        allowNull: true,
        defaultValue: 0,
        comment: 'Bandera de binarios en numero entero con val max 16383 que representa cuando se debe aplicar una configuración',
    }),
    __metadata("design:type", Number)
], WaterSettings.prototype, "status", void 0);
__decorate([
    sequelize_typescript_1.Column({
        type: sequelize_typescript_1.DataType.STRING(150),
        allowNull: false,
        comment: 'Url a la cual el dispositivo esta transmitiendo continuamente',
    }),
    __metadata("design:type", String)
], WaterSettings.prototype, "apiUrl", void 0);
__decorate([
    sequelize_typescript_1.Column({
        type: sequelize_typescript_1.DataType.STRING(5),
        allowNull: false,
        comment: 'valores permitidos M3 , L y G',
    }),
    __metadata("design:type", String)
], WaterSettings.prototype, "consumptionUnits", void 0);
__decorate([
    sequelize_typescript_1.Column({
        type: sequelize_typescript_1.DataType.STRING(5),
        allowNull: false,
        comment: 'Valores permitidos LPS, M3H y GPM',
    }),
    __metadata("design:type", String)
], WaterSettings.prototype, "flowUnits", void 0);
__decorate([
    sequelize_typescript_1.Column({
        type: sequelize_typescript_1.DataType.INTEGER,
        allowNull: true,
        defaultValue: 60,
        comment: 'Valores de 0 a 60 (unidad en minutos) 60 = cada hora',
    }),
    __metadata("design:type", Number)
], WaterSettings.prototype, "storageFrequency", void 0);
__decorate([
    sequelize_typescript_1.Column({
        type: sequelize_typescript_1.DataType.STRING(5),
        allowNull: true,
        defaultValue: "00:00",
        comment: 'Formato de horas y minutos 00:00',
    }),
    __metadata("design:type", String)
], WaterSettings.prototype, "storageTime", void 0);
__decorate([
    sequelize_typescript_1.Column({
        type: sequelize_typescript_1.DataType.INTEGER({ length: 1 }),
        allowNull: true,
        defaultValue: 1,
        comment: '0 o 1 = desactivada/activada',
    }),
    __metadata("design:type", Number)
], WaterSettings.prototype, "dailyTransmission", void 0);
__decorate([
    sequelize_typescript_1.Column({
        type: sequelize_typescript_1.DataType.STRING(5),
        allowNull: true,
        defaultValue: '',
        comment: 'Formato de horas y minutos 00:00',
    }),
    __metadata("design:type", String)
], WaterSettings.prototype, "dailyTime", void 0);
__decorate([
    sequelize_typescript_1.Column({
        type: sequelize_typescript_1.DataType.INTEGER({ length: 1 }),
        allowNull: true,
        defaultValue: 0,
        comment: '0 o 1  = 12 am(media noche)/12 pm(medio dia)',
    }),
    __metadata("design:type", Number)
], WaterSettings.prototype, "customDailyTime", void 0);
__decorate([
    sequelize_typescript_1.Column({
        type: sequelize_typescript_1.DataType.INTEGER,
        allowNull: true,
        defaultValue: 0,
        comment: 'Cada cuantos minutos transmite periódicamente ( 0 a 1440 ) donde 1440 es = 1 dia',
    }),
    __metadata("design:type", Number)
], WaterSettings.prototype, "periodicFrequency", void 0);
__decorate([
    sequelize_typescript_1.Column({
        type: sequelize_typescript_1.DataType.STRING(5),
        allowNull: true,
        defaultValue: '',
        comment: 'Formato de horas y minutos 00:00',
    }),
    __metadata("design:type", String)
], WaterSettings.prototype, "periodicTime", void 0);
__decorate([
    sequelize_typescript_1.Column({
        type: sequelize_typescript_1.DataType.INTEGER,
        allowNull: true,
        defaultValue: 0,
        comment: 'del 0 al 2 donde 0 = ipv4, 1 = ipv6 y 2 = ipv6v4',
    }),
    __metadata("design:type", Number)
], WaterSettings.prototype, "ipProtocol", void 0);
__decorate([
    sequelize_typescript_1.Column({
        type: sequelize_typescript_1.DataType.INTEGER,
        allowNull: true,
        defaultValue: 0,
        comment: 'del 0 al 3 donde 0 = none, 1 = PAP, 2 = CHAP, 3 = PAP/CHAP',
    }),
    __metadata("design:type", Number)
], WaterSettings.prototype, "auth", void 0);
__decorate([
    sequelize_typescript_1.Column({
        type: sequelize_typescript_1.DataType.STRING(50),
        allowNull: true,
        defaultValue: "",
        comment: 'Comentario o pequeña descripción para identificar el dispositivo',
    }),
    __metadata("design:type", String)
], WaterSettings.prototype, "label", void 0);
__decorate([
    sequelize_typescript_1.Column({
        type: sequelize_typescript_1.DataType.INTEGER,
        allowNull: true,
        defaultValue: 0,
        comment: 'Opciones: 0 = continua y 1 = mensual',
    }),
    __metadata("design:type", Number)
], WaterSettings.prototype, "consumptionAlertType", void 0);
__decorate([
    sequelize_typescript_1.Column({
        type: sequelize_typescript_1.DataType.INTEGER,
        allowNull: true,
        defaultValue: 1,
        comment: '1 a ???, la unidad seria igual a 1 litro/min',
    }),
    __metadata("design:type", Number)
], WaterSettings.prototype, "consumptionSetpoint", void 0);
__decorate([
    sequelize_typescript_1.Column({
        type: sequelize_typescript_1.DataType.INTEGER,
        allowNull: true,
        defaultValue: 30,
        comment: 'De 0 a 1440 medida en minutos donde 1440 = 1 dia',
    }),
    __metadata("design:type", Number)
], WaterSettings.prototype, "dripSetpoint", void 0);
__decorate([
    sequelize_typescript_1.Column({
        type: sequelize_typescript_1.DataType.INTEGER,
        allowNull: true,
        defaultValue: 30,
        comment: 'De 0 a 1440 medida en minutos donde 1440 = 1 dia',
    }),
    __metadata("design:type", Number)
], WaterSettings.prototype, "burstSetpoint", void 0);
__decorate([
    sequelize_typescript_1.Column({
        type: sequelize_typescript_1.DataType.INTEGER,
        allowNull: true,
        defaultValue: 30,
        comment: 'De 0 a 1440 medida en minutos donde 1440 = 1 dia',
    }),
    __metadata("design:type", Number)
], WaterSettings.prototype, "flowSetpoint", void 0);
__decorate([
    sequelize_typescript_1.Column({
        type: sequelize_typescript_1.DataType.BOOLEAN,
        allowNull: true,
        defaultValue: 1,
        comment: 'Variable para activar las notificaciones en la app para goteo',
    }),
    __metadata("design:type", Boolean)
], WaterSettings.prototype, "dripFlag", void 0);
__decorate([
    sequelize_typescript_1.Column({
        type: sequelize_typescript_1.DataType.BOOLEAN,
        allowNull: true,
        defaultValue: 1,
        comment: 'Variable para activar las notificaciones en la app para notificaciones de manipulacion',
    }),
    __metadata("design:type", Boolean)
], WaterSettings.prototype, "manipulationFlag", void 0);
__decorate([
    sequelize_typescript_1.Column({
        type: sequelize_typescript_1.DataType.BOOLEAN,
        allowNull: true,
        defaultValue: true,
        comment: 'Variable para activar las notificaciones de flujo inverso en la app',
    }),
    __metadata("design:type", Boolean)
], WaterSettings.prototype, "reversedFlowFlag", void 0);
__decorate([
    sequelize_typescript_1.Column({
        type: sequelize_typescript_1.DataType.BOOLEAN,
        allowNull: true,
        defaultValue: 1,
        comment: 'Variable para activar las notificaciones de fuga inverso en la app',
    }),
    __metadata("design:type", Boolean)
], WaterSettings.prototype, "burstFlag", void 0);
__decorate([
    sequelize_typescript_1.Column({
        type: sequelize_typescript_1.DataType.BOOLEAN,
        allowNull: true,
        defaultValue: 1,
        comment: 'Variable para activar las notificaciones de burbujas inverso en la app',
    }),
    __metadata("design:type", Boolean)
], WaterSettings.prototype, "bubbleFlag", void 0);
__decorate([
    sequelize_typescript_1.Column({
        type: sequelize_typescript_1.DataType.BOOLEAN,
        allowNull: true,
        defaultValue: 1,
        comment: 'Variable para activar las notificaciones de tuberia vacia inverso en la app',
    }),
    __metadata("design:type", Boolean)
], WaterSettings.prototype, "emptyFlag", void 0);
__decorate([
    sequelize_typescript_1.Column({
        type: sequelize_typescript_1.DataType.BOOLEAN,
        allowNull: true,
        defaultValue: 1,
        comment: 'Variable para apagar o prender el medidor de agua',
    }),
    __metadata("design:type", Boolean)
], WaterSettings.prototype, "isOn", void 0);
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
], WaterSettings.prototype, "updatedAt", void 0);
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
], WaterSettings.prototype, "createdAt", void 0);
__decorate([
    sequelize_typescript_1.BelongsTo(() => device_entity_1.Device, 'idDevice'),
    __metadata("design:type", device_entity_1.Device)
], WaterSettings.prototype, "device", void 0);
WaterSettings = __decorate([
    sequelize_typescript_1.Table({
        tableName: 'waterSettings',
        timestamps: true,
        updatedAt: false,
        createdAt: false,
    })
], WaterSettings);
exports.WaterSettings = WaterSettings;
//# sourceMappingURL=waterSettings.entity.js.map