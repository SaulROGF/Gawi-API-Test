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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const user_service_1 = require("../user/user.service");
const ServerMessage_class_1 = require("../../../classes/ServerMessage.class");
let AuthService = class AuthService {
    constructor(usersService, jwtService, logger, organizationRepository, notificationRepository) {
        this.usersService = usersService;
        this.jwtService = jwtService;
        this.logger = logger;
        this.organizationRepository = organizationRepository;
        this.notificationRepository = notificationRepository;
    }
    async disableNotifications(credentials) {
        try {
            if (credentials.idUser == null ||
                credentials.idUser == undefined ||
                credentials.uuid == null ||
                credentials.uuid == undefined) {
                return new ServerMessage_class_1.ServerMessage(true, 'Petición incompleta', {});
            }
            let storedCredentials = await this.notificationRepository.findOne({
                where: {
                    idUser: credentials.idUser,
                    uuid: credentials.uuid,
                },
            });
            await storedCredentials.destroy();
            return new ServerMessage_class_1.ServerMessage(false, 'credenciales sustituidas', {});
        }
        catch (error) {
            return new ServerMessage_class_1.ServerMessage(true, 'Ha ocurrido un error', {});
        }
    }
    async storeNotificationCredentials(credentials, idUser) {
        try {
            if (credentials.token == null ||
                credentials.token == undefined ||
                credentials.uuid == null ||
                credentials.uuid == undefined) {
                return new ServerMessage_class_1.ServerMessage(true, 'Petición incompleta', {});
            }
            let storedCredentials = await this.notificationRepository.findOne({
                where: {
                    uuid: credentials.uuid,
                },
            });
            if (!storedCredentials) {
                let newCredentials = await this.notificationRepository.create({
                    idUser: idUser,
                    token: credentials.token,
                    uuid: credentials.uuid,
                    isLogged: true,
                });
                return new ServerMessage_class_1.ServerMessage(false, 'credenciales generadas', {});
            }
            if (storedCredentials.idUser == idUser) {
                storedCredentials.token = credentials.token;
                storedCredentials.lastLogin = new Date();
                storedCredentials.updatedAt = new Date();
                storedCredentials.isLogged = true;
                await storedCredentials.save();
                return new ServerMessage_class_1.ServerMessage(false, 'token actualizado', {});
            }
            else {
                await storedCredentials.destroy();
                let newCredentials = await this.notificationRepository.create({
                    idUser: idUser,
                    token: credentials.token,
                    uuid: credentials.uuid,
                    isLogged: true,
                });
                return new ServerMessage_class_1.ServerMessage(false, 'credenciales sustituidas', {});
            }
        }
        catch (error) {
            return new ServerMessage_class_1.ServerMessage(true, 'Ha ocurrido un error', {});
        }
    }
    async validateUserByPassword(loginAttempt) {
        if (loginAttempt.email == null ||
            loginAttempt.email == undefined ||
            loginAttempt.password == null ||
            loginAttempt.password == undefined) {
            return new ServerMessage_class_1.ServerMessage(true, 'Petición incompleta', {});
        }
        let userToAttempt = await this.usersService.findOneByEmailActiveNotDeleted(loginAttempt.email);
        if (userToAttempt != null) {
            try {
                let checkPass = await userToAttempt.validPassword(loginAttempt.password);
                if (checkPass) {
                    let response = this.createJwtPayload(userToAttempt.email);
                    userToAttempt.lastLoginDate = new Date();
                    await userToAttempt.save();
                    response.user = await this.generateUserData(userToAttempt);
                    return new ServerMessage_class_1.ServerMessage(false, 'Inicio exitoso', response);
                }
                else {
                    return new ServerMessage_class_1.ServerMessage(true, 'Sin autorización para acceder a la cuenta', new common_1.UnauthorizedException());
                }
            }
            catch (error) {
                this.logger.error(`-> [LIN] ${error}`);
                return new ServerMessage_class_1.ServerMessage(true, 'Ha ocurrido un error', error);
            }
        }
        else {
            return new ServerMessage_class_1.ServerMessage(true, 'Usuario y/o contraseña incorrectos', new common_1.UnauthorizedException());
        }
    }
    async validateUserByJwt(payload) {
        let user;
        user = await this.usersService.findOneByEmailActiveNotDeleted(payload.email);
        if (user) {
            return user;
        }
        else {
            throw new common_1.UnauthorizedException();
        }
    }
    createJwtPayload(email) {
        let lifeTime = 365 * 24 * 60 * 60;
        let jwt = this.jwtService.sign({
            email: email
        }, {
            expiresIn: lifeTime,
        });
        return {
            expiresIn: lifeTime,
            token: jwt
        };
    }
    async generateUserData(userToAttempt) {
        let organization = await this.organizationRepository.findOne({
            where: {
                idOrganization: userToAttempt.idOrganization,
            },
        });
        let haveImage = false;
        if (organization.logoUrl.length > 0) {
            haveImage = true;
        }
        return {
            idUser: this.checkNullUndefined(userToAttempt.idUser)
                ? -1
                : userToAttempt.idUser,
            idRole: this.checkNullUndefined(userToAttempt.idRole)
                ? -1
                : userToAttempt.idRole,
            idOrganization: this.checkNullUndefined(userToAttempt.idOrganization)
                ? -1
                : userToAttempt.idOrganization,
            idTown: this.checkNullUndefined(userToAttempt.idTown)
                ? -1
                : userToAttempt.idTown,
            email: this.checkNullUndefined(userToAttempt.email)
                ? ''
                : userToAttempt.email,
            phone: this.checkNullUndefined(userToAttempt.phone)
                ? ''
                : userToAttempt.phone,
            firstName: this.checkNullUndefined(userToAttempt.firstName)
                ? ''
                : userToAttempt.firstName,
            lastName: this.checkNullUndefined(userToAttempt.lastName)
                ? ''
                : userToAttempt.lastName,
            mothersLastName: this.checkNullUndefined(userToAttempt.mothersLastName)
                ? ''
                : userToAttempt.mothersLastName,
            lastLoginDate: this.checkNullUndefined(userToAttempt.lastLoginDate) ? new Date() : userToAttempt.lastLoginDate,
            createdAt: userToAttempt.createdAt,
            updatedAt: userToAttempt.updatedAt,
            town: userToAttempt.town,
            haveLogo: haveImage,
            logoUrl: organization.logoUrl,
        };
    }
    checkNullUndefined(varTest) {
        if (varTest == null || varTest == undefined) {
            return true;
        }
        else {
            return false;
        }
    }
};
AuthService = __decorate([
    common_1.Injectable(),
    __param(2, common_1.Inject('winston')),
    __param(3, common_1.Inject('OrganizationRepository')),
    __param(4, common_1.Inject('NotificationsRepository')),
    __metadata("design:paramtypes", [user_service_1.UserService,
        jwt_1.JwtService, Object, Object, Object])
], AuthService);
exports.AuthService = AuthService;
//# sourceMappingURL=auth.service.js.map