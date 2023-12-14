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
exports.ConektaService = void 0;
const ServerMessage_class_1 = require("./../../../classes/ServerMessage.class");
const common_1 = require("@nestjs/common");
const conekta = require("conekta");
conekta.api_key = "key_p4k1J61x14GRB0BaTNKeED0";
conekta.locale = "es";
conekta.api_version = "2.0.0";
let ConektaService = class ConektaService {
    constructor() {
        this.conekta = conekta;
    }
    async createConektaCustomer(name, email, phone) {
        let conektaData = {
            name: name,
            email: email,
            phone: '+52' + phone,
        };
        return new Promise((resolve, reject) => {
            this.conekta.Customer.create(conektaData, (err, customer) => {
                if (err) {
                    resolve(err);
                }
                else {
                    resolve(customer.toObject());
                }
            });
        });
    }
    async updateCustomer(id, conektaData) {
        return new Promise((resolve, reject) => {
            this.conekta.Customer.find(id, (error, customer) => {
                if (error) {
                    resolve(new ServerMessage_class_1.ServerMessage(true, 'Ha ocurrido un error buscando cliente', error));
                }
                else {
                    customer.update(conektaData, (error, customer) => {
                        if (error) {
                            resolve(new ServerMessage_class_1.ServerMessage(true, 'Ha ocurrido un error actualizando cliente', error));
                        }
                        else {
                            resolve(new ServerMessage_class_1.ServerMessage(false, 'Se ha actualizado la información correctamente', customer));
                        }
                    });
                }
            });
        });
    }
    async addCard(idCustomer, cardToken) {
        return new Promise((resolve, reject) => {
            this.conekta.Customer.find(idCustomer, (error, customer) => {
                if (error) {
                    resolve(new ServerMessage_class_1.ServerMessage(true, 'Ha ocurrido un error buscando cliente', error));
                }
                else {
                    customer.createPaymentSource({
                        type: 'card',
                        token_id: cardToken,
                    }, (error, card) => {
                        if (error) {
                            resolve(new ServerMessage_class_1.ServerMessage(true, 'Error añadiendo tarjeta', error));
                        }
                        else {
                            resolve(new ServerMessage_class_1.ServerMessage(false, 'Éxito añadiendo tarjeta', card));
                        }
                    });
                }
            });
        });
    }
    async getAllCards(idCustomer) {
        return new Promise((resolve, reject) => {
            this.conekta.Customer.find(idCustomer, (error, customer) => {
                if (error) {
                    resolve(new ServerMessage_class_1.ServerMessage(true, 'Ha ocurrido un error buscando cliente', error));
                }
                else {
                    if (customer.payment_sources == null ||
                        customer.payment_sources == undefined) {
                        resolve(new ServerMessage_class_1.ServerMessage(true, 'No hay tarjetas registradas en la API de conekta', {}));
                    }
                    else {
                        let cards = customer.payment_sources.toObject().data;
                        resolve(new ServerMessage_class_1.ServerMessage(false, 'Petición satisfactoria', cards));
                    }
                }
            });
        });
    }
    async deleteCart(idCustomer, cardData) {
        return new Promise((resolve, reject) => {
            this.conekta.Customer.find(idCustomer, (error, customer) => {
                if (error) {
                    resolve(new ServerMessage_class_1.ServerMessage(true, 'Ha ocurrido un error buscando cliente', error));
                }
                else {
                    let cards = customer.payment_sources.toObject().data;
                    let cardIndex = cards.findIndex((card) => {
                        return card.id == cardData.conektaCardToken;
                    });
                    if (cardIndex == -1) {
                        resolve(new ServerMessage_class_1.ServerMessage(true, 'No se ha encontrado la tarjeta', error));
                    }
                    else {
                        customer.payment_sources
                            .get(cardIndex)
                            .delete((error, response) => {
                            if (error) {
                                resolve(new ServerMessage_class_1.ServerMessage(true, 'Error eliminando tarjeta', error));
                            }
                            else {
                                resolve(new ServerMessage_class_1.ServerMessage(false, 'Éxito eliminando tarjeta', response));
                            }
                        });
                    }
                }
            });
        });
    }
    async getDefaultCard(idCustomer) {
        return new Promise((resolve, reject) => {
            this.conekta.Customer.find(idCustomer, (error, customer) => {
                if (error) {
                    resolve(new ServerMessage_class_1.ServerMessage(true, 'Ha ocurrido un error buscando cliente', error));
                }
                else {
                    resolve(new ServerMessage_class_1.ServerMessage(false, '', customer.toObject().default_payment_source_id));
                }
            });
        });
    }
    async setCardAsDefault(idCustomer, cardToken) {
        return new Promise((resolve, reject) => {
            this.conekta.Customer.find(idCustomer, (error, customer) => {
                if (error) {
                    resolve(new ServerMessage_class_1.ServerMessage(true, 'Ha ocurrido un error buscando cliente', error));
                }
                else {
                    let cards = customer.payment_sources.toObject().data;
                    let cardIndex = cards.findIndex((card) => {
                        return card.id == cardToken;
                    });
                    if (cardIndex == -1)
                        resolve(new ServerMessage_class_1.ServerMessage(true, 'No se ha encontrado la tarjeta', error));
                    customer.update({ default_payment_source_id: cardToken }, (error, customer) => {
                        if (error) {
                            resolve(new ServerMessage_class_1.ServerMessage(true, 'Ocurrió un error seteando el método default', error));
                        }
                        else {
                            resolve(new ServerMessage_class_1.ServerMessage(false, 'Se encuentra la tarjeta', cards[cardIndex]));
                        }
                    });
                }
            });
        });
    }
    async findCustomerByEmail(email) {
        return new Promise((resolve, reject) => {
            this.conekta.Customer.where({
                email: email,
            }, (err, customer) => {
                if (err) {
                    resolve(err);
                }
                else {
                    resolve(customer.toObject());
                }
            });
        });
    }
    async createSubscriptionPayment(conektaClientId, conektaCardId, product, productDescription) {
        return new Promise(async (resolve, reject) => {
            let productsList = [];
            productsList.push(product);
            let resultFindCard = await this.setCardAsDefault(conektaClientId, conektaCardId);
            if (resultFindCard.error == true) {
                resolve(resultFindCard);
            }
            else {
                conekta.Order.create({
                    currency: 'MXN',
                    customer_info: {
                        customer_id: conektaClientId,
                        antifraud_info: {},
                    },
                    line_items: productsList,
                    metadata: {
                        description: productDescription,
                    },
                    charges: [
                        {
                            payment_method: {
                                type: 'default',
                            },
                        },
                    ],
                }, function (err, charge) {
                    if (err) {
                        if (err.details) {
                            resolve(new ServerMessage_class_1.ServerMessage(true, err.details[0].message, {
                                err: err,
                                resultFindCard: resultFindCard,
                            }));
                        }
                        else {
                            resolve(new ServerMessage_class_1.ServerMessage(true, 'Ocurrió un error creando la orden', {
                                err: err,
                                resultFindCard: resultFindCard,
                            }));
                        }
                    }
                    else {
                        resolve(new ServerMessage_class_1.ServerMessage(false, 'Se creo la orden', charge.toObject()));
                    }
                });
            }
        });
    }
};
ConektaService = __decorate([
    common_1.Injectable(),
    __metadata("design:paramtypes", [])
], ConektaService);
exports.ConektaService = ConektaService;
//# sourceMappingURL=conekta-service.service.js.map