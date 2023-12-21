import { ServerMessage } from './../../../classes/ServerMessage.class';
import { User } from './../../../models/user.entity';
import { EmailsService } from './../../../modules/global/emails/emails.service';
import { GeoLocationService } from './../../../modules/global/geo-location/geo-location.service';
import { AuthService } from '../auth/auth.service';
import { ConektaService } from '../../global/conekta-service/conekta-service.service';
import { JwtService } from '@nestjs/jwt';
export declare class PublicService {
    private jwtService;
    private readonly authService;
    private readonly emailsService;
    private readonly geoLocationService;
    private readonly conektaService;
    private readonly userRepository;
    constructor(jwtService: JwtService, authService: AuthService, emailsService: EmailsService, geoLocationService: GeoLocationService, conektaService: ConektaService, userRepository: typeof User);
    generateRecoveryEmail(body: any): Promise<ServerMessage>;
    resetPassword(bodyForRecoverEmail: any): Promise<ServerMessage>;
    generatePassword(length: number): string;
    createClient(newClientData: User, ip: string): Promise<ServerMessage>;
}
