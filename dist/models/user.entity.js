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
exports.User = void 0;
const card_entity_1 = require("./card.entity");
const bcrypt = require("bcrypt");
const town_entity_1 = require("./town.entity");
const role_entity_1 = require("./role.entity");
const device_entity_1 = require("./device.entity");
const organization_entity_1 = require("./organization.entity");
const sequelize_typescript_1 = require("sequelize-typescript");
const billingInformation_entity_1 = require("./billingInformation.entity");
const historyPayments_entity_1 = require("./historyPayments.entity");
const notifications_entity_1 = require("./notifications.entity");
let User = class User extends sequelize_typescript_1.Model {
    static async hashPassword(user) {
        user.password = await bcrypt.hash(user.password, bcrypt.genSaltSync(10));
    }
    validPassword(password) {
        return bcrypt.compare(password, this.password);
    }
    async validAlexaPassword(password) {
        if (this.passwordAlexa.length == 0) {
            this.passwordAlexa = await bcrypt.hash(password, bcrypt.genSaltSync(10));
            return {
                checkPass: true,
                isNew: true
            };
        }
        else {
            return {
                checkPass: bcrypt.compare(password, this.passwordAlexa),
                isNew: false
            };
        }
    }
    async hashNewPassword(password) {
        return await bcrypt.hash(password, bcrypt.genSaltSync(10));
    }
};
__decorate([
    sequelize_typescript_1.Column({
        type: sequelize_typescript_1.DataType.INTEGER({ length: 11 }),
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
    }),
    __metadata("design:type", Number)
], User.prototype, "idUser", void 0);
__decorate([
    sequelize_typescript_1.ForeignKey(() => role_entity_1.Role),
    sequelize_typescript_1.Column({
        type: sequelize_typescript_1.DataType.INTEGER({ length: 11 }),
        allowNull: false,
        comment: ' 1 = Root admin' +
            '2 = Organization Admin' +
            '3 = Warehouse user ' +
            '4 = Conta' +
            '5 = Driver' +
            '6 = Technician' +
            '7 = Final User,',
    }),
    __metadata("design:type", Number)
], User.prototype, "idRole", void 0);
__decorate([
    sequelize_typescript_1.ForeignKey(() => town_entity_1.Town),
    sequelize_typescript_1.Column({
        type: sequelize_typescript_1.DataType.INTEGER({ length: 11 }),
        allowNull: false,
    }),
    __metadata("design:type", Number)
], User.prototype, "idTown", void 0);
__decorate([
    sequelize_typescript_1.ForeignKey(() => organization_entity_1.Organization),
    sequelize_typescript_1.Column({
        type: sequelize_typescript_1.DataType.INTEGER({ length: 11 }),
        allowNull: false,
    }),
    __metadata("design:type", Number)
], User.prototype, "idOrganization", void 0);
__decorate([
    sequelize_typescript_1.Column({
        type: sequelize_typescript_1.DataType.STRING(150),
        allowNull: false,
    }),
    __metadata("design:type", String)
], User.prototype, "email", void 0);
__decorate([
    sequelize_typescript_1.Column({
        type: sequelize_typescript_1.DataType.STRING(200),
        allowNull: false,
    }),
    __metadata("design:type", String)
], User.prototype, "password", void 0);
__decorate([
    sequelize_typescript_1.Column({
        type: sequelize_typescript_1.DataType.STRING(50),
        allowNull: true,
        defaultValue: '',
    }),
    __metadata("design:type", String)
], User.prototype, "firstName", void 0);
__decorate([
    sequelize_typescript_1.Column({
        type: sequelize_typescript_1.DataType.STRING(30),
        allowNull: true,
        defaultValue: '',
    }),
    __metadata("design:type", String)
], User.prototype, "lastName", void 0);
__decorate([
    sequelize_typescript_1.Column({
        type: sequelize_typescript_1.DataType.STRING(30),
        allowNull: true,
        defaultValue: '',
    }),
    __metadata("design:type", String)
], User.prototype, "mothersLastName", void 0);
__decorate([
    sequelize_typescript_1.Column({
        type: sequelize_typescript_1.DataType.STRING(10),
        allowNull: true,
        defaultValue: '',
    }),
    __metadata("design:type", String)
], User.prototype, "phone", void 0);
__decorate([
    sequelize_typescript_1.Column({
        type: sequelize_typescript_1.DataType.STRING(200),
        allowNull: true,
        defaultValue: '',
    }),
    __metadata("design:type", String)
], User.prototype, "passwordAlexa", void 0);
__decorate([
    sequelize_typescript_1.Column({
        type: sequelize_typescript_1.DataType.STRING(200),
        allowNull: true,
        defaultValue: '',
    }),
    __metadata("design:type", String)
], User.prototype, "passwordGoogle", void 0);
__decorate([
    sequelize_typescript_1.Column({
        type: sequelize_typescript_1.DataType.STRING(200),
        allowNull: true,
        defaultValue: '',
    }),
    __metadata("design:type", String)
], User.prototype, "passwordFacebook", void 0);
__decorate([
    sequelize_typescript_1.Column({
        type: sequelize_typescript_1.DataType.STRING(200),
        allowNull: true,
        defaultValue: '',
    }),
    __metadata("design:type", String)
], User.prototype, "idConektaAccount", void 0);
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
], User.prototype, "lastLoginDate", void 0);
__decorate([
    sequelize_typescript_1.Column({
        type: sequelize_typescript_1.DataType.BOOLEAN,
        allowNull: false,
    }),
    __metadata("design:type", Boolean)
], User.prototype, "active", void 0);
__decorate([
    sequelize_typescript_1.Column({
        type: sequelize_typescript_1.DataType.BOOLEAN,
        allowNull: true,
        defaultValue: false,
    }),
    __metadata("design:type", Boolean)
], User.prototype, "deleted", void 0);
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
], User.prototype, "createdAt", void 0);
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
], User.prototype, "updatedAt", void 0);
__decorate([
    sequelize_typescript_1.BelongsTo(() => town_entity_1.Town, 'idTown'),
    __metadata("design:type", town_entity_1.Town)
], User.prototype, "town", void 0);
__decorate([
    sequelize_typescript_1.BelongsTo(() => role_entity_1.Role, 'idRole'),
    __metadata("design:type", role_entity_1.Role)
], User.prototype, "role", void 0);
__decorate([
    sequelize_typescript_1.BelongsTo(() => organization_entity_1.Organization, 'idOrganization'),
    __metadata("design:type", organization_entity_1.Organization)
], User.prototype, "organization", void 0);
__decorate([
    sequelize_typescript_1.HasMany(() => device_entity_1.Device, 'idUser'),
    __metadata("design:type", Array)
], User.prototype, "devices", void 0);
__decorate([
    sequelize_typescript_1.HasMany(() => notifications_entity_1.Notifications, 'idUser'),
    __metadata("design:type", Array)
], User.prototype, "notifications", void 0);
__decorate([
    sequelize_typescript_1.HasMany(() => historyPayments_entity_1.HistoryPayment, 'idUser'),
    __metadata("design:type", Array)
], User.prototype, "historyPayments", void 0);
__decorate([
    sequelize_typescript_1.HasMany(() => card_entity_1.Card, 'idUser'),
    __metadata("design:type", Array)
], User.prototype, "cards", void 0);
__decorate([
    sequelize_typescript_1.HasOne(() => billingInformation_entity_1.BillingInformation, 'idUser'),
    __metadata("design:type", billingInformation_entity_1.BillingInformation)
], User.prototype, "billingInformation", void 0);
__decorate([
    sequelize_typescript_1.BeforeCreate,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [User]),
    __metadata("design:returntype", Promise)
], User, "hashPassword", null);
User = __decorate([
    sequelize_typescript_1.Table({
        tableName: 'users',
        timestamps: true,
        createdAt: false,
        updatedAt: false,
    })
], User);
exports.User = User;
//# sourceMappingURL=user.entity.js.map