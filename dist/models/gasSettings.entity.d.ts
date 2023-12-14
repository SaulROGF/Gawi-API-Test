import { Device } from './device.entity';
import { Model } from 'sequelize-typescript';
export declare class GasSettings extends Model<GasSettings> {
    idGasSettings: number;
    idDevice: number;
    destUrl: string;
    closingHour: string;
    consumptionUnits: string;
    consumptionPeriod: string;
    minFillingPercentage: number;
    interval: number;
    minsBetweenMeasurements: number;
    travelMode: boolean;
    firmwareVersion: string;
    offset: number;
    offsetTime: string;
    wereApplied: boolean;
    createdAt: Date;
    updatedAt: Date;
    device: Device;
}
