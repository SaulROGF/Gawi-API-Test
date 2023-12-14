import { Model } from 'sequelize-typescript';
import { Device } from './device.entity';
import { Stations } from './stations.entity';
export declare class DeviceStation extends Model<DeviceStation> {
    idDeviceStation: number;
    idDevice: number;
    idStation: number;
    device: Device;
    stations: Stations;
}
