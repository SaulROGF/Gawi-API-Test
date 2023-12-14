import { Town } from './../../../models/town.entity';
export declare class GeoLocationService {
    private readonly townRepository;
    constructor(townRepository: typeof Town);
    getLocationByIp(ip: string): Promise<any>;
}
