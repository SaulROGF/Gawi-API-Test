import { Logger } from 'winston';
export declare class AppService {
    private readonly logger;
    constructor(logger: Logger);
    getHello(): string;
}
