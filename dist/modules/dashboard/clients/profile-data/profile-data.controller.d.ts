import { ProfileDataService } from './profile-data.service';
import { ServerMessage } from './../../../../classes/ServerMessage.class';
export declare class ProfileDataController {
    private readonly profileDataService;
    constructor(profileDataService: ProfileDataService);
    getBillingInfoEndpoint(req: any): Promise<ServerMessage>;
    updateBillingInfoEndpoint(body: any, req: any): Promise<ServerMessage>;
    getTownsAndStatesEndpoint(req: any): Promise<ServerMessage>;
    updateTownEndpoint(body: any, req: any): Promise<ServerMessage>;
    deleteUserData(req: any): Promise<ServerMessage>;
    getAdminAccountData(req: any): Promise<ServerMessage>;
    updateClientName(req: any, body: any): Promise<ServerMessage>;
    updateClientPhone(req: any, body: any): Promise<ServerMessage>;
    updateClientEmail(req: any, body: any): Promise<ServerMessage>;
    addCardEndpoint(req: any, body: any): Promise<ServerMessage>;
    deleteCardEndpoint(req: any, body: any): Promise<ServerMessage>;
    getAllCardsEndpoint(req: any): Promise<ServerMessage>;
    getCardEndpoint(req: any, idCard: number): Promise<ServerMessage>;
    setCardAsDefaultEndpoint(req: any, body: any): Promise<ServerMessage>;
    payDeviceSubscription(req: any, body: any): Promise<ServerMessage>;
    getPaymentsList(req: any, body: any): Promise<ServerMessage>;
    getPaymentDetails(req: any, idHistoryPayments: number): Promise<ServerMessage>;
}
