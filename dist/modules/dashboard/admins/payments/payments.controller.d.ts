import { ServerMessage } from '../../../../classes/ServerMessage.class';
import { PaymentsService } from './payments.service';
export declare class PaymentsController {
    private readonly paymentsService;
    constructor(paymentsService: PaymentsService);
    manualSubscriptionsActivations(body: any): Promise<ServerMessage>;
    deleteCardEndpoint(body: any): Promise<ServerMessage>;
    createInvoice(body: any): Promise<ServerMessage>;
    getAlreadyBillsList(body: any): Promise<ServerMessage>;
}
