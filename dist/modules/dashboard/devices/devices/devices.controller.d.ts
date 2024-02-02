import { DevicesService } from './devices.service';
import { ServerMessage } from '../../../../classes/ServerMessage.class';
import { JwtService } from '@nestjs/jwt';
export declare class DevicesController {
    private readonly devicesService;
    private jwtService;
    constructor(devicesService: DevicesService, jwtService: JwtService);
    saveGasMeasuresEndpoint(body: any): Promise<any>;
    markNaturalGasSettingsAsAppliedEndpoint(body: any): Promise<any>;
    loginEndpoint(body: any): Promise<any>;
    saveWaterDeviceDataEndpoint(body: any): Promise<any>;
    markWaterDeviceSettingsAsAppliedEndpoint(body: any): Promise<any>;
    markGasSettingsAsAppliedEndpoint(serialNumber: string): Promise<any>;
    saveGasDeviceDataEndpoint(deviceDate: string, deviceTime: string, imei: string, serialNumber: string, measure: string, consumption: string, meanConsumption: string, alerts: string, bateryLevel: string, temperature: string, signalQuality: string): Promise<any>;
    postSaveGasDeviceDataEndpoint(body: any): Promise<any>;
    saveDataloggerMeasuresEndpoint(body: any): Promise<any>;
    serveByFTPEndpoint(idOrganization: number): Promise<ServerMessage>;
}
