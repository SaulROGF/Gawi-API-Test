import {
  Controller,
  Get,
  Post,
  Res,
  Request,
  UseGuards,
  Body,
  Param,
  Inject,
  Response,
} from '@nestjs/common';
import {
  RoleDeviceGuard,
  RoleWaterDeviceGuard,
} from './../../../../middlewares/roles.guard';
import { DevicesService } from './devices.service';
import { AuthGuard } from '@nestjs/passport';
import { ServerMessage } from '../../../../classes/ServerMessage.class';
import { WaterHistoryDto } from './classes/waterHistory.dto';
import { JwtService } from '@nestjs/jwt';
import { Logger } from 'winston';
import { stringify } from 'querystring';

@Controller('devs')
export class DevicesController {
  constructor(
    private readonly devicesService: DevicesService,
    private jwtService: JwtService,
    @Inject('winston') private readonly logger: Logger
  ) {}


  /**
   * Almacenar historial de transmision del medidor de gas natural
   * @param body historial de transmision
   * @returns confirmación de recepción del historial
   */
  @Post('ng-save')
  async saveGasMeasuresEndpoint(@Body() body: any, ): Promise<any> {
    
    return this.devicesService.saveGasMeasures(body);
  }

  /**
   * Login para los dispositivos de agua y gas
   * @param body credenciales para hacer el login
   * @returns token generado para el dispositivo
   */
  @Post('login/')
  async loginEndpoint(@Body() body: any, @Request() req,): Promise<any> {
    const logData = {
      method: req.method,
      url: req.url,
      headers: req.headers,
      body: req.body
    };
    this.logger.info(JSON.stringify(logData));
    const result = await this.devicesService.login(body);
    this.logger.info(`Response: ${JSON.stringify(result)}`);
    return result;
    
  }

  /**
   * Almacenar historial de transmision del dispositivo
   * @param idDevice id del dispositivo
   * @param body historial de transmision
   * @returns confirmación de recepción del historial
   */
  @Post('wd-save')
  async saveWaterDeviceDataEndpoint(@Body() body: any, @Request() req): Promise<any> {
    const logData = {
      method: req.method,
      url: req.url,
      headers: req.headers,
      body: req.body
    };
    this.logger.info(JSON.stringify(logData));
    const result = await this.devicesService.saveWaterDeviceData(body);
    this.logger.info(`Response: ${JSON.stringify(result)}`);
    return result;

  }

  /**
   * marcar settings como aplicados
   * @param idDevice id del dispositivo
   * @returns confirmación de la aplicación de settings
   */
  @Post('wd-mark')
  async markWaterDeviceSettingsAsAppliedEndpoint(
    @Body() body: any,
  ): Promise<any> {
    return this.devicesService.markWaterDeviceSettingsAsApplied(body);
  }

  /**
   * marcar settings del dispositivo como aplicados
   * @param serialNumber numero de serie del dispositivo
   * @returns confirmación de la aplicación de settings
   */
  @Get('gd-mark/A=:A')
  async markGasSettingsAsAppliedEndpoint(
    @Param('A') serialNumber: string,
  ): Promise<any> {
    return await this.devicesService.markGasSettingsAsApplied(serialNumber);
  }

  /**
   * almacenar historial de transmision del dispositivo de gas
   * @param deviceDate fecha proveniente del dispositivo
   * @param deviceTime tiempo proveniente del dispositivo
   * @param imei imei del dispositivo
   * @param serialNumber numero e serie del dispositivo
   * @param measure medicion de porcentaje de gas contenido
   * @param consumption consumo calculado
   * @param meanConsumption consumo promedio
   * @param alerts set de alertas generadas
   * @param bateryLevel nivel de bateria
   * @param temperature temperatura medida en el dispositivo
   * @param signalQuality calidad de la señal de transmision
   * @returns confirmación de recepción del historial
   */
  @Get('gd-save/A=:A&B=:B&C=:C&D=:D&E=:E&F=:F&G=:G&H=:H&I=:I&J=:J&K=:K')
  async saveGasDeviceDataEndpoint(
    @Param('A') deviceDate: string,
    @Param('B') deviceTime: string,
    @Param('C') imei: string,
    @Param('D') serialNumber: string,
    @Param('E') measure: string,
    @Param('F') consumption: string,
    @Param('G') meanConsumption: string,
    @Param('H') alerts: string,
    @Param('I') bateryLevel: string,
    @Param('J') temperature: string,
    @Param('K') signalQuality: string,
  ): Promise<any> {
    return await this.devicesService.saveGasDeviceData(
      deviceDate,
      deviceTime,
      imei,
      serialNumber,
      measure,
      consumption,
      meanConsumption,
      alerts,
      bateryLevel,
      temperature,
      signalQuality,
    );
  }

  /**
   * almacenar historial de transmision del dispositivo de gas
   * @param body historial de transmision
   * @returns confirmación de recepción del historial
   */
  @Post('gd-save')
  async postSaveGasDeviceDataEndpoint(
    @Body() body: any,
  ): Promise<any> {
    return await this.devicesService.saveGasDeviceData(
      body.A,
      body.B,
      body.C,
      body.D,
      body.E,
      body.F,
      body.G,
      body.H,
      body.I,
      body.J,
      body.K,
    );
  }

  /**
   * Almacenar historial de transmision del dispositivo
   * @param body historial de transmision
   * @returns confirmación de recepción del historial
   */
  @Post('dl-save')
  async saveDataloggerMeasuresEndpoint(@Body() body: any): Promise<any> {
    return this.devicesService.saveDataloggerMeasures(body);
  }

  @Get('serve-by-FTP/:idOrganization')
  async serveByFTPEndpoint(
    @Param('idOrganization') idOrganization: number,
  ): Promise<ServerMessage> {
    return await this.devicesService.serverByFTP(idOrganization);
  }
}
