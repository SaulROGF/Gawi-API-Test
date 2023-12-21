import { AuthService } from '../auth.service';
import { DevicesService } from '../../../dashboard/devices/devices/devices.service';
declare const JwtStrategy_base: new (...args: any[]) => any;
export declare class JwtStrategy extends JwtStrategy_base {
    private authService;
    private devicesService;
    constructor(authService: AuthService, devicesService: DevicesService);
    validate(payload: any): Promise<any>;
}
export {};
