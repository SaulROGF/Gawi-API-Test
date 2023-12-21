import { ServerMessage } from "../../../classes/ServerMessage.class";
import { Notifications } from "../../../models/notifications.entity";
export declare class PushNotificationsService {
    private readonly notificationRepository;
    private serviceAccount;
    constructor(notificationRepository: typeof Notifications);
    private initialize;
    send(idUser: number, title: string, content: string): Promise<ServerMessage>;
    private sendNotification;
}
