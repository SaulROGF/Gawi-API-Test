import { AuthGuard } from '@nestjs/passport';
import { RoleTechnicianGuard } from './../../../../middlewares/roles.guard';
import { ServerMessage } from './../../../../classes/ServerMessage.class';
import { DevicesService } from './devices.service';
import { Controller, Post, UseGuards, Body, Req, Get, Param } from '@nestjs/common';

@Controller('technician/devices')
export class DevicesController {
  constructor(private readonly devicesService: DevicesService) { }

  /**
   *
   */
  @Get('get-apn-catalog')
  @UseGuards(AuthGuard(), RoleTechnicianGuard)
  async getApnCatalog(): Promise<ServerMessage> {
    return await this.devicesService.getApnCatalog();
  }

  /**
   *
   */
  @Post('get-device-by-serial-number')
  @UseGuards(AuthGuard(), RoleTechnicianGuard)
  async getCheckDeviceExist(@Body() body, @Req() req: any): Promise<ServerMessage> {
    return await this.devicesService.getCheckDeviceExist(req.user, body);
  }

  /**
   *
   */
  @Get('get-water-device-settings/:idDevice')
  @UseGuards(AuthGuard(), RoleTechnicianGuard)
  async getWaterDeviceSettingsEndpoint(
    @Param('idDevice') idDevice: number,
    @Req() req: any,
  ): Promise<ServerMessage> {
    return await this.devicesService.getWaterDeviceSettings(req.user, idDevice);
  }

  /**
   *
   */
  @Post('update-device-water-settings-nfc')
  @UseGuards(AuthGuard(), RoleTechnicianGuard)
  async syncSettingsNewData(@Body() body, @Req() req: any): Promise<ServerMessage> {
    return await this.devicesService.syncWaterSettingsNewData(req.user, body , true);
  }

  /**
   *
   */
  @Post('update-device-water-settings-cloud')
  @UseGuards(AuthGuard(), RoleTechnicianGuard)
  async syncSettingsCloudNewData(@Body() body, @Req() req: any): Promise<ServerMessage> {
    return await this.devicesService.syncWaterSettingsNewData(req.user, body , false);
  }

  /**
   *
   */
  /* @Get('get-gas-device-settings/:idDevice')
  @UseGuards(AuthGuard(), RoleTechnicianGuard)
  async getGasDeviceSettingsEndpoint(
    @Param('idDevice') idDevice: number,
    @Req() req: any,
  ): Promise<ServerMessage> {
    return await this.devicesService.getGasDeviceSettings(req.user, idDevice);
  } */

  /**
   *
   */

  @Get('get-device-address-settings/:idDevice')
  @UseGuards(AuthGuard(), RoleTechnicianGuard)
  async getDeviceClientAddressSettings(
    @Param('idDevice') idDevice: any,
    @Req() req: any,
  ): Promise<ServerMessage> {
    return await this.devicesService.getDeviceTechnicianAddressSettings(req.user, idDevice);
  }

  /**
   *
   */
  @Post('update-device-address-settings')
  @UseGuards(AuthGuard(), RoleTechnicianGuard)
  async updateDeviceClientAddressSettings(
    @Body() body: any,
    @Req() req: any,
  ): Promise<ServerMessage> {
    return await this.devicesService.updateDeviceTechnicianAddressSettings(req.user, body);
  }

  /**
   *
   */
  @Post('update-device-on-off-settings-nfc')
  @UseGuards(AuthGuard(), RoleTechnicianGuard)
  async updateDeviceOnOffSettingsNFCEndpoint (
    @Body() body: any,
    @Req() req: any,
  ): Promise<ServerMessage> {
    return await this.devicesService.updateDeviceOnOffSettingsNFC(req.user, body);
  }
}
