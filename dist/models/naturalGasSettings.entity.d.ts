import { Device } from './device.entity';
import { Model } from 'sequelize-typescript';
export declare class NaturalGasSettings extends Model<NaturalGasSettings> {
    idNaturalGasSettings: number;
    idDevice: number;
    wereApplied: boolean;
    status: number;
    firmwareVersion: string;
    serviceOutageDay: number;
    monthMaxConsumption: number;
    apiUrl: string;
    consumptionUnits: string;
    storageFrequency: number;
    storageTime: string;
    dailyTime: string;
    customDailyTime: number;
    periodicFrequency: number;
    periodicTime: string;
    ipProtocol: number;
    auth: number;
    label: string;
    consumptionAlertType: number;
    consumptionAlertSetPoint: number;
    consumptionExcessFlag: number;
    lowBatteryFlag: number;
    sensorFlag: number;
    darkSetPoint: number;
    darkFlag: number;
    lightSetPoint: number;
    lightFlag: number;
    isOn: number;
    updatedAt: Date;
    createdAt: Date;
    device: Device;
    calculateNewStatus(noSetting: number, isForApply: boolean): number;
}
