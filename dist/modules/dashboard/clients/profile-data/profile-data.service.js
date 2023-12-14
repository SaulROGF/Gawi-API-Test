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
exports.ProfileDataService = void 0;
const card_entity_1 = require("./../../../../models/card.entity");
const common_1 = require("@nestjs/common");
const ServerMessage_class_1 = require("../../../../classes/ServerMessage.class");
const billingInformation_entity_1 = require("./../../../../models/billingInformation.entity");
const factur_api_service_1 = require("./../../../global/factur-api/factur-api.service");
const state_entity_1 = require("./../../../../models/state.entity");
const town_entity_1 = require("./../../../../models/town.entity");
const user_entity_1 = require("./../../../../models/user.entity");
const sequelize_1 = require("sequelize");
const conekta_service_service_1 = require("../../../global/conekta-service/conekta-service.service");
const conektaClasses_class_1 = require("./../../../../classes/conektaClasses.class");
const device_entity_1 = require("../../../../models/device.entity");
const emails_service_1 = require("../../../global/emails/emails.service");
const organization_entity_1 = require("../../../../models/organization.entity");
let ProfileDataService = class ProfileDataService {
    constructor(stateRepository, townRepository, userRepository, cardRepository, historyPaymentsRepository, billingInfoRepository, facturapiService, emailsService, conektaService, logger) {
        this.stateRepository = stateRepository;
        this.townRepository = townRepository;
        this.userRepository = userRepository;
        this.cardRepository = cardRepository;
        this.historyPaymentsRepository = historyPaymentsRepository;
        this.billingInfoRepository = billingInfoRepository;
        this.facturapiService = facturapiService;
        this.emailsService = emailsService;
        this.conektaService = conektaService;
        this.logger = logger;
    }
    async retrieveTownsAndStates(idUser) {
        try {
            let states = await this.stateRepository.findAll({
                include: [
                    {
                        model: town_entity_1.Town,
                        as: 'towns',
                    },
                ],
            });
            let userTownData = await this.userRepository.findOne({
                where: {
                    idUser: idUser,
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
            return new ServerMessage_class_1.ServerMessage(false, '', {
                states: states,
                actualTown: userTownData.town,
            });
        }
        catch (error) {
            this.logger.error(error);
            return new ServerMessage_class_1.ServerMessage(true, 'A ocurrido un error', error);
        }
    }
    async updateTownInClient(client, body) {
        try {
            const constrants = [
                client == null,
                client == undefined,
                body.idTown == null,
                body.idTown == undefined,
            ];
            if (constrants.some(val => val)) {
                return new ServerMessage_class_1.ServerMessage(true, 'Petición incompleta', {});
            }
            client.idTown = body.idTown;
            await client.save();
            return new ServerMessage_class_1.ServerMessage(false, 'Actualizado correctamente', {});
        }
        catch (error) {
            this.logger.error(error);
            return new ServerMessage_class_1.ServerMessage(true, 'A ocurrido un error', error);
        }
    }
    async getBillingInfoData(client) {
        try {
            if (client == null || client == undefined) {
                return new ServerMessage_class_1.ServerMessage(true, 'Petición incompleta', {});
            }
            let billingInfoData = await this.billingInfoRepository.findOne({
                where: {
                    idUser: client.idUser,
                },
            });
            if (!billingInfoData) {
                return new ServerMessage_class_1.ServerMessage(true, 'Información no encontrada', {});
            }
            return new ServerMessage_class_1.ServerMessage(false, 'Datos extraidos correctamente', billingInfoData);
        }
        catch (error) {
            this.logger.error(error);
            return new ServerMessage_class_1.ServerMessage(true, 'A ocurrido un error', error);
        }
    }
    async updateBillingInfoData(client, billingInfoData) {
        try {
            const constrants = [
                client == null,
                client == undefined,
                billingInfoData.businessName == null,
                billingInfoData.businessName == undefined,
                billingInfoData.rfc == null,
                billingInfoData.rfc == undefined,
                billingInfoData.phone == null,
                billingInfoData.phone == undefined,
                billingInfoData.email == null,
                billingInfoData.email == undefined,
                billingInfoData.city == null,
                billingInfoData.city == undefined,
                billingInfoData.state == null,
                billingInfoData.state == undefined,
                billingInfoData.zipCode == null,
                billingInfoData.zipCode == undefined,
                billingInfoData.suburb == null,
                billingInfoData.suburb == undefined,
                billingInfoData.street == null,
                billingInfoData.street == undefined,
                billingInfoData.addressNumber == null,
                billingInfoData.addressNumber == undefined,
            ];
            if (constrants.some(val => val)) {
                return new ServerMessage_class_1.ServerMessage(true, 'Petición incompleta', {});
            }
            let billingInfo = await this.billingInfoRepository.findOne({
                where: {
                    idUser: client.idUser,
                },
            });
            if (!billingInfo) {
                let response = await this.facturapiService.createCustomer(billingInfoData);
                if (response.error) {
                    return new ServerMessage_class_1.ServerMessage(true, 'Error al crear los datos de facturación', response);
                }
                billingInfo = await this.billingInfoRepository.create({
                    idUser: client.idUser,
                    businessName: billingInfoData.businessName,
                    rfc: billingInfoData.rfc,
                    phone: billingInfoData.phone,
                    email: billingInfoData.email,
                    state: billingInfoData.state,
                    city: billingInfoData.city,
                    zipCode: billingInfoData.zipCode,
                    suburb: billingInfoData.suburb,
                    street: billingInfoData.street,
                    addressNumber: billingInfoData.addressNumber,
                    facturapiClientToken: response.data.id,
                });
                await billingInfo.save();
            }
            else {
                let response = await this.facturapiService.updateCustomer(billingInfo.facturapiClientToken, billingInfo);
                if (response.error) {
                    return new ServerMessage_class_1.ServerMessage(true, 'Error al actualizar los datos de facturación', response);
                }
                billingInfo.businessName = billingInfoData.businessName;
                billingInfo.rfc = billingInfoData.rfc;
                billingInfo.phone = billingInfoData.phone;
                billingInfo.email = billingInfoData.email;
                billingInfo.state = billingInfoData.state;
                billingInfo.city = billingInfoData.city;
                billingInfo.zipCode = billingInfoData.zipCode;
                billingInfo.suburb = billingInfoData.suburb;
                billingInfo.street = billingInfoData.street;
                billingInfo.addressNumber = billingInfoData.addressNumber;
                await billingInfo.save();
            }
            return new ServerMessage_class_1.ServerMessage(false, 'Guardado correctamente', billingInfo);
        }
        catch (error) {
            let fixError = error.toString();
            this.logger.error(fixError);
            if (fixError.includes('Error') == true) {
                return new ServerMessage_class_1.ServerMessage(true, fixError, fixError);
            }
            else {
                return new ServerMessage_class_1.ServerMessage(true, 'A ocurrido un error actualizando los datos de facturación', fixError);
            }
        }
    }
    async deleteUserData(idUser) {
        try {
            let client = await this.userRepository.findOne({
                where: {
                    idUser: idUser,
                    deleted: false,
                },
                include: [
                    {
                        model: device_entity_1.Device,
                        as: 'devices',
                    },
                ],
            });
            if (!client) {
                return new ServerMessage_class_1.ServerMessage(true, 'Usuario no encontrado', {});
            }
            for (let index = 0; index < client.devices.length; index++) {
                let deviceToUnlock = client.devices[index];
                deviceToUnlock.isActive = true;
                await deviceToUnlock.save();
            }
            client.active = false;
            client.deleted = true;
            await client.save();
            return new ServerMessage_class_1.ServerMessage(false, 'Datos eliminados correctamente', {});
        }
        catch (error) {
            this.logger.error(error);
            return new ServerMessage_class_1.ServerMessage(true, 'A ocurrido un error', error);
        }
    }
    async getClientAccountData(idUser) {
        try {
            let client = await this.userRepository.findOne({
                where: {
                    idUser: idUser,
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
                    {
                        model: billingInformation_entity_1.BillingInformation,
                        as: 'billingInformation',
                    },
                    {
                        model: card_entity_1.Card,
                        as: 'cards',
                        where: {
                            activePaymentMethod: true,
                        },
                        limit: 1,
                    },
                ],
            });
            if (!client) {
                return new ServerMessage_class_1.ServerMessage(true, 'Usuario no encontrado', {});
            }
            return new ServerMessage_class_1.ServerMessage(false, 'Datos enviados correctamente', {
                user: client,
            });
        }
        catch (error) {
            this.logger.error(error);
            return new ServerMessage_class_1.ServerMessage(true, 'A ocurrido un error', error);
        }
    }
    async updateClientName(user, userData) {
        try {
            if (userData.firstName == null ||
                userData.firstName == undefined ||
                userData.lastName == null ||
                userData.lastName == undefined ||
                userData.mothersLastName == null ||
                userData.mothersLastName == undefined) {
                return new ServerMessage_class_1.ServerMessage(true, 'Petición incompleta', {});
            }
            let conektaData = {
                name: userData.firstName +
                    ' ' +
                    userData.lastName +
                    ' ' +
                    userData.mothersLastName,
                email: user.email,
                phone: user.phone,
                shipping_contact: {
                    receiver: userData.firstName +
                        ' ' +
                        userData.lastName +
                        ' ' +
                        userData.mothersLastName,
                    phone: user.phone,
                },
            };
            let conektaCustomerUpdateResult = await this.conektaService.updateCustomer(user.idConektaAccount, conektaData);
            if (conektaCustomerUpdateResult.error == false) {
                user.firstName = userData.firstName;
                user.lastName = userData.lastName;
                user.mothersLastName = userData.mothersLastName;
                await user.save();
            }
            return new ServerMessage_class_1.ServerMessage(false, 'Actualizado con éxito', {});
        }
        catch (error) {
            this.logger.error(error);
            return new ServerMessage_class_1.ServerMessage(true, 'A ocurrido un error', error);
        }
    }
    async updateClientPhone(user, userData) {
        try {
            if (userData.phone == null || userData.phone == undefined) {
                return new ServerMessage_class_1.ServerMessage(true, 'Petición incompleta', {});
            }
            let conektaData = {
                name: user.firstName + ' ' + user.lastName + ' ' + user.mothersLastName,
                email: user.email,
                phone: userData.phone,
                shipping_contact: {
                    receiver: user.firstName + ' ' + user.lastName + ' ' + user.mothersLastName,
                    phone: user.phone,
                },
            };
            let conektaCustomerUpdateResult = await this.conektaService.updateCustomer(user.idConektaAccount, conektaData);
            if (conektaCustomerUpdateResult.error == false) {
                user.phone = userData.phone;
                await user.save();
            }
            return new ServerMessage_class_1.ServerMessage(false, 'Actualizado con éxito', {});
        }
        catch (error) {
            this.logger.error(error);
            return new ServerMessage_class_1.ServerMessage(true, 'A ocurrido un error', error);
        }
    }
    async updateClientEmail(user, userData) {
        try {
            if (userData.email == null || userData.email == undefined) {
                return new ServerMessage_class_1.ServerMessage(true, 'Petición incompleta', {});
            }
            let alreadyEmail = await this.userRepository.findOne({
                where: {
                    idUser: {
                        [sequelize_1.Op.not]: user.idUser,
                    },
                    email: userData.email,
                    deleted: false,
                },
            });
            if (alreadyEmail) {
                return new ServerMessage_class_1.ServerMessage(true, 'Email actualmente en uso', {});
            }
            if (user.email == userData.email) {
                return new ServerMessage_class_1.ServerMessage(false, 'Sin cambios', {});
            }
            let conektaData = {
                name: user.firstName + ' ' + user.lastName + ' ' + user.mothersLastName,
                email: userData.email,
                phone: user.phone,
                shipping_contact: {
                    receiver: user.firstName + ' ' + user.lastName + ' ' + user.mothersLastName,
                    phone: user.phone,
                },
            };
            let conektaCustomerUpdateResult = await this.conektaService.updateCustomer(user.idConektaAccount, conektaData);
            if (conektaCustomerUpdateResult.error == false) {
                user.email = userData.email;
                await user.save();
            }
            return new ServerMessage_class_1.ServerMessage(false, 'Actualizado con éxito', {});
        }
        catch (error) {
            this.logger.error(error);
            return new ServerMessage_class_1.ServerMessage(true, 'A ocurrido un error', error);
        }
    }
    async addCard(cardInfo, client) {
        try {
            const constrants = [
                client == null,
                client == undefined,
                cardInfo.conektaCardToken == null,
                cardInfo.conektaCardToken == undefined,
                cardInfo.activePaymentMethod == null,
                cardInfo.activePaymentMethod == undefined,
            ];
            if (constrants.some(val => val)) {
                return new ServerMessage_class_1.ServerMessage(true, 'Petición incompleta', {});
            }
            let cards = await this.cardRepository.findAll({
                where: {
                    idUser: client.idUser,
                }
            });
            let addCardProcess = await this.conektaService.addCard(client.idConektaAccount, cardInfo.conektaCardToken);
            if (addCardProcess.error)
                return addCardProcess;
            let conektaCard = addCardProcess.data;
            if (cardInfo.activePaymentMethod == true) {
                let defaultCard = await this.cardRepository.findOne({
                    where: {
                        idUser: client.idUser,
                        activePaymentMethod: true,
                    },
                });
                if (defaultCard) {
                    defaultCard.activePaymentMethod = false;
                    await defaultCard.save();
                }
                this.conektaService.setCardAsDefault(client.idConektaAccount, conektaCard.id);
            }
            let cardFromDB = await this.cardRepository.create({
                idUser: client.idUser,
                conektaCardToken: conektaCard.id,
                last4Digits: conektaCard.last4,
                month: conektaCard.exp_month,
                year: conektaCard.exp_year,
                brand: conektaCard.brand,
                printedName: conektaCard.name,
                activePaymentMethod: cardInfo.activePaymentMethod == true || cards.length == 0 ? true : false,
            });
            return new ServerMessage_class_1.ServerMessage(false, 'Se ha añadido la tarjeta correctamente', cardFromDB);
        }
        catch (error) {
            this.logger.error(error);
            return new ServerMessage_class_1.ServerMessage(true, 'Ha ocurrido un error', error);
        }
    }
    async deleteCard(cardInfo, client) {
        try {
            const constrants = [
                client == null,
                client == undefined,
                cardInfo.idCard == null,
                cardInfo.idCard == undefined,
            ];
            if (constrants.some(val => val))
                return new ServerMessage_class_1.ServerMessage(true, 'Petición incompleta', {});
            let cardForDelete = await this.cardRepository.findOne({
                where: {
                    idCard: cardInfo.idCard,
                    idUser: client.idUser,
                },
            });
            if (!cardForDelete) {
                return new ServerMessage_class_1.ServerMessage(true, 'La tarjeta no esta disponible', {});
            }
            let getCardsProcess = await this.conektaService.getAllCards(client.idConektaAccount);
            if (getCardsProcess.error)
                return getCardsProcess;
            let conektaCards = getCardsProcess.data;
            if (conektaCards.length <= 1)
                return new ServerMessage_class_1.ServerMessage(true, 'El cliente no se puede quedar sin tarjetas registradas', {});
            let deleteCardProcess = await this.conektaService.deleteCart(client.idConektaAccount, cardForDelete);
            if (deleteCardProcess.error)
                return deleteCardProcess;
            await cardForDelete.destroy();
            if (cardForDelete.activePaymentMethod) {
                let actualDefaultCardId = await this.conektaService.getDefaultCard(client.idConektaAccount);
                let defaultCard = await this.cardRepository.findOne({
                    where: {
                        idUser: client.idUser,
                        conektaCardToken: actualDefaultCardId.data,
                    },
                });
                if (defaultCard) {
                    defaultCard.activePaymentMethod = true;
                    await defaultCard.save();
                }
            }
            return new ServerMessage_class_1.ServerMessage(false, 'Se ha eliminado la tarjeta correctamente', {});
        }
        catch (error) {
            this.logger.error(error);
            return new ServerMessage_class_1.ServerMessage(true, 'Ha ocurrido un error', error);
        }
    }
    async getAllCards(client) {
        try {
            const constrants = [
                client == null,
                client == undefined,
            ];
            if (constrants.some(val => val))
                return new ServerMessage_class_1.ServerMessage(true, 'Petición incompleta', {});
            let cards = await this.cardRepository.findAll({
                where: {
                    idUser: client.idUser
                }
            });
            return new ServerMessage_class_1.ServerMessage(false, 'Tarjetas extraidas correctamente', cards);
        }
        catch (error) {
            this.logger.error(error);
            return new ServerMessage_class_1.ServerMessage(true, 'Ha ocurrido un error', error);
        }
    }
    async getCard(idCard, client) {
        try {
            const constrants = [
                client == null,
                client == undefined,
                idCard == null,
                idCard == undefined,
            ];
            if (constrants.some(val => val))
                return new ServerMessage_class_1.ServerMessage(true, 'Petición incompleta', {});
            let queriedCard = await this.cardRepository.findOne({
                attributes: { exclude: ['conektaCardToken'] },
                where: {
                    idCard: idCard,
                    idUser: client.idUser,
                },
            });
            if (!queriedCard)
                return new ServerMessage_class_1.ServerMessage(true, 'No existe la tarjeta consultada en la base de datos', {});
            let haveMoreCards = false;
            let userCards = await this.cardRepository.findAll({
                where: {
                    idUser: client.idUser,
                },
            });
            if (userCards.length > 1) {
                haveMoreCards = true;
            }
            return new ServerMessage_class_1.ServerMessage(false, 'Tarjeta extraida correctamente', {
                queriedCard: queriedCard,
                haveMoreCards: haveMoreCards,
            });
        }
        catch (error) {
            this.logger.error(error);
            return new ServerMessage_class_1.ServerMessage(true, 'Ha ocurrido un error', error);
        }
    }
    async setCardAsDefault(cardInfo, client) {
        try {
            const constrants = [
                client == null,
                client == undefined,
                cardInfo.idCard == null,
                cardInfo.idCard == undefined,
            ];
            if (constrants.some(val => val))
                return new ServerMessage_class_1.ServerMessage(true, 'Petición incompleta', {});
            let cardToUpdate = await this.cardRepository.findOne({
                where: {
                    idCard: cardInfo.idCard,
                    idUser: client.idUser,
                },
            });
            if (!cardToUpdate) {
                return new ServerMessage_class_1.ServerMessage(true, 'La tarjeta no esta disponible', {});
            }
            this.conektaService.setCardAsDefault(client.idConektaAccount, cardToUpdate.conektaCardToken);
            let defaultCard = await this.cardRepository.findOne({
                where: {
                    idUser: client.idUser,
                    activePaymentMethod: true,
                },
            });
            if (defaultCard) {
                defaultCard.activePaymentMethod = false;
                await defaultCard.save();
            }
            cardToUpdate.activePaymentMethod = true;
            await cardToUpdate.save();
            return new ServerMessage_class_1.ServerMessage(false, 'Metodo de pago actualizado', cardToUpdate);
        }
        catch (error) {
            this.logger.error(error);
            return new ServerMessage_class_1.ServerMessage(true, 'Ha ocurrido un error', error);
        }
    }
    async payDeviceSubscription(idUser, newPaymentData) {
        try {
            if (idUser == null ||
                idUser == undefined ||
                newPaymentData.idDevice == null ||
                newPaymentData.idDevice == undefined ||
                newPaymentData.type == null ||
                newPaymentData.type == undefined ||
                newPaymentData.requireInvoice == null ||
                newPaymentData.requireInvoice == undefined) {
                return new ServerMessage_class_1.ServerMessage(true, "Petición Incompleta!", {});
            }
            let userForSale = await this.userRepository.findOne({
                where: {
                    idUser: idUser,
                },
                include: [{
                        model: device_entity_1.Device,
                        as: "devices",
                        required: true,
                        where: {
                            idDevice: newPaymentData.idDevice,
                        }
                    }]
            });
            if (!userForSale) {
                return new ServerMessage_class_1.ServerMessage(true, "Usuario invalido!", {});
            }
            if (userForSale.devices.length < 1) {
                return new ServerMessage_class_1.ServerMessage(true, "Medidor invalido!", {});
            }
            if (newPaymentData.type != 0 && newPaymentData.type != 1 && newPaymentData.type != 2) {
                return new ServerMessage_class_1.ServerMessage(true, "Subscription invalida!", {});
            }
            let planData = {
                name: "",
                description: "",
                cost: '255.20',
                currency: 'MXN',
                monthsBuy: 12,
                duration: 1,
                satCodeProduct: this.facturapiService.satCodeSubscriptionProduct,
                unitSatCode: this.facturapiService.unitSatCode,
                createdAt: new Date(),
            };
            if (newPaymentData.type == 0) {
                planData.name = "1 año de servicio de datos de gas";
                planData.description = "Suscripción de acceso a la plataforma de GAWI para un medidor de Gas";
            }
            else if (newPaymentData.type == 1) {
                planData.name = "1 año de servicio de datos de agua";
                planData.description = "Suscripción de acceso a la plataforma de GAWI para un medidor de agua";
            }
            else if (newPaymentData.type == 2) {
                planData.name = "1 año de servicio de datos del data logger";
                planData.description = "Suscripción de acceso a la plataforma de GAWI para un data logger";
            }
            let defaultCard = await this.cardRepository.findOne({
                where: {
                    idUser: idUser,
                    activePaymentMethod: true
                },
            });
            if (!defaultCard) {
                return new ServerMessage_class_1.ServerMessage(true, "Tarjeta invalida!", {});
            }
            let dataProductFixed = new conektaClasses_class_1.ProductConekta();
            dataProductFixed.name = planData.name + " (" + planData.monthsBuy + " meses)";
            dataProductFixed.unit_price = parseInt((parseInt(planData.cost) * 100).toFixed(2));
            dataProductFixed.quantity = 1;
            dataProductFixed.antifraud_info = {};
            let responseCreateOrder = await this.conektaService.createSubscriptionPayment(userForSale.idConektaAccount, defaultCard.conektaCardToken, dataProductFixed, planData.description);
            if (responseCreateOrder.error == true) {
                return responseCreateOrder;
            }
            let charge = responseCreateOrder.data;
            if (charge.payment_status != "paid") {
                let errorHistoryData = {
                    idUser: idUser,
                    idDevice: userForSale.devices[0].idDevice,
                    idOrganization: userForSale.devices[0].idOrganization,
                    type: 0,
                    paymentToken: '',
                    product: planData.name + " (" + planData.monthsBuy + " meses)",
                    currency: 0,
                    status: 'payment-error',
                    commentForUser: "A ocurrido un error procesando el pago",
                    facturapiInvoiceId: "",
                    verificationUrl: "",
                    conektaOrderId: "",
                    object: JSON.stringify(charge).substring(0, 4990),
                    amount: (parseInt(planData.cost)).toFixed(2),
                    invoiced: false,
                    needInvoice: false,
                };
                let newPayment = await this.historyPaymentsRepository.create(errorHistoryData);
                return new ServerMessage_class_1.ServerMessage(true, 'A ocurrido un error procesando el pago', newPayment);
            }
            else {
                userForSale.devices[0].validUntil = this.addMonths(planData.monthsBuy);
                await userForSale.devices[0].save();
                let successCardHistoryData = {
                    idUser: idUser,
                    idDevice: userForSale.devices[0].idDevice,
                    idOrganization: userForSale.devices[0].idOrganization,
                    type: 0,
                    paymentToken: '',
                    product: planData.name + " (" + planData.monthsBuy + " meses)",
                    currency: 0,
                    status: 'successful-payment',
                    commentForUser: "Pago con tarjeta con terminacion #" + defaultCard.last4Digits + " procesado con éxito",
                    facturapiInvoiceId: "",
                    verificationUrl: "",
                    conektaOrderId: charge.id,
                    object: JSON.stringify(charge).substring(0, 4990),
                    amount: (parseInt(planData.cost)).toFixed(2),
                    invoiced: false,
                    needInvoice: newPaymentData.requireInvoice,
                };
                let newPayment = await this.historyPaymentsRepository.create(successCardHistoryData);
                let sendValidationVoucher = await this.emailsService
                    .sendSubscriptionPaymentSuccessEmail(userForSale.firstName + " " + userForSale.lastName, userForSale.email, planData.name + " (" + planData.monthsBuy + " meses)", userForSale.devices[0].validUntil.toLocaleDateString("es-MX", { day: "2-digit", month: "2-digit", year: "numeric" }), '#' + newPayment.idHistoryPayments + '-' + newPayment.conektaOrderId, '255.20', newPaymentData.type, successCardHistoryData.commentForUser);
                if (sendValidationVoucher.error == false) {
                    return new ServerMessage_class_1.ServerMessage(false, "Pago realizado con éxito, se a enviado un correo electrónico con los datos de la compra.", {
                        sendValidationVoucher: sendValidationVoucher,
                        paymentToApprove: newPayment,
                        charge: charge,
                    });
                }
                else if (sendValidationVoucher.error == true) {
                    return new ServerMessage_class_1.ServerMessage(false, "Pago realizado con éxito, no se envió un correo electrónico con los datos de la compra.", {
                        sendValidationVoucher: sendValidationVoucher,
                        paymentToApprove: newPayment,
                        responseCreateOrder: responseCreateOrder,
                        charge: charge,
                    });
                }
            }
        }
        catch (error) {
            this.logger.error(error);
            return new ServerMessage_class_1.ServerMessage(true, 'A ocurrido un error mientras se realizaba el pago', error);
        }
    }
    async getPaymentsList(idUser) {
        try {
            let paymentsList = await this.historyPaymentsRepository.findAll({
                where: {
                    idUser: idUser
                },
                include: [{
                        model: user_entity_1.User,
                        as: 'user',
                        include: [{
                                model: town_entity_1.Town,
                                as: 'town',
                                include: [{
                                        model: state_entity_1.State,
                                        as: 'state',
                                    }]
                            }]
                    }, {
                        model: organization_entity_1.Organization,
                        as: 'organization'
                    }, {
                        model: device_entity_1.Device,
                        as: 'device'
                    }],
                order: [['createdAt', 'DESC']],
            })
                .map((payment) => {
                return this.buildPaymentDto(payment);
            });
            return new ServerMessage_class_1.ServerMessage(false, 'Pagos del usuario obtenidos con exito', paymentsList);
        }
        catch (error) {
            this.logger.error(error);
            return new ServerMessage_class_1.ServerMessage(true, 'A ocurrido un error obteniendo los pagos del usuario', error);
        }
    }
    async getPaymentDetails(idUser, idHistoryPayments) {
        try {
            let payment = await this.historyPaymentsRepository.findOne({
                where: {
                    idHistoryPayments: idHistoryPayments,
                    idUser: idUser,
                },
                include: [{
                        model: user_entity_1.User,
                        as: 'user',
                        include: [{
                                model: town_entity_1.Town,
                                as: 'town',
                                include: [{
                                        model: state_entity_1.State,
                                        as: 'state',
                                    }]
                            }]
                    }, {
                        model: organization_entity_1.Organization,
                        as: 'organization'
                    }, {
                        model: device_entity_1.Device,
                        as: 'device'
                    }],
            });
            return new ServerMessage_class_1.ServerMessage(false, 'Pago del usuario obtenido con éxito', this.buildPaymentDto(payment));
        }
        catch (error) {
            this.logger.error(error);
            return new ServerMessage_class_1.ServerMessage(true, 'A ocurrido un error obteniendo el pago del usuario', error);
        }
    }
    buildPaymentDto(payment) {
        return {
            idHistoryPayment: payment.idHistoryPayments,
            codePayment: payment.idHistoryPayments + '-' + payment.conektaOrderId.replace('Ord_', ''),
            clientId: payment.user.idUser,
            clientName: payment.user.firstName + ' ' + payment.user.lastName,
            clientEmail: payment.user.email,
            clientPhone: payment.user.phone,
            idDevice: payment.device.idDevice,
            serialNumber: payment.device.serialNumber,
            deviceType: payment.device.type,
            idConektaAccount: payment.user.idConektaAccount,
            clientState: payment.user.town.state.name,
            clientTown: payment.user.town.name,
            clientCreatedAt: payment.user.createdAt,
            commentForUser: payment.commentForUser,
            product: payment.product,
            status: payment.status,
            needInvoice: payment.needInvoice,
            invoiced: payment.invoiced,
            facturapiInvoiceId: payment.facturapiInvoiceId,
            verificationUrl: payment.verificationUrl,
            amount: payment.amount,
            organizationName: payment.organization.comercialName,
            updatedAt: payment.updatedAt,
            createdAt: payment.createdAt,
        };
    }
    addMonths(months, date = new Date()) {
        var d = date.getDate();
        date.setMonth(date.getMonth() + +months);
        if (date.getDate() != d) {
            date.setDate(0);
        }
        return date;
    }
};
ProfileDataService = __decorate([
    common_1.Injectable(),
    __param(0, common_1.Inject('StateRepository')),
    __param(1, common_1.Inject('TownRepository')),
    __param(2, common_1.Inject('UserRepository')),
    __param(3, common_1.Inject('CardRepository')),
    __param(4, common_1.Inject('HistoryPaymentsRepository')),
    __param(5, common_1.Inject('BillingInformationRepository')),
    __param(9, common_1.Inject('winston')),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object, Object, factur_api_service_1.FacturApiService,
        emails_service_1.EmailsService,
        conekta_service_service_1.ConektaService, Object])
], ProfileDataService);
exports.ProfileDataService = ProfileDataService;
//# sourceMappingURL=profile-data.service.js.map