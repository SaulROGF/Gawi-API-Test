import { Device } from './device.entity';
import { Model } from 'sequelize-typescript';
export declare class DataloggerHistory extends Model<DataloggerHistory> {
    idHistory: number;
    idDevice: number;
    batteryLevel: number;
    signalQuality: number;
    dateTime: Date;
    createdAt: Date;
    digitalInputs: number;
    digitalOutputs: number;
    analogInput1: number;
    analogInput2: number;
    analogInput3: number;
    analogInput4: number;
    flow1: number;
    flow2: number;
    consumption1: number;
    consumption2: number;
    alerts: number;
    device: Device;
}
