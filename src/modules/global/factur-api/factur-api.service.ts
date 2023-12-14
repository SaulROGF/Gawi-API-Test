import { Injectable, Inject } from '@nestjs/common';
import {
  CustomerFacturapi,
  AddressFacturapi,
} from './../../../classes/facturapiClasses.class';
import { ServerMessage } from './../../../classes/ServerMessage.class';
import { BillingInformation } from '../../../models/billingInformation.entity';
import { User } from '../../../models/user.entity';
import { Town } from '../../../models/town.entity';
import { State } from '../../../models/state.entity';
import * as Facturapi from 'facturapi';
import * as axios from 'axios';

@Injectable()
export class FacturApiService {
  axios: any;
  facturapi: any;


  satCodeSubscriptionProduct:string = '81112000';//82101603',//'81112006 servicio de almacenamiento de datos',
  unitSatCode:string = 'E48';

  constructor(
    @Inject('UserRepository') private readonly userRepository: typeof User,
    @Inject('TownRepository') private readonly townRepository: typeof Town,
    @Inject('BillingInformationRepository')
    private readonly billingInfoRepository: typeof BillingInformation,
  ) {
    this.axios = axios.default;
    this.facturapi = new Facturapi(process.env.FACTURAPI_API_KEY);
  }

  /**
   * Create facturapi customer
   */
  async createOrganizationCustomer(
    organizationInfo: any,
  ): Promise<ServerMessage> {
    try {
      // crear el objeto facturapi data con la información que
      // actualizaremos en la cuenta de facturapi
      let facturapiData = {
        legal_name: organizationInfo.businessName.toUpperCase(),
        email: organizationInfo.email.toLowerCase(),
        tax_id: organizationInfo.rfc.toUpperCase(),
        phone: organizationInfo.phone,
        address: {
          city: organizationInfo.city,
          state: organizationInfo.state,
          street: organizationInfo.street,
          exterior: organizationInfo.addressNumber,
          interior: '',
          neighborhood: organizationInfo.suburb,
          zip: organizationInfo.zipCode,
          country: 'MEX',
        },
      };
      // crear customer de facturapi
      let customer: CustomerFacturapi = await this.facturapi.customers.create(
        facturapiData,
      );
      //
      if (!customer) {
        return new ServerMessage(
          true,
          'Error al crear el objeto facturapi',
          customer,
        );
      }
      //
      return new ServerMessage(false, 'Cliente creado correctamente', customer);
    } catch (error) {
      return new ServerMessage(true, 'Ha ocurrido un error', error);
    }
  }

  /**
   * Update facturapi customer
   */
  async updateOrganizationCustomer(
    token: string,
    organizationInfo: any,
  ): Promise<ServerMessage> {
    try {
      // crear el objeto facturapi data con la información que
      // actualizaremos en la cuenta de facturapi
      let facturapiData = {
        legal_name: organizationInfo.businessName.toUpperCase(),
        email: organizationInfo.email.toLowerCase(),
        tax_id: organizationInfo.rfc.toUpperCase(),
        phone: organizationInfo.phone,
        address: {
          city: organizationInfo.city,
          state: organizationInfo.state,
          street: organizationInfo.street,
          exterior: organizationInfo.addressNumber,
          interior: '',
          neighborhood: organizationInfo.suburb,
          zip: organizationInfo.zipCode,
          country: 'MEX',
        },
      };
      // actualizar customer de facturapi
      let customer: CustomerFacturapi = await this.facturapi.customers.update(
          token,
          facturapiData,
        );
      //
      if (!customer) {
        return new ServerMessage( true, 'Error al instanciar los datos de facturación', customer);
      }
      //
      return new ServerMessage(false, 'Cliente actualizado correctamente', customer);
    } catch (error) {
      console.log(error);
      
      return new ServerMessage(true, 'Ha ocurrido un error', error);
    }
  }

  /**
   * Create facturapi customer
   */
  async createCustomer(
    billingInfoData: BillingInformation,
  ): Promise<ServerMessage> {
    try {
      // crear el objeto facturapi data con la información que
      // actualizaremos en la cuenta de facturapi
      let facturapiData = {
        legal_name: billingInfoData.businessName.toUpperCase(),
        email: billingInfoData.email.toLowerCase(),
        tax_id: billingInfoData.rfc.toUpperCase(),
        phone: billingInfoData.phone,
        address: {
          city: billingInfoData.city,
          state: billingInfoData.state,
          street: billingInfoData.street,
          exterior: billingInfoData.addressNumber,
          interior: '',
          neighborhood: billingInfoData.suburb,
          zip: billingInfoData.zipCode,
          country: 'MEX',
        },
      };
      // crear customer de facturapi
      let customer: CustomerFacturapi = await this.facturapi.customers.create(
        facturapiData,
      );
      //
      if (!customer) {
        return new ServerMessage(
          true,
          'Error al crear el objeto facturapi',
          customer,
        );
      }
      //
      return new ServerMessage(false, 'Cliente creado correctamente', customer);
    } catch (error) {
      return new ServerMessage(true, 'Ha ocurrido un error', error);
    }
  }
  
  /**
   * Update facturapi customer
   */
  async updateCustomer(
    token: string,
    billingInfoData: BillingInformation,
  ): Promise<ServerMessage> {
    try {
      // crear el objeto facturapi data con la información que
      // actualizaremos en la cuenta de facturapi
      let facturapiData = {
        legal_name: billingInfoData.businessName.toUpperCase(),
        email: billingInfoData.email.toLowerCase(),
        tax_id: billingInfoData.rfc.toUpperCase(),
        phone: billingInfoData.phone,
        address: {
          city: billingInfoData.city,
          state: billingInfoData.state,
          street: billingInfoData.street,
          exterior: billingInfoData.addressNumber,
          interior: '',
          neighborhood: billingInfoData.suburb,
          zip: billingInfoData.zipCode,
          country: 'MEX',
        },
      };
      // actualizar customer de facturapi
      let customer: CustomerFacturapi = await this.facturapi.customers.update(
          token,
          facturapiData,
        );
      //
      if (!customer) {
        return new ServerMessage( true, 'Error al instanciar los datos de facturación', customer);
      }
      //
      return new ServerMessage(false, 'Cliente actualizado correctamente', customer);
    } catch (error) {
      return new ServerMessage(true, 'Ha ocurrido un error', error);
    }
  }
}

/**
  async updateFacturapiUserData(
    client: User,
    billingInfoData: BillingInformation,
  ): Promise<ServerMessage> {
    try {
      // crear el objeto facturapi data con la información que
      // actualizaremos en la cuenta de facturapi
      let facturapiData = {
        legal_name: billingInfoData.businessName.toUpperCase(),
        email: billingInfoData.email.toLowerCase(),
        tax_id: billingInfoData.rfc.toUpperCase(),
        phone: billingInfoData.phone,
        address: {
          city: billingInfoData.city,
          state: billingInfoData.state,
          street: billingInfoData.street,
          exterior: billingInfoData.addressNumber,
          interior: '',
          neighborhood: billingInfoData.suburb,
          zip: billingInfoData.zipCode,
          country: 'MEX',
        },
      };

      // obtenemos el objeto billingInfo, para actualizarlo o en su defecto, crearlo
      let billingInfo: BillingInformation = await this.billingInfoRepository.findOne<
        BillingInformation
      >({
        where: {
          idUser: client.idUser,
        },
      });

      //
      // si no existe el objeto billingInfo, creamos el customer en facturapi,
      // obtenemos un token (el id del customer) y lo implementamos para crear
      // un objeto billingInfo con la información presentada
      //
      if (!billingInfo) {
        // creamos el customer de facturapi
        const customer: CustomerFacturapi = await this.facturapi.customers.create(
          facturapiData,
        );
        // creamos el objeto billingInfo
        billingInfo = await this.billingInfoRepository.create<
          BillingInformation
        >({
          idUser: client.idUser,
          businessName: billingInfoData.businessName,
          rfc: billingInfoData.rfc,
          phone: billingInfoData.phone,
          email: billingInfoData.email,
          state: townWithState.state.name,
          city: townWithState.name,
          zipCode: billingInfoData.zipCode,
          suburb: billingInfoData.suburb,
          street: billingInfoData.street,
          addressNumber: billingInfoData.addressNumber,
          facturapiClientToken: customer.id,
        });
        await billingInfo.save();
        //
        // si ya existe el objeto billingInfo, solo debemos actualizar el
        // customer de facturapi y despues actualizar el objeto mismo
        //
      } else {
        // update facturapi data
        const customer = await this.facturapi.customers.update(
          billingInfo.facturapiClientToken,
          facturapiData,
        );
        // actualizar los valores del objeto
        billingInfo.businessName = billingInfoData.businessName;
        billingInfo.rfc = billingInfoData.rfc;
        billingInfo.phone = billingInfoData.phone;
        billingInfo.email = billingInfoData.email;
        billingInfo.state = townWithState.state.name;
        billingInfo.city = townWithState.name;
        billingInfo.zipCode = billingInfoData.zipCode;
        billingInfo.suburb = billingInfoData.suburb;
        billingInfo.street = billingInfoData.street;
        billingInfo.addressNumber = billingInfoData.addressNumber;
        await billingInfo.save();
      }

      return new ServerMessage(
        false,
        'Se ha actualizado el registro de la información de facturación correctamente',
        billingInfo,
      );
    } catch (error) {
      let fixError: string = error.toString();
      if (fixError.includes('Error') == true) {
        return new ServerMessage(true, fixError, fixError);
      } else {
        return new ServerMessage(
          true,
          'A ocurrido un error actualizando los datos de facturación en facturapi',
          fixError,
        );
      }
    }
  }
*/
