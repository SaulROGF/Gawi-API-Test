import { AuthGuard } from '@nestjs/passport';
import { RoleClientGuard } from './../../../../middlewares/roles.guard';
import { ServerMessage } from './../../../../classes/ServerMessage.class';
import { DevicesService } from './devices.service';
import { Controller, Post, UseGuards, Body, Req, Get, Param } from '@nestjs/common';


@Controller('clients/devices-data')
export class DevicesController {
  constructor(private readonly devicesService: DevicesService) { }

  /**
   *
   */
  @Get('get-alerts')
  @UseGuards(AuthGuard(), RoleClientGuard)
  async getAlertsEndpoint(@Req() req: any): Promise<ServerMessage> {
    return await this.devicesService.getAlerts(req.user);
  }

  /**
   *
   */
  @Get('get-devices')
  @UseGuards(AuthGuard(), RoleClientGuard)
  async getTownsAndStates(@Req() req: any): Promise<ServerMessage> {
    return await this.devicesService.getDevices(req.user);
  }

  /**
   *
   */
  @Post('add-device')
  @UseGuards(AuthGuard(), RoleClientGuard)
  async updateTown(@Body() body: any, @Req() req: any): Promise<ServerMessage> {
    return await this.devicesService.addDevice(req.user, body);
  }

  /**
   *
   */
  @Get('get-device-natural-gas-data/:idDevice/:period')
  @UseGuards(AuthGuard(), RoleClientGuard)
  async getNaturalGasDeviceData(
    @Param('idDevice') idDevice: number,
    @Param('period') period: number,
    @Req() req: any,
  ): Promise<ServerMessage> {
    return await this.devicesService.getNaturalGasDeviceData(req.user, idDevice, period);
  }

  /**
   *
   */
  @Get('get-natural-gas-device-settings/:idDevice')
  @UseGuards(AuthGuard(), RoleClientGuard)
  async getNaturalGasDeviceSettings(
    @Param('idDevice') idDevice: number,
    @Req() req: any,
  ): Promise<ServerMessage> {
    return await this.devicesService.getNaturalGasDeviceSettings(req.user, idDevice);
  }

  /**
   *
   */
  @Post('update-device-natural-gas-month-max-consumption')
  @UseGuards(AuthGuard(), RoleClientGuard)
  async updateSettingsNaturalServiceMonthMaxConsumption(
    @Body() body: any,
    @Req() req: any,
  ): Promise<ServerMessage> {
    return await this.devicesService.updateSettingsNaturalServiceMonthMaxConsumption(req.user, body);
  }

  /**
   *
   */
  @Get('get-device-water-data/:idDevice/:period')
  @UseGuards(AuthGuard(), RoleClientGuard)
  async getDeviceWaterData(
    @Param('idDevice') idDevice: number,
    @Param('period') period: number,
    @Req() req: any,
  ): Promise<ServerMessage> {
    return await this.devicesService.getDeviceWaterData(req.user, idDevice, period);
  }

  /**
   * 
   */
  @Post('get-device-logger-data')
  @UseGuards(AuthGuard(),RoleClientGuard)
  getIndividualLoggerDeviceData( @Req() req: any,@Body() body : any ) : Promise<ServerMessage> {
      return this.devicesService.getIndividualLoggerDeviceData( body,req.user.idUser );
  } 

  /**
   * 
   */
  @Post('get-device-logger-from-to-data')
  @UseGuards(AuthGuard(),RoleClientGuard)
  getLoggerFromToDeviceData( @Req() req: any,@Body() body : any ) : Promise<ServerMessage> {
      return this.devicesService.getQueryHistoryFromTOLoggerDeviceData( body,req.user.idUser );
  } 

  /**
   *
   */
  @Get('get-logger-device-settings/:idDevice')
  @UseGuards(AuthGuard(), RoleClientGuard)
  async getLoggerDeviceSettingsEndpoint(
    @Param('idDevice') idDevice: number,
    @Req() req: any,
  ): Promise<ServerMessage> {
    return await this.devicesService.getLoggerDeviceSettingsEndpoint(req.user, idDevice);
  }

 
  /**
   *
   */
   @Post('update-device-gas-notification-repeat-time')
   @UseGuards(AuthGuard(), RoleClientGuard)
   async updateLoggerNotificationRepeatTime(
     @Body() body: any,
     @Req() req: any,
   ): Promise<ServerMessage> {
      return await this.devicesService.updateLoggerNotificationRepeatTime(req.user, body);
   }

  /**
   *
   */
  @Get('get-water-device-alerts/:idDevice/:period')
  @UseGuards(AuthGuard(), RoleClientGuard)
  async getWaterDeviceAlertsEndpoint(
    @Param('idDevice') idDevice: number,
    @Param('period') period: number,
    @Req() req: any,
  ): Promise<ServerMessage> {
    return await this.devicesService.getWaterDeviceAlerts(req.user, idDevice, period);
  }

  /**
   *
   */
  @Get('get-water-device-settings/:idDevice')
  @UseGuards(AuthGuard(), RoleClientGuard)
  async getWaterDeviceSettingsEndpoint(
    @Param('idDevice') idDevice: number,
    @Req() req: any,
  ): Promise<ServerMessage> {
    return await this.devicesService.getWaterDeviceSettings(req.user, idDevice);
  }

  /**
   *
   */
  @Post('update-device-name')
  @UseGuards(AuthGuard(), RoleClientGuard)
  async updateDeviceName(
    @Body() body: any,
    @Req() req: any
  ): Promise<ServerMessage> {
    return await this.devicesService.updateDeviceName(req.user, body);
  }

  /**
   *
   */
  @Get('get-gas-device-data/:idDevice/:period')
  @UseGuards(AuthGuard(), RoleClientGuard)
  async getGasDeviceDataEndpoint(
    @Param('idDevice') idDevice: number,
    @Param('period') period: number,
    @Req() req: any,
  ): Promise<ServerMessage> {
    return await this.devicesService.getGasDeviceData(req.user, idDevice, period);
  }

  /**
   *
   */
  @Get('get-gas-device-alerts/:idDevice/:period')
  @UseGuards(AuthGuard(), RoleClientGuard)
  async getGasDeviceAlertsEndpoint(
    @Param('idDevice') idDevice: number,
    @Param('period') period: number,
    @Req() req: any,
  ): Promise<ServerMessage> {
    return await this.devicesService.getGasDeviceAlerts(req.user, idDevice, period);
  }

  /**
   *
   */
  @Get('get-gas-device-settings/:idDevice')
  @UseGuards(AuthGuard(), RoleClientGuard)
  async getGasDeviceSettingsEndpoint(
    @Param('idDevice') idDevice: number,
    @Req() req: any,
  ): Promise<ServerMessage> {
    return await this.devicesService.getGasDeviceSettings(req.user, idDevice);
  }

  /**
   *
   */
  @Post('update-device-gas-interval')
  @UseGuards(AuthGuard(), RoleClientGuard)
  async updateSettingsGasInterval(
    @Body() body: any,
    @Req() req: any,
  ): Promise<ServerMessage> {
    return await this.devicesService.updateSettingsGasInterval(req.user, body);
  }

  /**
   *
   */
   @Post('update-device-gas-offset')
   @UseGuards(AuthGuard(), RoleClientGuard)
   async updateGasOffset(
     @Body() body: any,
     @Req() req: any,
   ): Promise<ServerMessage> {
      return await this.devicesService.updateGasOffset(req.user, body);
   }
 
  /**
   *
   */
   @Post('update-device-gas-offset-time')
   @UseGuards(AuthGuard(), RoleClientGuard)
   async updateGasOffsetTime(
     @Body() body: any,
     @Req() req: any,
   ): Promise<ServerMessage> {
      return await this.devicesService.updateGasOffsetTime(req.user, body);
   }

  /**
   *
   */
  @Post('update-device-gas-tank-capacity')
  @UseGuards(AuthGuard(), RoleClientGuard)
  async updateSettingsTankCapacity(
    @Body() body: any,
    @Req() req: any,
  ): Promise<ServerMessage> {
    return await this.devicesService.updateSettingsTankCapacity(req.user, body);
  }

  /**
   *
   */
  @Post('update-device-gas-min-filling-percentage')
  @UseGuards(AuthGuard(), RoleClientGuard)
  async updateSettingsGasMinFillingPercentage(
    @Body() body: any,
    @Req() req: any,
  ): Promise<ServerMessage> {
    return await this.devicesService.updateSettingsGasMinFillingPercentage(req.user, body);
  }

  /**
   *
   */
  @Post('update-device-gas-consumption-units-period')
  @UseGuards(AuthGuard(), RoleClientGuard)
  async updateConsumptionUnitsPeriod(
    @Body() body: any,
    @Req() req: any,
  ): Promise<ServerMessage> {
    return await this.devicesService.updateConsumptionUnitsPeriod(req.user, body);
  }

  /**
   *
   */
  @Post('update-device-gas-travel-mode')
  @UseGuards(AuthGuard(), RoleClientGuard)
  async updateTravelModeEndpoint(
    @Body() body: any,
    @Req() req: any,
  ): Promise<ServerMessage> {
    const ans = await this.devicesService.updateTravelMode(req.user, body);
    console.log(ans);
    return ans;
  }

  /**
   *
   */
  @Post('update-device-water-outage-day')
  @UseGuards(AuthGuard(), RoleClientGuard)
  async updateSettingsServiceOutageDay(
    @Body() body: any,
    @Req() req: any,
  ): Promise<ServerMessage> {
    return await this.devicesService.updateSettingsServiceOutageDay(req.user, body);
  }

  /**
   *
   */
  @Post('update-device-water-consumption-units')
  @UseGuards(AuthGuard(), RoleClientGuard)
  async updateSettingsWaterServiceConsumptionUnits(
    @Body() body: any,
    @Req() req: any,
  ): Promise<ServerMessage> {
    return await this.devicesService.updateSettingsWaterServiceConsumptionUnits(req.user, body);
  }

  /**
   *
   */
  @Post('update-device-water-spending-units')
  @UseGuards(AuthGuard(), RoleClientGuard)
  async updateSettingsWaterServiceSpendingUnits(
    @Body() body: any,
    @Req() req: any,
  ): Promise<ServerMessage> {
    return await this.devicesService.updateSettingsWaterServiceSpendingUnits(req.user, body);
  }

  /**
   *
   */
  @Post('update-device-water-storage-frequency')
  @UseGuards(AuthGuard(), RoleClientGuard)
  async updateSettingsWaterServiceStorageFrequency(
    @Body() body: any,
    @Req() req: any,
  ): Promise<ServerMessage> {
    return await this.devicesService.updateSettingsWaterServiceStorageFrequency(req.user, body);
  }

  /**
   *
   */
  @Post('update-device-water-daily-transmission')
  @UseGuards(AuthGuard(), RoleClientGuard)
  async updateSettingsWaterServiceDailyTransmission(
    @Body() body: any,
    @Req() req: any,
  ): Promise<ServerMessage> {
    return await this.devicesService.updateSettingsWaterServiceDailyTransmission(req.user, body);
  }

  /**
   *
   */
  @Post('update-device-water-custom-daily-time')
  @UseGuards(AuthGuard(), RoleClientGuard)
  async updateSettingsWaterServiceCustomDailyTime(
    @Body() body: any,
    @Req() req: any,
  ): Promise<ServerMessage> {
    return await this.devicesService.updateSettingsWaterServiceCustomDailyTime(req.user, body);
  }

  /**
   *
   */
  @Post('update-device-water-ip-protocol')
  @UseGuards(AuthGuard(), RoleClientGuard)
  async updateSettingsWaterServiceIpProtocol(
    @Body() body: any,
    @Req() req: any,
  ): Promise<ServerMessage> {
    return await this.devicesService.updateSettingsWaterServiceIpProtocol(req.user, body);
  }

  /**
   *
   */
  @Post('update-device-water-authentication-protocol')
  @UseGuards(AuthGuard(), RoleClientGuard)
  async updateSettingsWaterAuthenticationProtocol(
    @Body() body: any,
    @Req() req: any,
  ): Promise<ServerMessage> {
    return await this.devicesService.updateSettingsWaterAuthenticationProtocol(req.user, body);
  }

  /**
   *
   */
  @Post('update-device-water-description-label')
  @UseGuards(AuthGuard(), RoleClientGuard)
  async updateSettingsWaterServiceDescriptionLabel(
    @Body() body: any,
    @Req() req: any,
  ): Promise<ServerMessage> {
    return await this.devicesService.updateSettingsWaterServiceDescriptionLabel(req.user, body);
  }

  /**
   *
   */
  @Post('update-device-water-consumption-alert-type')
  @UseGuards(AuthGuard(), RoleClientGuard)
  async updateSettingsWaterConsumptionAlertType(
    @Body() body: any,
    @Req() req: any,
  ): Promise<ServerMessage> {
    return await this.devicesService.updateSettingsWaterConsumptionAlertType(req.user, body);
  }

  /**
   *
   */
  @Post('update-device-water-periodic-frequency')
  @UseGuards(AuthGuard(), RoleClientGuard)
  async updateSettingsWaterServicePeriodicFrequency(
    @Body() body: any,
    @Req() req: any,
  ): Promise<ServerMessage> {
    return await this.devicesService.updateSettingsWaterServicePeriodicFrequency(req.user, body);
  }

  /**
   *
   */
  @Post('update-device-water-drip-setpoint')
  @UseGuards(AuthGuard(), RoleClientGuard)
  async updateSettingsWaterServiceDripSetpoint(
    @Body() body: any,
    @Req() req: any,
  ): Promise<ServerMessage> {
    return await this.devicesService.updateSettingsWaterServiceDripSetpoint(req.user, body);
  }

  /**
   *
   */
  @Post('update-device-water-burst-setpoint')
  @UseGuards(AuthGuard(), RoleClientGuard)
  async updateSettingsWaterServiceBurstSetpoint(
    @Body() body: any,
    @Req() req: any,
  ): Promise<ServerMessage> {
    return await this.devicesService.updateSettingsWaterServiceBurstSetpoint(req.user, body);
  }

  /**
   *
   */
  @Post('update-device-water-flow-setpoint')
  @UseGuards(AuthGuard(), RoleClientGuard)
  async updateSettingsWaterServiceFlowSetpoint(
    @Body() body: any,
    @Req() req: any,
  ): Promise<ServerMessage> {
    return await this.devicesService.updateSettingsWaterServiceFlowSetpoint(req.user, body);
  }

  /**
   *
   */
  @Post('update-device-water-consumption-setpoint')
  @UseGuards(AuthGuard(), RoleClientGuard)
  async updateSettingsWaterServiceConsumptionSetpoint(
    @Body() body: any,
    @Req() req: any,
  ): Promise<ServerMessage> {
    return await this.devicesService.updateSettingsWaterServiceConsumptionSetpoint(req.user, body);
  }

  /**
   *
   */
  @Post('update-device-water-periodic-time')
  @UseGuards(AuthGuard(), RoleClientGuard)
  async updateSettingsWaterServicePeriodicTime(
    @Body() body: any,
    @Req() req: any,
  ): Promise<ServerMessage> {
    return await this.devicesService.updateSettingsWaterServicePeriodicTime(req.user, body);
  }

  /**
   *
   */
  @Post('update-device-water-daily-time')
  @UseGuards(AuthGuard(), RoleClientGuard)
  async updateSettingsWaterServiceDailyTime(
    @Body() body: any,
    @Req() req: any,
  ): Promise<ServerMessage> {
    return await this.devicesService.updateSettingsWaterServiceDailyTime(req.user, body);
  }

  /**
   *
   */
  @Post('update-device-water-storage-time')
  @UseGuards(AuthGuard(), RoleClientGuard)
  async updateSettingsWaterServiceStorageTime(
    @Body() body: any,
    @Req() req: any,
  ): Promise<ServerMessage> {
    return await this.devicesService.updateSettingsWaterServiceStorageTime(req.user, body);
  }

  /**
   *
   */
  @Post('update-device-water-month-max-consumption')
  @UseGuards(AuthGuard(), RoleClientGuard)
  async updateSettingsWaterServiceMonthMaxConsumption(
    @Body() body: any,
    @Req() req: any,
  ): Promise<ServerMessage> {
    return await this.devicesService.updateSettingsWaterServiceMonthMaxConsumption(req.user, body);
  }

  /**
   *
   */
  @Post('update-device-water-flags')
  @UseGuards(AuthGuard(), RoleClientGuard)
  async updateSettingsWaterServiceUpdateFlags(
    @Body() body: any,
    @Req() req: any,
  ): Promise<ServerMessage> {
    return await this.devicesService.updateSettingsWaterServiceUpdateFlags(req.user, body);
  }


  /**
   *
   */
  @Get('get-device-address-settings/:idDevice')
  @UseGuards(AuthGuard(), RoleClientGuard)
  async getDeviceClientAddressSettings(
    @Param('idDevice') idDevice: any,
    @Req() req: any,
  ): Promise<ServerMessage> {
    return await this.devicesService.getDeviceClientAddressSettings(req.user, idDevice);
  }

  /**
   *
   */
  @Post('update-device-address-settings')
  @UseGuards(AuthGuard(), RoleClientGuard)
  async updateDeviceClientAddressSettings(
    @Body() body: any,
    @Req() req: any,
  ): Promise<ServerMessage> {
    return await this.devicesService.updateDeviceClientAddressSettings(req.user, body);
  }

  /**
   *
   */
  @Post('detach-device')
  @UseGuards(AuthGuard(), RoleClientGuard)
  async detachDeviceEndpoint(
    @Req() req: any,
    @Body() body: any,
  ): Promise<ServerMessage> {
    return await this.devicesService.detachDevice(req.user, body);
  }
}
