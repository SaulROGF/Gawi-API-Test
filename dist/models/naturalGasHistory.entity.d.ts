import { Device } from './device.entity';
import { Model } from 'sequelize-typescript';
export declare class NaturalGasHistory extends Model<NaturalGasHistory> {
    idNaturalGasHistory: number;
    idDevice: number;
    consumption: number;
    temperature: number;
    signalQuality: number;
    bateryLevel: number;
    reason: number;
    hour: string;
    consumptionAlert: boolean;
    consumptionExcessAlert: boolean;
    lowBatteryAlert: boolean;
    sensorAlert: boolean;
    darkAlert: boolean;
    lightAlert: boolean;
    dateTime: Date;
    updatedAt: Date;
    createdAt: Date;
    device: Device;
}
