import { ServerMessage } from './../../../../classes/ServerMessage.class';
import { DevicesService } from './devices.service';
export declare class DevicesController {
    private readonly devicesService;
    constructor(devicesService: DevicesService);
    getApnCatalog(): Promise<ServerMessage>;
    getCheckDeviceExist(body: any, req: any): Promise<ServerMessage>;
    getWaterDeviceSettingsEndpoint(idDevice: number, req: any): Promise<ServerMessage>;
    syncSettingsNewData(body: any, req: any): Promise<ServerMessage>;
    syncSettingsCloudNewData(body: any, req: any): Promise<ServerMessage>;
    getDeviceClientAddressSettings(idDevice: any, req: any): Promise<ServerMessage>;
    updateDeviceClientAddressSettings(body: any, req: any): Promise<ServerMessage>;
    updateDeviceOnOffSettingsNFCEndpoint(body: any, req: any): Promise<ServerMessage>;
}
