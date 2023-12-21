import { ServerMessage } from './../../../classes/ServerMessage.class';
import { ProductConekta } from '../../../classes/conektaClasses.class';
import { Card } from '../../../models/card.entity';
export declare class ConektaService {
    conekta: any;
    constructor();
    createConektaCustomer(name: string, email: string, phone: string): Promise<any>;
    updateCustomer(id: string, conektaData: any): Promise<ServerMessage>;
    addCard(idCustomer: string, cardToken: string): Promise<ServerMessage>;
    getAllCards(idCustomer: string): Promise<ServerMessage>;
    deleteCart(idCustomer: string, cardData: Card): Promise<ServerMessage>;
    getDefaultCard(idCustomer: string): Promise<ServerMessage>;
    setCardAsDefault(idCustomer: string, cardToken: string): Promise<ServerMessage>;
    findCustomerByEmail(email: string): Promise<any>;
    createSubscriptionPayment(conektaClientId: string, conektaCardId: string, product: ProductConekta, productDescription: string): Promise<ServerMessage>;
}
