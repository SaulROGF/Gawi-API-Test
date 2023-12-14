import { Inject, Injectable, Logger } from '@nestjs/common';
import { ServerMessage } from '../../../../classes/ServerMessage.class';
import { BillingInformation } from '../../../../models/billingInformation.entity';
import { Card } from '../../../../models/card.entity';
import { HistoryPayment } from '../../../../models/historyPayments.entity';
import { Organization } from '../../../../models/organization.entity';
import { State } from '../../../../models/state.entity';
import { Town } from '../../../../models/town.entity';
import { User } from '../../../../models/user.entity';
import { ConektaService } from '../../../global/conekta-service/conekta-service.service';
import { EmailsService } from '../../../global/emails/emails.service';
import { FacturApiService } from '../../../global/factur-api/factur-api.service';
// import { facturapiConf } from './../../../../conf/facturapi.conf';
import * as Facturapi from 'facturapi';
import * as axios from 'axios';
import { Device } from '../../../../models/device.entity';

@Injectable()
export class PaymentsService {
    axios: any;
    facturapi: any;
    srcEmail: string;
    

    constructor(
        @Inject('StateRepository') private readonly stateRepository: typeof State,
        @Inject('TownRepository') private readonly townRepository: typeof Town,
        @Inject('UserRepository') private readonly userRepository: typeof User,
        @Inject('DeviceRepository') private readonly deviceRepository: typeof Device,
        @Inject('CardRepository') private readonly cardRepository: typeof Card,
        @Inject('HistoryPaymentsRepository') private readonly historyPaymentsRepository: typeof HistoryPayment,
        @Inject('BillingInformationRepository')
        private readonly billingInfoRepository: typeof BillingInformation,
        private readonly facturapiService: FacturApiService,
        private readonly emailsService: EmailsService,
        private readonly conektaService: ConektaService,
        @Inject('winston') private readonly logger: Logger,
    ) {
        this.axios = axios.default;
        this.facturapi = new Facturapi(process.env.FACTURAPI_API_KEY);
        this.srcEmail = process.env.EMAIL_USR;
     }
    
     addMonths(months: number, date: Date = new Date()): Date {
        var d = date.getDate();
        date.setMonth(date.getMonth() + +months);
        if (date.getDate() != d) {
          date.setDate(0);
        }
        return date;
    }
    
    /**
     *
    */
     async manualSubscriptionsActivations( data : {
        serialNumber: string,
        type: number,
        years: number,
      }[] ): Promise<ServerMessage> {

        if( data == undefined || 
            data == null ){

            return new ServerMessage(true, 'Peticion invalida', {});
        }
        if( data.length == 0 ){
            return new ServerMessage(true, 'Peticion invalida', {});
        }
        try {
            let errors : ServerMessage[] = [];
            let activateSubscription : ServerMessage[] = [];

            for (let index = 0; index < data.length; index++) {
                const element = data[index];

                if( element.serialNumber == undefined || 
                    element.serialNumber == null || 
                    element.type == undefined || 
                    element.type == null || 
                    element.years == undefined || 
                    element.years == null
                ){
                    errors.push(new ServerMessage(true, 'Peticion invalida', element))
                }else{
                    let device: Device = await this.deviceRepository.findOne<Device>({
                        where: {
                            serialNumber: element.serialNumber,
                            type: element.type,
                        },
                    });

                    if(device){
                        device.validUntil = this.addMonths(12 * element.years);
                        await device.save();
    
                        activateSubscription.push(new ServerMessage(false, 'Suscripcion activada con exito', element))
                    }else{
                        errors.push(new ServerMessage(true, 'El numero de serie no existe', element))
                    }
                }
            }

            return new ServerMessage(false, 'Activaciones realizadas con exito', {
                errors : errors,
                activateSubscription : activateSubscription
            });
        } catch (error) {
            this.logger.error(error);
            return new ServerMessage(true, 'A ocurrido un error activando los dispositivos', error);
        }
    } 
    
    /**
    *
    */
   async paymentsListDeviceSubscription(queryParams: any): Promise<ServerMessage> {
       try {
           //'#'+newPayment.idHistoryPayments +'-'+newPayment.conektaOrderId
           let paymentsList: any[] = await this.historyPaymentsRepository.findAll<HistoryPayment>({
               where: {
                   type: 0,
               },
               include: [{
                   model: User,
                   as: 'user',
                   include: [{
                       model: Town,
                       as: 'town',
                       include: [{
                           model: State,
                           as: 'state',

                       }]
                   }]
               }, {
                   model: Organization,
                   as: 'organization'
               }, {
                   model: Device,
                   as: 'device'
               }],
               order: [['createdAt', 'DESC']],
           })
               .map((payment: HistoryPayment) => {
                   return this.buildPaymentDto(payment);
               });

           return new ServerMessage(false, 'Lista de pagos de las suscripciones obtenida con exito', paymentsList);
       } catch (error) {
           this.logger.error(error);
           return new ServerMessage(true, 'A ocurrido un error obteniendo la lista de pagos de las suscripciones', error);
       }
   }

    async createPaymentSubscriptionInvoice(data: { idHistoryPayment: number }): Promise<ServerMessage> {
        try {
            if (
                data.idHistoryPayment == null ||
                data.idHistoryPayment == undefined
            ) {
                return new ServerMessage(true, "Campos inválidos", {});
            }

            let paymentToBill: HistoryPayment = await this.historyPaymentsRepository.findOne<HistoryPayment>({
                where: {
                    idHistoryPayments: data.idHistoryPayment,
                    status: 'successful-payment',
                    needInvoice: true
                },
                include: [{
                    model: User,
                    as: 'user',
                    //attributes:  ['idUser','idRol','username','email'],
                    include: [{
                        model: BillingInformation,
                        as: 'billingInformation',
                        //attributes:  ['idUser','idRol','username','email'],
                    },{
                        model : Town,
                        as: 'town',
                        include: [{
                            model : State,
                            as: 'state',
                        }]
                    }]
                },{
                    model: Organization,
                    as: 'organization'
                }, {
                    model: Device,
                    as: 'device'
                }]
            });

            if (!paymentToBill) {
                return new ServerMessage(true, "El pago no esta disponible para facturación", {});
            }

            if (!paymentToBill.user.billingInformation) {
                return new ServerMessage(true, "El usuario no dispone de datos de facturación", {});
            }

            //Este try es la funcion de facturacion deberia moverse al servicio  de facturapi
            try {
                
                let type = '04';// 04 - Tarjeta de crédito,
                if (paymentToBill.type == 1) {
                    type = '03'; // 03 - Transferencia electrónica de fondos
                }

                let invoice: any = {};
                let idClientFacturapi = paymentToBill.user.billingInformation.facturapiClientToken;

                let items: {
                    quantity: number,
                    product: {
                        description: string,
                        product_key: string, //Sat code
                        price: number,
                        tax_included: boolean, //true
                        unit_key: string, //Sat unit code
                        sku: string, //Código interno
                    },
                }[] = [];

                //Se crea el producto
                items.push({
                    quantity: 1,
                    product: {
                        description: paymentToBill.product /* + " (" + paymentToApprove.buyedMonths + " meses)" */,
                        product_key: this.facturapiService.satCodeSubscriptionProduct, //Sat code
                        price: paymentToBill.amount,
                        tax_included: true, //true
                        unit_key: this.facturapiService.unitSatCode, //Sat unit code
                        sku: '#'+paymentToBill.idHistoryPayments +'-'+paymentToBill.conektaOrderId, //Código interno
                    },
                });

                invoice = await this.facturapi.invoices.create({
                    customer: idClientFacturapi,
                    //payment_method : string, // PUE - “PUE”	Pago en una sola exhibición (de contado).
                    // “PPD”	Pago en parcialidades o diferido (total o parcialmente a crédito). 
                    //Requiere expedir un comprobante de pago cuando se reciba un pago subsecuente. 
                    payment_form: type,
                    folio_number: paymentToBill.idHistoryPayments,//Folio interno idOrder
                    //series: 'A',
                    items: items,
                });

                try {
                    paymentToBill.facturapiInvoiceId = invoice.id;
                    paymentToBill.commentForUser = paymentToBill.commentForUser + ". Factura generada con éxito";
                    //paymentToBill.createdBy = "Sistema de facturación";
                    paymentToBill.verificationUrl = invoice.verification_url;
                    paymentToBill.invoiced = true;
                    paymentToBill.object = JSON.stringify(invoice).substring(0, 4990);
                    await paymentToBill.save();

                    try {

                        let emails: string[] = [];

                        let adminUsers: User[] = await this.userRepository.findAll({
                            where: {
                                idRole: 1
                            }
                        });

                        if (adminUsers.length > 0) {
                            for (let index = 0; index < adminUsers.length; index++) {
                                emails.push(adminUsers[index].email);
                            }
                        }

                        emails.push(paymentToBill.user.billingInformation.email);
                        emails.push(this.srcEmail)

                        // Enviar al correo del cliente
                        //await this.facturapi.invoices.sendByEmail(newOrder.idInvoiceFacturapi);
                        // Enviar a otro correo
                        //await this.facturapi.invoices.sendByEmail(
                        //    newOrder.idInvoiceFacturapi,
                        //    { email: 'otro@correo.com' }
                        //);
                        // Enviar a más de un correo (máx. 10)
                        let emailResult = await this.facturapi.invoices.sendByEmail(
                            paymentToBill.facturapiInvoiceId,
                            {
                                email: emails
                            }
                        );

                        paymentToBill.commentForUser =  paymentToBill.commentForUser + ". Factura enviada por email";
                        //paymentToBill.createdBy = "Sistema de facturación";
                        paymentToBill.object = JSON.stringify(emailResult).substring(0, 4990);
                        paymentToBill.save();

                        return new ServerMessage(
                            false, 
                            "Factura enviada por email, por favor comunicarse con soporte para mas información", 
                            //paymentToBill
                            this.buildPaymentDto(paymentToBill)
                        );
                    } catch (error) {
                        console.log('error',error);
                        
                        paymentToBill.commentForUser =  paymentToBill.commentForUser + ". Error enviando la factura por email, por favor comunicarse con soporte para mas información";
                        //paymentToBill.createdBy = "Sistema de facturación";
                        paymentToBill.object = JSON.stringify(error).substring(0, 4990);
                        await paymentToBill.save();

                        return new ServerMessage(
                            true, 
                            "Error enviando la factura por email, por favor comunicarse con soporte para mas información", 
                            JSON.stringify(error).substring(0, 4990)
                        );
                    }
                } catch (error) {
                    paymentToBill.commentForUser =  paymentToBill.commentForUser + ". Error guardando la información de la factura, por favor comunicarse con soporte para mas información";
                    //paymentToBill.createdBy = "Sistema de facturación";
                    paymentToBill.object = JSON.stringify(invoice).substring(0, 4990);
                    await paymentToBill.save();

                    this.logger.error(invoice);
                    return new ServerMessage(true, "Error guardando la información de la factura, por favor comunicarse con soporte para mas información", JSON.stringify(invoice).substring(0, 4990));
                }
            } catch (error) {
                let fixError: string = error.toString();

                if (fixError.includes('Error') == true) {
                    //paymentToBill.createdBy = "Sistema de facturación";
                    paymentToBill.object = JSON.stringify(fixError).substring(0, 4990);
                    await paymentToBill.save();

                    return new ServerMessage(true, fixError, fixError);
                } else {
                    //invoice = new ServerMessage(true, 'A ocurrido un error facturando en facturapi', fixError);

                    paymentToBill.commentForUser =  paymentToBill.commentForUser + ". A ocurrido un error facturando en facturapi";
                    //paymentToBill.createdBy = "Sistema de facturación";
                    paymentToBill.object = JSON.stringify(fixError).substring(0, 4990);
                    await paymentToBill.save();
                    this.logger.error(fixError);

                    return new ServerMessage(true, "Ocurrió un error generando la factura, por favor comunicarse con soporte", 
                        { 
                            invoice: {}, 
                            paymentToApprove: 
                            paymentToBill ,
                            fixError : fixError
                        });
                }
            }
        } catch (error) {
            this.logger.error(error);
            return new ServerMessage(true, "Error creando la factura", error);
        }
    }

    /**
     *
     */
    async getAlreadyBillsList(queryParams: any): Promise<ServerMessage> {
        try {
            //'#'+newPayment.idHistoryPayments +'-'+newPayment.conektaOrderId
            let paymentsList: any[] = await this.historyPaymentsRepository.findAll<HistoryPayment>({
                where: {
                    //type: 0,
                    invoiced : true,
                },
                include: [{
                    model: User,
                    as: 'user',
                    include: [{
                        model: Town,
                        as: 'town',
                        include: [{
                            model: State,
                            as: 'state',

                        }]
                    }]
                }, {
                    model: Organization,
                    as: 'organization'
                }, {
                    model: Device,
                    as: 'device'
                }],
                order: [['createdAt', 'DESC']],
            })
                .map((payment: HistoryPayment) => {
                    return this.buildPaymentDto(payment);
                });

            return new ServerMessage(false, 'Lista de pagos de las suscripciones obtenida con exito', paymentsList);
        } catch (error) {
            this.logger.error(error);
            return new ServerMessage(true, 'A ocurrido un error obteniendo la lista de pagos de las suscripciones', error);
        }
    }


    buildPaymentDto( payment : HistoryPayment){
        return {
            idHistoryPayment : payment.idHistoryPayments,
            codePayment: payment.idHistoryPayments + '-' + payment.conektaOrderId.replace('Ord_', ''),
            clientId: payment.user.idUser,
            clientName: payment.user.firstName + ' ' + payment.user.lastName,
            clientEmail: payment.user.email,
            clientPhone: payment.user.phone,

            idDevice : payment.device.idDevice,
            serialNumber : payment.device.serialNumber,
            idConektaAccount: payment.user.idConektaAccount,
            clientState: payment.user.town.state.name,
            clientTown: payment.user.town.name,
            clientCreatedAt: payment.user.createdAt,

            commentForUser: payment.commentForUser,
            product: payment.product,
            status: payment.status,
            needInvoice: payment.needInvoice,
            invoiced: payment.invoiced,
            facturapiInvoiceId: payment.facturapiInvoiceId,
            verificationUrl: payment.verificationUrl,
            amount: payment.amount,
            organizationName: payment.organization.comercialName,
            updatedAt: payment.updatedAt,
            createdAt: payment.createdAt,
        }
    }
}
