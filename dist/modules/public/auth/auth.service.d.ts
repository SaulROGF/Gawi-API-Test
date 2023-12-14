import { JwtService } from '@nestjs/jwt';
import { LoginUserDto } from '../user/dto/loginUser.dto';
import { UserService } from '../user/user.service';
import { JwtPayload } from './interfaces/jwtPayload.interface';
import { User } from '../../../models/user.entity';
import { ServerMessage } from '../../../classes/ServerMessage.class';
import { Organization } from '../../../models/organization.entity';
import { Notifications } from '../../../models/notifications.entity';
import { Logger } from 'winston';
export declare class AuthService {
    private usersService;
    private jwtService;
    private readonly logger;
    private readonly organizationRepository;
    private readonly notificationRepository;
    constructor(usersService: UserService, jwtService: JwtService, logger: Logger, organizationRepository: typeof Organization, notificationRepository: typeof Notifications);
    disableNotifications(credentials: any): Promise<ServerMessage>;
    storeNotificationCredentials(credentials: any, idUser: any): Promise<ServerMessage>;
    validateUserByPassword(loginAttempt: LoginUserDto): Promise<ServerMessage>;
    validateUserByJwt(payload: JwtPayload): Promise<any>;
    createJwtPayload(email: any): {
        expiresIn: number;
        token: string;
    };
    generateUserData(userToAttempt: User): Promise<{
        idUser: number;
        idRole: number;
        idOrganization: number;
        idTown: number;
        email: string;
        phone: string;
        firstName: string;
        lastName: string;
        mothersLastName: string;
        lastLoginDate: Date;
        createdAt: Date;
        updatedAt: Date;
        town: import("../../../models/town.entity").Town;
        haveLogo: boolean;
        logoUrl: string;
    }>;
    checkNullUndefined(varTest: any): boolean;
}
