import { ServerMessage } from './../../../classes/ServerMessage.class';
import { UserService } from './user.service';
export declare class UserController {
    private readonly userService;
    constructor(userService: UserService);
    createUser(body: any): Promise<ServerMessage>;
    changePasswordEndpoint(body: any): Promise<ServerMessage>;
}
