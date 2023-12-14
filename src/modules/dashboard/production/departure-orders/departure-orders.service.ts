// generales
import { Injectable, Inject } from '@nestjs/common';
import { Logger } from 'winston';
import { Op } from 'sequelize';
// repositorios y entidades
import { Organization } from '../../../../models/organization.entity';
import { Device } from './../../../../models/device.entity';
import { User } from './../../../../models/user.entity';
import { DepartureOrder } from './../../../../models/departureOrders.entity';
// dtos y transferencia de datos
import { ServerMessage } from './../../../../classes/ServerMessage.class';
import { Sequelize } from 'sequelize';
import { toLocalTime } from './../../../../utils/utilities';

@Injectable()
export class DepartureOrdersService {

    /**
     * Constructor
     * @param organizationRepository repositorio para acceder a la tabla organizaciones en
     * la base de datos
     */
    constructor(
        @Inject('OrganizationRepository') private readonly organizationRepository: typeof Organization,
        @Inject('DeviceRepository') private readonly deviceRepository: typeof Device,
        @Inject('DepartureOrderRepository') private readonly departureOrderRepository: typeof DepartureOrder,
        @Inject('winston') private readonly logger: Logger,
    ) { }

    /**
     * Obtener todas las organizaciones contenidas en la base de datos
     * @returns todas las organizaciones contenidas en la base de datos excepto la principal
     */
    async getAllOrganizations(): Promise<ServerMessage> {
        try {
            // extraer todas las organizaciones contenidas en la base de datos excepto la principal
            let organizations: Organization[] = await this.organizationRepository.findAll<Organization>({
                where: {
                    idOrganization: {
                        [Op.not]: 1,
                    }
                }
            });
            if (!organizations) {
                return new ServerMessage(true, "No exisen organizaciones", null);
            }
            return new ServerMessage(false, "Organizaciones extraidas éxitosamente", organizations);

        } catch(error) {
            this.logger.error(error);
            return new ServerMessage(true, "Ha ocurrido un error", error);
        }
    }

    /**
     * Obtener todos los dispositivos que esten en almacen
     * @returns suma de todos los dispositivos que esten en almacen
     */
    async getDevicesInStock(): Promise<ServerMessage> {
        try {
            let devsInStock = await this.deviceRepository.count({
                attributes: { 
                    include: [[Sequelize.fn("COUNT", Sequelize.col("user.idRole")), "devsCount"]] 
                },
                include: [{
                    model: User,
                    as: 'user',
                    where: {
                        idRole: 3,
                    }
                }]
            });

            return (devsInStock == 0)
                   ? new ServerMessage(true, "No hay dispositivos en stock", 0)
                   : new ServerMessage(false, "Cantidad de dispositivos en stock extraidos éxitosamente", devsInStock);

        } catch(error) {
            this.logger.error(error);
            return new ServerMessage(true, "Ha ocurrido un error", error);
        }
    }

    /**
     * Crear una orden de salida
     * @param body información de la orden de salida
     * @returns confirmación de la creación de la orden 
     */
    async createDepartureOrder(productionLeader: User, body: any): Promise<ServerMessage> {
        try {
            //
            // check constraints
            //
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
                new ServerMessage(false, "Peticion incompleta", null);
            }
            
            let order: DepartureOrder = await this.departureOrderRepository.create({
                idUser: productionLeader.idUser,
                idOrganization: body.idOrganization,
                deviceQuantity: body.deviceQuantity,
                deviceType: body.deviceType,
            });
            
            if (!order) {
                return new ServerMessage(true, "No se generó la orden", null);
            }

            return new ServerMessage(false, "Orden creada éxitosamente", null);

        } catch(error) {      
            this.logger.error(error);
            return new ServerMessage(true, "Ha ocurrido un error", error);
        }
    }

    /**
     * Obtener todas las ordenes de salida creadas en el sistema
     * @returns todas las ordenes de salida creadas en el sistema
     */
    async getAllOrders(): Promise<ServerMessage> {
        try {
            let orders: DepartureOrder[] = await this.departureOrderRepository.findAll({
                include: [{
                    model: Organization,
                    as: 'organization',
                }]
            });            
            
            if (!orders) {
                return new ServerMessage(true, "Sin ordenes en el sistema", null);
            }
            
            return new ServerMessage(false, "Ordenes extraidas éxitosamente", orders);

        } catch(error) {      
            this.logger.error(error);
            return new ServerMessage(true, "Ha ocurrido un error", error);
        }
    }

    /**
     * Obtener todos los dispositivos que esten en almacen
     * @returns suma de todos los dispositivos que esten en almacen
     */
    async getDevicesOnDemmand(): Promise<ServerMessage> {
        try {
            const orders: DepartureOrder[] = await this.departureOrderRepository.findAll({
                attributes: [
                    [Sequelize.fn('sum', Sequelize.col('devicequantity')), 'total']
                ],
                where: {
                    status: [1, 2],
                }
            });
            if (!orders) {
                return new ServerMessage(true, "Sin ordenes en el sistema", null);
            }

            const devsInOrder: number = parseInt(orders[0].get("total").toString());
            return new ServerMessage(false, "Cantidad de dispositivos en demanda extraidos éxitosamente", devsInOrder);

        } catch(error) {
            this.logger.error(error);
            return new ServerMessage(true, "Ha ocurrido un error", error);
        }
    }

    /**
     * Cancelar una órden de salida
     * @param idDepartureOrder id de la órden de salida
     * @returns confirmación de éxito
     */
    async cancelDepartureOrder(idDepartureOrder: number): Promise<ServerMessage> {
        try {
            let order: DepartureOrder = await this.departureOrderRepository.findOne({
                where: {
                    idDepartureOrder: idDepartureOrder,
                }
            });
            if (!order) {
                return new ServerMessage(true, "La órden no existe en el sistema", null);
            }

            order.status = 0;
            order.deliveredAt = toLocalTime(new Date());
            await order.save();
            return new ServerMessage(false, "Órden cancelada éxitosamente", null);

        } catch(error) {
            this.logger.error(error);
            return new ServerMessage(true, "Ha ocurrido un error", error);
        }
    }

    /**
     * Marcar como finalizada una órden de salida
     * @param idDepartureOrder id de la órden de salida
     * @returns confirmación de éxito
     */
    async completeDepartureOrder(idDepartureOrder: number): Promise<ServerMessage> {
        try {
            let order: DepartureOrder = await this.departureOrderRepository.findOne({
                where: {
                    idDepartureOrder: idDepartureOrder,
                }
            });
            if (!order) {
                return new ServerMessage(true, "La órden no existe en el sistema", null);
            }

            order.status = 4;
            order.deliveredAt = toLocalTime(new Date());
            await order.save();
            return new ServerMessage(false, "Órden cancelada éxitosamente", null);

        } catch(error) {
            this.logger.error(error);
            return new ServerMessage(true, "Ha ocurrido un error", error);
        }   
    }
}
