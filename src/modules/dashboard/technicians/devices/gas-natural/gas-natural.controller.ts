import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { GasNaturalService } from './gas-natural.service';
import { ServerMessage } from 'src/classes/ServerMessage.class';
import { AuthGuard } from '@nestjs/passport';
import { RoleTechnicianGuard } from 'src/middlewares/roles.guard';
import { UpdateNaturalGasSettingsDto } from 'src/modules/dashboard/devices/devices/classes/naturalGasSettings.dto';

@Controller('technician/gas-natural')
export class GasNaturalController {
  constructor(private readonly gasNaturalService: GasNaturalService) {}

  /**
   * Controlador para visualizar el historial de un dispositivo de gas natural.
   *
   * @returns {Promise<ServerMessage>} Retorna una promesa que se resuelve con un mensaje del servidor. El mensaje del servidor indica si la operación fue exitosa o si ocurrió un error.
   * @param {number} idDevice - El id del dispositivo del cual se desean obtener las configuraciones.
   * @access Protegido. Requiere autenticación y rol de técnico.
   * La función delega la operación de actualización al servicio `gasNaturalService`, pasando el usuario autenticado y los ajustes proporcionados.
   * @throws {Error} Captura cualquier error que ocurra durante el proceso de actualización y lo retorna encapsulado en un `ServerMessage`.
   */
  @Get('natural-gas-history/:idDevice')
  @UseGuards(AuthGuard(), RoleTechnicianGuard)
  async getGasDeviceSettingsEndpoint(@Param('idDevice') idDevice: number): Promise<ServerMessage> {
    return await this.gasNaturalService.getGasHistory(idDevice);
  }

  /**
   * Controlador para visualizar la configuracion de un dispositivo de gas natural.
   *
   * @returns {Promise<ServerMessage>} Retorna una promesa que se resuelve con un mensaje del servidor. El mensaje del servidor indica si la operación fue exitosa o si ocurrió un error.
   * @param {number} idDevice - El id del dispositivo del cual se desean obtener las configuraciones.
   * @access Protegido. Requiere autenticación y rol de técnico.
   * La función delega la operación de actualización al servicio `gasNaturalService`, pasando el usuario autenticado y los ajustes proporcionados.
   * @throws {Error} Captura cualquier error que ocurra durante el proceso de actualización y lo retorna encapsulado en un `ServerMessage`.
   */
  @Get('natural-gas-settings/:idDevice')
  @UseGuards(AuthGuard(), RoleTechnicianGuard)
  async getGasSettingsEndpoint( @Param('idDevice') idDevice: number): Promise<ServerMessage> {
    return await this.gasNaturalService.getGasSettings(idDevice);
  }

  /**
   * Controlador para actualizar las configuraciones de un dispositivo de gas natural.
   *
   * @param {UpdateNaturalGasSettingsDto} settings - Objeto DTO que contiene los nuevos valores de configuración, incluyendo el id del dispositivo y el nuevo día de corte del servicio.
   * @param {any} req - El objeto de solicitud de Express, que se utiliza para acceder al usuario autenticado a través de `req.user`.
   * @returns {Promise<ServerMessage>} Retorna una promesa que se resuelve con un mensaje del servidor. El mensaje del servidor indica si la operación fue exitosa o si ocurrió un error.
   * @access Protegido. Requiere autenticación y rol de técnico.
   * La función delega la operación de actualización al servicio `gasNaturalService`, pasando el usuario autenticado y los ajustes proporcionados.
   * Utiliza `@Body(new ValidationPipe())` para validar automáticamente los datos entrantes según las reglas definidas en `UpdateNaturalGasSettingsDto`.
   * @throws {Error} Captura cualquier error que ocurra durante el proceso de actualización y lo retorna encapsulado en un `ServerMessage`.
   */
  @Post('update-natural-gas-settings')
  @UseGuards(AuthGuard(), RoleTechnicianGuard)
  async updateSettingsServiceOutageDay(
    @Body(new ValidationPipe()) settings: UpdateNaturalGasSettingsDto,
    @Req() req: any,
  ): Promise<ServerMessage> {
    return await this.gasNaturalService.updateSettings(req.user, settings);
  }
}
