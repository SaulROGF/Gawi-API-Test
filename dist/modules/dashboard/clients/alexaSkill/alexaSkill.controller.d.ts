import { ErrorHandler, RequestHandler } from "ask-sdk-core";
import { Request } from "express";
import { AlexaSkillService } from './alexaSkill.service';
import { Logger } from 'winston';
import { ServerMessage } from "../../../../classes/ServerMessage.class";
import { Response } from 'express';
export declare class AlexaSkillController {
    private readonly logger;
    private readonly alexaSkillService;
    axios: any;
    ErrorHandler: ErrorHandler;
    LaunchRequestHandler: RequestHandler;
    constructor(logger: Logger, alexaSkillService: AlexaSkillService);
    login(loginData: any): Promise<ServerMessage>;
    runSkill(req: Request, response: Response): Promise<Response<any>>;
    alexaSkill(req: Request, response: Response): Promise<Response<any>>;
}
