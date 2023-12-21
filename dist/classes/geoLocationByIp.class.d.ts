export declare class GeoLocationByIp {
    geoip: any;
    client: any;
    mbxClient: any;
    mbxService: any;
    mbxClientKey: string;
    constructor();
    getLocationByIp(ip: string): Promise<any>;
}
