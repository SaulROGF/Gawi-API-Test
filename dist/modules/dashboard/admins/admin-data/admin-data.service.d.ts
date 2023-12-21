import { Apn } from './../../../../models/apn.entity';
import { User } from './../../../../models/user.entity';
import { ServerMessage } from './../../../../classes/ServerMessage.class';
import { State } from '../../../../models/state.entity';
import { Device } from '../../../../models/device.entity';
import { Logger } from 'winston';
export declare class AdminDataService {
    private readonly userRepository;
    private readonly stateRepository;
    private readonly apnRepository;
    private readonly deviceRepository;
    private readonly logger;
    constructor(userRepository: typeof User, stateRepository: typeof State, apnRepository: typeof Apn, deviceRepository: typeof Device, logger: Logger);
    getAdminAccountData(user: User): Promise<ServerMessage>;
    updateAdminAccountData(adminUser: User, adminUserData: User): Promise<ServerMessage>;
    getApnList(organization: number): Promise<ServerMessage>;
    createNewApn(data: Apn): Promise<ServerMessage>;
    updateAPNAdmin(data: Apn): Promise<ServerMessage>;
    deleteAPNAdmin(data: {
        apnDataToDelete: Apn;
        apnDataToSet: Apn;
    }): Promise<ServerMessage>;
}
