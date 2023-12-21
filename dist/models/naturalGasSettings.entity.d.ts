import { Device } from './device.entity';
import { Model } from 'sequelize-typescript';
export declare class NaturalGasSettings extends Model<NaturalGasSettings> {
    idNaturalGasSettings: number;
    idDevice: number;
    serviceOutageDay: number;
    monthMaxConsumption: number;
    apiUrl: string;
    consumptionUnits: string;
    ipProtocol: number;
    auth: number;
    label: string;
    isOn: boolean;
    updatedAt: Date;
    createdAt: Date;
    device: Device;
}
