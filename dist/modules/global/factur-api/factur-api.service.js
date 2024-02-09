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
exports.FacturApiService = void 0;
const common_1 = require("@nestjs/common");
const ServerMessage_class_1 = require("./../../../classes/ServerMessage.class");
const Facturapi = require("facturapi");
const axios = require("axios");
let FacturApiService = class FacturApiService {
    constructor(userRepository, townRepository, billingInfoRepository) {
        this.userRepository = userRepository;
        this.townRepository = townRepository;
        this.billingInfoRepository = billingInfoRepository;
        this.satCodeSubscriptionProduct = '81112000';
        this.unitSatCode = 'E48';
        this.axios = axios.default;
        this.facturapi = new Facturapi(process.env.FACTURAPI_API_KEY);
    }
    async createOrganizationCustomer(organizationInfo) {
        try {
            let facturapiData = {
                legal_name: organizationInfo.businessName.toUpperCase(),
                email: organizationInfo.email.toLowerCase(),
                tax_id: organizationInfo.rfc.toUpperCase(),
                phone: organizationInfo.phone,
                address: {
                    city: organizationInfo.city,
                    state: organizationInfo.state,
                    street: organizationInfo.street,
                    exterior: organizationInfo.addressNumber,
                    interior: '',
                    neighborhood: organizationInfo.suburb,
                    zip: organizationInfo.zipCode,
                    country: 'MEX',
                },
            };
            let customer = await this.facturapi.customers.create(facturapiData);
            if (!customer) {
                return new ServerMessage_class_1.ServerMessage(true, 'Error al crear el objeto facturapi', customer);
            }
            return new ServerMessage_class_1.ServerMessage(false, 'Cliente creado correctamente', customer);
        }
        catch (error) {
            return new ServerMessage_class_1.ServerMessage(true, 'Ha ocurrido un error', error);
        }
    }
    async updateOrganizationCustomer(token, organizationInfo) {
        try {
            let facturapiData = {
                legal_name: organizationInfo.businessName.toUpperCase(),
                email: organizationInfo.email.toLowerCase(),
                tax_id: organizationInfo.rfc.toUpperCase(),
                phone: organizationInfo.phone,
                address: {
                    city: organizationInfo.city,
                    state: organizationInfo.state,
                    street: organizationInfo.street,
                    exterior: organizationInfo.addressNumber,
                    interior: '',
                    neighborhood: organizationInfo.suburb,
                    zip: organizationInfo.zipCode,
                    country: 'MEX',
                },
            };
            let customer = await this.facturapi.customers.update(token, facturapiData);
            if (!customer) {
                return new ServerMessage_class_1.ServerMessage(true, 'Error al instanciar los datos de facturación', customer);
            }
            return new ServerMessage_class_1.ServerMessage(false, 'Cliente actualizado correctamente', customer);
        }
        catch (error) {
            console.log(error);
            return new ServerMessage_class_1.ServerMessage(true, 'Ha ocurrido un error', error);
        }
    }
    async createCustomer(billingInfoData) {
        try {
            let facturapiData = {
                legal_name: billingInfoData.businessName.toUpperCase(),
                email: billingInfoData.email.toLowerCase(),
                tax_id: billingInfoData.rfc.toUpperCase(),
                phone: billingInfoData.phone,
                address: {
                    city: billingInfoData.city,
                    state: billingInfoData.state,
                    street: billingInfoData.street,
                    exterior: billingInfoData.addressNumber,
                    interior: '',
                    neighborhood: billingInfoData.suburb,
                    zip: billingInfoData.zipCode,
                    country: 'MEX',
                },
            };
            let customer = await this.facturapi.customers.create(facturapiData);
            if (!customer) {
                return new ServerMessage_class_1.ServerMessage(true, 'Error al crear el objeto facturapi', customer);
            }
            return new ServerMessage_class_1.ServerMessage(false, 'Cliente creado correctamente', customer);
        }
        catch (error) {
            return new ServerMessage_class_1.ServerMessage(true, 'Ha ocurrido un error', error);
        }
    }
    async updateCustomer(token, billingInfoData) {
        try {
            let facturapiData = {
                legal_name: billingInfoData.businessName.toUpperCase(),
                email: billingInfoData.email.toLowerCase(),
                tax_id: billingInfoData.rfc.toUpperCase(),
                phone: billingInfoData.phone,
                address: {
                    city: billingInfoData.city,
                    state: billingInfoData.state,
                    street: billingInfoData.street,
                    exterior: billingInfoData.addressNumber,
                    interior: '',
                    neighborhood: billingInfoData.suburb,
                    zip: billingInfoData.zipCode,
                    country: 'MEX',
                },
            };
            let customer = await this.facturapi.customers.update(token, facturapiData);
            if (!customer) {
                return new ServerMessage_class_1.ServerMessage(true, 'Error al instanciar los datos de facturación', customer);
            }
            return new ServerMessage_class_1.ServerMessage(false, 'Cliente actualizado correctamente', customer);
        }
        catch (error) {
            return new ServerMessage_class_1.ServerMessage(true, 'Ha ocurrido un error', error);
        }
    }
};
FacturApiService = __decorate([
    common_1.Injectable(),
    __param(0, common_1.Inject('UserRepository')),
    __param(1, common_1.Inject('TownRepository')),
    __param(2, common_1.Inject('BillingInformationRepository')),
    __metadata("design:paramtypes", [Object, Object, Object])
], FacturApiService);
exports.FacturApiService = FacturApiService;
//# sourceMappingURL=factur-api.service.js.map