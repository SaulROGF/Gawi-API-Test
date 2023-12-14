import { DevicesService } from './devices.service';
import { ServerMessage } from '../../../../classes/ServerMessage.class';
export declare class DevicesController {
    private readonly devicesService;
    constructor(devicesService: DevicesService);
    loadHomeDataWarehouse(req: any): Promise<ServerMessage>;
    getApnList(): Promise<ServerMessage>;
    createWaterDevice(req: any, body: any): Promise<ServerMessage>;
    createMultipleDevices(req: any, body: any): Promise<ServerMessage>;
    checkAlreadyDevice(body: any): Promise<ServerMessage>;
}
