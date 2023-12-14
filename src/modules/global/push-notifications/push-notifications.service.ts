import { Injectable, Inject } from "@nestjs/common";
import { ServerMessage } from "../../../classes/ServerMessage.class";
import { Notifications } from "../../../models/notifications.entity";
import { firebaseServiceAccount } from "./firebase.conf";
import * as admin from "firebase-admin";

@Injectable()
export class PushNotificationsService {
  private serviceAccount: any;

  constructor(
    @Inject('NotificationsRepository')
    private readonly notificationRepository: typeof Notifications,
  ) {
    this.initialize();
  }

  private initialize() {
    if (!admin.apps.length) {
      this.serviceAccount = firebaseServiceAccount;
      admin.initializeApp({
        credential: admin.credential.cert(this.serviceAccount),
      });
    }
  }

  public async send(
    idUser: number,
    title: string,
    content: string,
  ): Promise<ServerMessage> {
    try {
      let credentials: Notifications[] = await this.notificationRepository.findAll<
        Notifications
      >({
        where: {
          idUser: idUser,
        },
      });
      const tokens: string[] = credentials
      .filter(credential => credential.isLogged == true)
      .map(credential => credential.token);

      return await this.sendNotification(tokens, {
        title: title,
        body: content,
      });
    } catch (error) {
      return new ServerMessage(true, 'Error en el servicio local de notificaciones', error);
    }
  }

  private sendNotification(
    tokens: string[],
    notification: any,
  ): Promise<ServerMessage> {
    const message = {
      notification: notification,
      tokens: tokens,
    };

    return new Promise(function(resolve, reject) {
      admin
        .messaging()
        .sendMulticast(message)
        .then(response => {
          resolve(
            new ServerMessage(
              false,
              'Notificacion enviada éxitosamente',
              response,
            ),
          );
        })
        .catch(error => {
          resolve(
            new ServerMessage(true, 'Error externo al intentar generar la notificacion', error),
          );
        });
    });
  }
}
