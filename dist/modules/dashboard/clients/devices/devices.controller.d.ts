import { ServerMessage } from './../../../../classes/ServerMessage.class';
import { DevicesService } from './devices.service';
export declare class DevicesController {
    private readonly devicesService;
    constructor(devicesService: DevicesService);
    getAlertsEndpoint(req: any): Promise<ServerMessage>;
    getTownsAndStates(req: any): Promise<ServerMessage>;
    updateTown(body: any, req: any): Promise<ServerMessage>;
    getNaturalGasDeviceData(idDevice: number, period: number, req: any): Promise<ServerMessage>;
    getNaturalGasDeviceSettings(idDevice: number, req: any): Promise<ServerMessage>;
    updateSettingsNaturalServiceMonthMaxConsumption(body: any, req: any): Promise<ServerMessage>;
    getDeviceWaterData(idDevice: number, period: number, req: any): Promise<ServerMessage>;
    getIndividualLoggerDeviceData(req: any, body: any): Promise<ServerMessage>;
    getLoggerFromToDeviceData(req: any, body: any): Promise<ServerMessage>;
    getLoggerDeviceSettingsEndpoint(idDevice: number, req: any): Promise<ServerMessage>;
    updateLoggerNotificationRepeatTime(body: any, req: any): Promise<ServerMessage>;
    getWaterDeviceAlertsEndpoint(idDevice: number, period: number, req: any): Promise<ServerMessage>;
    getWaterDeviceSettingsEndpoint(idDevice: number, req: any): Promise<ServerMessage>;
    updateDeviceName(body: any, req: any): Promise<ServerMessage>;
    getGasDeviceDataEndpoint(idDevice: number, period: number, req: any): Promise<ServerMessage>;
    getGasDeviceAlertsEndpoint(idDevice: number, period: number, req: any): Promise<ServerMessage>;
    getGasDeviceSettingsEndpoint(idDevice: number, req: any): Promise<ServerMessage>;
    updateSettingsGasInterval(body: any, req: any): Promise<ServerMessage>;
    updateGasOffset(body: any, req: any): Promise<ServerMessage>;
    updateGasOffsetTime(body: any, req: any): Promise<ServerMessage>;
    updateSettingsTankCapacity(body: any, req: any): Promise<ServerMessage>;
    updateSettingsGasMinFillingPercentage(body: any, req: any): Promise<ServerMessage>;
    updateConsumptionUnitsPeriod(body: any, req: any): Promise<ServerMessage>;
    updateTravelModeEndpoint(body: any, req: any): Promise<ServerMessage>;
    updateSettingsServiceOutageDay(body: any, req: any): Promise<ServerMessage>;
    updateSettingsWaterServiceConsumptionUnits(body: any, req: any): Promise<ServerMessage>;
    updateSettingsWaterServiceSpendingUnits(body: any, req: any): Promise<ServerMessage>;
    updateSettingsWaterServiceStorageFrequency(body: any, req: any): Promise<ServerMessage>;
    updateSettingsWaterServiceDailyTransmission(body: any, req: any): Promise<ServerMessage>;
    updateSettingsWaterServiceCustomDailyTime(body: any, req: any): Promise<ServerMessage>;
    updateSettingsWaterServiceIpProtocol(body: any, req: any): Promise<ServerMessage>;
    updateSettingsWaterAuthenticationProtocol(body: any, req: any): Promise<ServerMessage>;
    updateSettingsWaterServiceDescriptionLabel(body: any, req: any): Promise<ServerMessage>;
    updateSettingsWaterConsumptionAlertType(body: any, req: any): Promise<ServerMessage>;
    updateSettingsWaterServicePeriodicFrequency(body: any, req: any): Promise<ServerMessage>;
    updateSettingsWaterServiceDripSetpoint(body: any, req: any): Promise<ServerMessage>;
    updateSettingsWaterServiceBurstSetpoint(body: any, req: any): Promise<ServerMessage>;
    updateSettingsWaterServiceFlowSetpoint(body: any, req: any): Promise<ServerMessage>;
    updateSettingsWaterServiceConsumptionSetpoint(body: any, req: any): Promise<ServerMessage>;
    updateSettingsWaterServicePeriodicTime(body: any, req: any): Promise<ServerMessage>;
    updateSettingsWaterServiceDailyTime(body: any, req: any): Promise<ServerMessage>;
    updateSettingsWaterServiceStorageTime(body: any, req: any): Promise<ServerMessage>;
    updateSettingsWaterServiceMonthMaxConsumption(body: any, req: any): Promise<ServerMessage>;
    updateSettingsWaterServiceUpdateFlags(body: any, req: any): Promise<ServerMessage>;
    getDeviceClientAddressSettings(idDevice: any, req: any): Promise<ServerMessage>;
    updateDeviceClientAddressSettings(body: any, req: any): Promise<ServerMessage>;
    detachDeviceEndpoint(req: any, body: any): Promise<ServerMessage>;
}
