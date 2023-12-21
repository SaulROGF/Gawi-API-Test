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
exports.Card = void 0;
const user_entity_1 = require("./user.entity");
const sequelize_typescript_1 = require("sequelize-typescript");
let Card = class Card extends sequelize_typescript_1.Model {
};
__decorate([
    sequelize_typescript_1.Column({
        type: sequelize_typescript_1.DataType.INTEGER({ length: 11 }),
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
    }),
    __metadata("design:type", Number)
], Card.prototype, "idCard", void 0);
__decorate([
    sequelize_typescript_1.ForeignKey(() => user_entity_1.User),
    sequelize_typescript_1.Column({
        type: sequelize_typescript_1.DataType.INTEGER({ length: 11 }),
        allowNull: false,
    }),
    __metadata("design:type", Number)
], Card.prototype, "idUser", void 0);
__decorate([
    sequelize_typescript_1.Column({
        type: sequelize_typescript_1.DataType.STRING(100),
        allowNull: false,
    }),
    __metadata("design:type", String)
], Card.prototype, "conektaCardToken", void 0);
__decorate([
    sequelize_typescript_1.Column({
        type: sequelize_typescript_1.DataType.STRING(150),
        allowNull: false,
    }),
    __metadata("design:type", String)
], Card.prototype, "printedName", void 0);
__decorate([
    sequelize_typescript_1.Column({
        type: sequelize_typescript_1.DataType.INTEGER({ length: 4 }),
        allowNull: false,
    }),
    __metadata("design:type", Number)
], Card.prototype, "last4Digits", void 0);
__decorate([
    sequelize_typescript_1.Column({
        type: sequelize_typescript_1.DataType.BOOLEAN,
        allowNull: false,
    }),
    __metadata("design:type", Boolean)
], Card.prototype, "activePaymentMethod", void 0);
__decorate([
    sequelize_typescript_1.Column({
        type: sequelize_typescript_1.DataType.STRING(20),
        allowNull: false,
    }),
    __metadata("design:type", String)
], Card.prototype, "brand", void 0);
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
], Card.prototype, "createdAt", void 0);
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
], Card.prototype, "updatedAt", void 0);
Card = __decorate([
    sequelize_typescript_1.Table({
        tableName: 'cards',
        timestamps: true,
        updatedAt: false,
        createdAt: false,
    })
], Card);
exports.Card = Card;
//# sourceMappingURL=card.entity.js.map