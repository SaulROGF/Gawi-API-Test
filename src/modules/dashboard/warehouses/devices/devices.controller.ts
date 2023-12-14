import { DevicesService } from './devices.service';
import { Controller, Post, UseGuards, Body,Request ,Get} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RoleWarehouseGuard } from '../../../../middlewares/roles.guard';
import { ServerMessage } from '../../../../classes/ServerMessage.class';

@Controller('wharehouse-devices-admin')
export class DevicesController {

    constructor(private readonly devicesService: DevicesService) { }

    @Get('get-home-data')
    @UseGuards(AuthGuard(), RoleWarehouseGuard,)
    loadHomeDataWarehouse(@Request() req/* ,@Body() body */) : Promise<ServerMessage> {
        return this.devicesService.loadHomeDataWarehouse(req.user);
    }

   @Get('get-apn-list')
   @UseGuards(AuthGuard(), RoleWarehouseGuard)
   async getApnList() : Promise<ServerMessage> {
     return await this.devicesService.getApnList( );
   }

    @Post('create-device')
    @UseGuards(AuthGuard(),RoleWarehouseGuard,)
    createWaterDevice(@Request() req,@Body() body) : Promise<ServerMessage> {
        return this.devicesService.createDevice(req.user,body);
    }

    @Post('create-multiple-devices')
    @UseGuards(AuthGuard(),RoleWarehouseGuard,)
    createMultipleDevices(@Request() req,@Body() body) : Promise<ServerMessage> {
        return this.devicesService.createMultipleDevices(req.user,body);
    }

    @Post('check-already-device')
    @UseGuards(AuthGuard(),RoleWarehouseGuard,)
    checkAlreadyDevice(@Body() body) : Promise<ServerMessage> {
        return this.devicesService.checkAlreadyDevice(body);
    }
}
