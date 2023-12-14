import { Town } from './../../../../models/town.entity';
import { User } from '../../../../models/user.entity';
import { ServerMessage } from '../../../../classes/ServerMessage.class';
import { State } from './../../../../models/state.entity';
import { Device } from '../../../../models/device.entity';
import { GasHistory } from '../../../../models/gasHistory.entity';
import { WaterHistory } from '../../../../models/waterHistory.entity';
import { WaterSettings } from '../../../../models/waterSettings.entity';
import { GasSettings } from '../../../../models/gasSettings.entity';
import { Apn } from '../../../../models/apn.entity';
import { Logger } from 'winston';
export declare class DevicesService {
    private readonly deviceRepository;
    private readonly waterHistoryRepository;
    private readonly gasHistoryRepository;
    private readonly waterSettingsRepository;
    private readonly gasSettingsRepository;
    private readonly userRepository;
    private readonly stateRepository;
    private readonly townRepository;
    private readonly apnRepository;
    private readonly logger;
    constructor(deviceRepository: typeof Device, waterHistoryRepository: typeof WaterHistory, gasHistoryRepository: typeof GasHistory, waterSettingsRepository: typeof WaterSettings, gasSettingsRepository: typeof GasSettings, userRepository: typeof User, stateRepository: typeof State, townRepository: typeof Town, apnRepository: typeof Apn, logger: Logger);
    getApnCatalog(): Promise<ServerMessage>;
    getCheckDeviceExist(technician: User, body: {
        serialNumber: string;
        type: string;
    }): Promise<ServerMessage>;
    getWaterDeviceSettings(technician: User, idDevice: any): Promise<ServerMessage>;
    syncWaterSettingsNewData(technician: User, body: {
        idApn: number;
        newWatterSettings: WaterSettings;
        type: number;
        serialNumber: string;
    }, isNfc: boolean): Promise<ServerMessage>;
    getDeviceTechnicianAddressSettings(technician: User, idDevice: any): Promise<ServerMessage>;
    updateDeviceTechnicianAddressSettings(technician: User, device: Device): Promise<ServerMessage>;
    updateDeviceOnOffSettingsNFC(user: User, body: any): Promise<ServerMessage>;
}
