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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PushNotificationsService = void 0;
const common_1 = require("@nestjs/common");
const ServerMessage_class_1 = require("../../../classes/ServerMessage.class");
const firebase_conf_1 = require("./firebase.conf");
const admin = require("firebase-admin");
let PushNotificationsService = class PushNotificationsService {
    constructor(notificationRepository) {
        this.notificationRepository = notificationRepository;
        this.initialize();
    }
    initialize() {
        if (!admin.apps.length) {
            this.serviceAccount = firebase_conf_1.firebaseServiceAccount;
            admin.initializeApp({
                credential: admin.credential.cert(this.serviceAccount),
            });
        }
    }
    async send(idUser, title, content) {
        try {
            let credentials = await this.notificationRepository.findAll({
                where: {
                    idUser: idUser,
                },
            });
            const tokens = credentials
                .filter(credential => credential.isLogged == true)
                .map(credential => credential.token);
            return await this.sendNotification(tokens, {
                title: title,
                body: content,
            });
        }
        catch (error) {
            return new ServerMessage_class_1.ServerMessage(true, 'Error en el servicio local de notificaciones', error);
        }
    }
    sendNotification(tokens, notification) {
        const message = {
            notification: notification,
            tokens: tokens,
        };
        return new Promise(function (resolve, reject) {
            admin
                .messaging()
                .sendMulticast(message)
                .then(response => {
                resolve(new ServerMessage_class_1.ServerMessage(false, 'Notificacion enviada éxitosamente', response));
            })
                .catch(error => {
                resolve(new ServerMessage_class_1.ServerMessage(true, 'Error externo al intentar generar la notificacion', error));
            });
        });
    }
};
PushNotificationsService = __decorate([
    common_1.Injectable(),
    __param(0, common_1.Inject('NotificationsRepository')),
    __metadata("design:paramtypes", [Object])
], PushNotificationsService);
exports.PushNotificationsService = PushNotificationsService;
//# sourceMappingURL=push-notifications.service.js.map