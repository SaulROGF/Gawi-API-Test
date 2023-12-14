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
exports.ServiceCenterService = void 0;
const common_1 = require("@nestjs/common");
const ServerMessage_class_1 = require("../../../../classes/ServerMessage.class");
const organization_entity_1 = require("./../../../../models/organization.entity");
const sequelize_1 = require("sequelize");
let ServiceCenterService = class ServiceCenterService {
    constructor(userRepository, organizationRepository, deviceRepository, logger) {
        this.userRepository = userRepository;
        this.organizationRepository = organizationRepository;
        this.deviceRepository = deviceRepository;
        this.logger = logger;
    }
    async retrieveContacts(client) {
        try {
            if (client == null || client == undefined) {
                return new ServerMessage_class_1.ServerMessage(true, 'Petición incompleta', {});
            }
            let adminUser = await this.userRepository.findOne({
                where: {
                    idRole: 1
                },
                include: [{
                        model: organization_entity_1.Organization,
                        as: 'organization'
                    }]
            });
            let devices = await this.deviceRepository.findAll({
                where: {
                    idUser: client.idUser,
                    idOrganization: {
                        [sequelize_1.Op.not]: adminUser.organization.idOrganization
                    }
                },
                include: [
                    {
                        model: organization_entity_1.Organization,
                        as: 'organization',
                    },
                ],
                group: ['Device.idOrganization'],
            });
            return new ServerMessage_class_1.ServerMessage(false, 'La petición se ha hecho correctamente', {
                organizationsData: devices.map((device) => {
                    return Object.assign(device.organization);
                }),
                mainOrganizationData: adminUser.organization
            });
        }
        catch (error) {
            this.logger.error(error);
            return new ServerMessage_class_1.ServerMessage(true, 'A ocurrido un error', error);
        }
    }
};
ServiceCenterService = __decorate([
    common_1.Injectable(),
    __param(0, common_1.Inject('UserRepository')),
    __param(1, common_1.Inject('OrganizationRepository')),
    __param(2, common_1.Inject('DeviceRepository')),
    __param(3, common_1.Inject('winston')),
    __metadata("design:paramtypes", [Object, Object, Object, Object])
], ServiceCenterService);
exports.ServiceCenterService = ServiceCenterService;
//# sourceMappingURL=service-center.service.js.map