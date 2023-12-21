import { ServerMessage } from '../../../../classes/ServerMessage.class';
import { Organization } from './../../../../models/organization.entity';
import { Device } from './../../../../models/device.entity';
import { User } from './../../../../models/user.entity';
import { Logger } from 'winston';
export declare class ServiceCenterService {
    private readonly userRepository;
    private readonly organizationRepository;
    private readonly deviceRepository;
    private readonly logger;
    constructor(userRepository: typeof User, organizationRepository: typeof Organization, deviceRepository: typeof Device, logger: Logger);
    retrieveContacts(client: User): Promise<ServerMessage>;
}
