import { FieldtestService } from './fieldtest.service';
import { FieldDeviceDto } from './dtos/fildDevice.dto';
import { ServerMessage } from 'src/classes/ServerMessage.class';
export declare class FieldtestController {
    private readonly fieldTestService;
    constructor(fieldTestService: FieldtestService);
    getDevicesInField(): any;
    addDeviceToFieldTable(fieldDeviceDto: FieldDeviceDto): Promise<ServerMessage>;
    removeDeviceToFieldTable(params: any): Promise<ServerMessage[]>;
}
