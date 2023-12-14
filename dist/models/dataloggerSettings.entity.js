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
exports.DataloggerSettings = void 0;
const device_entity_1 = require("./device.entity");
const sequelize_typescript_1 = require("sequelize-typescript");
let DataloggerSettings = class DataloggerSettings extends sequelize_typescript_1.Model {
};
__decorate([
    sequelize_typescript_1.Column({
        type: sequelize_typescript_1.DataType.INTEGER({ length: 11 }),
        allowNull: true,
        primaryKey: true,
        autoIncrement: true,
        unique: true,
    }),
    __metadata("design:type", Number)
], DataloggerSettings.prototype, "idSettings", void 0);
__decorate([
    sequelize_typescript_1.ForeignKey(() => device_entity_1.Device),
    sequelize_typescript_1.Column({
        type: sequelize_typescript_1.DataType.INTEGER({ length: 11 }),
        allowNull: false,
    }),
    __metadata("design:type", Number)
], DataloggerSettings.prototype, "idDevice", void 0);
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
], DataloggerSettings.prototype, "updatedAt", void 0);
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
], DataloggerSettings.prototype, "createdAt", void 0);
__decorate([
    sequelize_typescript_1.Column({
        type: sequelize_typescript_1.DataType.INTEGER,
        allowNull: true,
        defaultValue: 0,
        comment: 'del 0 al 2 donde 0 = ipv4, 1 = ipv6 y 2 = ipv6v4',
    }),
    __metadata("design:type", Number)
], DataloggerSettings.prototype, "ipProtocol", void 0);
__decorate([
    sequelize_typescript_1.Column({
        type: sequelize_typescript_1.DataType.INTEGER,
        allowNull: true,
        defaultValue: 0,
        comment: 'del 0 al 3 donde 0 = none, 1 = PAP, 2 = CHAP, 3 = PAP/CHAP',
    }),
    __metadata("design:type", Number)
], DataloggerSettings.prototype, "auth", void 0);
__decorate([
    sequelize_typescript_1.Column({
        type: sequelize_typescript_1.DataType.STRING(150),
        allowNull: true,
        defaultValue: 'http://api-test.gawi.mx/',
    }),
    __metadata("design:type", String)
], DataloggerSettings.prototype, "apiUrl", void 0);
__decorate([
    sequelize_typescript_1.Column({
        type: sequelize_typescript_1.DataType.INTEGER,
        allowNull: true,
        defaultValue: 0,
    }),
    __metadata("design:type", Number)
], DataloggerSettings.prototype, "analogMode1", void 0);
__decorate([
    sequelize_typescript_1.Column({
        type: sequelize_typescript_1.DataType.INTEGER,
        allowNull: true,
        defaultValue: 0,
    }),
    __metadata("design:type", Number)
], DataloggerSettings.prototype, "analogMode2", void 0);
__decorate([
    sequelize_typescript_1.Column({
        type: sequelize_typescript_1.DataType.INTEGER,
        allowNull: true,
        defaultValue: 0,
    }),
    __metadata("design:type", Number)
], DataloggerSettings.prototype, "analogMode3", void 0);
__decorate([
    sequelize_typescript_1.Column({
        type: sequelize_typescript_1.DataType.INTEGER,
        allowNull: true,
        defaultValue: 0,
    }),
    __metadata("design:type", Number)
], DataloggerSettings.prototype, "analogMode4", void 0);
__decorate([
    sequelize_typescript_1.Column({
        type: sequelize_typescript_1.DataType.DOUBLE({ length: 10, decimals: 2 }),
        allowNull: true,
        defaultValue: 0.0,
    }),
    __metadata("design:type", Number)
], DataloggerSettings.prototype, "analogBoundary1", void 0);
__decorate([
    sequelize_typescript_1.Column({
        type: sequelize_typescript_1.DataType.DOUBLE({ length: 10, decimals: 2 }),
        allowNull: true,
        defaultValue: 0.0,
    }),
    __metadata("design:type", Number)
], DataloggerSettings.prototype, "analogBoundary2", void 0);
__decorate([
    sequelize_typescript_1.Column({
        type: sequelize_typescript_1.DataType.DOUBLE({ length: 10, decimals: 2 }),
        allowNull: true,
        defaultValue: 0.0,
    }),
    __metadata("design:type", Number)
], DataloggerSettings.prototype, "analogBoundary3", void 0);
__decorate([
    sequelize_typescript_1.Column({
        type: sequelize_typescript_1.DataType.DOUBLE({ length: 10, decimals: 2 }),
        allowNull: true,
        defaultValue: 0.0,
    }),
    __metadata("design:type", Number)
], DataloggerSettings.prototype, "analogBoundary4", void 0);
__decorate([
    sequelize_typescript_1.Column({
        type: sequelize_typescript_1.DataType.INTEGER,
        allowNull: true,
        defaultValue: 0,
    }),
    __metadata("design:type", Number)
], DataloggerSettings.prototype, "flowUnits1", void 0);
__decorate([
    sequelize_typescript_1.Column({
        type: sequelize_typescript_1.DataType.INTEGER,
        allowNull: true,
        defaultValue: 0,
    }),
    __metadata("design:type", Number)
], DataloggerSettings.prototype, "flowUnits2", void 0);
__decorate([
    sequelize_typescript_1.Column({
        type: sequelize_typescript_1.DataType.INTEGER,
        allowNull: true,
        defaultValue: 0,
    }),
    __metadata("design:type", Number)
], DataloggerSettings.prototype, "consumptionUnits1", void 0);
__decorate([
    sequelize_typescript_1.Column({
        type: sequelize_typescript_1.DataType.INTEGER,
        allowNull: true,
        defaultValue: 0,
    }),
    __metadata("design:type", Number)
], DataloggerSettings.prototype, "consumptionUnits2", void 0);
__decorate([
    sequelize_typescript_1.Column({
        type: sequelize_typescript_1.DataType.DOUBLE({ length: 10, decimals: 2 }),
        allowNull: true,
        defaultValue: 0.0,
    }),
    __metadata("design:type", Number)
], DataloggerSettings.prototype, "flowSetpointLow1", void 0);
__decorate([
    sequelize_typescript_1.Column({
        type: sequelize_typescript_1.DataType.DOUBLE({ length: 10, decimals: 2 }),
        allowNull: true,
        defaultValue: 0.0,
    }),
    __metadata("design:type", Number)
], DataloggerSettings.prototype, "flowSetpointLow2", void 0);
__decorate([
    sequelize_typescript_1.Column({
        type: sequelize_typescript_1.DataType.DOUBLE({ length: 10, decimals: 2 }),
        allowNull: true,
        defaultValue: 0.0,
    }),
    __metadata("design:type", Number)
], DataloggerSettings.prototype, "flowSetpointHigh1", void 0);
__decorate([
    sequelize_typescript_1.Column({
        type: sequelize_typescript_1.DataType.DOUBLE({ length: 10, decimals: 2 }),
        allowNull: true,
        defaultValue: 0.0,
    }),
    __metadata("design:type", Number)
], DataloggerSettings.prototype, "flowSetpointHigh2", void 0);
__decorate([
    sequelize_typescript_1.Column({
        type: sequelize_typescript_1.DataType.DOUBLE({ length: 10, decimals: 2 }),
        allowNull: true,
        defaultValue: 0.0,
    }),
    __metadata("design:type", Number)
], DataloggerSettings.prototype, "analogSetpointLow1", void 0);
__decorate([
    sequelize_typescript_1.Column({
        type: sequelize_typescript_1.DataType.DOUBLE({ length: 10, decimals: 2 }),
        allowNull: true,
        defaultValue: 0.0,
    }),
    __metadata("design:type", Number)
], DataloggerSettings.prototype, "analogSetpointLow2", void 0);
__decorate([
    sequelize_typescript_1.Column({
        type: sequelize_typescript_1.DataType.DOUBLE({ length: 10, decimals: 2 }),
        allowNull: true,
        defaultValue: 0.0,
    }),
    __metadata("design:type", Number)
], DataloggerSettings.prototype, "analogSetpointLow3", void 0);
__decorate([
    sequelize_typescript_1.Column({
        type: sequelize_typescript_1.DataType.DOUBLE({ length: 10, decimals: 2 }),
        allowNull: true,
        defaultValue: 0.0,
    }),
    __metadata("design:type", Number)
], DataloggerSettings.prototype, "analogSetpointLow4", void 0);
__decorate([
    sequelize_typescript_1.Column({
        type: sequelize_typescript_1.DataType.DOUBLE({ length: 10, decimals: 2 }),
        allowNull: true,
        defaultValue: 0.0,
    }),
    __metadata("design:type", Number)
], DataloggerSettings.prototype, "analogSetpointHigh1", void 0);
__decorate([
    sequelize_typescript_1.Column({
        type: sequelize_typescript_1.DataType.DOUBLE({ length: 10, decimals: 2 }),
        allowNull: true,
        defaultValue: 0.0,
    }),
    __metadata("design:type", Number)
], DataloggerSettings.prototype, "analogSetpointHigh2", void 0);
__decorate([
    sequelize_typescript_1.Column({
        type: sequelize_typescript_1.DataType.DOUBLE({ length: 10, decimals: 2 }),
        allowNull: true,
        defaultValue: 0.0,
    }),
    __metadata("design:type", Number)
], DataloggerSettings.prototype, "analogSetpointHigh3", void 0);
__decorate([
    sequelize_typescript_1.Column({
        type: sequelize_typescript_1.DataType.DOUBLE({ length: 10, decimals: 2 }),
        allowNull: true,
        defaultValue: 0.0,
    }),
    __metadata("design:type", Number)
], DataloggerSettings.prototype, "analogSetpointHigh4", void 0);
__decorate([
    sequelize_typescript_1.Column({
        type: sequelize_typescript_1.DataType.DOUBLE({ length: 10, decimals: 2 }),
        allowNull: true,
        defaultValue: 0.0,
    }),
    __metadata("design:type", Number)
], DataloggerSettings.prototype, "flowConstant1", void 0);
__decorate([
    sequelize_typescript_1.Column({
        type: sequelize_typescript_1.DataType.DOUBLE({ length: 10, decimals: 2 }),
        allowNull: true,
        defaultValue: 0.0,
    }),
    __metadata("design:type", Number)
], DataloggerSettings.prototype, "flowConstant2", void 0);
__decorate([
    sequelize_typescript_1.Column({
        type: sequelize_typescript_1.DataType.INTEGER({ length: 1 }),
        allowNull: true,
        defaultValue: 1,
        comment: '0 o 1 = desactivada/activada',
    }),
    __metadata("design:type", Number)
], DataloggerSettings.prototype, "dailyTransmission", void 0);
__decorate([
    sequelize_typescript_1.Column({
        type: sequelize_typescript_1.DataType.STRING(5),
        allowNull: true,
        defaultValue: '00:00',
        comment: 'Formato de horas y minutos 00:00',
    }),
    __metadata("design:type", String)
], DataloggerSettings.prototype, "dailyTime", void 0);
__decorate([
    sequelize_typescript_1.Column({
        type: sequelize_typescript_1.DataType.INTEGER,
        allowNull: true,
        defaultValue: 60,
        comment: 'Valores de 0 a 60 (unidad en minutos) 60 = cada hora',
    }),
    __metadata("design:type", Number)
], DataloggerSettings.prototype, "storageFrequency", void 0);
__decorate([
    sequelize_typescript_1.Column({
        type: sequelize_typescript_1.DataType.STRING(5),
        allowNull: true,
        defaultValue: "00:00",
        comment: 'Formato de horas y minutos 00:00',
    }),
    __metadata("design:type", String)
], DataloggerSettings.prototype, "storageTime", void 0);
__decorate([
    sequelize_typescript_1.Column({
        type: sequelize_typescript_1.DataType.STRING(5),
        allowNull: true,
        defaultValue: "00:00",
        comment: 'Formato de horas y minutos 00:00',
    }),
    __metadata("design:type", String)
], DataloggerSettings.prototype, "repeatNotificationTime", void 0);
__decorate([
    sequelize_typescript_1.Column({
        type: sequelize_typescript_1.DataType.INTEGER({ length: 1 }),
        allowNull: true,
        defaultValue: 0,
        comment: '0 o 1 = 12 am(media noche)/12 pm(medio dia)',
    }),
    __metadata("design:type", Number)
], DataloggerSettings.prototype, "customDailyTime", void 0);
__decorate([
    sequelize_typescript_1.Column({
        type: sequelize_typescript_1.DataType.STRING(5),
        allowNull: true,
        defaultValue: '00:00',
        comment: 'Formato de horas y minutos 00:00',
    }),
    __metadata("design:type", String)
], DataloggerSettings.prototype, "periodicTime", void 0);
__decorate([
    sequelize_typescript_1.Column({
        type: sequelize_typescript_1.DataType.INTEGER,
        allowNull: true,
        defaultValue: 0,
        comment: 'Cada cuantos minutos transmite periódicamente ( 0 a 1440 ) donde 1440 es = 1 dia',
    }),
    __metadata("design:type", Number)
], DataloggerSettings.prototype, "periodicFrequency", void 0);
__decorate([
    sequelize_typescript_1.Column({
        type: sequelize_typescript_1.DataType.BOOLEAN,
        allowNull: true,
        defaultValue: 1,
    }),
    __metadata("design:type", Boolean)
], DataloggerSettings.prototype, "isPoweredByBattery", void 0);
__decorate([
    sequelize_typescript_1.Column({
        type: sequelize_typescript_1.DataType.INTEGER({ length: 1 }),
        allowNull: true,
        defaultValue: 1,
        comment: '0 o 1 = desactivada/activada',
    }),
    __metadata("design:type", Number)
], DataloggerSettings.prototype, "measurePowerSupply", void 0);
__decorate([
    sequelize_typescript_1.Column({
        type: sequelize_typescript_1.DataType.STRING(50),
        allowNull: true,
        defaultValue: "",
        comment: 'Comentario o pequeña descripción para identificar el dispositivo',
    }),
    __metadata("design:type", String)
], DataloggerSettings.prototype, "label", void 0);
__decorate([
    sequelize_typescript_1.Column({
        type: sequelize_typescript_1.DataType.INTEGER,
        allowNull: true,
        defaultValue: 0,
    }),
    __metadata("design:type", Number)
], DataloggerSettings.prototype, "digitalMonitoring", void 0);
__decorate([
    sequelize_typescript_1.Column({
        type: sequelize_typescript_1.DataType.STRING(10),
        allowNull: true,
        defaultValue: 'AN-1',
        comment: 'Comentario o pequeña descripción para identificar la entrada',
    }),
    __metadata("design:type", String)
], DataloggerSettings.prototype, "analogLabel1", void 0);
__decorate([
    sequelize_typescript_1.Column({
        type: sequelize_typescript_1.DataType.STRING(10),
        allowNull: true,
        defaultValue: 'AN-2',
        comment: 'Comentario o pequeña descripción para identificar la entrada',
    }),
    __metadata("design:type", String)
], DataloggerSettings.prototype, "analogLabel2", void 0);
__decorate([
    sequelize_typescript_1.Column({
        type: sequelize_typescript_1.DataType.STRING(10),
        allowNull: true,
        defaultValue: 'AN-3',
        comment: 'Comentario o pequeña descripción para identificar la entrada',
    }),
    __metadata("design:type", String)
], DataloggerSettings.prototype, "analogLabel3", void 0);
__decorate([
    sequelize_typescript_1.Column({
        type: sequelize_typescript_1.DataType.STRING(10),
        allowNull: true,
        defaultValue: 'AN-4',
        comment: 'Comentario o pequeña descripción para identificar la entrada',
    }),
    __metadata("design:type", String)
], DataloggerSettings.prototype, "analogLabel4", void 0);
__decorate([
    sequelize_typescript_1.Column({
        type: sequelize_typescript_1.DataType.STRING(10),
        allowNull: true,
        defaultValue: 'DG-1',
        comment: 'Comentario o pequeña descripción para identificar la entrada',
    }),
    __metadata("design:type", String)
], DataloggerSettings.prototype, "digitalLabel1", void 0);
__decorate([
    sequelize_typescript_1.Column({
        type: sequelize_typescript_1.DataType.STRING(10),
        allowNull: true,
        defaultValue: 'DG-2',
        comment: 'Comentario o pequeña descripción para identificar la entrada',
    }),
    __metadata("design:type", String)
], DataloggerSettings.prototype, "digitalLabel2", void 0);
__decorate([
    sequelize_typescript_1.Column({
        type: sequelize_typescript_1.DataType.STRING(10),
        allowNull: true,
        defaultValue: 'DG-3',
        comment: 'Comentario o pequeña descripción para identificar la entrada',
    }),
    __metadata("design:type", String)
], DataloggerSettings.prototype, "digitalLabel3", void 0);
__decorate([
    sequelize_typescript_1.Column({
        type: sequelize_typescript_1.DataType.STRING(10),
        allowNull: true,
        defaultValue: 'DG-4',
        comment: 'Comentario o pequeña descripción para identificar la entrada',
    }),
    __metadata("design:type", String)
], DataloggerSettings.prototype, "digitalLabel4", void 0);
__decorate([
    sequelize_typescript_1.Column({
        type: sequelize_typescript_1.DataType.INTEGER,
        allowNull: true,
        defaultValue: 0,
    }),
    __metadata("design:type", Number)
], DataloggerSettings.prototype, "signalType1", void 0);
__decorate([
    sequelize_typescript_1.Column({
        type: sequelize_typescript_1.DataType.INTEGER,
        allowNull: true,
        defaultValue: 0,
    }),
    __metadata("design:type", Number)
], DataloggerSettings.prototype, "signalType2", void 0);
__decorate([
    sequelize_typescript_1.Column({
        type: sequelize_typescript_1.DataType.INTEGER,
        allowNull: true,
        defaultValue: 0,
    }),
    __metadata("design:type", Number)
], DataloggerSettings.prototype, "signalType3", void 0);
__decorate([
    sequelize_typescript_1.Column({
        type: sequelize_typescript_1.DataType.INTEGER,
        allowNull: true,
        defaultValue: 0,
    }),
    __metadata("design:type", Number)
], DataloggerSettings.prototype, "signalType4", void 0);
__decorate([
    sequelize_typescript_1.BelongsTo(() => device_entity_1.Device, 'idDevice'),
    __metadata("design:type", device_entity_1.Device)
], DataloggerSettings.prototype, "device", void 0);
DataloggerSettings = __decorate([
    sequelize_typescript_1.Table({
        tableName: 'dataloggerSettings',
        timestamps: true,
        updatedAt: false,
        createdAt: false,
    })
], DataloggerSettings);
exports.DataloggerSettings = DataloggerSettings;
//# sourceMappingURL=dataloggerSettings.entity.js.map