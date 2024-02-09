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
exports.AlexaSkillService = exports.AlexaResponseMsg = void 0;
const common_1 = require("@nestjs/common");
const axios = require("axios");
const devices_service_1 = require("./../devices/devices.service");
const ServerMessage_class_1 = require("../../../../classes/ServerMessage.class");
const user_service_1 = require("../../../public/user/user.service");
const auth_service_1 = require("../../../public/auth/auth.service");
class AlexaResponseMsg {
    constructor(speechText, endSession = false, loginCard = false) {
        this.speechText = speechText;
        this.endSession = endSession;
        this.loginCard = loginCard;
    }
}
exports.AlexaResponseMsg = AlexaResponseMsg;
let AlexaSkillService = class AlexaSkillService {
    constructor(logger, devicesClientService, authService, usersService, userRepository) {
        this.logger = logger;
        this.devicesClientService = devicesClientService;
        this.authService = authService;
        this.usersService = usersService;
        this.userRepository = userRepository;
        this.axios = axios.default;
    }
    async validateUserByAlexaPassword(loginAttempt) {
        if (loginAttempt.email == null ||
            loginAttempt.email == undefined ||
            loginAttempt.passwordAlexa == null ||
            loginAttempt.passwordAlexa == undefined ||
            loginAttempt.option == null ||
            loginAttempt.option == undefined ||
            loginAttempt.senHi == null ||
            loginAttempt.senHi == undefined ||
            loginAttempt.numberDevice == null ||
            loginAttempt.numberDevice == undefined) {
            return new ServerMessage_class_1.ServerMessage(true, 'Petición incompleta', {});
        }
        let userToAttempt = await this.usersService.findOneByEmailActiveNotDeleted(loginAttempt.email);
        if (userToAttempt != null) {
            try {
                let { checkPass, isNew } = await userToAttempt.validAlexaPassword(loginAttempt.passwordAlexa);
                if (checkPass) {
                    userToAttempt.lastLoginDate = new Date();
                    await userToAttempt.save();
                    let responseData = {};
                    if (loginAttempt.option < 1 || loginAttempt.option > 2) {
                        return new ServerMessage_class_1.ServerMessage(true, 'Petición invalida', {});
                    }
                    if (loginAttempt.option == 1) {
                        let response = await this.getAlexaUserDevicesList(userToAttempt.email, loginAttempt.senHi, isNew);
                        responseData = response;
                    }
                    else if (loginAttempt.option == 2) {
                        let response = await this.getAlexaActualDeviceMeasure(userToAttempt.email, loginAttempt.numberDevice);
                        responseData = response;
                    }
                    return new ServerMessage_class_1.ServerMessage(false, 'Respuesta para Alexa obtenida', responseData);
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
    async getAlexaUserDevicesList(email, senHi, isNew) {
        let requestUser = await this.userRepository.findOne({
            where: {
                email: email
            },
        });
        if (!requestUser) {
            return new AlexaResponseMsg("No cuentas con una cuenta en GAWI, baja la app disponible en la Play Store o App Store", false, false);
        }
        let userDevices = await this.devicesClientService.getDevices(requestUser);
        let speechText = "";
        if (isNew) {
            speechText = "Hola! Bienvenido a GAWI. Parece que es tu primera vez por aquí. Te platicaré un poco acerca " +
                "de mi y las cosas que puedo hacer: " +
                "Estoy aquí para proveerte información acerca del consumo de tu red de agua o tanque estacionario," +
                " dependiendo de los medidores GAWI registrados en tu cuenta,  creada a través de la aplicación móvil de Gawi." +
                "Recuerda que si tenes alguna duda puedes revisar mi documentación con el comando “ayuda”." +
                "";
        }
        else if (senHi) {
            speechText = "Bienvenido de nuevo a GAWI,";
        }
        speechText = speechText + " por favor dime cual medidor deseas que revisemos. ";
        let devicesFiltered = userDevices.data.clientDevices.filter(device => device.type != 2);
        if (devicesFiltered.length == 0) {
            speechText = speechText + " Actualmente no cuentas con medidores.";
            return new AlexaResponseMsg(speechText, true, false);
        }
        else {
            let names = " Te proporcionaré una lista con los medidores disponibles en tu cuenta: ";
            for (let index = 0; index < devicesFiltered.length; index++) {
                const deviceData = devicesFiltered[index];
                if (deviceData.name.length > 0) {
                    names = names + " medidor " + (index + 1) + " para " + deviceData.name;
                }
                else {
                    names = names + " medidor " + (index + 1);
                }
                if (deviceData.type == 0) {
                    names = names + ", de tipo gas";
                }
                else if (deviceData.type == 1) {
                    names = names + ", de tipo agua";
                }
                else if (deviceData.type == 3) {
                    names = names + ", de gas natural";
                }
                names = names + " ; ";
            }
            speechText = speechText + names;
            speechText = speechText + " ¿De cual medidor deseas consultar tu consumo?";
            return new AlexaResponseMsg(speechText, false, false);
        }
    }
    async getAlexaActualDeviceMeasure(email, numberDevice) {
        try {
            let requestUser = await this.userRepository.findOne({
                where: {
                    email: email
                },
            });
            if (!requestUser) {
                return new AlexaResponseMsg("No cuentas con una cuenta en GAWI, baja la app disponible en la Play Store o App Store", false, false);
            }
            let userDevices = await this.devicesClientService.getDevices(requestUser);
            let speechText = "";
            if (isNaN(numberDevice)) {
                return new AlexaResponseMsg("Una disculpa no te eh entendido", false, false);
            }
            if (numberDevice < 0 || (userDevices.data.clientDevices.length + 1) < numberDevice) {
                speechText = " El medidor numero " + numberDevice + " no esta disponible. ¿deseas revisar algún otro?";
            }
            else {
                const deviceData = userDevices.data.clientDevices[numberDevice - 1];
                if (deviceData) {
                    if (deviceData.type == 0) {
                        if (deviceData.gasHistory.length > 0) {
                            speechText = "Tu tanque tiene un " + deviceData.gasHistory[0].measure.toFixed(2) + " por ciento.";
                        }
                        else {
                            speechText = "Tu tanque tiene un 0 por ciento.";
                        }
                    }
                    else if (deviceData.type == 1) {
                        speechText = "Tu gasto actual es de " + (parseInt(deviceData.litersConsumedThisMonth) / 1000).toFixed(2)
                            + " metros cúbicos, equivalente a aproximadamente " + ((parseInt(deviceData.litersConsumedThisMonth) / 1000) * 25)
                            .toFixed(0) + " pesos.";
                    }
                    else if (deviceData.type == 3) {
                        speechText = "Tu gasto actual es de " + (parseInt(deviceData.litersConsumedThisMonth))
                            + " metros cúbicos, equivalente a aproximadamente " + ((parseInt(deviceData.litersConsumedThisMonth)) * 6.71)
                            .toFixed(0) + " pesos.";
                    }
                    speechText = speechText + " ¿deseas revisar algún otro?";
                }
                else {
                    speechText = "El medidor no esta disponible. ¿deseas revisar algún otro?";
                }
            }
            return new AlexaResponseMsg(speechText, false, false);
        }
        catch (error) {
            console.log(error);
            this.logger.debug("   " + `problema con alexa ${JSON.stringify(error)}`);
            this.logger.error("   " + `problema con alexa ${JSON.stringify(error)}`);
            return new AlexaResponseMsg("Lo siento a ocurrido un problema con la api de GAWI", true, false);
        }
    }
    sendNextMessage(handlerInput, speechText, endSession = false, loginCard = false) {
        if (loginCard) {
            return handlerInput.responseBuilder
                .speak(speechText)
                .reprompt(speechText)
                .withShouldEndSession(endSession)
                .withLinkAccountCard()
                .getResponse();
        }
        else {
            return handlerInput.responseBuilder
                .speak(speechText)
                .reprompt(speechText)
                .withShouldEndSession(endSession)
                .getResponse();
        }
    }
    async getUserInfo(accessToken) {
        return new Promise((resolve, reject) => {
            const options = {
                "method": "GET",
                "hostname": "api.amazon.com",
                "path": "/user/profile",
                "headers": {
                    "Authorization": `Bearer ${accessToken}`
                }
            };
            const https = require('https');
            let req = https.request(options, (response) => {
                let returnData = '';
                response.on('data', (chunk) => {
                    returnData += chunk;
                });
                response.on('end', () => {
                    resolve(new ServerMessage_class_1.ServerMessage(false, "Usuario de amazon obtenido", JSON.parse(returnData)));
                });
                response.on("error", (error) => {
                    resolve(new ServerMessage_class_1.ServerMessage(true, "Error obteniendo el usuario", error));
                });
            });
            req.end();
        });
    }
    async getUserDevicesList(handlerInput, email, senHi) {
        if (!email) {
            return "El email proporcionado es invalido";
        }
        let requestUser = await this.userRepository.findOne({
            where: {
                email: email
            },
        });
        if (!requestUser) {
            return this.sendNextMessage(handlerInput, "No cuentas con una cuenta en GAWI," +
                " baja la app disponible en la Play Store o App Store", true);
        }
        let speechText = " estos son tus medidores : ";
        if (senHi) {
            speechText = "Bienvenido a GAWI," + speechText;
            ;
        }
        let userDevices = await this.devicesClientService.getDevices(requestUser);
        let names = "";
        let devicesFiltered = userDevices.data.clientDevices.filter(device => device.type != 2);
        if (devicesFiltered.length == 0) {
            names = " actualmente no cuentas con medidores.";
        }
        else {
            for (let index = 0; index < devicesFiltered.length; index++) {
                const deviceData = devicesFiltered[index];
                names = names + " medidor " + (index + 1) + " para " + deviceData.name + " : ";
            }
        }
        speechText = speechText + names;
        return this.sendNextMessage(handlerInput, speechText, false);
    }
    async getActualGasMeasureIntent(handlerInput, email, numberDevice) {
        try {
            if (!email) {
                return "El email proporcionado es invalido";
            }
            let requestUser = await this.userRepository.findOne({
                where: {
                    email: email
                },
            });
            if (!requestUser) {
                return this.sendNextMessage(handlerInput, "No cuentas con una cuenta en GAWI," +
                    " baja la app disponible en la Play Store o App Store", true);
            }
            let userDevices = await this.devicesClientService.getDevices(requestUser);
            let speechText = "";
            if (isNaN(numberDevice)) {
                return this.sendNextMessage(handlerInput, "Una disculpa no te eh entendido", false);
            }
            if (numberDevice < 0 || (userDevices.data.clientDevices.length + 1) < numberDevice) {
                speechText = " El medidor con numero" + numberDevice + " no esta disponible";
            }
            else {
                const deviceData = userDevices.data.clientDevices[numberDevice - 1];
                if (deviceData.type == 0) {
                    if (deviceData.gasHistory.length > 0) {
                        speechText = "Tu tanque tiene un " + deviceData.gasHistory[0].measure.toFixed(2) + " porciento";
                    }
                    else {
                        speechText = "Tu tanque tiene un 0 porciento";
                    }
                }
                else {
                    speechText = "Tu gasto actual es de " + (parseInt(deviceData.litersConsumedThisMonth) / 1000).toFixed(2)
                        + " metros cúbicos, equivalente a aproximadamente " + ((parseInt(deviceData.litersConsumedThisMonth) / 1000) * 25)
                        .toFixed(0) + " pesos";
                }
            }
            speechText = speechText;
            return this.sendNextMessage(handlerInput, speechText, false);
        }
        catch (error) {
            this.logger.debug("   " + `problema con alexa ${JSON.stringify(error)}`);
            this.logger.error("   " + `problema con alexa ${JSON.stringify(error)}`);
            return this.sendNextMessage(handlerInput, "Lo siento a ocurrido un problema con la api de GAWI", false);
        }
    }
};
AlexaSkillService = __decorate([
    common_1.Injectable(),
    __param(0, common_1.Inject('winston')),
    __param(4, common_1.Inject('UserRepository')),
    __metadata("design:paramtypes", [Object, devices_service_1.DevicesService,
        auth_service_1.AuthService,
        user_service_1.UserService, Object])
], AlexaSkillService);
exports.AlexaSkillService = AlexaSkillService;
//# sourceMappingURL=alexaSkill.service.js.map