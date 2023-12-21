import { Notifications } from "../notifications.entity";
export declare const notificationProviders: {
    provide: string;
    useValue: typeof Notifications;
}[];
