import { AdminDataService } from './admin-data.service';
import { ServerMessage } from './../../../../classes/ServerMessage.class';
export declare class AdminDataController {
    private readonly adminDataService;
    constructor(adminDataService: AdminDataService);
    getAdminAccountData(req: any): Promise<ServerMessage>;
    updateAdminAccountData(req: any, body: any): Promise<ServerMessage>;
    getApnList(req: any): Promise<ServerMessage>;
    createNewApn(req: any, body: any): Promise<ServerMessage>;
    updateAPNAdmin(req: any, body: any): Promise<ServerMessage>;
    deleteAPNAdmin(req: any, body: any): Promise<ServerMessage>;
}
