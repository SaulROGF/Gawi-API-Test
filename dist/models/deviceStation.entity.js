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
exports.DeviceStation = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const device_entity_1 = require("./device.entity");
const stations_entity_1 = require("./stations.entity");
let DeviceStation = class DeviceStation extends sequelize_typescript_1.Model {
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
], DeviceStation.prototype, "idDeviceStation", void 0);
__decorate([
    sequelize_typescript_1.ForeignKey(() => device_entity_1.Device),
    sequelize_typescript_1.Column({
        type: sequelize_typescript_1.DataType.INTEGER({ length: 11 }),
        allowNull: false,
        primaryKey: false,
        autoIncrement: false,
        unique: true,
    }),
    __metadata("design:type", Number)
], DeviceStation.prototype, "idDevice", void 0);
__decorate([
    sequelize_typescript_1.ForeignKey(() => stations_entity_1.Stations),
    sequelize_typescript_1.Column({
        type: sequelize_typescript_1.DataType.INTEGER,
        allowNull: false,
        field: 'idStation'
    }),
    __metadata("design:type", Number)
], DeviceStation.prototype, "idStation", void 0);
__decorate([
    sequelize_typescript_1.BelongsTo(() => device_entity_1.Device, 'idDevice'),
    __metadata("design:type", device_entity_1.Device)
], DeviceStation.prototype, "device", void 0);
__decorate([
    sequelize_typescript_1.BelongsTo(() => stations_entity_1.Stations, 'idStation'),
    __metadata("design:type", stations_entity_1.Stations)
], DeviceStation.prototype, "stations", void 0);
DeviceStation = __decorate([
    sequelize_typescript_1.Table({
        tableName: 'deviceStation',
        timestamps: true,
        updatedAt: false,
        createdAt: false,
    })
], DeviceStation);
exports.DeviceStation = DeviceStation;
//# sourceMappingURL=deviceStation.entity.js.map