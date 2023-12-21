import { AuthService } from './auth.service';
import { LoginUserDto } from '../user/dto/loginUser.dto';
import { ServerMessage } from '../../../classes/ServerMessage.class';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    login(loginUserDto: LoginUserDto): Promise<ServerMessage>;
    storeNotificationsCredentialsEndpoint(credentials: any, req: any): Promise<ServerMessage>;
    disableNotificationsEndpoint(credentials: any): Promise<ServerMessage>;
    testAuthRoute(req: any): Promise<ServerMessage>;
}
