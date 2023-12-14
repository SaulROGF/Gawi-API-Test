import { Controller, HttpCode, Post, Body, Req, Get, Inject, Res, HttpStatus, BadRequestException } from "@nestjs/common";
import {
  ErrorHandler,
  HandlerInput,
  RequestHandler,
  SkillBuilders,

} from "ask-sdk-core";
import { Request } from "express";

import { AlexaSkillService } from './alexaSkill.service';

import { Logger } from 'winston';
import { ServerMessage } from "../../../../classes/ServerMessage.class";

import { SkillRequestSignatureVerifier, TimestampVerifier } from 'ask-sdk-express-adapter';
import { ResponseEnvelope } from "ask-sdk-model";
import { Response } from 'express';
import * as axios from 'axios';
import { LoginUserDto } from "../../../public/user/dto/loginUser.dto";


//https://api-test.gawi.mx/clients/alexa/requests
//https://3460-2806-2f0-34e0-20c6-8dfe-e8a1-6969-d533.ngrok.io/clients/alexa/requests
@Controller('clients/alexa')
export class AlexaSkillController {
  axios: any;

  ErrorHandler: ErrorHandler = {
    canHandle: (handlerInput: HandlerInput, error: Error) => {
      return true;
    },
    handle: (handlerInput: HandlerInput, error: Error) => {
      //console.log("Error handled en stringify : " + error.message + " " + JSON.stringify(error));
      //console.log("---------------------------------------------------");

      return handlerInput.responseBuilder
        .speak("Lo siento, No puede entenderte. Puedes repetírmelo.")
        .reprompt("Lo siento, No puede entenderte. Puedes repetírmelo.")
        .getResponse();
    },
  };

  LaunchRequestHandler: RequestHandler = {
    canHandle: (handlerInput: HandlerInput) => {
      //console.log("---------" + handlerInput.requestEnvelope.request.type);

      return handlerInput.requestEnvelope.request.type === "LaunchRequest" ||
        handlerInput.requestEnvelope.request.type === "IntentRequest" ||
        handlerInput.requestEnvelope.request.type === "SessionEndedRequest";
    },
    handle: async (handlerInput: HandlerInput) => {
      let speechText = "";
      const { accessToken } = handlerInput.requestEnvelope.session.user;

      if (handlerInput.requestEnvelope.request.type === "SessionEndedRequest") {
        //console.log("   Cerrando sesión");
        return this.alexaSkillService
          .sendNextMessage(handlerInput, "", true);
      } else if (typeof accessToken === "undefined") {
        speechText = "Por favor vincula tu cuenta de GAWI";

        //console.log("   " + speechText);
        return this.alexaSkillService
          .sendNextMessage(handlerInput, speechText, true, true);
      } else {
        const resultAmazon: ServerMessage = await this.alexaSkillService.getUserInfo(accessToken);

        if (resultAmazon.error == true) {
          speechText = "No se pudo obtener la información de la cuenta";
          //console.log("   " + speechText + `... info: ${JSON.stringify(resultAmazon)}`);

          return this.alexaSkillService
            .sendNextMessage(handlerInput, speechText, true);
        } else if (resultAmazon.error == false) {
          if (handlerInput.requestEnvelope.request.type === "LaunchRequest") {
            //console.log("   La persona : " + resultAmazon.data.name +
            //" acaba de iniciar la sesión , mandando medidores(menu) : token" + accessToken);

            return await this.alexaSkillService.getUserDevicesList(handlerInput, resultAmazon.data.email, true);
          } else if (handlerInput.requestEnvelope.request.type === "IntentRequest") {
            //console.log("   Petición de la sesión de : " + resultAmazon.data.email);

            let intentName = handlerInput.requestEnvelope.request.intent.name;

            //console.log("       Se requiere la opcion (intent) " + intentName);

            //Intents of functions called by the user in the skill
            if (intentName == 'AMAZON.StopIntent' || intentName == 'AMAZON.CancelIntent') {
              //console.log("   Cerrando sesión");

              return this.alexaSkillService
                .sendNextMessage(handlerInput, " hasta luego ", true);
            } else if (intentName == 'GetActualDevicesListIntent' || intentName == 'AMAZON.HelpIntent' || intentName == 'AMAZON.NavigateHomeIntent') {
              return await this.alexaSkillService.getUserDevicesList(handlerInput, resultAmazon.data.email, false);
            } else if (intentName == 'GetActualMeasureIntent') {
              //console.log("   " + `...: ${JSON.stringify(handlerInput.requestEnvelope.request.intent.slots)}`);

              return await this.alexaSkillService
                .getActualGasMeasureIntent(
                  handlerInput,
                  resultAmazon.data.email,
                  parseInt(handlerInput.requestEnvelope.request.intent.slots['number'].value));
            } else {
              //console.log("   " + `...: ${JSON.stringify(handlerInput.requestEnvelope.request.intent)}`);
              speechText = "aun no se tiene un comando para este intent";
            }
          }

          return this.alexaSkillService
            .sendNextMessage(handlerInput, speechText, false);
        }
      }
    },
  };

  constructor(
    @Inject('winston') private readonly logger: Logger,
    private readonly alexaSkillService: AlexaSkillService) {
    this.axios = axios.default;
  }
  
  @Post('alexa-login')
  async login(@Body() loginData ): Promise<ServerMessage> {
    return await this.alexaSkillService.validateUserByAlexaPassword(loginData);
  }

  @Get('requests')
  async runSkill(@Req() req: Request, @Res() response: Response) {
    return response
      .status(HttpStatus.OK)
      .send({});
  }

  //ruta a la que le pega la skill de alexa y los medidores de los clientes
  @Post('requests')
  async alexaSkill(@Req() req: Request, @Res() response: Response) {

    //Se crea la skill para luego setearle los objetos que manejaran las solicitudes y errores
    let skill = SkillBuilders.custom()
      .addRequestHandlers(
        this.LaunchRequestHandler
      )
      .addErrorHandlers(this.ErrorHandler)
      .create();

    try {
      let textBody = JSON.stringify(req.body)

      //this.logger.error("textBody alexa : "+textBody);
      //this.logger.error("headers alexa "+JSON.stringify(req.headers['signaturecertchainurl']));

      let signaturecertchainurl: any = req.headers['signaturecertchainurl'];

      if (signaturecertchainurl.substr(0, "https://s3.amazonaws.com".length) != "https://s3.amazonaws.com") {
        throw new BadRequestException();
      }
      let pathString: string = signaturecertchainurl.substr("https://s3.amazonaws.com".length, "/echo.api/".length);

      if (pathString.toLowerCase() != "/echo.api/") {
        throw new BadRequestException();
      }


      let responseAxios = await this.axios.get(signaturecertchainurl, {
        responseType: "blob", // this is important!
        //headers: { Authorization: "sometoken" },
      });
      console.log(responseAxios.data);
      const { X509Certificate } = require('crypto');
      var crt_obj = X509Certificate.parseCert(responseAxios.data);
      console.log(crt_obj.notBefore);
      console.log(crt_obj.notAfter);


      //Se verifica que la peticion venga de amazon alexa solo para local porque en el servidor truena
      //ya que se elimina el header
      //await new SkillRequestSignatureVerifier().verify( textBody ,req.headers );
      await new TimestampVerifier().verify(textBody);


      return skill
        .invoke(req.body)
        .then((res: ResponseEnvelope) => {
          return response
            .status(HttpStatus.OK)
            .send(res);
        })
        .catch((err) => {
          this.logger.error("error alexa " + JSON.stringify(err));
          return response
            .status(HttpStatus.BAD_REQUEST)
            .send(err);
        });
    } catch (err) {
      console.log(err);

      //this.logger.error("error 2 "+JSON.stringify(err));

      return response
        .status(HttpStatus.BAD_REQUEST)
        .send(err);
    }
  }
}
