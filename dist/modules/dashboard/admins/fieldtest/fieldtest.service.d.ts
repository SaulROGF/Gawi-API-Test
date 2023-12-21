import { Device } from 'src/models/device.entity';
import { FieldDevice } from 'src/models/fieldDevice.entity';
import { FieldDeviceDto } from './dtos/fildDevice.dto';
import { ServerMessage } from 'src/classes/ServerMessage.class';
import { WaterHistory } from 'src/models/waterHistory.entity';
export declare class FieldtestService {
    private readonly fieldDeviceRepository;
    private readonly deviceRepository;
    private readonly waterHistoryRepository;
    constructor(fieldDeviceRepository: typeof FieldDevice, deviceRepository: typeof Device, waterHistoryRepository: typeof WaterHistory);
    getDevicesInField(): Promise<any[]>;
    saveDeviceInField(fieldDeviceDto: FieldDeviceDto): Promise<ServerMessage>;
    deleteDeviceFromField(serialNumbers: string): Promise<ServerMessage[]>;
    private findDeviceBySerialNumber;
    private findFieldDeviceByDeviceId;
    private handleDBExceptions;
}
