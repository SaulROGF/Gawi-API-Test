import { OrganizationDataService } from './organization-data.service';
import { ServerMessage } from './../../../../classes/ServerMessage.class';
export declare class OrganizationDataController {
    private readonly organizationDataService;
    constructor(organizationDataService: OrganizationDataService);
    getAdminAccountData(req: any): Promise<ServerMessage>;
}
