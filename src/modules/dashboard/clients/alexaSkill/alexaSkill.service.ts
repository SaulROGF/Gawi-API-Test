import { Injectable, Inject, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Logger } from 'winston';

import { HandlerInput } from 'ask-sdk-core';

import * as axios from 'axios';
import { DevicesService } from './../devices/devices.service';
import { ServerMessage } from '../../../../classes/ServerMessage.class';
import { User } from '../../../../models/user.entity';
import { Device } from '../../../../models/device.entity';
import { LoginUserDto } from '../../../public/user/dto/loginUser.dto';
import { UserService } from '../../../public/user/user.service';
import { AuthService } from '../../../public/auth/auth.service';

export class AlexaResponseMsg{
  speechText : string;
  endSession : boolean;
  loginCard : boolean;

  constructor(speechText : string,endSession : boolean = false,loginCard : boolean = false){
    this.speechText = speechText;
    this.endSession = endSession;
    this.loginCard = loginCard;
  }
}

@Injectable()
export class AlexaSkillService {
  axios: any;

  constructor(
    @Inject('winston') private readonly logger: Logger,
    private readonly devicesClientService: DevicesService,
    private readonly authService: AuthService,
    private readonly usersService: UserService,
    @Inject('UserRepository') private readonly userRepository: typeof User,
  ) {
    this.axios = axios.default;
  }

  async validateUserByAlexaPassword(
    loginAttempt: {
      email : string,
      passwordAlexa : string,
      option : number,
      senHi : boolean,
      numberDevice : number,
  },
  ): Promise<ServerMessage> {
    if (
      loginAttempt.email == null ||
      loginAttempt.email == undefined ||
      loginAttempt.passwordAlexa == null ||
      loginAttempt.passwordAlexa == undefined ||
      loginAttempt.option == null ||
      loginAttempt.option == undefined||
      loginAttempt.senHi == null ||
      loginAttempt.senHi == undefined||
      loginAttempt.numberDevice == null ||
      loginAttempt.numberDevice == undefined
    ) {
      return new ServerMessage(true, 'Petición incompleta', {});
    }

    let userToAttempt: User = await this.usersService.findOneByEmailActiveNotDeleted(
      loginAttempt.email,
    );

    if (userToAttempt != null) {
      try {
        let { checkPass , isNew } = await userToAttempt.validAlexaPassword(
          loginAttempt.passwordAlexa,
        );
        if (checkPass) {
          //let response: any = this.authService.createJwtPayload(userToAttempt.email);
          userToAttempt.lastLoginDate = new Date();
          await userToAttempt.save();
          let responseData : any = {
            //token : response.token,
          }
          //Se checa que la opcion exista
          if(loginAttempt.option < 1 || loginAttempt.option > 2){
            return new ServerMessage(true, 'Petición invalida', {});
          }
          //getUserDevicesList = 1
          if(loginAttempt.option == 1){
            let response : AlexaResponseMsg = await this.getAlexaUserDevicesList(
              userToAttempt.email,loginAttempt.senHi, isNew
            );
            responseData = response;

          }else if(loginAttempt.option == 2){
            let response : AlexaResponseMsg = await this.getAlexaActualDeviceMeasure(
              userToAttempt.email,loginAttempt.numberDevice
            );
            responseData = response;
          }

          return new ServerMessage(false, 'Respuesta para Alexa obtenida', responseData);
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
  
  async getAlexaUserDevicesList(email : string,senHi : boolean,isNew : boolean) : Promise<AlexaResponseMsg>{
    let requestUser : User = await this.userRepository.findOne<User>({
      where: {
        email : email
      },
    });

    if(!requestUser){
      return new AlexaResponseMsg(
        "No cuentas con una cuenta en GAWI, baja la app disponible en la Play Store o App Store",
        false,
        false
      );
    }
    /* {
      litersConsumedThisMonth: litersConsumedThisMonth.toFixed(2),
      actualPeriodMetry: actualPeriodMetry,
      lastPeriodMetry: lastPeriodMetry,

      idDevice: device.idDevice,
      name: device.name,
      serialNumber: device.serialNumber,
      type: device.type,
      organization: device.organization,
      gasHistory: device.gasHistory,
      waterHistory: device.waterHistory,
      waterSettings: device.waterSettings,
    } */
    let userDevices : ServerMessage = await this.devicesClientService.getDevices(requestUser);

    //console.log(userDevices.data.clientDevices);

    let speechText = "";
    
    if(isNew){
      speechText = "Hola! Bienvenido a GAWI. Parece que es tu primera vez por aquí. Te platicaré un poco acerca "+
        "de mi y las cosas que puedo hacer: "+
        "Estoy aquí para proveerte información acerca del consumo de tu red de agua o tanque estacionario,"+
        " dependiendo de los medidores GAWI registrados en tu cuenta,  creada a través de la aplicación móvil de Gawi."+
        "Recuerda que si tenes alguna duda puedes revisar mi documentación con el comando “ayuda”."+
        "";
    }else if(senHi){
      speechText = "Bienvenido de nuevo a GAWI,";
    }

    speechText = speechText +  " por favor dime cual medidor deseas que revisemos. ";

    //Se eliminan los de tipo datalogger
    let devicesFiltered : Device[] = (userDevices.data.clientDevices as Device[]).filter(device => device.type != 2);

    if(devicesFiltered.length == 0){
      speechText = speechText +  " Actualmente no cuentas con medidores.";

      return  new AlexaResponseMsg(
        speechText,
        true,
        false
      );
    }else{
      let names = " Te proporcionaré una lista con los medidores disponibles en tu cuenta: ";
      for (let index = 0; index < devicesFiltered.length; index++) {
        const deviceData = devicesFiltered[index];

        if( deviceData.name.length > 0 ){
          names = names + " medidor " +  ( index + 1 ) + " para "+ deviceData.name;
        }else{
          names = names + " medidor " +  ( index + 1 );
        }

        //'0 - gas, 1 - agua, 2 - datalogger', 3 - Gas Natural',
        if( deviceData.type == 0 ){
          names = names + ", de tipo gas";
        }else if( deviceData.type == 1 ){
          names = names + ", de tipo agua";
        }else if( deviceData.type == 3 ){
          names = names + ", de gas natural";
        }
        
        names = names + " ; ";
      }
      speechText = speechText + names;
      speechText = speechText + " ¿De cual medidor deseas consultar tu consumo?";
      return  new AlexaResponseMsg(
        speechText,
        false,
        false
      );
    }
  }

  async getAlexaActualDeviceMeasure( email : string, numberDevice : number ) : Promise<AlexaResponseMsg>{
    try {
      let requestUser : User = await this.userRepository.findOne<User>({
        where: {
          email : email
        },
      });

      if(!requestUser){
        return new AlexaResponseMsg(
          "No cuentas con una cuenta en GAWI, baja la app disponible en la Play Store o App Store",
          false,
          false
        );
      }
      
      /* {
        litersConsumedThisMonth: litersConsumedThisMonth.toFixed(2),//Only water
        actualPeriodMetry: actualPeriodMetry,//Only water
        lastPeriodMetry: lastPeriodMetry,//Only water

        idDevice: device.idDevice,
        name: device.name,
        serialNumber: device.serialNumber,
        type: device.type,
        organization: device.organization,
        gasHistory: device.gasHistory,
        waterHistory: device.waterHistory,
        waterSettings: device.waterSettings,
      } */
      let userDevices : ServerMessage = await this.devicesClientService.getDevices(requestUser);

      let speechText = "";

      if(  isNaN( numberDevice ) /* == null || numberDevice == undefined || numberDevice == NaN */) {
        return new AlexaResponseMsg(
          "Una disculpa no te eh entendido",
          false,
          false
        );
      }

      if( numberDevice < 0 || (userDevices.data.clientDevices.length + 1)  < numberDevice ){
        speechText = " El medidor numero "+numberDevice+" no esta disponible. ¿deseas revisar algún otro?";
      }else{
        const deviceData /* : Device */ = userDevices.data.clientDevices[numberDevice-1];

        if(deviceData){
          if(deviceData.type == 0){
            if(deviceData.gasHistory.length > 0){
              speechText = "Tu tanque tiene un "+deviceData.gasHistory[0].measure.toFixed(2) + " por ciento.";
            }else{
              speechText = "Tu tanque tiene un 0 por ciento.";
            }
          }else if(deviceData.type == 1){
            speechText = "Tu gasto actual es de " + (parseInt(deviceData.litersConsumedThisMonth)/1000).toFixed(2) 
              + " metros cúbicos, equivalente a aproximadamente "+ ((parseInt(deviceData.litersConsumedThisMonth)/1000)*25)
                .toFixed(0) + " pesos.";
          }else if(deviceData.type == 3){
            speechText = "Tu gasto actual es de " + (parseInt(deviceData.litersConsumedThisMonth)) 
              + " metros cúbicos, equivalente a aproximadamente "+ ((parseInt(deviceData.litersConsumedThisMonth))*6.71)
                .toFixed(0) + " pesos.";
          }
          speechText = speechText + " ¿deseas revisar algún otro?";
        }else{
          speechText = "El medidor no esta disponible. ¿deseas revisar algún otro?";
        }
      }

      return new AlexaResponseMsg(
        speechText,
        false,
        false
      );
    } catch (error) {
      console.log(error);
      
      this.logger.debug("   " + `problema con alexa ${JSON.stringify(error)}`);
      this.logger.error("   " + `problema con alexa ${JSON.stringify(error)}`);

      return new AlexaResponseMsg(
        "Lo siento a ocurrido un problema con la api de GAWI",
        true,
        false
      );
    }
  }

  //////////////////////////////////////LEGACY para montar sobre nest la skill
  sendNextMessage(handlerInput: HandlerInput , speechText, endSession : boolean = false, loginCard : boolean = false){
    if(loginCard){
      return handlerInput.responseBuilder
        .speak(speechText)
        .reprompt(speechText)
        //.withSimpleCard("Titulo de la tarjeta", speechText)
        .withShouldEndSession(endSession)
        .withLinkAccountCard()
        .getResponse();
    }else{
      return handlerInput.responseBuilder
        .speak(speechText)
        .reprompt(speechText)
        //.withSimpleCard("Titulo de la tarjeta", speechText)
        .withShouldEndSession(endSession)
        .getResponse();
    }
  }

  async getUserInfo(accessToken) : Promise<ServerMessage> {
    return new Promise((resolve, reject) => {
      const options = {
        "method": "GET",
        "hostname": "api.amazon.com",
        "path": "/user/profile",
        "headers": {
          "Authorization": `Bearer ${accessToken}`
        }
      };
      const https = require('https');

      let req = https.request(options, (response) => {
        let returnData = '';

        response.on('data', (chunk) => {
          returnData += chunk;
        });

        response.on('end', () => {
          resolve(new ServerMessage(false, "Usuario de amazon obtenido", JSON.parse(returnData)));
        });

        response.on("error", (error) => {
          resolve(new ServerMessage(true, "Error obteniendo el usuario", error));
        })
      })
      req.end();
    })
  }
  /* Querys functions */
  async getUserDevicesList(handlerInput: HandlerInput ,email : string,senHi : boolean) : Promise<any>{
    if(!email){
      return "El email proporcionado es invalido"
    }

    let requestUser : User = await this.userRepository.findOne<User>({
      where: {
        email : email
      },
    });

    if(!requestUser){
      return this.sendNextMessage(handlerInput,"No cuentas con una cuenta en GAWI,"+
        " baja la app disponible en la Play Store o App Store",true);
    }
    

    let speechText = " estos son tus medidores : ";
    
    if(senHi){
      speechText = "Bienvenido a GAWI,"+speechText;;
    }

    /* {
      litersConsumedThisMonth: litersConsumedThisMonth.toFixed(2),
      actualPeriodMetry: actualPeriodMetry,
      lastPeriodMetry: lastPeriodMetry,

      idDevice: device.idDevice,
      name: device.name,
      serialNumber: device.serialNumber,
      type: device.type,
      organization: device.organization,
      gasHistory: device.gasHistory,
      waterHistory: device.waterHistory,
      waterSettings: device.waterSettings,
    } */
    let userDevices : ServerMessage = await this.devicesClientService.getDevices(requestUser);

    //console.log(userDevices.data.clientDevices);

    let names = "";

    let devicesFiltered : Device[] = (userDevices.data.clientDevices as Device[]).filter(device => device.type != 2);

    if(devicesFiltered.length == 0){
      names = " actualmente no cuentas con medidores.";
    }else{
      for (let index = 0; index < devicesFiltered.length; index++) {
        const deviceData = devicesFiltered[index];
        names = names + " medidor " +  ( index + 1 ) + " para "+ deviceData.name + " : "
      }
    }
    speechText = speechText + names;

    return this.sendNextMessage(handlerInput,speechText,false);
  }

  async getActualGasMeasureIntent(handlerInput: HandlerInput ,email : string, numberDevice : number ) : Promise<any>{
    try {
      if(!email){
        return "El email proporcionado es invalido"
      }

      let requestUser : User = await this.userRepository.findOne<User>({
        where: {
          email : email
        },
      });

      if(!requestUser){
        return this.sendNextMessage(handlerInput,"No cuentas con una cuenta en GAWI,"+
          " baja la app disponible en la Play Store o App Store",true);
      }
      
      /* {
        litersConsumedThisMonth: litersConsumedThisMonth.toFixed(2),//Only water
        actualPeriodMetry: actualPeriodMetry,//Only water
        lastPeriodMetry: lastPeriodMetry,//Only water

        idDevice: device.idDevice,
        name: device.name,
        serialNumber: device.serialNumber,
        type: device.type,
        organization: device.organization,
        gasHistory: device.gasHistory,
        waterHistory: device.waterHistory,
        waterSettings: device.waterSettings,
      } */
      let userDevices : ServerMessage = await this.devicesClientService.getDevices(requestUser);

      let speechText = "";

      if(  isNaN( numberDevice ) /* == null || numberDevice == undefined || numberDevice == NaN */) {
        return this.sendNextMessage(handlerInput,"Una disculpa no te eh entendido",false);
      }

      if( numberDevice < 0 || (userDevices.data.clientDevices.length + 1)  < numberDevice ){
        speechText = " El medidor con numero"+numberDevice+" no esta disponible";
      }else{
        const deviceData /* : Device */ = userDevices.data.clientDevices[numberDevice-1];

        if(deviceData.type == 0){
          if(deviceData.gasHistory.length > 0){
            speechText = "Tu tanque tiene un "+deviceData.gasHistory[0].measure.toFixed(2) + " porciento";
          }else{
            speechText = "Tu tanque tiene un 0 porciento";
          }
        }else{
          speechText = "Tu gasto actual es de " + (parseInt(deviceData.litersConsumedThisMonth)/1000).toFixed(2) 
            + " metros cúbicos, equivalente a aproximadamente "+ ((parseInt(deviceData.litersConsumedThisMonth)/1000)*25)
              .toFixed(0) + " pesos";
        }
      }
      speechText = speechText;

      return this.sendNextMessage(handlerInput,speechText,false);
    } catch (error) {
      this.logger.debug("   " + `problema con alexa ${JSON.stringify(error)}`);
      this.logger.error("   " + `problema con alexa ${JSON.stringify(error)}`);
      return this.sendNextMessage(handlerInput,"Lo siento a ocurrido un problema con la api de GAWI",false);
    }
  }
}
