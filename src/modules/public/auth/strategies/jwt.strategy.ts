import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from '../auth.service';
import { PassportStrategy } from '@nestjs/passport';
import {DevicesService} from '../../../dashboard/devices/devices/devices.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {

    constructor(
      private authService: AuthService,
      private devicesService: DevicesService,
    ){

        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: 'ingMultiKey'
        });

    }

    async validate(payload: any) {
	if (payload.serialNumber) {
	  const device = await this.devicesService.validateDeviceByJwt(payload);
	  if(!device){
	    throw new UnauthorizedException();
	  }
	  return device;
	}
	else if (payload.email) {
	  const user = await this.authService.validateUserByJwt(payload);
	  if(!user){
	      throw new UnauthorizedException();
	  }
	  return user;
	}


    }

}
