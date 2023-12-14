import { Logger } from 'winston';
import { HandlerInput } from 'ask-sdk-core';
import { DevicesService } from './../devices/devices.service';
import { ServerMessage } from '../../../../classes/ServerMessage.class';
import { User } from '../../../../models/user.entity';
import { UserService } from '../../../public/user/user.service';
import { AuthService } from '../../../public/auth/auth.service';
export declare class AlexaResponseMsg {
    speechText: string;
    endSession: boolean;
    loginCard: boolean;
    constructor(speechText: string, endSession?: boolean, loginCard?: boolean);
}
export declare class AlexaSkillService {
    private readonly logger;
    private readonly devicesClientService;
    private readonly authService;
    private readonly usersService;
    private readonly userRepository;
    axios: any;
    constructor(logger: Logger, devicesClientService: DevicesService, authService: AuthService, usersService: UserService, userRepository: typeof User);
    validateUserByAlexaPassword(loginAttempt: {
        email: string;
        passwordAlexa: string;
        option: number;
        senHi: boolean;
        numberDevice: number;
    }): Promise<ServerMessage>;
    getAlexaUserDevicesList(email: string, senHi: boolean, isNew: boolean): Promise<AlexaResponseMsg>;
    getAlexaActualDeviceMeasure(email: string, numberDevice: number): Promise<AlexaResponseMsg>;
    sendNextMessage(handlerInput: HandlerInput, speechText: any, endSession?: boolean, loginCard?: boolean): import("ask-sdk-model").Response;
    getUserInfo(accessToken: any): Promise<ServerMessage>;
    getUserDevicesList(handlerInput: HandlerInput, email: string, senHi: boolean): Promise<any>;
    getActualGasMeasureIntent(handlerInput: HandlerInput, email: string, numberDevice: number): Promise<any>;
}
