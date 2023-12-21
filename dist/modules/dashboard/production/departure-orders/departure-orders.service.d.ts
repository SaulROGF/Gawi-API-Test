import { Logger } from 'winston';
import { Organization } from '../../../../models/organization.entity';
import { Device } from './../../../../models/device.entity';
import { User } from './../../../../models/user.entity';
import { DepartureOrder } from './../../../../models/departureOrders.entity';
import { ServerMessage } from './../../../../classes/ServerMessage.class';
export declare class DepartureOrdersService {
    private readonly organizationRepository;
    private readonly deviceRepository;
    private readonly departureOrderRepository;
    private readonly logger;
    constructor(organizationRepository: typeof Organization, deviceRepository: typeof Device, departureOrderRepository: typeof DepartureOrder, logger: Logger);
    getAllOrganizations(): Promise<ServerMessage>;
    getDevicesInStock(): Promise<ServerMessage>;
    createDepartureOrder(productionLeader: User, body: any): Promise<ServerMessage>;
    getAllOrders(): Promise<ServerMessage>;
    getDevicesOnDemmand(): Promise<ServerMessage>;
    cancelDepartureOrder(idDepartureOrder: number): Promise<ServerMessage>;
    completeDepartureOrder(idDepartureOrder: number): Promise<ServerMessage>;
}
