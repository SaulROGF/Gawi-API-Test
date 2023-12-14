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
exports.PublicService = void 0;
const common_1 = require("@nestjs/common");
const ServerMessage_class_1 = require("./../../../classes/ServerMessage.class");
const emails_service_1 = require("./../../../modules/global/emails/emails.service");
const geo_location_service_1 = require("./../../../modules/global/geo-location/geo-location.service");
const auth_service_1 = require("../auth/auth.service");
const conekta_service_service_1 = require("../../global/conekta-service/conekta-service.service");
const jwt_1 = require("@nestjs/jwt");
let PublicService = class PublicService {
    constructor(jwtService, authService, emailsService, geoLocationService, conektaService, userRepository) {
        this.jwtService = jwtService;
        this.authService = authService;
        this.emailsService = emailsService;
        this.geoLocationService = geoLocationService;
        this.conektaService = conektaService;
        this.userRepository = userRepository;
    }
    async generateRecoveryEmail(body) {
        try {
            if (body.recoverEmail == null || body.recoverEmail == undefined) {
                return new ServerMessage_class_1.ServerMessage(true, 'Petición incompleta', null);
            }
            let emailOwner = await this.userRepository.findOne({
                where: {
                    email: body.recoverEmail,
                    active: true,
                    deleted: false,
                },
            });
            if (!emailOwner) {
                return new ServerMessage_class_1.ServerMessage(true, "El correo es invalido", null);
            }
            const lifeTime = 15 * 60;
            const token = this.jwtService.sign({
                email: body.recoverEmail,
            }, {
                expiresIn: lifeTime,
            });
            const recoveryUrl = `${process.env.WEB_URL}/#/recovery/${token}`;
            console.log("URL:", recoveryUrl);
            return await this.emailsService.recoveryPassword(body.recoverEmail, recoveryUrl);
        }
        catch (error) {
            return new ServerMessage_class_1.ServerMessage(true, "Ha ocurrido un error", error);
        }
    }
    async resetPassword(bodyForRecoverEmail) {
        try {
            if (bodyForRecoverEmail.recoverEmail == null ||
                bodyForRecoverEmail.recoverEmail == undefined) {
                return new ServerMessage_class_1.ServerMessage(true, 'Petición incompleta', {});
            }
            let queredUser = await this.userRepository.findOne({
                where: {
                    email: bodyForRecoverEmail.recoverEmail,
                    active: true,
                    deleted: false,
                },
            });
            let newPassword = this.generatePassword(8);
            queredUser.password = await queredUser.hashNewPassword(newPassword);
            await queredUser.save();
            return await this.emailsService.resetPassword(bodyForRecoverEmail.recoverEmail, newPassword);
        }
        catch (error) {
            console.log(error);
            return new ServerMessage_class_1.ServerMessage(true, 'No fue posible restablecer una contraseña provisional', error);
        }
    }
    generatePassword(length) {
        const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let password = '';
        for (let i = 0, n = charset.length; i < length; ++i) {
            password += charset.charAt(Math.floor(Math.random() * n));
        }
        return password;
    }
    async createClient(newClientData, ip) {
        try {
            let location = await this.geoLocationService.getLocationByIp(ip);
            const constraints = [
                location == null,
                location == undefined,
                location.data == null,
                location.data == undefined,
                newClientData.idOrganization == null,
                newClientData.idOrganization == undefined,
                newClientData.idTown == null,
                newClientData.idTown == undefined,
                newClientData.idRole == null,
                newClientData.idRole == undefined,
                newClientData.firstName == null,
                newClientData.firstName == undefined,
                newClientData.lastName == null,
                newClientData.lastName == undefined,
                newClientData.mothersLastName == null,
                newClientData.mothersLastName == undefined,
                newClientData.phone == null,
                newClientData.phone == undefined,
                newClientData.email == null,
                newClientData.email == undefined,
                newClientData.password == null,
                newClientData.password == undefined,
                newClientData.active == null,
                newClientData.active == undefined,
            ];
            if (constraints.some(val => val)) {
                return new ServerMessage_class_1.ServerMessage(true, 'Campos inválidos', {});
            }
            let alreadyUser = await this.userRepository.findOne({
                where: {
                    email: newClientData.email,
                    deleted: false,
                },
            });
            let alreadyCustomer = await this.conektaService.findCustomerByEmail(newClientData.email);
            if (alreadyUser || alreadyCustomer.total > 0) {
                return new ServerMessage_class_1.ServerMessage(true, 'Email actualmente registrado', {});
            }
            let queredUser = await this.userRepository.findOne({
                where: {
                    idRole: 1,
                },
            });
            if (queredUser) {
                let customer = await this.conektaService.createConektaCustomer(newClientData.firstName +
                    ' ' +
                    newClientData.lastName +
                    ' ' +
                    newClientData.mothersLastName, newClientData.email, newClientData.phone);
                if (!customer) {
                    return new ServerMessage_class_1.ServerMessage(true, 'Error al generar usuario', {});
                }
                console.log("CUSTOMER:", customer);
                let newClient = await this.userRepository.create({
                    idRole: 7,
                    idTown: location.data.town,
                    idOrganization: queredUser.idOrganization,
                    email: newClientData.email,
                    password: newClientData.password,
                    firstName: newClientData.firstName,
                    lastName: newClientData.lastName,
                    mothersLastName: newClientData.mothersLastName,
                    phone: newClientData.phone,
                    active: true,
                    deleted: false,
                    idConektaAccount: customer.id,
                });
                console.log("CLIENT:", newClient);
                let responseAuth = await this.authService.validateUserByPassword({
                    email: newClientData.email,
                    password: newClientData.password,
                });
                let emailResponse = await this.emailsService.welcome(newClientData.email, newClientData.firstName);
                if (emailResponse.error == true) {
                    console.log("********:", emailResponse);
                    return new ServerMessage_class_1.ServerMessage(false, 'Registro éxitoso, error enviando el correo de bienvenida', responseAuth.data);
                }
                else {
                    return new ServerMessage_class_1.ServerMessage(false, 'Registro éxitoso', responseAuth.data);
                }
            }
            else {
                return new ServerMessage_class_1.ServerMessage(true, 'No existe la organización principal', {});
            }
        }
        catch (error) {
            console.log(error);
            return new ServerMessage_class_1.ServerMessage(true, 'A ocurrido un error creando el usuario', error);
        }
    }
};
PublicService = __decorate([
    common_1.Injectable(),
    __param(5, common_1.Inject('UserRepository')),
    __metadata("design:paramtypes", [jwt_1.JwtService,
        auth_service_1.AuthService,
        emails_service_1.EmailsService,
        geo_location_service_1.GeoLocationService,
        conekta_service_service_1.ConektaService, Object])
], PublicService);
exports.PublicService = PublicService;
//# sourceMappingURL=public.service.js.map