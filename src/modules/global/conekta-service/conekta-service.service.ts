import { ServerMessage } from './../../../classes/ServerMessage.class';
import { Injectable } from '@nestjs/common';
import * as conekta from 'conekta';
import { User } from '../../../models/user.entity';
import { ProductConekta } from '../../../classes/conektaClasses.class';
import { Card } from '../../../models/card.entity';

/**
conekta.api_key = process.env.CONECKTA_API_KEY;
conekta.locale = process.env.CONECKTA_LOCALE;
conekta.api_version = process.env.CONECKTA_API_VERSION;
*/
conekta.api_key = "key_p4k1J61x14GRB0BaTNKeED0";
conekta.locale = "es";
conekta.api_version = "2.0.0";

@Injectable()
export class ConektaService {
  conekta;

  constructor() {
    this.conekta = conekta;
  }

  /**
   * Create conekta customer
   */
  async createConektaCustomer(
    name: string,
    email: string,
    phone: string,
  ): Promise<any> {
    // create data for creating
    let conektaData = {
      name: name,
      email: email,
      phone: '+52' + phone,
    };
    //
    return new Promise((resolve, reject) => {
      // creating customer
      this.conekta.Customer.create(conektaData, (err, customer) => {
        // return exception
        if (err) {
          resolve(err);
          // working...
        } else {
          resolve(customer.toObject());
        }
      });
    });
  }

  /**
   * Update customer
   */
  async updateCustomer(id: string, conektaData: any): Promise<ServerMessage> {
    //
    return new Promise((resolve, reject) => {
      // find customer
      this.conekta.Customer.find(id, (error, customer) => {
        // return exception
        if (error) {
          resolve(
            new ServerMessage(
              true,
              'Ha ocurrido un error buscando cliente',
              error,
            ),
          );
          // working...
        } else {
          customer.update(conektaData, (error, customer) => {
            // return exception
            if (error) {
              resolve(
                new ServerMessage(
                  true,
                  'Ha ocurrido un error actualizando cliente',
                  error,
                ),
              );
              // working...
            } else {
              resolve(
                new ServerMessage(
                  false,
                  'Se ha actualizado la información correctamente',
                  customer,
                ),
              );
            }
          });
        }
      });
    });
  }

  /**
   * Adding card to customer
   */
  async addCard(idCustomer: string, cardToken: string): Promise<ServerMessage> {
    return new Promise((resolve, reject) => {
      // find customer
      this.conekta.Customer.find(idCustomer, (error, customer) => {
        // return exception
        if (error) {
          resolve( new ServerMessage( true, 'Ha ocurrido un error buscando cliente', error ) );
          // working...
        } else {
          // let cards: [] = customer.payment_sources.toObject().data;
          // let defaultCard = cards.filter((item: any) => {
          //   return item.default == false;
          // });
          // linking card to customer
          customer.createPaymentSource( {
              type: 'card',
              token_id: cardToken,
            }, (error, card) => {
              // return exception
              if (error) {
                resolve( new ServerMessage(true, 'Error añadiendo tarjeta', error) );
                // working...
              } else {
                resolve( new ServerMessage(false, 'Éxito añadiendo tarjeta', card) );
              }
            },
          );
        }
      });
    });
  }

  /**
   *  Get all cards
   */
  async getAllCards(idCustomer: string): Promise<ServerMessage> {
    return new Promise((resolve, reject) => {
      // find customer
      this.conekta.Customer.find(idCustomer, (error, customer) => {
        // return exception
        if (error) {
          resolve( new ServerMessage( true, 'Ha ocurrido un error buscando cliente', error, ) );
          // working...
        } else {
          // extraer la colleción de tarjetas del usuario
          if (
            customer.payment_sources == null ||
            customer.payment_sources == undefined
          ) {
            resolve(new ServerMessage(true, 'No hay tarjetas registradas en la API de conekta', {}));
          }
          else {
            // return cards
            let cards: [] = customer.payment_sources.toObject().data;

            resolve(new ServerMessage(false, 'Petición satisfactoria', cards));
          }
        }
      });
    });
  }


  /**
   *  Delete card associed to customer
   */
  async deleteCart(idCustomer: string, cardData: Card): Promise<ServerMessage> {
    return new Promise((resolve, reject) => {
      // extraer cliente de conekta
      this.conekta.Customer.find(idCustomer, (error, customer) => {
        if (error) {
          //manejando el error
          resolve(
            new ServerMessage(
              true,
              'Ha ocurrido un error buscando cliente',
              error,
            ),
          );
        } else {
          // extraer el cardIndex de la colleción de tarjetas del usuario
          let cards: any[] = customer.payment_sources.toObject().data;
          let cardIndex = cards.findIndex((card: any) => {
            return card.id == cardData.conektaCardToken;
          });
          if (cardIndex == -1) {
            // no se ha encontrado la tarjeta correspondiente al cardIndex
            resolve(
              new ServerMessage(true, 'No se ha encontrado la tarjeta', error),
            );
          } else {
            // eliminando la tarjeta
            customer.payment_sources
              .get(cardIndex)
              .delete((error, response) => {
                if (error) {
                  // manejar el error
                  resolve(
                    new ServerMessage(true, 'Error eliminando tarjeta', error),
                  );
                } else {
                  // todo OK
                  resolve(
                    new ServerMessage(
                      false,
                      'Éxito eliminando tarjeta',
                      response,
                    ),
                  );
                }
              });
          }
        }
      });
    });
  }

  /**
   *
   */
  async getDefaultCard(idCustomer: string): Promise<ServerMessage> {
    return new Promise((resolve, reject) => {
      // find customer
      this.conekta.Customer.find(idCustomer, (error, customer) => {
        // return exception
        if (error) {
          resolve(
            new ServerMessage( true, 'Ha ocurrido un error buscando cliente', error ),
          );
          // working...
        } else {
          resolve( new ServerMessage( false, '', customer.toObject().default_payment_source_id, ) );

        }
      });
    });
  }


  /**
   *
   */
  async setCardAsDefault(
    idCustomer: string,
    cardToken: string,
  ): Promise<ServerMessage> {
    return new Promise((resolve, reject) => {
      // find customer
      this.conekta.Customer.find(idCustomer, (error, customer) => {
        // return exception
        if (error) {
          resolve(
            new ServerMessage(
              true,
              'Ha ocurrido un error buscando cliente',
              error,
            ),
          );
          // working...
        } else {
          // extraer el cardIndex de la colleción de tarjetas del usuario
          let cards: [] = customer.payment_sources.toObject().data;
          let cardIndex = cards.findIndex((card: any) => {
            return card.id == cardToken;
          });
          // no se ha encontrado la tarjeta correspondiente al cardIndex
          if (cardIndex == -1)
            resolve(
              new ServerMessage(true, 'No se ha encontrado la tarjeta', error),
            );
          // asignar la tarjeta actual como principal
          customer.update(
            { default_payment_source_id: cardToken },
            (error, customer) => {
              if (error) {
                resolve(
                  new ServerMessage(
                    true,
                    'Ocurrió un error seteando el método default',
                    error,
                  ),
                );
              } else {
                resolve(
                  new ServerMessage(
                    false,
                    'Se encuentra la tarjeta',
                    cards[cardIndex],
                  ),
                );
              }
            },
          );
        }
      });
    });
  }

  /**
  //Se pone la tarjeta como la default para usarla posteriormente como método de pago
  async setCustomerDefaultCardData(
    conektaIdCustomer: string,
    conektaCardId: string,
  ): Promise<ServerMessage> {
    return new Promise((resolve, reject) => {
      this.conekta.Customer.find(conektaIdCustomer, (err, customer) => {
        if (err) {
          resolve(
            new ServerMessage(
              true,
              'El cliente no esta registrado en conecta 1',
              err,
            ),
          );
        } else {
          let cardsConekta: [] = customer.payment_sources.toObject().data;

          //console.log(conektaCardId);
          //console.log(cardsConekta);

          let indexCardFinded = cardsConekta.findIndex((card: any) => {
            return card.id == conektaCardId;
          });
          //console.log(cardsConekta[indexCardFinded]);

          if (indexCardFinded == -1) {
            resolve(new ServerMessage(true, 'No se encuentra la tarjeta', {}));
          } else {
            this.conekta.Customer.find(conektaIdCustomer, (err, customer) => {
              if (err) {
                //console.log("entro al error de búsqueda de cliente");
                //console.log(err);
                resolve(
                  new ServerMessage(
                    true,
                    'El cliente no esta registrado en conecta',
                    err,
                  ),
                );
              } else {
                //Se pone la tarjeta como la default para usarla posteriormente como método de pago
                customer.update(
                  { default_payment_source_id: conektaCardId },
                  (err, customer) => {
                    if (err) {
                      //console.log("entro al error del seteo");
                      //console.log(err);
                      resolve(
                        new ServerMessage(
                          true,
                          'Ocurrió un error setenado el método default',
                          err,
                        ),
                      );
                    } else {
                      resolve(
                        new ServerMessage(
                          false,
                          'Se encuentra la tarjeta',
                          cardsConekta[indexCardFinded],
                        ),
                      );
                    }
                  },
                );
              }
            });
          }
        }
      });
    });
  }
  */

  /**
   * Find conekta customer by email
   */
  async findCustomerByEmail(email: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.conekta.Customer.where(
        {
          email: email,
        },
        (err, customer) => {
          if (err) {
            resolve(err);
          } else {
            resolve(customer.toObject());
          }
        },
      );
    });
  }
  
  async createSubscriptionPayment(
    conektaClientId: string,
    conektaCardId: string,
    product: ProductConekta,
    productDescription : string
    // shippingAddress: {street : string ,number : string ,postalCode : string } 
  ): Promise<ServerMessage> {
    return new Promise(async (resolve, reject) => {
      //Costos de envio para cuando son compras de productos físicos
      //let shippingCosts: any[] = [{
      //    "amount": 0 ,//parseInt(shippingCost.amount.toFixed(2)), // Comentado porque los envíos son gratis
      //    "carrier": "enbibo"
      //}];

      let productsList: ProductConekta[] = [];
      productsList.push(product);

      //Se pone la tarjeta como la default para usarla posteriormente como método de pago
      let resultFindCard: ServerMessage = await this.setCardAsDefault(
        conektaClientId,
        conektaCardId,
      );

      if (resultFindCard.error == true) {
        resolve(resultFindCard);
      } else {
        conekta.Order.create(
          {
            currency: 'MXN',
            customer_info: {
              customer_id: conektaClientId,
              antifraud_info: {
                //"paid_transactions": 4
              },
            },
            // "shipping_contact": {
            //            "address": {
            //                "street1": shippingAddress.street + " ," + shippingAddress.number,
            //                "postal_code": shippingAddress.postalCode,
            //                "country": "MX"
            //            }
            //        }, 
            line_items: productsList,
            //"shipping_lines": shippingCosts, //shipping_lines - physical goods only
            metadata: {
              description: productDescription,
              //"reference": "1334523452345"
            },
            charges: [
              {
                payment_method: {
                  type: 'default', // "card",
                  //"id": resultFindCard.data.id,
                  //"exp_month": resultFindCard.data.exp_month,
                  //"exp_year": resultFindCard.data.exp_year,
                  //"brand": resultFindCard.data.brand,
                  //"name": resultFindCard.data.name,
                  //"number": resultFindCard.data.number,
                },
                //payment_methods
                //  - use the customer's default
                //  - a card to charge a card, different from the default,
                //      you can indicate the card's source_id as shown in the Retry Card Section
              },
            ],
          },
          function(err, charge) {
            if (err) {
              if (err.details) {
                resolve(
                  new ServerMessage(true, err.details[0].message, {
                    err: err,
                    resultFindCard: resultFindCard,
                  }),
                );
              } else {
                resolve(
                  new ServerMessage(true, 'Ocurrió un error creando la orden', {
                    err: err,
                    resultFindCard: resultFindCard,
                  }),
                );
              }
              //console.log("entro al error");
              //console.log(err);
            } else {
              resolve(
                new ServerMessage(false, 'Se creo la orden', charge.toObject()),
              );
            }
          },
        );
      }
    });
  }
}


