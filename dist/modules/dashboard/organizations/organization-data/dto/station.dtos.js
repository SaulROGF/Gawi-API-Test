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
exports.UpdateStationDto = exports.CreateStationDto = void 0;
const class_validator_1 = require("class-validator");
class CreateStationDto {
}
__decorate([
    class_validator_1.IsInt({ message: 'El idOrganization debe ser un número entero.' }),
    __metadata("design:type", Number)
], CreateStationDto.prototype, "idOrganization", void 0);
__decorate([
    class_validator_1.IsOptional(),
    class_validator_1.IsInt({ message: 'El idZone debe ser un número entero.' }),
    __metadata("design:type", Number)
], CreateStationDto.prototype, "idZone", void 0);
__decorate([
    class_validator_1.IsNotEmpty({ message: 'El nombre no debe estar vacío.' }),
    class_validator_1.Length(1, 100, { message: 'El nombre debe tener entre 1 y 100 caracteres.' }),
    __metadata("design:type", String)
], CreateStationDto.prototype, "name", void 0);
__decorate([
    class_validator_1.IsOptional(),
    class_validator_1.IsInt({ message: 'El supervisorId debe ser un número entero.' }),
    __metadata("design:type", Number)
], CreateStationDto.prototype, "supervisorId", void 0);
__decorate([
    class_validator_1.IsOptional(),
    class_validator_1.IsNotEmpty({ message: 'El openingTime no debe estar vacío.' }),
    class_validator_1.Matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/, {
        message: 'openingTime debe ser una hora válida en formato HH:mm:ss.'
    }),
    __metadata("design:type", String)
], CreateStationDto.prototype, "openingTime", void 0);
__decorate([
    class_validator_1.IsOptional(),
    class_validator_1.IsNotEmpty({ message: 'El closingTime no debe estar vacío.' }),
    class_validator_1.Matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/, {
        message: 'closingTime debe ser una hora válida en formato HH:mm:ss.'
    }),
    __metadata("design:type", String)
], CreateStationDto.prototype, "closingTime", void 0);
__decorate([
    class_validator_1.IsOptional(),
    class_validator_1.IsBoolean({ message: 'is24Hours debe ser un valor booleano.' }),
    __metadata("design:type", Boolean)
], CreateStationDto.prototype, "is24Hours", void 0);
exports.CreateStationDto = CreateStationDto;
class UpdateStationDto {
}
__decorate([
    class_validator_1.IsOptional(),
    class_validator_1.IsInt({ message: 'El idZone debe ser un número entero.' }),
    __metadata("design:type", Number)
], UpdateStationDto.prototype, "idZone", void 0);
__decorate([
    class_validator_1.IsOptional(),
    class_validator_1.IsNotEmpty({ message: 'El nombre no debe estar vacío.' }),
    class_validator_1.Length(1, 100, { message: 'El nombre debe tener entre 1 y 100 caracteres.' }),
    __metadata("design:type", String)
], UpdateStationDto.prototype, "name", void 0);
__decorate([
    class_validator_1.IsOptional(),
    class_validator_1.IsInt({ message: 'El supervisorId debe ser un número entero.' }),
    __metadata("design:type", Number)
], UpdateStationDto.prototype, "supervisorId", void 0);
__decorate([
    class_validator_1.IsOptional(),
    class_validator_1.IsNotEmpty({ message: 'El openingTime no debe estar vacío.' }),
    class_validator_1.Matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/, {
        message: 'openingTime debe ser una hora válida en formato HH:mm:ss.'
    }),
    __metadata("design:type", String)
], UpdateStationDto.prototype, "openingTime", void 0);
__decorate([
    class_validator_1.IsOptional(),
    class_validator_1.IsNotEmpty({ message: 'El closingTime no debe estar vacío.' }),
    class_validator_1.Matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/, {
        message: 'closingTime debe ser una hora válida en formato HH:mm:ss.'
    }),
    __metadata("design:type", String)
], UpdateStationDto.prototype, "closingTime", void 0);
__decorate([
    class_validator_1.IsOptional(),
    class_validator_1.IsBoolean({ message: 'is24Hours debe ser un valor booleano.' }),
    __metadata("design:type", Boolean)
], UpdateStationDto.prototype, "is24Hours", void 0);
__decorate([
    class_validator_1.IsInt({ message: 'El idDeLaOrganización debe ser un número entero.' }),
    __metadata("design:type", Number)
], UpdateStationDto.prototype, "idOrganization", void 0);
exports.UpdateStationDto = UpdateStationDto;
//# sourceMappingURL=station.dtos.js.map