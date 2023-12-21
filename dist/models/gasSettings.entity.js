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
exports.GasSettings = void 0;
const device_entity_1 = require("./device.entity");
const sequelize_typescript_1 = require("sequelize-typescript");
let GasSettings = class GasSettings extends sequelize_typescript_1.Model {
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
], GasSettings.prototype, "idGasSettings", void 0);
__decorate([
    sequelize_typescript_1.ForeignKey(() => device_entity_1.Device),
    sequelize_typescript_1.Column({
        type: sequelize_typescript_1.DataType.INTEGER({ length: 11 }),
        allowNull: false,
    }),
    __metadata("design:type", Number)
], GasSettings.prototype, "idDevice", void 0);
__decorate([
    sequelize_typescript_1.Column({
        type: sequelize_typescript_1.DataType.STRING(150),
        allowNull: false,
    }),
    __metadata("design:type", String)
], GasSettings.prototype, "destUrl", void 0);
__decorate([
    sequelize_typescript_1.Column({
        type: sequelize_typescript_1.DataType.STRING(5),
        allowNull: false,
    }),
    __metadata("design:type", String)
], GasSettings.prototype, "closingHour", void 0);
__decorate([
    sequelize_typescript_1.Column({
        type: sequelize_typescript_1.DataType.STRING(4),
        allowNull: false,
    }),
    __metadata("design:type", String)
], GasSettings.prototype, "consumptionUnits", void 0);
__decorate([
    sequelize_typescript_1.Column({
        type: sequelize_typescript_1.DataType.STRING(20),
        allowNull: false,
    }),
    __metadata("design:type", String)
], GasSettings.prototype, "consumptionPeriod", void 0);
__decorate([
    sequelize_typescript_1.Column({
        type: sequelize_typescript_1.DataType.INTEGER,
        allowNull: false,
    }),
    __metadata("design:type", Number)
], GasSettings.prototype, "minFillingPercentage", void 0);
__decorate([
    sequelize_typescript_1.Column({
        type: sequelize_typescript_1.DataType.INTEGER,
        allowNull: false,
    }),
    __metadata("design:type", Number)
], GasSettings.prototype, "interval", void 0);
__decorate([
    sequelize_typescript_1.Column({
        type: sequelize_typescript_1.DataType.INTEGER,
        allowNull: false,
    }),
    __metadata("design:type", Number)
], GasSettings.prototype, "minsBetweenMeasurements", void 0);
__decorate([
    sequelize_typescript_1.Column({
        type: sequelize_typescript_1.DataType.BOOLEAN,
        allowNull: true,
        defaultValue: false,
    }),
    __metadata("design:type", Boolean)
], GasSettings.prototype, "travelMode", void 0);
__decorate([
    sequelize_typescript_1.Column({
        type: sequelize_typescript_1.DataType.STRING(100),
        allowNull: true,
        defaultValue: '0',
    }),
    __metadata("design:type", String)
], GasSettings.prototype, "firmwareVersion", void 0);
__decorate([
    sequelize_typescript_1.Column({
        type: sequelize_typescript_1.DataType.INTEGER,
        allowNull: true,
        defaultValue: 0,
    }),
    __metadata("design:type", Number)
], GasSettings.prototype, "offset", void 0);
__decorate([
    sequelize_typescript_1.Column({
        type: sequelize_typescript_1.DataType.STRING(5),
        allowNull: true,
        defaultValue: '00:01',
    }),
    __metadata("design:type", String)
], GasSettings.prototype, "offsetTime", void 0);
__decorate([
    sequelize_typescript_1.Column({
        type: sequelize_typescript_1.DataType.BOOLEAN,
        allowNull: true,
        defaultValue: false,
    }),
    __metadata("design:type", Boolean)
], GasSettings.prototype, "wereApplied", void 0);
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
], GasSettings.prototype, "createdAt", void 0);
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
], GasSettings.prototype, "updatedAt", void 0);
__decorate([
    sequelize_typescript_1.BelongsTo(() => device_entity_1.Device, 'idDevice'),
    __metadata("design:type", device_entity_1.Device)
], GasSettings.prototype, "device", void 0);
GasSettings = __decorate([
    sequelize_typescript_1.Table({
        tableName: 'gasSettings',
        timestamps: true,
        updatedAt: false,
        createdAt: false,
    })
], GasSettings);
exports.GasSettings = GasSettings;
//# sourceMappingURL=gasSettings.entity.js.map