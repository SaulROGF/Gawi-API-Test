import { Town } from './../../../models/town.entity';
import { ServerMessage } from './../../../classes/ServerMessage.class';
import { User } from './../../../models/user.entity';
import { Injectable, Inject } from '@nestjs/common';
import { ConektaService } from './../../global/conekta-service/conekta-service.service';
import { Op } from 'sequelize';
import { State } from '../../../models/state.entity';
import * as bcrypt from 'bcrypt';


@Injectable()
export class UserService {
  constructor(
    private conektaService: ConektaService,
    @Inject('UserRepository') private readonly userRepository: typeof User,
  ) {
    //this.createAdminUser();
  }

  /* async createAdminUser(){
    var newUser: User = await this.userRepository.create<User>({
      //idUser: number,
      password: "qwertyuiop",
      //passwordGoogle : "",
      //passwordFacebook : "",
      email: "luismi.luu@gmail.com",
    }, {});
    console.log(newUser);
    
   }
 */

  /**
   *
   */
  async getAllUsers(): Promise<User[]> {
    return await this.userRepository.findAll<User>();
  }

  /**
   *
   */
  async findOneByEmailActiveNotDeleted(useremail: string): Promise<User> {
    return await this.userRepository.findOne<User>({
      where: {
        email: useremail,
        active: true,
        deleted: false,
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
  }

  /**
   *
   */
  async createUser(newUserData: User): Promise<ServerMessage> {
    try {
      // check contraints
      if (
        newUserData.email == null ||
        newUserData.email == undefined ||
        newUserData.password == null ||
        newUserData.password == undefined
      ) {
        return new ServerMessage(true, 'Petición incompleta', {});
      }

      // validate username and email
      var userUsernameEmail = await this.userRepository.findOne<User>({
        attributes: ['email'],
        where: {
          [Op.or]: [
            {
              email: newUserData.email,
            },
          ],
        },
      });

    if (userUsernameEmail) {
      return new ServerMessage(true, 'Nombre y/ó email actualmente registrado', {});
    }

      let newUser: User = await this.userRepository.create<User>({
        // idUser: number,
        // passwordGoogle : "",
        // passwordFacebook : "",
        password: newUserData.password,
        email: newUserData.email,
      }, {});


    } catch (error) {
      // console.log(error);
      return new ServerMessage(
        true,
        'A ocurrido un error creando el usuario.',
        error,
      );
    }

    /**
    if (
      newUserData.email == null ||
      newUserData.email == undefined ||
      newUserData.password == null ||
      newUserData.password == undefined
    ) {
      return new ServerMessage(true, "Petición incompleta", {});
    }
    // validate username and email
    var userUsernameEmail = await this.userRepository.findOne<User>({
      attributes: [ 'email' ],
      where: {
        [Op.or]: [{
          email: newUserData.email,
        }],
      },
    });

    if (userUsernameEmail) {
      return new ServerMessage(true, 'Nombre y/ó email actualmente registrado', {});
    }

    try {
      //createUser.idRol = 400;
      var newUser: User = await this.userRepository.create<User>({
        //idUser: number,
        password: newUserData.password,
        //passwordGoogle : "",
        //passwordFacebook : "",
        email: newUserData.email,
      }, {});

      /**
      let sendWelcomeEmailResult: ServerMessage = await this.emailCenterService.sendWelcomeEmail(newUser.email, newUser.email, newUserData.password);

      if (sendWelcomeEmailResult.error == false) {
        return new ServerMessage(false, "Usuario creado con éxito, se a enviado un correo electrónico con su información.", newUser);
      } else if (sendWelcomeEmailResult.error == true) {
        return new ServerMessage(false, "Usuario creado con éxito, no se envió la bienvenida.", newUser);
      }
      */
    // } catch (error) {
    //console.log(error);
    //return new ServerMessage(true, "A ocurrido un error creando el usuario.", error);
    //}
  }


  async changePassword(body: any): Promise<ServerMessage> {
    try {
      // check contraints
      if (
        body.email == null ||
        body.email == undefined ||
        body.password == null ||
        body.password == undefined
      ) {
        return new ServerMessage(true, 'Petición incompleta', {});
      }

      // validate username and email
      var user = await this.userRepository.findOne<User>({
        where: {
          [Op.or]: [
            {
              email: body.email,
            },
          ],
        },
      });

      if (!user) {
        return new ServerMessage(true, 'No existe el usuario', null);
      }
      // update password
      const newPassword: string = await bcrypt.hash(body.password, bcrypt.genSaltSync(10));
      user.password = newPassword;
      await user.save();
      
      return new ServerMessage(false, "contraseña cambiada éxitosamente", null);
    } catch(error) {
      return new ServerMessage(true, "Ha ocurrido un error", error);
    }

  }




  /* async logIn(credentials): Promise<User> {
    let user: User;
    user = await this.userRepository.findOne<User>({ where: { username: credentials.username } });

    return user.validPassword(credentials.npassword)
  } */
}
