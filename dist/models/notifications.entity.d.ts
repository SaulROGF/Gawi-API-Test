import { Model } from 'sequelize-typescript';
import { User } from './user.entity';
export declare class Notifications extends Model<Notifications> {
    idNotification: number;
    idUser: number;
    uuid: string;
    token: string;
    isLogged: boolean;
    lastLogin: Date;
    createdAt: Date;
    updatedAt: Date;
    users: User;
}
export declare const notificationProviders: {
    provide: string;
    useValue: typeof Notifications;
}[];
