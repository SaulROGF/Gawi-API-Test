import { Organization } from './organization.entity';
import { User } from './user.entity';
import { Device } from './device.entity';
import { Model } from 'sequelize-typescript';
export declare class HistoryPayment extends Model<HistoryPayment> {
    idHistoryPayments: number;
    idUser: number;
    idDevice: number;
    idOrganization: number;
    type: number;
    paymentToken: string;
    product: string;
    currency: string;
    status: string;
    commentForUser: string;
    facturapiInvoiceId: string;
    verificationUrl: string;
    conektaOrderId: string;
    object: string;
    amount: number;
    invoiced: boolean;
    needInvoice: boolean;
    createdAt: Date;
    updatedAt: Date;
    user: User;
    organization: Organization;
    device: Device;
}
