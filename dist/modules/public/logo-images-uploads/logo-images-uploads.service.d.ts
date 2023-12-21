import { ServerMessage } from '../../../classes/ServerMessage.class';
import { Organization } from '../../../models/organization.entity';
export declare class LogoImagesUploadsService {
    private readonly organizationRepository;
    constructor(organizationRepository: typeof Organization);
    downloadLogoFromOrganization(idOrganization: string): Promise<ServerMessage>;
    compressImageLogoFile(logoFileName: string): Promise<ServerMessage>;
    deleteBannerById(idAdsBanner: string): Promise<any>;
}
