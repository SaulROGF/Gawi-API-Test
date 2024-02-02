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
exports.OrganizationDataService = void 0;
const common_1 = require("@nestjs/common");
const ServerMessage_class_1 = require("./../../../../classes/ServerMessage.class");
const organization_entity_1 = require("./../../../../models/organization.entity");
let OrganizationDataService = class OrganizationDataService {
    constructor(organizationRepository, userRepository, logger) {
        this.organizationRepository = organizationRepository;
        this.userRepository = userRepository;
        this.logger = logger;
    }
    async getOrganizationData(user) {
        try {
            let userWithOrganization = await this.userRepository.findOne({
                where: {
                    idUser: user.idUser,
                },
                include: [
                    {
                        model: organization_entity_1.Organization,
                        as: 'organization',
                    },
                ],
            });
            return new ServerMessage_class_1.ServerMessage(false, 'Datos enviados correctamente', {
                organization: userWithOrganization.organization,
            });
        }
        catch (error) {
            this.logger.error(error);
            return new ServerMessage_class_1.ServerMessage(true, 'A ocurrido un error', error);
        }
    }
};
OrganizationDataService = __decorate([
    common_1.Injectable(),
    __param(0, common_1.Inject('OrganizationRepository')),
    __param(1, common_1.Inject('UserRepository')),
    __param(2, common_1.Inject('winston')),
    __metadata("design:paramtypes", [Object, Object, Object])
], OrganizationDataService);
exports.OrganizationDataService = OrganizationDataService;
//# sourceMappingURL=organization-data.service.js.map