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
exports.Town = void 0;
const user_entity_1 = require("./user.entity");
const state_entity_1 = require("./state.entity");
const sequelize_typescript_1 = require("sequelize-typescript");
let Town = class Town extends sequelize_typescript_1.Model {
};
__decorate([
    sequelize_typescript_1.Column({
        type: sequelize_typescript_1.DataType.INTEGER({ length: 11 }),
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
    }),
    __metadata("design:type", Number)
], Town.prototype, "idTown", void 0);
__decorate([
    sequelize_typescript_1.ForeignKey(() => state_entity_1.State),
    sequelize_typescript_1.Column({
        type: sequelize_typescript_1.DataType.INTEGER({ length: 11 }),
        allowNull: false,
    }),
    __metadata("design:type", Number)
], Town.prototype, "idState", void 0);
__decorate([
    sequelize_typescript_1.Column({
        type: sequelize_typescript_1.DataType.STRING(100),
        allowNull: false,
    }),
    __metadata("design:type", String)
], Town.prototype, "name", void 0);
__decorate([
    sequelize_typescript_1.HasMany(() => user_entity_1.User, 'idTown'),
    __metadata("design:type", Array)
], Town.prototype, "users", void 0);
__decorate([
    sequelize_typescript_1.BelongsTo(() => state_entity_1.State, 'idState'),
    __metadata("design:type", state_entity_1.State)
], Town.prototype, "state", void 0);
Town = __decorate([
    sequelize_typescript_1.Table({
        tableName: 'towns',
    })
], Town);
exports.Town = Town;
//# sourceMappingURL=town.entity.js.map