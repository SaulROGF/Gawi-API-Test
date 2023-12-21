import { Device } from './device.entity';
import { Model } from 'sequelize-typescript';
export declare class WaterHistory extends Model<WaterHistory> {
    idWaterHistory: number;
    idDevice: number;
    flow: number;
    consumption: number;
    reversedConsumption: number;
    temperature: number;
    dripAlert: boolean;
    manipulationAlert: boolean;
    emptyAlert: boolean;
    burstAlert: boolean;
    bubbleAlert: boolean;
    reversedFlowAlert: boolean;
    bateryLevel: number;
    signalQuality: number;
    reason: number;
    dateTime: Date;
    createdAt: Date;
    devices: Device;
}
