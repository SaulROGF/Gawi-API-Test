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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const town_entity_1 = require("./../../../models/town.entity");
const ServerMessage_class_1 = require("./../../../classes/ServerMessage.class");
const common_1 = require("@nestjs/common");
const conekta_service_service_1 = require("./../../global/conekta-service/conekta-service.service");
const sequelize_1 = require("sequelize");
const state_entity_1 = require("../../../models/state.entity");
const bcrypt = require("bcrypt");
let UserService = class UserService {
    constructor(conektaService, userRepository) {
        this.conektaService = conektaService;
        this.userRepository = userRepository;
    }
    async getAllUsers() {
        return await this.userRepository.findAll();
    }
    async findOneByEmailActiveNotDeleted(useremail) {
        return await this.userRepository.findOne({
            where: {
                email: useremail,
                active: true,
                deleted: false,
            },
            include: [
                {
                    model: town_entity_1.Town,
                    as: 'town',
                    include: [
                        {
                            model: state_entity_1.State,
                            as: 'state',
                        },
                    ],
                },
            ],
        });
    }
    async createUser(newUserData) {
        try {
            if (newUserData.email == null ||
                newUserData.email == undefined ||
                newUserData.password == null ||
                newUserData.password == undefined) {
                return new ServerMessage_class_1.ServerMessage(true, 'Petición incompleta', {});
            }
            var userUsernameEmail = await this.userRepository.findOne({
                attributes: ['email'],
                where: {
                    [sequelize_1.Op.or]: [
                        {
                            email: newUserData.email,
                        },
                    ],
                },
            });
            if (userUsernameEmail) {
                return new ServerMessage_class_1.ServerMessage(true, 'Nombre y/ó email actualmente registrado', {});
            }
            let newUser = await this.userRepository.create({
                password: newUserData.password,
                email: newUserData.email,
            }, {});
        }
        catch (error) {
            return new ServerMessage_class_1.ServerMessage(true, 'A ocurrido un error creando el usuario.', error);
        }
    }
    async changePassword(body) {
        try {
            if (body.email == null ||
                body.email == undefined ||
                body.password == null ||
                body.password == undefined) {
                return new ServerMessage_class_1.ServerMessage(true, 'Petición incompleta', {});
            }
            var user = await this.userRepository.findOne({
                where: {
                    [sequelize_1.Op.or]: [
                        {
                            email: body.email,
                        },
                    ],
                },
            });
            if (!user) {
                return new ServerMessage_class_1.ServerMessage(true, 'No existe el usuario', null);
            }
            const newPassword = await bcrypt.hash(body.password, bcrypt.genSaltSync(10));
            user.password = newPassword;
            await user.save();
            return new ServerMessage_class_1.ServerMessage(false, "contraseña cambiada éxitosamente", null);
        }
        catch (error) {
            return new ServerMessage_class_1.ServerMessage(true, "Ha ocurrido un error", error);
        }
    }
};
UserService = __decorate([
    common_1.Injectable(),
    __param(1, common_1.Inject('UserRepository')),
    __metadata("design:paramtypes", [conekta_service_service_1.ConektaService, Object])
], UserService);
exports.UserService = UserService;
//# sourceMappingURL=user.service.js.map