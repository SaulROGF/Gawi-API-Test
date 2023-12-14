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
exports.DepartureOrdersService = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("sequelize");
const organization_entity_1 = require("../../../../models/organization.entity");
const user_entity_1 = require("./../../../../models/user.entity");
const ServerMessage_class_1 = require("./../../../../classes/ServerMessage.class");
const sequelize_2 = require("sequelize");
const utilities_1 = require("./../../../../utils/utilities");
let DepartureOrdersService = class DepartureOrdersService {
    constructor(organizationRepository, deviceRepository, departureOrderRepository, logger) {
        this.organizationRepository = organizationRepository;
        this.deviceRepository = deviceRepository;
        this.departureOrderRepository = departureOrderRepository;
        this.logger = logger;
    }
    async getAllOrganizations() {
        try {
            let organizations = await this.organizationRepository.findAll({
                where: {
                    idOrganization: {
                        [sequelize_1.Op.not]: 1,
                    }
                }
            });
            if (!organizations) {
                return new ServerMessage_class_1.ServerMessage(true, "No exisen organizaciones", null);
            }
            return new ServerMessage_class_1.ServerMessage(false, "Organizaciones extraidas éxitosamente", organizations);
        }
        catch (error) {
            this.logger.error(error);
            return new ServerMessage_class_1.ServerMessage(true, "Ha ocurrido un error", error);
        }
    }
    async getDevicesInStock() {
        try {
            let devsInStock = await this.deviceRepository.count({
                attributes: {
                    include: [[sequelize_2.Sequelize.fn("COUNT", sequelize_2.Sequelize.col("user.idRole")), "devsCount"]]
                },
                include: [{
                        model: user_entity_1.User,
                        as: 'user',
                        where: {
                            idRole: 3,
                        }
                    }]
            });
            return (devsInStock == 0)
                ? new ServerMessage_class_1.ServerMessage(true, "No hay dispositivos en stock", 0)
                : new ServerMessage_class_1.ServerMessage(false, "Cantidad de dispositivos en stock extraidos éxitosamente", devsInStock);
        }
        catch (error) {
            this.logger.error(error);
            return new ServerMessage_class_1.ServerMessage(true, "Ha ocurrido un error", error);
        }
    }
    async createDepartureOrder(productionLeader, body) {
        try {
            const constraints = [
                productionLeader.idUser == null,
                productionLeader.idUser == undefined,
                body.idOrganization == null,
                body.idOrganization == undefined,
                body.deviceQuantity == null,
                body.deviceQuantity == undefined,
                body.deviceType == null,
                body.deviceType == undefined,
            ];
            if (constraints.some(val => val)) {
                new ServerMessage_class_1.ServerMessage(false, "Peticion incompleta", null);
            }
            let order = await this.departureOrderRepository.create({
                idUser: productionLeader.idUser,
                idOrganization: body.idOrganization,
                deviceQuantity: body.deviceQuantity,
                deviceType: body.deviceType,
            });
            if (!order) {
                return new ServerMessage_class_1.ServerMessage(true, "No se generó la orden", null);
            }
            return new ServerMessage_class_1.ServerMessage(false, "Orden creada éxitosamente", null);
        }
        catch (error) {
            this.logger.error(error);
            return new ServerMessage_class_1.ServerMessage(true, "Ha ocurrido un error", error);
        }
    }
    async getAllOrders() {
        try {
            let orders = await this.departureOrderRepository.findAll({
                include: [{
                        model: organization_entity_1.Organization,
                        as: 'organization',
                    }]
            });
            if (!orders) {
                return new ServerMessage_class_1.ServerMessage(true, "Sin ordenes en el sistema", null);
            }
            return new ServerMessage_class_1.ServerMessage(false, "Ordenes extraidas éxitosamente", orders);
        }
        catch (error) {
            this.logger.error(error);
            return new ServerMessage_class_1.ServerMessage(true, "Ha ocurrido un error", error);
        }
    }
    async getDevicesOnDemmand() {
        try {
            const orders = await this.departureOrderRepository.findAll({
                attributes: [
                    [sequelize_2.Sequelize.fn('sum', sequelize_2.Sequelize.col('devicequantity')), 'total']
                ],
                where: {
                    status: [1, 2],
                }
            });
            if (!orders) {
                return new ServerMessage_class_1.ServerMessage(true, "Sin ordenes en el sistema", null);
            }
            const devsInOrder = parseInt(orders[0].get("total").toString());
            return new ServerMessage_class_1.ServerMessage(false, "Cantidad de dispositivos en demanda extraidos éxitosamente", devsInOrder);
        }
        catch (error) {
            this.logger.error(error);
            return new ServerMessage_class_1.ServerMessage(true, "Ha ocurrido un error", error);
        }
    }
    async cancelDepartureOrder(idDepartureOrder) {
        try {
            let order = await this.departureOrderRepository.findOne({
                where: {
                    idDepartureOrder: idDepartureOrder,
                }
            });
            if (!order) {
                return new ServerMessage_class_1.ServerMessage(true, "La órden no existe en el sistema", null);
            }
            order.status = 0;
            order.deliveredAt = utilities_1.toLocalTime(new Date());
            await order.save();
            return new ServerMessage_class_1.ServerMessage(false, "Órden cancelada éxitosamente", null);
        }
        catch (error) {
            this.logger.error(error);
            return new ServerMessage_class_1.ServerMessage(true, "Ha ocurrido un error", error);
        }
    }
    async completeDepartureOrder(idDepartureOrder) {
        try {
            let order = await this.departureOrderRepository.findOne({
                where: {
                    idDepartureOrder: idDepartureOrder,
                }
            });
            if (!order) {
                return new ServerMessage_class_1.ServerMessage(true, "La órden no existe en el sistema", null);
            }
            order.status = 4;
            order.deliveredAt = utilities_1.toLocalTime(new Date());
            await order.save();
            return new ServerMessage_class_1.ServerMessage(false, "Órden cancelada éxitosamente", null);
        }
        catch (error) {
            this.logger.error(error);
            return new ServerMessage_class_1.ServerMessage(true, "Ha ocurrido un error", error);
        }
    }
};
DepartureOrdersService = __decorate([
    common_1.Injectable(),
    __param(0, common_1.Inject('OrganizationRepository')),
    __param(1, common_1.Inject('DeviceRepository')),
    __param(2, common_1.Inject('DepartureOrderRepository')),
    __param(3, common_1.Inject('winston')),
    __metadata("design:paramtypes", [Object, Object, Object, Object])
], DepartureOrdersService);
exports.DepartureOrdersService = DepartureOrdersService;
//# sourceMappingURL=departure-orders.service.js.map