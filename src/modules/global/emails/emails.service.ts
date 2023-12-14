import { Injectable } from '@nestjs/common';
import { ServerMessage } from '../../../classes/ServerMessage.class';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class EmailsService {
  srcEmail: string;

  constructor(private readonly mailerService: MailerService) {
    this.srcEmail = process.env.EMAIL_USR; // "no-reply@gawi.mx";
  }

  /**
   *
   */
  async welcome(userEmail: string, userName: string): Promise<ServerMessage> {
    return new Promise<ServerMessage>((resolve, reject) => {
      const uppercaseWords = str =>
        str.replace(/^(.)|\s+(.)/g, c => c.toUpperCase());

      this.mailerService
        .sendMail({
          to: userEmail,
          cc: this.srcEmail,
          from: this.srcEmail,
          subject: 'Bienvenido',
          template: './welcome',
          context: {
            name: uppercaseWords(userName),
          },
        })
        .then(success => {
          resolve(
            new ServerMessage(false, 'Correo enviado correctamente', success),
          );
        })
        .catch(error => {
          reject(new ServerMessage(true, 'Error al enviar correo', error));
        });
    });
  }

  /**
   *
   */
  async resetPassword(
    currentEmail: string,
    newPassword: string,
  ): Promise<ServerMessage> {
    return new Promise(async (resolve, reject) => {
      // sending email
      this.mailerService
        .sendMail({
          to: currentEmail,
          cc: this.srcEmail,
          from: this.srcEmail,
          subject: 'Generación de contraseña provisional',
          template: './recovery',
          context: {
            email: currentEmail,
            newPassword: newPassword,
          },
        })
        .then(success => {
          resolve(
            new ServerMessage(false, 'Correo enviado correctamente', success),
          );
        })
        .catch(error => {
          reject(new ServerMessage(true, 'Error al enviar correo', error));
        });
    });
  }



  /**
   *
   */
  async recoveryPassword(
    email: string,
    link: string,
  ): Promise<ServerMessage> {
    return new Promise(async (resolve, reject) => {
      // sending email
      this.mailerService
        .sendMail({
          to: email,
          cc: this.srcEmail,
          from: this.srcEmail,
          subject: 'Restablecer contraseña',
          template: './reset',
          context: {
            email: email,
            link: link,
          },
        })
        .then(success => {
          resolve(
            new ServerMessage(false, 'Correo enviado correctamente', success),
          );
        })
        .catch(error => {
          reject(new ServerMessage(true, 'Error al enviar correo', error));
        });
    });
  }

  convertDateToUTC(date: Date) {
    let dateFixed = new Date(date);
    return new Date(
      dateFixed.getUTCFullYear(),
      dateFixed.getUTCMonth(),
      dateFixed.getUTCDate(),
      dateFixed.getUTCHours(),
      dateFixed.getUTCMinutes(),
      dateFixed.getUTCSeconds(),
    );
  }

  async sendSubscriptionPaymentSuccessEmail(
    name: string,
    toEmail: string,
    product: string,
    valid: string,
    reference: string,
    amount : string,
    type : number,
    commentForUser : string,): Promise<ServerMessage> {
    return new Promise(async (resolve, reject) => {
      try {
        //toEmails = es una variable donde pasas los emails separados por coma
        let srcImageProduct = "";
        if (type == 0) {
          srcImageProduct = '';
        } else if (type == 1) {
          srcImageProduct = '';
        }

        let dateFixed: Date = this.convertDateToUTC(new Date());
        let stringDate = dateFixed.toLocaleDateString("es-MX", { year: "numeric" }) + '-' +
          dateFixed.toLocaleDateString("es-MX", { month: "2-digit" }) + '-' +
          dateFixed.toLocaleDateString("es-MX", { day: "2-digit" });

        this.mailerService.sendMail({
          to: toEmail, // list of receivers string separado por comas
          cc: this.srcEmail,
          from: this.srcEmail, // sender address
          subject: "✔ Su suscripción a sido activada" /* + userName */,// Subject line
          //text: 'welcome', // plaintext body
          //html: '<b>email : {{email}} . password : {{password}}</b>', /* welcomeEmail,  */ // HTML body content 
          //template: path.resolve(__dirname, '..', '..', '..', 'templates', 'emails', 'success-payment'), // The `.pug`, `.ejs` or `.hbs` extension is appended automatically.
          template: './subscription-payment',
          context: {  // Data to be sent to template engine.
            name: name,
            product: product,
            valid: valid,
            reference: reference,
            stringDate : stringDate,
            amount : amount,
            srcImageProduct : srcImageProduct,
            commentForUser : commentForUser,
          },
        })
          .then((success) => {
            resolve(new ServerMessage(false, "Email enviado con éxito", success));
          })
          .catch((error) => {
            /* console.log("ERROR ----------------------------------"); */
            /* console.log(error); */
            resolve(new ServerMessage(true, "Error enviando correo", error));
          });
      } catch (error) {
        resolve(new ServerMessage(true, "Error 2 enviando correo", error));
      }
    })
  }
}
