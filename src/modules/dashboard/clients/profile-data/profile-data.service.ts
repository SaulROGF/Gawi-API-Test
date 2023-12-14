import { HistoryPayment } from './../../../../models/historyPayments.entity';
import { Card } from './../../../../models/card.entity';
import { Injectable, Inject } from '@nestjs/common';
import { ServerMessage } from '../../../../classes/ServerMessage.class';
import { BillingInformation } from './../../../../models/billingInformation.entity';
import { FacturApiService } from './../../../global/factur-api/factur-api.service';
import { State } from './../../../../models/state.entity';
import { Town } from './../../../../models/town.entity';
import { User } from './../../../../models/user.entity';
import { Op } from 'sequelize';
import { ConektaService } from '../../../global/conekta-service/conekta-service.service';
import { ConektaCustomer, PaidOrderConekta, ProductConekta } from './../../../../classes/conektaClasses.class';
import { Logger } from 'winston';
import { Device } from '../../../../models/device.entity';
import { EmailsService } from '../../../global/emails/emails.service';
import { Organization } from '../../../../models/organization.entity';

@Injectable()
export class ProfileDataService {
  constructor(
    @Inject('StateRepository') private readonly stateRepository: typeof State,
    @Inject('TownRepository') private readonly townRepository: typeof Town,
    @Inject('UserRepository') private readonly userRepository: typeof User,
    @Inject('CardRepository') private readonly cardRepository: typeof Card,
    @Inject('HistoryPaymentsRepository') private readonly historyPaymentsRepository: typeof HistoryPayment,
    @Inject('BillingInformationRepository')
    private readonly billingInfoRepository: typeof BillingInformation,
    private readonly facturapiService: FacturApiService,
    private readonly emailsService: EmailsService,
    private readonly conektaService: ConektaService,
    @Inject('winston') private readonly logger: Logger,
  ) { }

  /**
   *
   */
  async retrieveTownsAndStates(idUser: number): Promise<ServerMessage> {
    try {
      // querying...
      let states: State[] = await this.stateRepository.findAll<State>({
        include: [
          {
            model: Town,
            as: 'towns',
          },
        ],
      });

      let userTownData: User = await this.userRepository.findOne<User>({
        where: {
          idUser: idUser,
          /* deleted : false,
          active : true */
        },
        include: [
          {
            model: Town,
            as: 'town',
            include: [
              {
                model: State,
                as: 'state',
              },
            ],
          },
        ],
      });

      // return data
      return new ServerMessage(false, '', {
        states: states,
        actualTown: userTownData.town,
      });
    } catch (error) {
      this.logger.error(error);
      return new ServerMessage(true, 'A ocurrido un error', error);
    }
  }

  /**
   *
   */
  async updateTownInClient(client: User, body: Town): Promise<ServerMessage> {
    try {
      const constrants = [
        client == null,
        client == undefined,
        body.idTown == null,
        body.idTown == undefined,
      ];

      if (constrants.some(val => val)) {
        return new ServerMessage(true, 'Petición incompleta', {});
      }

      client.idTown = body.idTown;
      await client.save();
      // return data
      return new ServerMessage(false, 'Actualizado correctamente', {});
    } catch (error) {
      this.logger.error(error);
      return new ServerMessage(true, 'A ocurrido un error', error);
    }
  }

  /**
   *
   */
  async getBillingInfoData(client: User): Promise<ServerMessage> {
    try {
      if (client == null || client == undefined) {
        return new ServerMessage(true, 'Petición incompleta', {});
      }

      let billingInfoData: BillingInformation = await this.billingInfoRepository.findOne<
        BillingInformation
      >({
        where: {
          idUser: client.idUser,
        },
      });

      if (!billingInfoData) {
        return new ServerMessage(true, 'Información no encontrada', {});
      }
      return new ServerMessage(
        false,
        'Datos extraidos correctamente',
        billingInfoData,
      );
    } catch (error) {
      this.logger.error(error);
      return new ServerMessage(true, 'A ocurrido un error', error);
    }
  }

  /**
   *
   */
  async updateBillingInfoData(
    client: User,
    billingInfoData: BillingInformation,
  ): Promise<ServerMessage> {
    try {
      const constrants = [
        client == null,
        client == undefined,
        billingInfoData.businessName == null,
        billingInfoData.businessName == undefined,
        billingInfoData.rfc == null,
        billingInfoData.rfc == undefined,
        billingInfoData.phone == null,
        billingInfoData.phone == undefined,
        billingInfoData.email == null,
        billingInfoData.email == undefined,
        billingInfoData.city == null,
        billingInfoData.city == undefined,
        billingInfoData.state == null,
        billingInfoData.state == undefined,
        billingInfoData.zipCode == null,
        billingInfoData.zipCode == undefined,
        billingInfoData.suburb == null,
        billingInfoData.suburb == undefined,
        billingInfoData.street == null,
        billingInfoData.street == undefined,
        billingInfoData.addressNumber == null,
        billingInfoData.addressNumber == undefined,
      ];

      if (constrants.some(val => val)) {
        return new ServerMessage(true, 'Petición incompleta', {});
      }
      // obtenemos el objeto billingInfo, para actualizarlo o en su defecto, crearlo
      let billingInfo: BillingInformation = await this.billingInfoRepository.findOne<
        BillingInformation
      >({
        where: {
          idUser: client.idUser,
        },
      });
      /**
       * si no existe el objeto billingInfo:
       * (1) creamos el customers en facturapi,
       * (2) obtenemos un token (el id del customer) y
       * (3) lo implementamos para crear un objeto billingInfo
       *     con la información presentada
       */
      if (!billingInfo) {
        let response: ServerMessage = await this.facturapiService.createCustomer(
          billingInfoData,
        );
        //
        if (response.error) {
          return new ServerMessage(
            true,
            'Error al crear los datos de facturación',
            response,
          );
        }
        // creamos el objeto billingInfo
        billingInfo = await this.billingInfoRepository.create<
          BillingInformation
        >({
          idUser: client.idUser,
          businessName: billingInfoData.businessName,
          rfc: billingInfoData.rfc,
          phone: billingInfoData.phone,
          email: billingInfoData.email,
          state: billingInfoData.state,
          city: billingInfoData.city,
          zipCode: billingInfoData.zipCode,
          suburb: billingInfoData.suburb,
          street: billingInfoData.street,
          addressNumber: billingInfoData.addressNumber,
          facturapiClientToken: response.data.id,
        });
        await billingInfo.save();
        /**
         * si ya existe el objeto billingInfo, solo debemos actualizar el
         * customer de facturapi y despues actualizar el objeto mismo
         */
      } else {
        let response: ServerMessage = await this.facturapiService.updateCustomer(
          billingInfo.facturapiClientToken,
          billingInfo,
        );
        //
        if (response.error) {
          return new ServerMessage(
            true,
            'Error al actualizar los datos de facturación',
            response,
          );
        }
        // actualizar los valores del objeto
        billingInfo.businessName = billingInfoData.businessName;
        billingInfo.rfc = billingInfoData.rfc;
        billingInfo.phone = billingInfoData.phone;
        billingInfo.email = billingInfoData.email;
        billingInfo.state = billingInfoData.state;
        billingInfo.city = billingInfoData.city;
        billingInfo.zipCode = billingInfoData.zipCode;
        billingInfo.suburb = billingInfoData.suburb;
        billingInfo.street = billingInfoData.street;
        billingInfo.addressNumber = billingInfoData.addressNumber;
        await billingInfo.save();
      }
      return new ServerMessage(false, 'Guardado correctamente', billingInfo);
    } catch (error) {
      let fixError: string = error.toString();
      this.logger.error(fixError);
      if (fixError.includes('Error') == true) {
        return new ServerMessage(true, fixError, fixError);
      } else {
        return new ServerMessage(
          true,
          'A ocurrido un error actualizando los datos de facturación',
          fixError,
        );
      }
    }
  }

  /**
   *
   */
  async deleteUserData(idUser: number): Promise<ServerMessage> {
    try {
      let client: User = await this.userRepository.findOne<User>({
        where: {
          idUser: idUser,
          deleted : false,
        },
        include: [
          {
            model: Device,
            as: 'devices',
          },
        ],
      });

      if (!client) {
        return new ServerMessage(true, 'Usuario no encontrado', {});
      }

      for (let index = 0; index < client.devices.length; index++) {
        let deviceToUnlock = client.devices[index];
        deviceToUnlock.isActive = true;
        await deviceToUnlock.save();
      }

      client.active = false;
      client.deleted = true;
      await client.save();

      return new ServerMessage(false, 'Datos eliminados correctamente', {});
    } catch (error) {
      this.logger.error(error);
      return new ServerMessage(true, 'A ocurrido un error', error);
    }
  }


  /**
   *
   */
   async getClientAccountData(idUser: number): Promise<ServerMessage> {
    try {
      let client: User = await this.userRepository.findOne<User>({
        where: {
          idUser: idUser,
        },
        include: [
          {
            model: Town,
            as: 'town',
            include: [
              {
                model: State,
                as: 'state',
              },
            ],
          },
          {
            model: BillingInformation,
            as: 'billingInformation',
          },
          {
            model: Card,
            as: 'cards',
            where: {
              activePaymentMethod: true,
            },
            limit: 1,
          },
        ],
      });

      if (!client) {
        return new ServerMessage(true, 'Usuario no encontrado', {});
      }

      return new ServerMessage(false, 'Datos enviados correctamente', {
        user: client,
      });
    } catch (error) {
      this.logger.error(error);
      return new ServerMessage(true, 'A ocurrido un error', error);
    }
  }

  /**
   *
   */
  async updateClientName(user: User, userData: User): Promise<ServerMessage> {
    try {
      if (
        userData.firstName == null ||
        userData.firstName == undefined ||
        userData.lastName == null ||
        userData.lastName == undefined ||
        userData.mothersLastName == null ||
        userData.mothersLastName == undefined
      ) {
        return new ServerMessage(true, 'Petición incompleta', {});
      }

      // armando el paquete de datos para actualizar
      // la cuenta de conekta
      let conektaData = {
        name:
          userData.firstName +
          ' ' +
          userData.lastName +
          ' ' +
          userData.mothersLastName,
        email: user.email,
        phone: user.phone,
        shipping_contact: {
          receiver:
            userData.firstName +
            ' ' +
            userData.lastName +
            ' ' +
            userData.mothersLastName,
          phone: user.phone,
          /* address: {
            street1: userData.street,
            country: 'MX',
            residential: true,
            object: 'shipping_address',
            postal_code: userData.zipCode,
          }, */
        },
      };
      // actualizar información de conekta
      let conektaCustomerUpdateResult: ServerMessage = await this.conektaService.updateCustomer(
        user.idConektaAccount,
        conektaData,
      );

      if (conektaCustomerUpdateResult.error == false) {
        // actualizar usuario en la base de datos
        user.firstName = userData.firstName;
        user.lastName = userData.lastName;
        user.mothersLastName = userData.mothersLastName;
        //user.email = userData.email;
        //user.phone = userData.phone;
        await user.save();
      }

      return new ServerMessage(false, 'Actualizado con éxito', {});
    } catch (error) {
      this.logger.error(error);
      return new ServerMessage(true, 'A ocurrido un error', error);
    }
  }

  /**
   *
   */
  async updateClientPhone(user: User, userData: User): Promise<ServerMessage> {
    try {
      if (userData.phone == null || userData.phone == undefined) {
        return new ServerMessage(true, 'Petición incompleta', {});
      }

      // armando el paquete de datos para actualizar
      // la cuenta de conekta
      let conektaData = {
        name: user.firstName + ' ' + user.lastName + ' ' + user.mothersLastName,
        email: user.email,
        phone: userData.phone,
        shipping_contact: {
          receiver:
            user.firstName + ' ' + user.lastName + ' ' + user.mothersLastName,
          phone: user.phone,
          /* address: {
            street1: userData.street,
            country: 'MX',
            residential: true,
            object: 'shipping_address',
            postal_code: userData.zipCode,
          }, */
        },
      };
      // actualizar información de conekta
      let conektaCustomerUpdateResult: ServerMessage = await this.conektaService.updateCustomer(
        user.idConektaAccount,
        conektaData,
      );

      if (conektaCustomerUpdateResult.error == false) {
        // actualizar usuario en la base de datos
        //user.email = userData.email;
        user.phone = userData.phone;
        await user.save();
      }

      return new ServerMessage(false, 'Actualizado con éxito', {});
    } catch (error) {
      this.logger.error(error);
      return new ServerMessage(true, 'A ocurrido un error', error);
    }
  }
  /**
   *
   */
  async updateClientEmail(user: User, userData: any): Promise<ServerMessage> {
    try {
      if (userData.email == null || userData.email == undefined) {
        return new ServerMessage(true, 'Petición incompleta', {});
      }
      // checar que el usuario no vaya a actualizar su email con otro
      // ya existente en la base de datos
      let alreadyEmail: User = await this.userRepository.findOne<User>({
        where: {
          idUser: {
            [Op.not]: user.idUser,
          },
          email: userData.email,
          deleted: false,
        },
      });
      if (alreadyEmail) {
        return new ServerMessage(true, 'Email actualmente en uso', {});
      }

      if (user.email == userData.email) {
        return new ServerMessage(false, 'Sin cambios', {});
      }
      // armando el paquete de datos para actualizar
      // la cuenta de conekta
      let conektaData = {
        name: user.firstName + ' ' + user.lastName + ' ' + user.mothersLastName,
        email: userData.email,
        phone: user.phone,
        shipping_contact: {
          receiver:
            user.firstName + ' ' + user.lastName + ' ' + user.mothersLastName,
          phone: user.phone,
          /* address: {
            street1: userData.street,
            country: 'MX',
            residential: true,
            object: 'shipping_address',
            postal_code: userData.zipCode,
          }, */
        },
      };
      // actualizar información de conekta
      let conektaCustomerUpdateResult: ServerMessage = await this.conektaService.updateCustomer(
        user.idConektaAccount,
        conektaData,
      );

      if (conektaCustomerUpdateResult.error == false) {
        // actualizar usuario en la base de datos
        user.email = userData.email;
        await user.save();
      }

      return new ServerMessage(false, 'Actualizado con éxito', {});
    } catch (error) {
      this.logger.error(error);
      return new ServerMessage(true, 'A ocurrido un error', error);
    }
  }

  /**
   *
   */
  async addCard(cardInfo: { conektaCardToken: string, activePaymentMethod: boolean }, client: User): Promise<ServerMessage> {
    try {
      /**
       * check constrants
       */
      const constrants = [
        client == null,
        client == undefined,
        cardInfo.conektaCardToken == null,
        cardInfo.conektaCardToken == undefined,
        cardInfo.activePaymentMethod == null,
        cardInfo.activePaymentMethod == undefined,
      ];
      if (constrants.some(val => val)) {
        return new ServerMessage(true, 'Petición incompleta', {});
      }

      /**
       * check instances
       */
      let cards: Card[] = await this.cardRepository.findAll({
        where: {
          idUser: client.idUser,
        }
      });

      let addCardProcess: ServerMessage = await this.conektaService.addCard(
        client.idConektaAccount,
        cardInfo.conektaCardToken,
      );

      if (addCardProcess.error) return addCardProcess;

      /**
       * business logic
       */
      let conektaCard = addCardProcess.data;

      if (cardInfo.activePaymentMethod == true) {
        let defaultCard: Card = await this.cardRepository.findOne({
          where: {
            idUser: client.idUser,
            activePaymentMethod: true,
          },
        });
        if (defaultCard) {
          defaultCard.activePaymentMethod = false;
          await defaultCard.save();
        }
        this.conektaService.setCardAsDefault(
          client.idConektaAccount,
          conektaCard.id,
        );
      }

      let cardFromDB: Card = await this.cardRepository.create<Card>({
        idUser: client.idUser,
        conektaCardToken: conektaCard.id,
        last4Digits: conektaCard.last4,
        month: conektaCard.exp_month,
        year: conektaCard.exp_year,
        brand: conektaCard.brand,
        printedName: conektaCard.name,
        activePaymentMethod:
          cardInfo.activePaymentMethod == true || cards.length == 0 ? true : false,
      });

      // check that exists at least one card
      /* let getCardsProcess: ServerMessage = await this.conektaService.getAllCards(
        client.idConektaAccount,
      );

      if (getCardsProcess.error) return getCardsProcess; */

      return new ServerMessage(false, 'Se ha añadido la tarjeta correctamente', cardFromDB);
    } catch (error) {
      this.logger.error(error);
      return new ServerMessage(true, 'Ha ocurrido un error', error);
    }
  }

  /**
   *
   */
  async deleteCard(cardInfo: Card, client: User): Promise<ServerMessage> {
    try {
      /**
       * check constrants
       */
      const constrants = [
        client == null,
        client == undefined,
        cardInfo.idCard == null,
        cardInfo.idCard == undefined,
      ];
      if (constrants.some(val => val))
        return new ServerMessage(true, 'Petición incompleta', {});

      /**
     * check if exists
     */
      let cardForDelete: Card = await this.cardRepository.findOne({
        /* attributes : { exclude: ['conektaCardToken']}, */
        where: {
          idCard: cardInfo.idCard,
          idUser: client.idUser,
        },
      });

      if (!cardForDelete) {
        return new ServerMessage(true, 'La tarjeta no esta disponible', {});
      }

      /**
       * check instances
       */
      // check that exists at least one card
      let getCardsProcess: ServerMessage = await this.conektaService.getAllCards(
        client.idConektaAccount,
      );

      if (getCardsProcess.error) return getCardsProcess;

      let conektaCards = getCardsProcess.data;

      if (conektaCards.length <= 1)
        return new ServerMessage(true, 'El cliente no se puede quedar sin tarjetas registradas', {},);

      /**
       * business logic
       */
      // delete card on conekta
      let deleteCardProcess: ServerMessage = await this.conektaService.deleteCart(
        client.idConektaAccount,
        cardForDelete,
      );
      if (deleteCardProcess.error) return deleteCardProcess;

      // delete card from own db
      await cardForDelete.destroy();

      // if deleted card is default, marked new default card
      if (cardForDelete.activePaymentMethod) {

        let actualDefaultCardId: ServerMessage = await this.conektaService.getDefaultCard(
          client.idConektaAccount
        );

        let defaultCard: Card = await this.cardRepository.findOne({
          where: {
            idUser: client.idUser,
            conektaCardToken: actualDefaultCardId.data,
          },
        });

        if (defaultCard) {
          defaultCard.activePaymentMethod = true;
          await defaultCard.save();
        }
      }

      return new ServerMessage(false, 'Se ha eliminado la tarjeta correctamente', {},);
    } catch (error) {
      this.logger.error(error);
      return new ServerMessage(true, 'Ha ocurrido un error', error);
    }
  }

  /**
   *
   */
  async getAllCards(client: User): Promise<ServerMessage> {
    try {
      /**
       * check constrants
       */
      const constrants = [
        client == null,
        client == undefined,
      ];
      if (constrants.some(val => val))
        return new ServerMessage(true, 'Petición incompleta', {});

      /**
       * check instances
       */
      let cards: Card[] = await this.cardRepository.findAll({
        where: {
          idUser: client.idUser
        }
      });

      /* if (!cards.length)
        return new ServerMessage(
          true,
          'No hay tarjetas registradas en la base de datos',
          {},
        ); */

      /* let getCardsProcess: ServerMessage = await this.conektaService.getAllCards(
        cardInfo.conektaId,
      );

      if (getCardsProcess.error) return getCardsProcess;
      
      let conektaCards = getCardsProcess.data; */

      /**
       * business logic
       */
      /* if (cards.length != conektaCards.length)
        new ServerMessage(
          true,
          'Error en la coincidencia del numero de tarjetas registradas',
          {},
        ); */

      return new ServerMessage(false, 'Tarjetas extraidas correctamente', cards);
    } catch (error) {
      this.logger.error(error);
      return new ServerMessage(true, 'Ha ocurrido un error', error);
    }
  }

  /**
   *
   */
  async getCard(idCard: number, client: User): Promise<ServerMessage> {
    try {
      /**
       * check constrants
       */
      const constrants = [
        client == null,
        client == undefined,
        idCard == null,
        idCard == undefined,
      ];
      if (constrants.some(val => val))
        return new ServerMessage(true, 'Petición incompleta', {});

      /**
       * check instances
       */
      let queriedCard: Card = await this.cardRepository.findOne({
        attributes: { exclude: ['conektaCardToken'] },
        where: {
          idCard: idCard,
          idUser: client.idUser,
        },
      });
      if (!queriedCard)
        return new ServerMessage(true, 'No existe la tarjeta consultada en la base de datos', {});

      let haveMoreCards = false;

      let userCards: Card[] = await this.cardRepository.findAll({
        where: {
          idUser: client.idUser,
        },
      });

      if (userCards.length > 1) {
        haveMoreCards = true;
      }

      return new ServerMessage(false, 'Tarjeta extraida correctamente', {
        queriedCard: queriedCard,
        haveMoreCards: haveMoreCards,
      });
    } catch (error) {
      this.logger.error(error);
      return new ServerMessage(true, 'Ha ocurrido un error', error);
    }
  }

  /**
   *
   */
  async setCardAsDefault(cardInfo: Card, client: User): Promise<ServerMessage> {
    try {
      /**
       * check constrants
       */
      const constrants = [
        client == null,
        client == undefined,
        cardInfo.idCard == null,
        cardInfo.idCard == undefined,
      ];
      if (constrants.some(val => val))
        return new ServerMessage(true, 'Petición incompleta', {});
      /**
       * check if exists
       */
      let cardToUpdate: Card = await this.cardRepository.findOne({
        /* attributes : { exclude: ['conektaCardToken']}, */
        where: {
          idCard: cardInfo.idCard,
          idUser: client.idUser,
        },
      });

      if (!cardToUpdate) {
        return new ServerMessage(true, 'La tarjeta no esta disponible', {});
      }

      this.conektaService.setCardAsDefault(
        client.idConektaAccount,
        cardToUpdate.conektaCardToken,
      );

      /**
       * check instances
       */
      let defaultCard: Card = await this.cardRepository.findOne({
        where: {
          idUser: client.idUser,
          activePaymentMethod: true,
        },
      });

      if (defaultCard) {
        defaultCard.activePaymentMethod = false;
        await defaultCard.save();
      }

      cardToUpdate.activePaymentMethod = true;
      await cardToUpdate.save();

      return new ServerMessage(false, 'Metodo de pago actualizado', cardToUpdate);
    } catch (error) {
      this.logger.error(error);
      return new ServerMessage(true, 'Ha ocurrido un error', error);
    }
  }

  async payDeviceSubscription(idUser: number, newPaymentData: {
    idDevice: number,
    type: number,
    requireInvoice: boolean,
  }): Promise<ServerMessage> {
    try {
      if (
        idUser == null ||
        idUser == undefined ||
        newPaymentData.idDevice == null ||
        newPaymentData.idDevice == undefined ||
        newPaymentData.type == null ||
        newPaymentData.type == undefined ||
        newPaymentData.requireInvoice == null ||
        newPaymentData.requireInvoice == undefined
      ) {
        return new ServerMessage(true, "Petición Incompleta!", {});
      }

      let userForSale: User = await this.userRepository.findOne<User>({
        where: {
          idUser: idUser,
        },
        include: [{
          model: Device,
          as: "devices",
          required: true,
          where: {
            idDevice: newPaymentData.idDevice,
          }
        }]
      });

      if (!userForSale) {
        return new ServerMessage(true, "Usuario invalido!", {});
      }

      if (userForSale.devices.length < 1) {
        return new ServerMessage(true, "Medidor invalido!", {});
      }

      if (newPaymentData.type != 0 && newPaymentData.type != 1 && newPaymentData.type != 2) {
        return new ServerMessage(true, "Subscription invalida!", {});
      }

      let planData = {
        name: "",
        description: "",
        cost: '255.20',
        currency: 'MXN',
        monthsBuy: 12,
        duration: 1,
        satCodeProduct: this.facturapiService.satCodeSubscriptionProduct,//'81112000',//82101603',//'81112006 servicio de almacenamiento de datos',
        unitSatCode: this.facturapiService.unitSatCode,
        createdAt: new Date(),
      }

      if (newPaymentData.type == 0) {
        planData.name = "1 año de servicio de datos de gas";
        planData.description = "Suscripción de acceso a la plataforma de GAWI para un medidor de Gas";
      } else if (newPaymentData.type == 1) {
        planData.name = "1 año de servicio de datos de agua";
        planData.description = "Suscripción de acceso a la plataforma de GAWI para un medidor de agua";
      } else if (newPaymentData.type == 2) {
        planData.name = "1 año de servicio de datos del data logger";
        planData.description = "Suscripción de acceso a la plataforma de GAWI para un data logger";
      }

      //Buscar la tarjeta principal
      let defaultCard: Card = await this.cardRepository.findOne<Card>({
        where: {
          idUser: idUser,
          activePaymentMethod: true
        },
      });

      if (!defaultCard) {
        return new ServerMessage(true, "Tarjeta invalida!", {});
      }

      let dataProductFixed: ProductConekta = new ProductConekta();
      dataProductFixed.name = planData.name + " (" + planData.monthsBuy + " meses)";
      dataProductFixed.unit_price = parseInt((parseInt(planData.cost) * 100).toFixed(2));
      dataProductFixed.quantity = 1;
      dataProductFixed.antifraud_info = {};

      //PASO 1 : Primero se crea el cargo en conekta
      let responseCreateOrder: ServerMessage = await this.conektaService.createSubscriptionPayment(
        userForSale.idConektaAccount, defaultCard.conektaCardToken, dataProductFixed, planData.description);

      if (responseCreateOrder.error == true) {
        return responseCreateOrder;
      }

      let charge: PaidOrderConekta = responseCreateOrder.data;

      //Si el pago por tarjeta no se proceso con éxito
      if (charge.payment_status != "paid") {
        let errorHistoryData = {
          //idHistoryPayments: number,
          idUser: idUser,
          idDevice: userForSale.devices[0].idDevice,
          idOrganization: userForSale.devices[0].idOrganization,
          type: 0, // 0 - suscripción un año pago con tarjeta
          paymentToken: '',
          product: planData.name + " (" + planData.monthsBuy + " meses)",
          currency: 0,// 0 - la suscripción no se renueva automáticamente
          status: 'payment-error', //waiting-pay, waiting-approval, successful-payment, payment-error, 
          commentForUser: "A ocurrido un error procesando el pago",
          facturapiInvoiceId: "",
          verificationUrl: "",
          conektaOrderId: "",
          object: JSON.stringify(charge).substring(0, 4990),
          amount: (parseInt(planData.cost)).toFixed(2),
          invoiced: false,
          needInvoice: false,//newPaymentData.requireInvoice,
        };
        let newPayment: HistoryPayment = await this.historyPaymentsRepository.create<HistoryPayment>(errorHistoryData);

        return new ServerMessage(true, 'A ocurrido un error procesando el pago', newPayment);
      } else {
        //INICIO activación de la suscripción
        userForSale.devices[0].validUntil = this.addMonths(planData.monthsBuy);
        await userForSale.devices[0].save();

        let successCardHistoryData = {
          //idHistoryPayments: number,
          idUser: idUser,
          idDevice: userForSale.devices[0].idDevice,
          idOrganization: userForSale.devices[0].idOrganization,
          type: 0, // 0 - suscripción un año pago con tarjeta
          paymentToken: '',
          product: planData.name + " (" + planData.monthsBuy + " meses)",
          currency: 0,// 0 - la suscripcion no se renueva automaticamente
          status: 'successful-payment', //waiting-pay, waiting-approval, successful-payment, payment-error, 
          commentForUser: "Pago con tarjeta con terminacion #" + defaultCard.last4Digits + " procesado con éxito",
          facturapiInvoiceId: "",
          verificationUrl: "",
          conektaOrderId: charge.id,
          object: JSON.stringify(charge).substring(0, 4990),
          amount: (parseInt(planData.cost)).toFixed(2),
          invoiced: false,
          needInvoice: newPaymentData.requireInvoice,
        };
        let newPayment: HistoryPayment = await this.historyPaymentsRepository.create<HistoryPayment>(successCardHistoryData);

        let sendValidationVoucher: ServerMessage = await this.emailsService
          .sendSubscriptionPaymentSuccessEmail(
            userForSale.firstName + " " + userForSale.lastName,
            userForSale.email,
            planData.name + " (" + planData.monthsBuy + " meses)",
            userForSale.devices[0].validUntil.toLocaleDateString("es-MX", { day: "2-digit", month: "2-digit", year: "numeric" }),
            '#' + newPayment.idHistoryPayments + '-' + newPayment.conektaOrderId,
            '255.20',
            newPaymentData.type,
            successCardHistoryData.commentForUser);

        if (sendValidationVoucher.error == false) {
          return new ServerMessage(false, "Pago realizado con éxito, se a enviado un correo electrónico con los datos de la compra.", {
            sendValidationVoucher: sendValidationVoucher,
            paymentToApprove: newPayment,
            charge: charge,
          });
        } else if (sendValidationVoucher.error == true) {
          return new ServerMessage(false, "Pago realizado con éxito, no se envió un correo electrónico con los datos de la compra.", {
            sendValidationVoucher: sendValidationVoucher,
            paymentToApprove: newPayment,
            responseCreateOrder: responseCreateOrder,
            charge: charge,
          });
        }
      }
    } catch (error) {
      this.logger.error(error);
      return new ServerMessage(true, 'A ocurrido un error mientras se realizaba el pago', error);
    }
  }

  async getPaymentsList(idUser: number): Promise<ServerMessage> {
    try {
      //'#'+newPayment.idHistoryPayments +'-'+newPayment.conektaOrderId
      let paymentsList: any[] = await this.historyPaymentsRepository.findAll<HistoryPayment>({
        where: {
          idUser : idUser
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

      return new ServerMessage(false, 'Pagos del usuario obtenidos con exito', paymentsList);
    } catch (error) {
      this.logger.error(error);

      return new ServerMessage(true, 'A ocurrido un error obteniendo los pagos del usuario', error);
    }
  }

  async getPaymentDetails( idUser: number,idHistoryPayments : number ): Promise<ServerMessage> {
    try {
      //'#'+newPayment.idHistoryPayments +'-'+newPayment.conektaOrderId
      let payment: HistoryPayment = await this.historyPaymentsRepository.findOne<HistoryPayment>({
        where: {
          idHistoryPayments : idHistoryPayments,
          idUser : idUser,
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
      });

      return new ServerMessage(false, 'Pago del usuario obtenido con éxito', this.buildPaymentDto(payment));
    } catch (error) {
      //this.logger.error(error);
      this.logger.error(error);

      return new ServerMessage(true, 'A ocurrido un error obteniendo el pago del usuario', error);
    }
  }

  buildPaymentDto(payment: HistoryPayment) {
    return {
      idHistoryPayment: payment.idHistoryPayments,
      codePayment: payment.idHistoryPayments + '-' + payment.conektaOrderId.replace('Ord_', ''),
      clientId: payment.user.idUser,
      clientName: payment.user.firstName + ' ' + payment.user.lastName,
      clientEmail: payment.user.email,
      clientPhone: payment.user.phone,

      idDevice: payment.device.idDevice,
      serialNumber: payment.device.serialNumber,
      deviceType : payment.device.type,//'0 - gas,' + '1 - agua'
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

  addMonths(months: number, date: Date = new Date()): Date {
    var d = date.getDate();
    date.setMonth(date.getMonth() + +months);
    if (date.getDate() != d) {
      date.setDate(0);
    }
    return date;
  }
}
