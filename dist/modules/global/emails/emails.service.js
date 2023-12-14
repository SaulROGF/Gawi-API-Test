"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailsService = void 0;
const common_1 = require("@nestjs/common");
const ServerMessage_class_1 = require("../../../classes/ServerMessage.class");
const mailer_1 = require("@nestjs-modules/mailer");
let EmailsService = class EmailsService {
    constructor(mailerService) {
        this.mailerService = mailerService;
        this.srcEmail = process.env.EMAIL_USR;
    }
    async welcome(userEmail, userName) {
        return new Promise((resolve, reject) => {
            const uppercaseWords = str => str.replace(/^(.)|\s+(.)/g, c => c.toUpperCase());
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
                resolve(new ServerMessage_class_1.ServerMessage(false, 'Correo enviado correctamente', success));
            })
                .catch(error => {
                reject(new ServerMessage_class_1.ServerMessage(true, 'Error al enviar correo', error));
            });
        });
    }
    async resetPassword(currentEmail, newPassword) {
        return new Promise(async (resolve, reject) => {
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
                resolve(new ServerMessage_class_1.ServerMessage(false, 'Correo enviado correctamente', success));
            })
                .catch(error => {
                reject(new ServerMessage_class_1.ServerMessage(true, 'Error al enviar correo', error));
            });
        });
    }
    async recoveryPassword(email, link) {
        return new Promise(async (resolve, reject) => {
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
                resolve(new ServerMessage_class_1.ServerMessage(false, 'Correo enviado correctamente', success));
            })
                .catch(error => {
                reject(new ServerMessage_class_1.ServerMessage(true, 'Error al enviar correo', error));
            });
        });
    }
    convertDateToUTC(date) {
        let dateFixed = new Date(date);
        return new Date(dateFixed.getUTCFullYear(), dateFixed.getUTCMonth(), dateFixed.getUTCDate(), dateFixed.getUTCHours(), dateFixed.getUTCMinutes(), dateFixed.getUTCSeconds());
    }
    async sendSubscriptionPaymentSuccessEmail(name, toEmail, product, valid, reference, amount, type, commentForUser) {
        return new Promise(async (resolve, reject) => {
            try {
                let srcImageProduct = "";
                if (type == 0) {
                    srcImageProduct = '';
                }
                else if (type == 1) {
                    srcImageProduct = '';
                }
                let dateFixed = this.convertDateToUTC(new Date());
                let stringDate = dateFixed.toLocaleDateString("es-MX", { year: "numeric" }) + '-' +
                    dateFixed.toLocaleDateString("es-MX", { month: "2-digit" }) + '-' +
                    dateFixed.toLocaleDateString("es-MX", { day: "2-digit" });
                this.mailerService.sendMail({
                    to: toEmail,
                    cc: this.srcEmail,
                    from: this.srcEmail,
                    subject: "✔ Su suscripción a sido activada",
                    template: './subscription-payment',
                    context: {
                        name: name,
                        product: product,
                        valid: valid,
                        reference: reference,
                        stringDate: stringDate,
                        amount: amount,
                        srcImageProduct: srcImageProduct,
                        commentForUser: commentForUser,
                    },
                })
                    .then((success) => {
                    resolve(new ServerMessage_class_1.ServerMessage(false, "Email enviado con éxito", success));
                })
                    .catch((error) => {
                    resolve(new ServerMessage_class_1.ServerMessage(true, "Error enviando correo", error));
                });
            }
            catch (error) {
                resolve(new ServerMessage_class_1.ServerMessage(true, "Error 2 enviando correo", error));
            }
        });
    }
};
EmailsService = __decorate([
    common_1.Injectable(),
    __metadata("design:paramtypes", [mailer_1.MailerService])
], EmailsService);
exports.EmailsService = EmailsService;
//# sourceMappingURL=emails.service.js.map