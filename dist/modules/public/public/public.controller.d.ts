import { ServerMessage } from './../../../classes/ServerMessage.class';
import { PublicService } from './public.service';
export declare class PublicController {
    private readonly publicService;
    constructor(publicService: PublicService);
    resetPassword(body: any): Promise<ServerMessage>;
    generateRecoveryEmailEndpoint(body: any): Promise<ServerMessage>;
    createClient(ip: string, body: any): Promise<ServerMessage>;
}
