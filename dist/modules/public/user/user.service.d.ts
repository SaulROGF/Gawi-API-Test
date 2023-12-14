import { ServerMessage } from './../../../classes/ServerMessage.class';
import { User } from './../../../models/user.entity';
import { ConektaService } from './../../global/conekta-service/conekta-service.service';
export declare class UserService {
    private conektaService;
    private readonly userRepository;
    constructor(conektaService: ConektaService, userRepository: typeof User);
    getAllUsers(): Promise<User[]>;
    findOneByEmailActiveNotDeleted(useremail: string): Promise<User>;
    createUser(newUserData: User): Promise<ServerMessage>;
    changePassword(body: any): Promise<ServerMessage>;
}
