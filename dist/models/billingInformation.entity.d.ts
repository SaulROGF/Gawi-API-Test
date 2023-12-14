import { Model } from 'sequelize-typescript';
export declare class BillingInformation extends Model<BillingInformation> {
    idBillingInformation: number;
    idUser: number;
    businessName: string;
    rfc: string;
    phone: string;
    email: string;
    state: string;
    city: string;
    zipCode: string;
    suburb: string;
    street: string;
    addressNumber: string;
    facturapiClientToken: string;
    createdAt: Date;
    updatedAt: Date;
}
