import { DepartureOrdersService } from './departure-orders.service';
import { ServerMessage } from './../../../../classes/ServerMessage.class';
export declare class DepartureOrdersController {
    private readonly departureOrdersService;
    constructor(departureOrdersService: DepartureOrdersService);
    getAllOrganizationsEndpoint(req: any): Promise<ServerMessage>;
    getDevicesInStockEndpoint(req: any): Promise<ServerMessage>;
    createDepartureorderEndpoint(req: any, body: any): Promise<ServerMessage>;
    getAllOrdersEndpoint(req: any): Promise<ServerMessage>;
    getDevicesOnDemmandEndpoint(req: any): Promise<ServerMessage>;
    cancelDepartureOrderEndpoint(idDepartureOrder: number): Promise<ServerMessage>;
    completeDepartureOrderEndpoint(idDepartureOrder: number): Promise<ServerMessage>;
}
