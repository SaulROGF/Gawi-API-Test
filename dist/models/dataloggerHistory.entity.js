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
exports.DataloggerHistory = void 0;
const device_entity_1 = require("./device.entity");
const sequelize_typescript_1 = require("sequelize-typescript");
const IN_1_GAIN = 1;
let DataloggerHistory = class DataloggerHistory extends sequelize_typescript_1.Model {
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
], DataloggerHistory.prototype, "idHistory", void 0);
__decorate([
    sequelize_typescript_1.ForeignKey(() => device_entity_1.Device),
    sequelize_typescript_1.Column({
        type: sequelize_typescript_1.DataType.INTEGER({ length: 11 }),
        allowNull: false,
    }),
    __metadata("design:type", Number)
], DataloggerHistory.prototype, "idDevice", void 0);
__decorate([
    sequelize_typescript_1.Column({
        type: sequelize_typescript_1.DataType.INTEGER,
        allowNull: true,
        defaultValue: 0,
    }),
    __metadata("design:type", Number)
], DataloggerHistory.prototype, "batteryLevel", void 0);
__decorate([
    sequelize_typescript_1.Column({
        type: sequelize_typescript_1.DataType.INTEGER,
        allowNull: true,
        defaultValue: 0,
    }),
    __metadata("design:type", Number)
], DataloggerHistory.prototype, "signalQuality", void 0);
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
], DataloggerHistory.prototype, "dateTime", void 0);
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
], DataloggerHistory.prototype, "createdAt", void 0);
__decorate([
    sequelize_typescript_1.Column({
        type: sequelize_typescript_1.DataType.INTEGER,
        allowNull: true,
        defaultValue: 0,
    }),
    __metadata("design:type", Number)
], DataloggerHistory.prototype, "digitalInputs", void 0);
__decorate([
    sequelize_typescript_1.Column({
        type: sequelize_typescript_1.DataType.INTEGER,
        allowNull: true,
        defaultValue: 0,
    }),
    __metadata("design:type", Number)
], DataloggerHistory.prototype, "digitalOutputs", void 0);
__decorate([
    sequelize_typescript_1.Column({
        type: sequelize_typescript_1.DataType.DOUBLE({ length: 10, decimals: 2 }),
        allowNull: true,
        defaultValue: 0.0,
        get() {
            return IN_1_GAIN * this.getDataValue('analogInput1');
        }
    }),
    __metadata("design:type", Number)
], DataloggerHistory.prototype, "analogInput1", void 0);
__decorate([
    sequelize_typescript_1.Column({
        type: sequelize_typescript_1.DataType.DOUBLE({ length: 10, decimals: 2 }),
        allowNull: true,
        defaultValue: 0.0,
    }),
    __metadata("design:type", Number)
], DataloggerHistory.prototype, "analogInput2", void 0);
__decorate([
    sequelize_typescript_1.Column({
        type: sequelize_typescript_1.DataType.DOUBLE({ length: 10, decimals: 2 }),
        allowNull: true,
        defaultValue: 0.0,
    }),
    __metadata("design:type", Number)
], DataloggerHistory.prototype, "analogInput3", void 0);
__decorate([
    sequelize_typescript_1.Column({
        type: sequelize_typescript_1.DataType.DOUBLE({ length: 10, decimals: 2 }),
        allowNull: true,
        defaultValue: 0.0,
    }),
    __metadata("design:type", Number)
], DataloggerHistory.prototype, "analogInput4", void 0);
__decorate([
    sequelize_typescript_1.Column({
        type: sequelize_typescript_1.DataType.DOUBLE({ length: 10, decimals: 2 }),
        allowNull: true,
        defaultValue: 0.0,
    }),
    __metadata("design:type", Number)
], DataloggerHistory.prototype, "flow1", void 0);
__decorate([
    sequelize_typescript_1.Column({
        type: sequelize_typescript_1.DataType.DOUBLE({ length: 10, decimals: 2 }),
        allowNull: true,
        defaultValue: 0.0,
    }),
    __metadata("design:type", Number)
], DataloggerHistory.prototype, "flow2", void 0);
__decorate([
    sequelize_typescript_1.Column({
        type: sequelize_typescript_1.DataType.DOUBLE({ length: 10, decimals: 2 }),
        allowNull: true,
        defaultValue: 0.0,
    }),
    __metadata("design:type", Number)
], DataloggerHistory.prototype, "consumption1", void 0);
__decorate([
    sequelize_typescript_1.Column({
        type: sequelize_typescript_1.DataType.DOUBLE({ length: 10, decimals: 2 }),
        allowNull: true,
        defaultValue: 0.0,
    }),
    __metadata("design:type", Number)
], DataloggerHistory.prototype, "consumption2", void 0);
__decorate([
    sequelize_typescript_1.Column({
        type: sequelize_typescript_1.DataType.INTEGER,
        allowNull: true,
        defaultValue: 0,
    }),
    __metadata("design:type", Number)
], DataloggerHistory.prototype, "alerts", void 0);
__decorate([
    sequelize_typescript_1.BelongsTo(() => device_entity_1.Device, 'idDevice'),
    __metadata("design:type", device_entity_1.Device)
], DataloggerHistory.prototype, "device", void 0);
DataloggerHistory = __decorate([
    sequelize_typescript_1.Table({
        tableName: 'dataloggerHistory',
        timestamps: true,
        updatedAt: false,
        createdAt: false,
    })
], DataloggerHistory);
exports.DataloggerHistory = DataloggerHistory;
//# sourceMappingURL=dataloggerHistory.entity.js.map