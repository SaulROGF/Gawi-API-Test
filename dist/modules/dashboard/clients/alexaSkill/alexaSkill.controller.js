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
exports.AlexaSkillController = void 0;
const common_1 = require("@nestjs/common");
const ask_sdk_core_1 = require("ask-sdk-core");
const alexaSkill_service_1 = require("./alexaSkill.service");
const ask_sdk_express_adapter_1 = require("ask-sdk-express-adapter");
const axios = require("axios");
let AlexaSkillController = class AlexaSkillController {
    constructor(logger, alexaSkillService) {
        this.logger = logger;
        this.alexaSkillService = alexaSkillService;
        this.ErrorHandler = {
            canHandle: (handlerInput, error) => {
                return true;
            },
            handle: (handlerInput, error) => {
                return handlerInput.responseBuilder
                    .speak("Lo siento, No puede entenderte. Puedes repetírmelo.")
                    .reprompt("Lo siento, No puede entenderte. Puedes repetírmelo.")
                    .getResponse();
            },
        };
        this.LaunchRequestHandler = {
            canHandle: (handlerInput) => {
                return handlerInput.requestEnvelope.request.type === "LaunchRequest" ||
                    handlerInput.requestEnvelope.request.type === "IntentRequest" ||
                    handlerInput.requestEnvelope.request.type === "SessionEndedRequest";
            },
            handle: async (handlerInput) => {
                let speechText = "";
                const { accessToken } = handlerInput.requestEnvelope.session.user;
                if (handlerInput.requestEnvelope.request.type === "SessionEndedRequest") {
                    return this.alexaSkillService
                        .sendNextMessage(handlerInput, "", true);
                }
                else if (typeof accessToken === "undefined") {
                    speechText = "Por favor vincula tu cuenta de GAWI";
                    return this.alexaSkillService
                        .sendNextMessage(handlerInput, speechText, true, true);
                }
                else {
                    const resultAmazon = await this.alexaSkillService.getUserInfo(accessToken);
                    if (resultAmazon.error == true) {
                        speechText = "No se pudo obtener la información de la cuenta";
                        return this.alexaSkillService
                            .sendNextMessage(handlerInput, speechText, true);
                    }
                    else if (resultAmazon.error == false) {
                        if (handlerInput.requestEnvelope.request.type === "LaunchRequest") {
                            return await this.alexaSkillService.getUserDevicesList(handlerInput, resultAmazon.data.email, true);
                        }
                        else if (handlerInput.requestEnvelope.request.type === "IntentRequest") {
                            let intentName = handlerInput.requestEnvelope.request.intent.name;
                            if (intentName == 'AMAZON.StopIntent' || intentName == 'AMAZON.CancelIntent') {
                                return this.alexaSkillService
                                    .sendNextMessage(handlerInput, " hasta luego ", true);
                            }
                            else if (intentName == 'GetActualDevicesListIntent' || intentName == 'AMAZON.HelpIntent' || intentName == 'AMAZON.NavigateHomeIntent') {
                                return await this.alexaSkillService.getUserDevicesList(handlerInput, resultAmazon.data.email, false);
                            }
                            else if (intentName == 'GetActualMeasureIntent') {
                                return await this.alexaSkillService
                                    .getActualGasMeasureIntent(handlerInput, resultAmazon.data.email, parseInt(handlerInput.requestEnvelope.request.intent.slots['number'].value));
                            }
                            else {
                                speechText = "aun no se tiene un comando para este intent";
                            }
                        }
                        return this.alexaSkillService
                            .sendNextMessage(handlerInput, speechText, false);
                    }
                }
            },
        };
        this.axios = axios.default;
    }
    async login(loginData) {
        return await this.alexaSkillService.validateUserByAlexaPassword(loginData);
    }
    async runSkill(req, response) {
        return response
            .status(common_1.HttpStatus.OK)
            .send({});
    }
    async alexaSkill(req, response) {
        let skill = ask_sdk_core_1.SkillBuilders.custom()
            .addRequestHandlers(this.LaunchRequestHandler)
            .addErrorHandlers(this.ErrorHandler)
            .create();
        try {
            let textBody = JSON.stringify(req.body);
            let signaturecertchainurl = req.headers['signaturecertchainurl'];
            if (signaturecertchainurl.substr(0, "https://s3.amazonaws.com".length) != "https://s3.amazonaws.com") {
                throw new common_1.BadRequestException();
            }
            let pathString = signaturecertchainurl.substr("https://s3.amazonaws.com".length, "/echo.api/".length);
            if (pathString.toLowerCase() != "/echo.api/") {
                throw new common_1.BadRequestException();
            }
            let responseAxios = await this.axios.get(signaturecertchainurl, {
                responseType: "blob",
            });
            console.log(responseAxios.data);
            const { X509Certificate } = require('crypto');
            var crt_obj = X509Certificate.parseCert(responseAxios.data);
            console.log(crt_obj.notBefore);
            console.log(crt_obj.notAfter);
            await new ask_sdk_express_adapter_1.TimestampVerifier().verify(textBody);
            return skill
                .invoke(req.body)
                .then((res) => {
                return response
                    .status(common_1.HttpStatus.OK)
                    .send(res);
            })
                .catch((err) => {
                this.logger.error("error alexa " + JSON.stringify(err));
                return response
                    .status(common_1.HttpStatus.BAD_REQUEST)
                    .send(err);
            });
        }
        catch (err) {
            console.log(err);
            return response
                .status(common_1.HttpStatus.BAD_REQUEST)
                .send(err);
        }
    }
};
__decorate([
    common_1.Post('alexa-login'),
    __param(0, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AlexaSkillController.prototype, "login", null);
__decorate([
    common_1.Get('requests'),
    __param(0, common_1.Req()),
    __param(1, common_1.Res()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AlexaSkillController.prototype, "runSkill", null);
__decorate([
    common_1.Post('requests'),
    __param(0, common_1.Req()),
    __param(1, common_1.Res()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AlexaSkillController.prototype, "alexaSkill", null);
AlexaSkillController = __decorate([
    common_1.Controller('clients/alexa'),
    __param(0, common_1.Inject('winston')),
    __metadata("design:paramtypes", [Object, alexaSkill_service_1.AlexaSkillService])
], AlexaSkillController);
exports.AlexaSkillController = AlexaSkillController;
//# sourceMappingURL=alexaSkill.controller.js.map