import { JwtService } from '@nestjs/jwt';
import { Device } from './../../../../models/device.entity';
import { DeviceMessage } from './classes/deviceMessage.class';
import { WaterHistory } from './../../../../models/waterHistory.entity';
import { WaterSettings } from './../../../../models/waterSettings.entity';
import { GasHistory } from './../../../../models/gasHistory.entity';
import { GasSettings } from './../../../../models/gasSettings.entity';
import { DataloggerHistory } from '../../../../models/dataloggerHistory.entity';
import { DataloggerSettings } from '../../../../models/dataloggerSettings.entity';
import { NaturalGasHistory } from 'src/models/naturalGasHistory.entity';
import { Logger } from 'winston';
import { ServerMessage } from './../../../../classes/ServerMessage.class';
import { Apn } from '../../../../models/apn.entity';
import { PushNotificationsService } from '../../../../modules/global/push-notifications/push-notifications.service';
import { NaturalGasSettings } from 'src/models/naturalGasSettings.entity';
export declare class DevicesService {
    private jwtService;
    private pushNotificationService;
    private readonly logger;
    private readonly deviceRepository;
    private readonly apnRepository;
    private readonly waterHistoryRepository;
    private readonly waterSettingsRepository;
    private readonly gasHistoryRepository;
    private readonly gasSettingsRepository;
    private readonly dataloggerHistoryRepository;
    private readonly dataloggerSettingsRepository;
    private readonly naturalGasHistoryRepository;
    private readonly naturalGasSettingsRepository;
    WD_MAX_CONFGS: number;
    WD_MAX_ALERTS: number;
    constructor(jwtService: JwtService, pushNotificationService: PushNotificationsService, logger: Logger, deviceRepository: typeof Device, apnRepository: typeof Apn, waterHistoryRepository: typeof WaterHistory, waterSettingsRepository: typeof WaterSettings, gasHistoryRepository: typeof GasHistory, gasSettingsRepository: typeof GasSettings, dataloggerHistoryRepository: typeof DataloggerHistory, dataloggerSettingsRepository: typeof DataloggerSettings, naturalGasHistoryRepository: typeof NaturalGasHistory, naturalGasSettingsRepository: typeof NaturalGasSettings);
    login(body: any): Promise<DeviceMessage>;
    saveNaturalGasMeasures(body: any): Promise<DeviceMessage>;
    saveDataloggerMeasures(body: any): Promise<DeviceMessage>;
    saveWaterDeviceData(body: any): Promise<DeviceMessage>;
    markWaterDeviceSettingsAsApplied(body: any): Promise<DeviceMessage>;
    markNaturalGasSettingsAsApplied(body: any): Promise<DeviceMessage>;
    markGasSettingsAsApplied(serialNumber: string): Promise<DeviceMessage>;
    saveGasDeviceData(deviceDate: string, deviceTime: string, imei: string, serialNumber: string, measure: string, consumption: string, meanConsumption: string, alerts: string, bateryLevel: string, temperature: string, signalQuality: string): Promise<DeviceMessage>;
    private sendAlertNotification;
    serverByFTP(idOrganization: number): Promise<ServerMessage>;
    private createCRC32Table;
    private updateCRC32;
    private computeCRC32;
    private getGasSettingsString;
    private fixLenWithZero;
    private checkIsApplied;
    private getATcommands;
    private getATcommandsNaturalGas;
    private createJwtPayloadDevice;
    private checkNullUndefined;
    validateDeviceByJwt(payload: any): Promise<any>;
    generateDeviceData(device: Device): Promise<{
        idDevice: number;
        serialNumber: string | number;
    }>;
    private getBackupPath;
    private debugAlerts;
}
