import { ServerMessage } from './../../../classes/ServerMessage.class';
import { BillingInformation } from '../../../models/billingInformation.entity';
import { User } from '../../../models/user.entity';
import { Town } from '../../../models/town.entity';
export declare class FacturApiService {
    private readonly userRepository;
    private readonly townRepository;
    private readonly billingInfoRepository;
    axios: any;
    facturapi: any;
    satCodeSubscriptionProduct: string;
    unitSatCode: string;
    constructor(userRepository: typeof User, townRepository: typeof Town, billingInfoRepository: typeof BillingInformation);
    createOrganizationCustomer(organizationInfo: any): Promise<ServerMessage>;
    updateOrganizationCustomer(token: string, organizationInfo: any): Promise<ServerMessage>;
    createCustomer(billingInfoData: BillingInformation): Promise<ServerMessage>;
    updateCustomer(token: string, billingInfoData: BillingInformation): Promise<ServerMessage>;
}
