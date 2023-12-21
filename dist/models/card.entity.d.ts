import { Model } from 'sequelize-typescript';
export declare class Card extends Model<Card> {
    idCard: number;
    idUser: number;
    conektaCardToken: string;
    printedName: string;
    last4Digits: number;
    activePaymentMethod: boolean;
    brand: string;
    createdAt: Date;
    updatedAt: Date;
}
