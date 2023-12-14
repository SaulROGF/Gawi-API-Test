import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginUserDto } from '../user/dto/loginUser.dto';
import { UserService } from '../user/user.service';
import { JwtPayload } from './interfaces/jwtPayload.interface';
import { User } from '../../../models/user.entity';
import { ServerMessage } from '../../../classes/ServerMessage.class';
import { Organization } from '../../../models/organization.entity';
import { Notifications } from '../../../models/notifications.entity';
import { Logger } from 'winston';


@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService,
    private jwtService: JwtService,
    @Inject('winston') private readonly logger: Logger,
    @Inject('OrganizationRepository')
    private readonly organizationRepository: typeof Organization,
    @Inject('NotificationsRepository')
    private readonly notificationRepository: typeof Notifications,
  ) { }


  /**
   * Disable push notification by user
   * @param iduser
   * @returns
   */
  async disableNotifications(credentials: any): Promise<ServerMessage> {
    try {
      if (
        credentials.idUser == null ||
        credentials.idUser == undefined ||
        credentials.uuid == null ||
        credentials.uuid == undefined
      ) {
        return new ServerMessage(true, 'Petición incompleta', {});
      }

      let storedCredentials: Notifications = await this.notificationRepository.findOne<
        Notifications
      >({
        where: {
          idUser: credentials.idUser,
          uuid: credentials.uuid,
        },
      });

      await storedCredentials.destroy();
      // storedCredentials.isLogged = false;
      // await storedCredentials.save();

      return new ServerMessage(false, 'credenciales sustituidas', {});
    
    } catch (error) {
      return new ServerMessage(true, 'Ha ocurrido un error', {});
    }
  }

  
  /**
   * Store push notification creentials
   * @param credentials
   * @returns
   */
  async storeNotificationCredentials(credentials: any, idUser) {
    try {
      if (
        credentials.token == null ||
        credentials.token == undefined ||
        credentials.uuid == null ||
        credentials.uuid == undefined
      ) {
        return new ServerMessage(true, 'Petición incompleta', {});
      }

      // | uuid | idUser |                              |
      // |------|--------|------------------------------|
      // | 0    | x      | store data on DB             |
      // | 1    | 0      | change idUser on DB instance |
      // | 1    | 1      | refresh token                |

      let storedCredentials: Notifications = await this.notificationRepository.findOne<
        Notifications
      >({
        where: {
          uuid: credentials.uuid,
        },
      });

      // 00
      if (!storedCredentials) {
        let newCredentials: Notifications = await this.notificationRepository.create(
          {
            idUser: idUser,
            token: credentials.token,
            uuid: credentials.uuid,
            isLogged: true,
          },
        );
        return new ServerMessage(false, 'credenciales generadas', {});
      }
      // 01
      if (storedCredentials.idUser == idUser) {
        storedCredentials.token = credentials.token;
        storedCredentials.lastLogin = new Date();
        storedCredentials.updatedAt = new Date();
        storedCredentials.isLogged = true;
        await storedCredentials.save();
        return new ServerMessage(false, 'token actualizado', {});
        // 10
      } else {
        await storedCredentials.destroy();
        let newCredentials: Notifications = await this.notificationRepository.create(
          {
            idUser: idUser,
            token: credentials.token,
            uuid: credentials.uuid,
            isLogged: true,
          },
        );
        return new ServerMessage(false, 'credenciales sustituidas', {});
      }
    } catch (error) {
      return new ServerMessage(true, 'Ha ocurrido un error', {});
    }
  }

  async validateUserByPassword(
    loginAttempt: LoginUserDto,
  ): Promise<ServerMessage> {
    if (
      loginAttempt.email == null ||
      loginAttempt.email == undefined ||
      loginAttempt.password == null ||
      loginAttempt.password == undefined
    ) {
      return new ServerMessage(true, 'Petición incompleta', {});
    }

    let userToAttempt: User = await this.usersService.findOneByEmailActiveNotDeleted(
      loginAttempt.email,
    );

    if (userToAttempt != null) {
      try {
        let checkPass = await userToAttempt.validPassword(
          loginAttempt.password,
        );
        if (checkPass) {
          let response: any = this.createJwtPayload(userToAttempt.email);
          userToAttempt.lastLoginDate = new Date();
          await userToAttempt.save();
          response.user = await this.generateUserData(userToAttempt);
          return new ServerMessage(false, 'Inicio exitoso', response);
        } else {
          return new ServerMessage(
            true,
            'Sin autorización para acceder a la cuenta',
            new UnauthorizedException(),
          );
        }
      } catch (error) {

        this.logger.error(`-> [LIN] ${error}`);
        return new ServerMessage(
          true,
          'Ha ocurrido un error',
          error,
        );
      }
    } else {
      return new ServerMessage(
        true,
        'Usuario y/o contraseña incorrectos',
        new UnauthorizedException(),
      );
    }
  }

  async validateUserByJwt(payload: JwtPayload) {
    // This will be used when the user has already logged in and has a JWT
    let user: any;
    user = await this.usersService.findOneByEmailActiveNotDeleted(
      payload.email,
    );

    if (user) {
      // If there is a successful match, generate a JWT for the user
      //let token = this.createJwtPayload(user.email);
      //return  ServerMessages.messageResponse(false , "Inicio éxitoso", response ) ;
      return user;
    } else {
      throw new UnauthorizedException();
    }
  }

    createJwtPayload(email) {
        let lifeTime : number = 365 * 24 * 60 * 60;
        let jwt = this.jwtService.sign({
            email: email
        },{
            expiresIn : lifeTime,
        });

        return {
            expiresIn: lifeTime,
            token: jwt
        }
    }


  async generateUserData(userToAttempt: User) {
    let organization: Organization = await this.organizationRepository.findOne({
      where: {
        idOrganization: userToAttempt.idOrganization,
      },
    });
    let haveImage = false;

    if (organization.logoUrl.length > 0) {
      haveImage = true;
    }
    return {
      idUser: this.checkNullUndefined(userToAttempt.idUser)
        ? -1
        : userToAttempt.idUser,
      idRole: this.checkNullUndefined(userToAttempt.idRole)
        ? -1
        : userToAttempt.idRole,
      idOrganization: this.checkNullUndefined(userToAttempt.idOrganization)
        ? -1
        : userToAttempt.idOrganization,
      idTown: this.checkNullUndefined(userToAttempt.idTown)
        ? -1
        : userToAttempt.idTown,
      email: this.checkNullUndefined(userToAttempt.email)
        ? ''
        : userToAttempt.email,
      phone: this.checkNullUndefined(userToAttempt.phone)
        ? ''
        : userToAttempt.phone,
      firstName: this.checkNullUndefined(userToAttempt.firstName)
        ? ''
        : userToAttempt.firstName,
      lastName: this.checkNullUndefined(userToAttempt.lastName)
        ? ''
        : userToAttempt.lastName,
      mothersLastName: this.checkNullUndefined(userToAttempt.mothersLastName)
        ? ''
        : userToAttempt.mothersLastName,
      lastLoginDate: this.checkNullUndefined(userToAttempt.lastLoginDate) ? new Date() : userToAttempt.lastLoginDate,
      createdAt: userToAttempt.createdAt,
      updatedAt: userToAttempt.updatedAt,
      town: userToAttempt.town,
      haveLogo: haveImage,
      logoUrl: organization.logoUrl,
    };
  }

  checkNullUndefined(varTest: any): boolean {
    if (varTest == null || varTest == undefined) {
      return true;
    } else {
      return false;
    }
  }
}
