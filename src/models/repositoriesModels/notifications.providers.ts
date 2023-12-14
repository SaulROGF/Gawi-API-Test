import { Notifications } from "../notifications.entity";

export const notificationProviders = [
    {   
        provide: 'NotificationsRepository',
        useValue: Notifications,
    },
]