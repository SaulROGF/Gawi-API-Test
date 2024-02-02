import { ServerMessage } from './../../../../classes/ServerMessage.class';
import { Organization } from './../../../../models/organization.entity';
import { User } from './../../../../models/user.entity';
import { Logger } from 'winston';
export declare class OrganizationDataService {
    private readonly organizationRepository;
    private readonly userRepository;
    private readonly logger;
    constructor(organizationRepository: typeof Organization, userRepository: typeof User, logger: Logger);
    getOrganizationData(user: User): Promise<ServerMessage>;
}
