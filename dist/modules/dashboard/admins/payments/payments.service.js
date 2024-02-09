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
exports.PaymentsService = void 0;
const common_1 = require("@nestjs/common");
const ServerMessage_class_1 = require("../../../../classes/ServerMessage.class");
const billingInformation_entity_1 = require("../../../../models/billingInformation.entity");
const organization_entity_1 = require("../../../../models/organization.entity");
const state_entity_1 = require("../../../../models/state.entity");
const town_entity_1 = require("../../../../models/town.entity");
const user_entity_1 = require("../../../../models/user.entity");
const conekta_service_service_1 = require("../../../global/conekta-service/conekta-service.service");
const emails_service_1 = require("../../../global/emails/emails.service");
const factur_api_service_1 = require("../../../global/factur-api/factur-api.service");
const Facturapi = require("facturapi");
const axios = require("axios");
const device_entity_1 = require("../../../../models/device.entity");
let PaymentsService = class PaymentsService {
    constructor(stateRepository, townRepository, userRepository, deviceRepository, cardRepository, historyPaymentsRepository, billingInfoRepository, facturapiService, emailsService, conektaService, logger) {
        this.stateRepository = stateRepository;
        this.townRepository = townRepository;
        this.userRepository = userRepository;
        this.deviceRepository = deviceRepository;
        this.cardRepository = cardRepository;
        this.historyPaymentsRepository = historyPaymentsRepository;
        this.billingInfoRepository = billingInfoRepository;
        this.facturapiService = facturapiService;
        this.emailsService = emailsService;
        this.conektaService = conektaService;
        this.logger = logger;
        this.axios = axios.default;
        this.facturapi = new Facturapi(process.env.FACTURAPI_API_KEY);
        this.srcEmail = process.env.EMAIL_USR;
    }
    addMonths(months, date = new Date()) {
        var d = date.getDate();
        date.setMonth(date.getMonth() + +months);
        if (date.getDate() != d) {
            date.setDate(0);
        }
        return date;
    }
    async manualSubscriptionsActivations(data) {
        if (data == undefined ||
            data == null) {
            return new ServerMessage_class_1.ServerMessage(true, 'Peticion invalida', {});
        }
        if (data.length == 0) {
            return new ServerMessage_class_1.ServerMessage(true, 'Peticion invalida', {});
        }
        try {
            let errors = [];
            let activateSubscription = [];
            for (let index = 0; index < data.length; index++) {
                const element = data[index];
                if (element.serialNumber == undefined ||
                    element.serialNumber == null ||
                    element.type == undefined ||
                    element.type == null ||
                    element.years == undefined ||
                    element.years == null) {
                    errors.push(new ServerMessage_class_1.ServerMessage(true, 'Peticion invalida', element));
                }
                else {
                    let device = await this.deviceRepository.findOne({
                        where: {
                            serialNumber: element.serialNumber,
                            type: element.type,
                        },
                    });
                    if (device) {
                        device.validUntil = this.addMonths(12 * element.years);
                        await device.save();
                        activateSubscription.push(new ServerMessage_class_1.ServerMessage(false, 'Suscripcion activada con exito', element));
                    }
                    else {
                        errors.push(new ServerMessage_class_1.ServerMessage(true, 'El numero de serie no existe', element));
                    }
                }
            }
            return new ServerMessage_class_1.ServerMessage(false, 'Activaciones realizadas con exito', {
                errors: errors,
                activateSubscription: activateSubscription
            });
        }
        catch (error) {
            this.logger.error(error);
            return new ServerMessage_class_1.ServerMessage(true, 'A ocurrido un error activando los dispositivos', error);
        }
    }
    async paymentsListDeviceSubscription(queryParams) {
        try {
            let paymentsList = await this.historyPaymentsRepository.findAll({
                where: {
                    type: 0,
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
            return new ServerMessage_class_1.ServerMessage(false, 'Lista de pagos de las suscripciones obtenida con exito', paymentsList);
        }
        catch (error) {
            this.logger.error(error);
            return new ServerMessage_class_1.ServerMessage(true, 'A ocurrido un error obteniendo la lista de pagos de las suscripciones', error);
        }
    }
    async createPaymentSubscriptionInvoice(data) {
        try {
            if (data.idHistoryPayment == null ||
                data.idHistoryPayment == undefined) {
                return new ServerMessage_class_1.ServerMessage(true, "Campos inválidos", {});
            }
            let paymentToBill = await this.historyPaymentsRepository.findOne({
                where: {
                    idHistoryPayments: data.idHistoryPayment,
                    status: 'successful-payment',
                    needInvoice: true
                },
                include: [{
                        model: user_entity_1.User,
                        as: 'user',
                        include: [{
                                model: billingInformation_entity_1.BillingInformation,
                                as: 'billingInformation',
                            }, {
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
                    }]
            });
            if (!paymentToBill) {
                return new ServerMessage_class_1.ServerMessage(true, "El pago no esta disponible para facturación", {});
            }
            if (!paymentToBill.user.billingInformation) {
                return new ServerMessage_class_1.ServerMessage(true, "El usuario no dispone de datos de facturación", {});
            }
            try {
                let type = '04';
                if (paymentToBill.type == 1) {
                    type = '03';
                }
                let invoice = {};
                let idClientFacturapi = paymentToBill.user.billingInformation.facturapiClientToken;
                let items = [];
                items.push({
                    quantity: 1,
                    product: {
                        description: paymentToBill.product,
                        product_key: this.facturapiService.satCodeSubscriptionProduct,
                        price: paymentToBill.amount,
                        tax_included: true,
                        unit_key: this.facturapiService.unitSatCode,
                        sku: '#' + paymentToBill.idHistoryPayments + '-' + paymentToBill.conektaOrderId,
                    },
                });
                invoice = await this.facturapi.invoices.create({
                    customer: idClientFacturapi,
                    payment_form: type,
                    folio_number: paymentToBill.idHistoryPayments,
                    items: items,
                });
                try {
                    paymentToBill.facturapiInvoiceId = invoice.id;
                    paymentToBill.commentForUser = paymentToBill.commentForUser + ". Factura generada con éxito";
                    paymentToBill.verificationUrl = invoice.verification_url;
                    paymentToBill.invoiced = true;
                    paymentToBill.object = JSON.stringify(invoice).substring(0, 4990);
                    await paymentToBill.save();
                    try {
                        let emails = [];
                        let adminUsers = await this.userRepository.findAll({
                            where: {
                                idRole: 1
                            }
                        });
                        if (adminUsers.length > 0) {
                            for (let index = 0; index < adminUsers.length; index++) {
                                emails.push(adminUsers[index].email);
                            }
                        }
                        emails.push(paymentToBill.user.billingInformation.email);
                        emails.push(this.srcEmail);
                        let emailResult = await this.facturapi.invoices.sendByEmail(paymentToBill.facturapiInvoiceId, {
                            email: emails
                        });
                        paymentToBill.commentForUser = paymentToBill.commentForUser + ". Factura enviada por email";
                        paymentToBill.object = JSON.stringify(emailResult).substring(0, 4990);
                        paymentToBill.save();
                        return new ServerMessage_class_1.ServerMessage(false, "Factura enviada por email, por favor comunicarse con soporte para mas información", this.buildPaymentDto(paymentToBill));
                    }
                    catch (error) {
                        console.log('error', error);
                        paymentToBill.commentForUser = paymentToBill.commentForUser + ". Error enviando la factura por email, por favor comunicarse con soporte para mas información";
                        paymentToBill.object = JSON.stringify(error).substring(0, 4990);
                        await paymentToBill.save();
                        return new ServerMessage_class_1.ServerMessage(true, "Error enviando la factura por email, por favor comunicarse con soporte para mas información", JSON.stringify(error).substring(0, 4990));
                    }
                }
                catch (error) {
                    paymentToBill.commentForUser = paymentToBill.commentForUser + ". Error guardando la información de la factura, por favor comunicarse con soporte para mas información";
                    paymentToBill.object = JSON.stringify(invoice).substring(0, 4990);
                    await paymentToBill.save();
                    this.logger.error(invoice);
                    return new ServerMessage_class_1.ServerMessage(true, "Error guardando la información de la factura, por favor comunicarse con soporte para mas información", JSON.stringify(invoice).substring(0, 4990));
                }
            }
            catch (error) {
                let fixError = error.toString();
                if (fixError.includes('Error') == true) {
                    paymentToBill.object = JSON.stringify(fixError).substring(0, 4990);
                    await paymentToBill.save();
                    return new ServerMessage_class_1.ServerMessage(true, fixError, fixError);
                }
                else {
                    paymentToBill.commentForUser = paymentToBill.commentForUser + ". A ocurrido un error facturando en facturapi";
                    paymentToBill.object = JSON.stringify(fixError).substring(0, 4990);
                    await paymentToBill.save();
                    this.logger.error(fixError);
                    return new ServerMessage_class_1.ServerMessage(true, "Ocurrió un error generando la factura, por favor comunicarse con soporte", {
                        invoice: {},
                        paymentToApprove: paymentToBill,
                        fixError: fixError
                    });
                }
            }
        }
        catch (error) {
            this.logger.error(error);
            return new ServerMessage_class_1.ServerMessage(true, "Error creando la factura", error);
        }
    }
    async getAlreadyBillsList(queryParams) {
        try {
            let paymentsList = await this.historyPaymentsRepository.findAll({
                where: {
                    invoiced: true,
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
            return new ServerMessage_class_1.ServerMessage(false, 'Lista de pagos de las suscripciones obtenida con exito', paymentsList);
        }
        catch (error) {
            this.logger.error(error);
            return new ServerMessage_class_1.ServerMessage(true, 'A ocurrido un error obteniendo la lista de pagos de las suscripciones', error);
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
};
PaymentsService = __decorate([
    common_1.Injectable(),
    __param(0, common_1.Inject('StateRepository')),
    __param(1, common_1.Inject('TownRepository')),
    __param(2, common_1.Inject('UserRepository')),
    __param(3, common_1.Inject('DeviceRepository')),
    __param(4, common_1.Inject('CardRepository')),
    __param(5, common_1.Inject('HistoryPaymentsRepository')),
    __param(6, common_1.Inject('BillingInformationRepository')),
    __param(10, common_1.Inject('winston')),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object, Object, Object, factur_api_service_1.FacturApiService,
        emails_service_1.EmailsService,
        conekta_service_service_1.ConektaService,
        common_1.Logger])
], PaymentsService);
exports.PaymentsService = PaymentsService;
//# sourceMappingURL=payments.service.js.map