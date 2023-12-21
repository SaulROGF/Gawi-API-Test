import { ServiceCenterService } from './service-center.service';
import { ServerMessage } from './../../../../classes/ServerMessage.class';
export declare class ServiceCenterController {
    private readonly serviceCenterService;
    constructor(serviceCenterService: ServiceCenterService);
    homeEndpoint(req: any): Promise<ServerMessage>;
}
