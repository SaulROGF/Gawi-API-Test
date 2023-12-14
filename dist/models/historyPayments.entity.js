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
exports.HistoryPayment = void 0;
const organization_entity_1 = require("./organization.entity");
const user_entity_1 = require("./user.entity");
const device_entity_1 = require("./device.entity");
const sequelize_typescript_1 = require("sequelize-typescript");
let HistoryPayment = class HistoryPayment extends sequelize_typescript_1.Model {
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
], HistoryPayment.prototype, "idHistoryPayments", void 0);
__decorate([
    sequelize_typescript_1.ForeignKey(() => user_entity_1.User),
    sequelize_typescript_1.Column({
        type: sequelize_typescript_1.DataType.INTEGER({ length: 11 }),
        allowNull: false,
    }),
    __metadata("design:type", Number)
], HistoryPayment.prototype, "idUser", void 0);
__decorate([
    sequelize_typescript_1.ForeignKey(() => device_entity_1.Device),
    sequelize_typescript_1.Column({
        type: sequelize_typescript_1.DataType.INTEGER({ length: 11 }),
        allowNull: false,
    }),
    __metadata("design:type", Number)
], HistoryPayment.prototype, "idDevice", void 0);
__decorate([
    sequelize_typescript_1.ForeignKey(() => organization_entity_1.Organization),
    sequelize_typescript_1.Column({
        type: sequelize_typescript_1.DataType.INTEGER({ length: 11 }),
        allowNull: false,
    }),
    __metadata("design:type", Number)
], HistoryPayment.prototype, "idOrganization", void 0);
__decorate([
    sequelize_typescript_1.Column({
        type: sequelize_typescript_1.DataType.INTEGER,
        allowNull: false,
        comment: '0 - suscripción un año pago con tarjeta, 1 - Transferencia electrónica de fondos'
    }),
    __metadata("design:type", Number)
], HistoryPayment.prototype, "type", void 0);
__decorate([
    sequelize_typescript_1.Column({
        type: sequelize_typescript_1.DataType.STRING(1255),
        allowNull: false,
    }),
    __metadata("design:type", String)
], HistoryPayment.prototype, "paymentToken", void 0);
__decorate([
    sequelize_typescript_1.Column({
        type: sequelize_typescript_1.DataType.STRING(100),
        allowNull: false,
    }),
    __metadata("design:type", String)
], HistoryPayment.prototype, "product", void 0);
__decorate([
    sequelize_typescript_1.Column({
        type: sequelize_typescript_1.DataType.STRING(3),
        allowNull: false,
        comment: '0 - la suscripcion no se renueva automaticamente'
    }),
    __metadata("design:type", String)
], HistoryPayment.prototype, "currency", void 0);
__decorate([
    sequelize_typescript_1.Column({
        type: sequelize_typescript_1.DataType.STRING(45),
        allowNull: false,
        comment: 'waiting-pay, waiting-approval, successful-payment, payment-error, '
    }),
    __metadata("design:type", String)
], HistoryPayment.prototype, "status", void 0);
__decorate([
    sequelize_typescript_1.Column({
        type: sequelize_typescript_1.DataType.STRING(1000),
        allowNull: true,
        defaultValue: '',
    }),
    __metadata("design:type", String)
], HistoryPayment.prototype, "commentForUser", void 0);
__decorate([
    sequelize_typescript_1.Column({
        type: sequelize_typescript_1.DataType.STRING(200),
        allowNull: true,
        defaultValue: '',
    }),
    __metadata("design:type", String)
], HistoryPayment.prototype, "facturapiInvoiceId", void 0);
__decorate([
    sequelize_typescript_1.Column({
        type: sequelize_typescript_1.DataType.STRING(500),
        allowNull: true,
        defaultValue: '',
    }),
    __metadata("design:type", String)
], HistoryPayment.prototype, "verificationUrl", void 0);
__decorate([
    sequelize_typescript_1.Column({
        type: sequelize_typescript_1.DataType.STRING(200),
        allowNull: true,
        defaultValue: '',
    }),
    __metadata("design:type", String)
], HistoryPayment.prototype, "conektaOrderId", void 0);
__decorate([
    sequelize_typescript_1.Column({
        type: sequelize_typescript_1.DataType.STRING(5000),
        allowNull: false,
    }),
    __metadata("design:type", String)
], HistoryPayment.prototype, "object", void 0);
__decorate([
    sequelize_typescript_1.Column({
        type: sequelize_typescript_1.DataType.FLOAT,
        allowNull: false,
    }),
    __metadata("design:type", Number)
], HistoryPayment.prototype, "amount", void 0);
__decorate([
    sequelize_typescript_1.Column({
        type: sequelize_typescript_1.DataType.BOOLEAN,
        allowNull: false,
    }),
    __metadata("design:type", Boolean)
], HistoryPayment.prototype, "invoiced", void 0);
__decorate([
    sequelize_typescript_1.Column({
        type: sequelize_typescript_1.DataType.BOOLEAN,
        allowNull: false,
    }),
    __metadata("design:type", Boolean)
], HistoryPayment.prototype, "needInvoice", void 0);
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
], HistoryPayment.prototype, "createdAt", void 0);
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
], HistoryPayment.prototype, "updatedAt", void 0);
__decorate([
    sequelize_typescript_1.BelongsTo(() => user_entity_1.User, 'idUser'),
    __metadata("design:type", user_entity_1.User)
], HistoryPayment.prototype, "user", void 0);
__decorate([
    sequelize_typescript_1.BelongsTo(() => organization_entity_1.Organization, 'idOrganization'),
    __metadata("design:type", organization_entity_1.Organization)
], HistoryPayment.prototype, "organization", void 0);
__decorate([
    sequelize_typescript_1.BelongsTo(() => device_entity_1.Device, 'idDevice'),
    __metadata("design:type", device_entity_1.Device)
], HistoryPayment.prototype, "device", void 0);
HistoryPayment = __decorate([
    sequelize_typescript_1.Table({
        tableName: 'historyPayments',
        timestamps: true,
        createdAt: false,
        updatedAt: false,
    })
], HistoryPayment);
exports.HistoryPayment = HistoryPayment;
//# sourceMappingURL=historyPayments.entity.js.map