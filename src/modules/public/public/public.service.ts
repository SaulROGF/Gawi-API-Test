import { Injectable, Inject } from '@nestjs/common';
import { ServerMessage } from './../../../classes/ServerMessage.class';
import { ConektaCustomer } from './../../../classes/conektaClasses.class';
import { User } from './../../../models/user.entity';
import { EmailsService } from './../../../modules/global/emails/emails.service';
import { GeoLocationService } from './../../../modules/global/geo-location/geo-location.service';
import { AuthService } from '../auth/auth.service';
import { ConektaService } from '../../global/conekta-service/conekta-service.service';
import { JwtService } from '@nestjs/jwt';


@Injectable()
export class PublicService {
  constructor(
    private jwtService: JwtService,
    private readonly authService: AuthService,
    private readonly emailsService: EmailsService,
    private readonly geoLocationService: GeoLocationService,
    private readonly conektaService: ConektaService,
    @Inject('UserRepository') private readonly userRepository: typeof User,
  ) {}

  /**
   *
   */
  async generateRecoveryEmail(body: any): Promise<ServerMessage> {
    try {
      //
      // validation
      //
      if (body.recoverEmail == null || body.recoverEmail == undefined) {
        return new ServerMessage(true, 'Petición incompleta', null);
      }

      let emailOwner: User = await this.userRepository.findOne<User>({
        where: {
          email: body.recoverEmail,
          active: true,
          deleted: false,
        },
      });

      if (!emailOwner) {
        return new ServerMessage(true, "El correo es invalido", null);
      }
      //
      // generate recovery information
      //
      const lifeTime = 15 * 60; // 15 mins
      const token = this.jwtService.sign({
        email: body.recoverEmail,
      }, {
        expiresIn: lifeTime,
      });
      const recoveryUrl = `${process.env.API_URL}/#/recovery/${token}`;
      
      //
      //
      //
      console.log("URL:", recoveryUrl);
      //
      // return responses
      //
      return await this.emailsService.recoveryPassword(body.recoverEmail, recoveryUrl);
      
    
    } catch(error) {
      return new ServerMessage(true, "Ha ocurrido un error", error);
    }
  } 


  /**
   *
   */
  async resetPassword(bodyForRecoverEmail: any): Promise<ServerMessage> {
    try {
      if (
        bodyForRecoverEmail.recoverEmail == null ||
        bodyForRecoverEmail.recoverEmail == undefined
      ) {
        return new ServerMessage(true, 'Petición incompleta', {});
      }

      // querying user
      let queredUser: User = await this.userRepository.findOne<User>({
        where: {
          email: bodyForRecoverEmail.recoverEmail,
          active: true,
          deleted: false,
        },
      });

      // generate new password and hash it
      let newPassword = this.generatePassword(8);
      queredUser.password = await queredUser.hashNewPassword(newPassword);
      await queredUser.save();
      // send email to user
      return await this.emailsService.resetPassword(
        bodyForRecoverEmail.recoverEmail,
        newPassword,
      );
    } catch (error) {
      console.log(error);
      return new ServerMessage(
        true,
        'No fue posible restablecer una contraseña provisional',
        error,
      );
    }
  }

  /**
   *
   */
  generatePassword(length: number): string {
    const charset =
      'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let password = '';

    for (let i = 0, n = charset.length; i < length; ++i) {
      password += charset.charAt(Math.floor(Math.random() * n));
    }

    return password;
  }

  /**
   *
   */
  async createClient(newClientData: User, ip: string): Promise<ServerMessage> {
    try {
      // obtaing current location
      let location: ServerMessage = await this.geoLocationService.getLocationByIp(
        ip,
      );

      const constraints = [
        location == null,
        location == undefined,
        location.data == null,
        location.data == undefined,
        newClientData.idOrganization == null,
        newClientData.idOrganization == undefined,
        newClientData.idTown == null,
        newClientData.idTown == undefined,
        newClientData.idRole == null,
        newClientData.idRole == undefined,
        newClientData.firstName == null,
        newClientData.firstName == undefined,
        newClientData.lastName == null,
        newClientData.lastName == undefined,
        newClientData.mothersLastName == null,
        newClientData.mothersLastName == undefined,
        newClientData.phone == null,
        newClientData.phone == undefined,
        newClientData.email == null,
        newClientData.email == undefined,
        newClientData.password == null,
        newClientData.password == undefined,
        newClientData.active == null,
        newClientData.active == undefined,
      ];

      // check if exists constraints
      if (constraints.some(val => val)) {
        return new ServerMessage(true, 'Campos inválidos', {});
      }
      /**
       *  creating a new client
       */
      // check already user on API
      let alreadyUser: User = await this.userRepository.findOne<User>({
        where: {
          email: newClientData.email,
          deleted: false,
        },
      });
      // check already customers on conekta
      let alreadyCustomer: any = await this.conektaService.findCustomerByEmail(
        newClientData.email,
      );
      
      // check if email is already used
      if (alreadyUser || alreadyCustomer.total > 0) {
        return new ServerMessage(true, 'Email actualmente registrado', {});
      }
      // retrieve organization
      let queredUser: User = await this.userRepository.findOne<User>({
        where: {
          idRole: 1,
        },
      });
      if (queredUser) {
        /**
         * create coneckta account
         */
        let customer: ConektaCustomer = await this.conektaService.createConektaCustomer(
          newClientData.firstName +
            ' ' +
            newClientData.lastName +
            ' ' +
            newClientData.mothersLastName,
          newClientData.email,
          newClientData.phone,
        );

        if (!customer) {
          return new ServerMessage(true, 'Error al generar usuario', {});
        }

        console.log("CUSTOMER:", customer);

        // creating client
        let newClient: User = await this.userRepository.create<User>({
          // idUser: newClientData.idUser,
          // passwordGoogle: "",
          // passwordFacebook: "",
          idRole: 7,
          idTown: location.data.town,
          idOrganization: queredUser.idOrganization,
          email: newClientData.email,
          password: newClientData.password,
          firstName: newClientData.firstName,
          lastName: newClientData.lastName,
          mothersLastName: newClientData.mothersLastName,
          phone: newClientData.phone,
          active: true,
          deleted: false,
          idConektaAccount: customer.id,
        });

        console.log("CLIENT:", newClient);

        let responseAuth: ServerMessage = await this.authService.validateUserByPassword(
          {
            email: newClientData.email,
            password: newClientData.password,
          },
        );

        /**
         * Sending email to user
         */
        let emailResponse: ServerMessage = await this.emailsService.welcome(
          newClientData.email,
          newClientData.firstName,
        );

       

        if (emailResponse.error == true) {
          console.log("********:", emailResponse);
          
          return new ServerMessage(
            false,
            'Registro éxitoso, error enviando el correo de bienvenida',
            responseAuth.data,
          );
        } else {
          return new ServerMessage(
            false,
            'Registro éxitoso',
            responseAuth.data,
          );
        }


      } else {
        return new ServerMessage(
          true,
          'No existe la organización principal',
          {},
        );
      }
    } catch (error) {
      console.log(error);
      return new ServerMessage(
        true,
        'A ocurrido un error creando el usuario',
        error,
      );
    }
  }
}
