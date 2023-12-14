import { Device } from './device.entity';
import { Model } from 'sequelize-typescript';
export declare class NaturalGasHistory extends Model<NaturalGasHistory> {
    idHistory: number;
    idDevice: number;
    consumption: number;
    dateTime: Date;
    createdAt: Date;
    device: Device;
}
