import { ServerMessage } from './../../../classes/ServerMessage.class';
import { LogoImagesUploadsService } from './logo-images-uploads.service';
export declare class LogoImagesUploadsController {
    private readonly logoImagesUploadsService;
    constructor(logoImagesUploadsService: LogoImagesUploadsService);
    addLogoImageFileUpload(images: any, req: any): Promise<ServerMessage>;
    serveLogoOrganizationImage(idOrganization: String, res: any): Promise<any>;
}
