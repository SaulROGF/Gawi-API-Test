import { Device } from './device.entity';
import { Model } from 'sequelize-typescript';
export declare class GasHistory extends Model<GasHistory> {
    idGasHistory: number;
    idDevice: number;
    measure: number;
    meanConsumption: number;
    bateryLevel: number;
    accumulatedConsumption: number;
    signalQuality: number;
    resetAlert: boolean;
    intervalAlert: boolean;
    fillingAlert: boolean;
    temperature: number;
    dateTime: Date;
    createdAt: Date;
    devices: Device;
}
