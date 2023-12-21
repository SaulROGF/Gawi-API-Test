import { GasSettings } from './../../../../models/gasSettings.entity';
import { Device } from './../../../../models/device.entity';
import { ServerMessage } from '../../../../classes/ServerMessage.class';
import { User } from '../../../../models/user.entity';
import { WaterSettings } from '../../../../models/waterSettings.entity';
import { Apn } from '../../../../models/apn.entity';
import { Logger } from 'winston';
import { DataloggerSettings } from '../../../../models/dataloggerSettings.entity';
export declare class DevicesService {
    private readonly deviceRepository;
    private readonly waterSettingsRepository;
    private readonly dataloggerSettingsRepository;
    private readonly gasSettingsRepository;
    private readonly apnRepository;
    private readonly logger;
    constructor(deviceRepository: typeof Device, waterSettingsRepository: typeof WaterSettings, dataloggerSettingsRepository: typeof DataloggerSettings, gasSettingsRepository: typeof GasSettings, apnRepository: typeof Apn, logger: Logger);
    getApnList(): Promise<ServerMessage>;
    loadHomeDataWarehouse(userWarehouse: User): Promise<ServerMessage>;
    createDevice(userWarehouse: User, newDeviceData: Device): Promise<ServerMessage>;
    createDeviceSetings(deviceData: Device): Promise<ServerMessage>;
    createMultipleDevices(userWarehouse: User, newDevicesData: Device[]): Promise<ServerMessage>;
    checkAlreadyDevice(deviceData: Device): Promise<ServerMessage>;
}
