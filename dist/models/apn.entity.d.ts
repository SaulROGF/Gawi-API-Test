import { Model } from 'sequelize-typescript';
import { Device } from './device.entity';
export declare class Apn extends Model<Apn> {
    idApn: number;
    name: string;
    companyName: string;
    apn: string;
    user: string;
    password: string;
    createdAt: Date;
    updatedAt: Date;
    devices: Device[];
}
export declare const apnProviders: {
    provide: string;
    useValue: typeof Apn;
}[];
