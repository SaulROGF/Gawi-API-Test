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
exports.Agenda = void 0;
const organization_entity_1 = require("./organization.entity");
const device_entity_1 = require("./device.entity");
const user_entity_1 = require("./user.entity");
const sequelize_typescript_1 = require("sequelize-typescript");
let Agenda = class Agenda extends sequelize_typescript_1.Model {
};
__decorate([
    sequelize_typescript_1.Column({
        type: sequelize_typescript_1.DataType.INTEGER({ length: 11 }),
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
    }),
    __metadata("design:type", Number)
], Agenda.prototype, "idAgenda", void 0);
__decorate([
    sequelize_typescript_1.ForeignKey(() => organization_entity_1.Organization),
    sequelize_typescript_1.Column({
        type: sequelize_typescript_1.DataType.INTEGER({ length: 11 }),
        allowNull: false,
    }),
    __metadata("design:type", Number)
], Agenda.prototype, "idOrganization", void 0);
__decorate([
    sequelize_typescript_1.ForeignKey(() => user_entity_1.User),
    sequelize_typescript_1.Column({
        type: sequelize_typescript_1.DataType.INTEGER({ length: 11 }),
        allowNull: false,
    }),
    __metadata("design:type", Number)
], Agenda.prototype, "idUser", void 0);
__decorate([
    sequelize_typescript_1.ForeignKey(() => device_entity_1.Device),
    sequelize_typescript_1.Column({
        type: sequelize_typescript_1.DataType.INTEGER({ length: 11 }),
        allowNull: false,
    }),
    __metadata("design:type", Number)
], Agenda.prototype, "idDevice", void 0);
__decorate([
    sequelize_typescript_1.Column({
        type: sequelize_typescript_1.DataType.STRING(1000),
        allowNull: false,
    }),
    __metadata("design:type", String)
], Agenda.prototype, "comment", void 0);
__decorate([
    sequelize_typescript_1.Column({
        type: sequelize_typescript_1.DataType.INTEGER,
        allowNull: false,
    }),
    __metadata("design:type", Number)
], Agenda.prototype, "type", void 0);
__decorate([
    sequelize_typescript_1.Column({
        type: sequelize_typescript_1.DataType.STRING(45),
        allowNull: false,
    }),
    __metadata("design:type", String)
], Agenda.prototype, "status", void 0);
__decorate([
    sequelize_typescript_1.Column({
        type: sequelize_typescript_1.DataType.DATE,
        allowNull: false,
        defaultValue: new Date(),
    }),
    __metadata("design:type", Date)
], Agenda.prototype, "viewDate", void 0);
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
], Agenda.prototype, "createdAt", void 0);
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
], Agenda.prototype, "updatedAt", void 0);
Agenda = __decorate([
    sequelize_typescript_1.Table({
        tableName: 'agendas',
        timestamps: true,
        updatedAt: false,
        createdAt: false,
    })
], Agenda);
exports.Agenda = Agenda;
//# sourceMappingURL=agenda.entity.js.map