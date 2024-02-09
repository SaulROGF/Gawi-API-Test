import { Inject, Injectable } from '@nestjs/common';
import { ServerMessage } from 'src/classes/ServerMessage.class';
import { NaturalGasHistory } from 'src/models/naturalGasHistory.entity';
import { NaturalGasSettings } from 'src/models/naturalGasSettings.entity';
import { User } from 'src/models/user.entity';
import {
  UpdateNaturalGasSettingsDto,
  changes,
} from 'src/modules/dashboard/devices/devices/classes/naturalGasSettings.dto';
@Injectable()
export class GasNaturalService {
  constructor(
    @Inject('NaturalGasHistoryRepository')
    private readonly naturalGasHistoryRepository: typeof NaturalGasHistory,
    @Inject('NaturalGasSettingsRepository')
    private readonly naturalGasSettingsRepository: typeof NaturalGasSettings,
  ) {}

  /**
   * Consulta el historial de un dispositivo de gas natural.
   *
   * @returns {Promise<ServerMessage>} Retorna un mensaje del servidor indicando el resultado de la operación.
   * @param {number} idDevice - El id del dispositivo del cual se desean obtener el historial.
   * @async
   * La función busca en la base de datos el historial de un dispositivo de gas natural, ordenado por fecha de creación en orden descendente.
   * @throws {Error} Captura cualquier error que ocurra durante el proceso y lo retorna encapsulado en un `ServerMessage`.
   */
  async getGasHistory(idDevice: number): Promise<ServerMessage> {
    try {
      const historial = await this.naturalGasHistoryRepository.findAll({
        order: [['createdAt', 'DESC']],
        where: {
          idDevice: idDevice,
        },
      });
      return new ServerMessage(false, 'Historial obtenido con éxito', {
        history: historial,
      });
    } catch (err) {
      return new ServerMessage(true, 'Error al obtener el historial', {
        error: err,
      });
    }
  }

  /**
   * Consulta las configuraciones de un dispositivo de gas natural.
   *
   * @returns {Promise<ServerMessage>} Retorna un mensaje del servidor indicando el resultado de la operación.
   * @param {number} idDevice - El id del dispositivo del cual se desean obtener las configuraciones.
   * @async
   * La función busca en la base de datos la configuracion de un dispositivo de gas natural.
   * @throws {Error} Captura cualquier error que ocurra durante el proceso y lo retorna encapsulado en un `ServerMessage`.
   */
  async getGasSettings(idDevice: number): Promise<ServerMessage> {
    
    try {
      const settings = await this.naturalGasSettingsRepository.findOne<
        NaturalGasSettings
      >({
        where: {
          idDevice: idDevice,
        },
      });
      return new ServerMessage(false, 'Configuraciones obtenidas con éxito', {
        settings,
      });
    } catch (err) {
      return new ServerMessage(true, 'Error al obtener las configuraciones', {
        error: err,
      });
    }
  }

  /*
  firmwareVersion
  serviceOutageDay
  monthMaxConsumption
  apiUrl
  consumptionUnits
  storageFrequency
  storageTime
  dailyTime
  customDailyTime
  periodicFrequency
  periodicTime
  ipProtocol
  auth
  label
  consumptionAlertType
  consumptionAlertSetPoint
  consumptionExcessFlag
  lowBatteryFlag
  sensorFlag
  darkSetPoint
  darkFlag
  lightSetPoint
  lightFlag
  isOn
  
  */

  /**
   * Actualiza la configuración para un dispositivo de gas natural específico.
   *
   * @param {User} client - El usuario que realiza la petición de actualización.
   * @param {UpdateNaturalGasSettingsDto} settings - Objeto que contiene los nuevos valores de configuración.
   * @returns {Promise<ServerMessage>} Retorna un mensaje del servidor indicando el resultado de la operación.
   * @async
   *
   * La función primero verifica si el objeto `client` es nulo o indefinido, retornando un mensaje de error si este es el caso.
   * Luego, busca la última configuración guardada para el dispositivo especificado en `settings.idDevice`.
   * Si no encuentra configuraciones previas para el dispositivo, retorna un mensaje indicando que el dispositivo no está disponible.
   * Si existe una configuración previa, compara cada campo de `settings` con los valores actuales.
   * Si un campo ha cambiado y está incluido en una lista predefinida de campos que pueden cambiar (`changes`), calcula el nuevo estado multibit del dispositivo y actualiza el campo correspondiente.
   * Finalmente, guarda las modificaciones en la base de datos y retorna un mensaje de éxito. En caso de error, captura la excepción y retorna un mensaje de error.
   *
   * @throws {Error} Captura cualquier error que ocurra durante el proceso y lo retorna encapsulado en un `ServerMessage`.
   */

  async updateSettings(
    client: User,
    settings: UpdateNaturalGasSettingsDto,
  ): Promise<ServerMessage> {
    try {
      if (client == null || client == undefined) {
        return new ServerMessage(true, 'Petición incompleta', {});
      }

      const lastSettings: NaturalGasSettings = await this.naturalGasSettingsRepository.findOne<
        NaturalGasSettings
      >({
        where: {
          idDevice: settings.idDevice,
        },
      });

      if (!lastSettings) {
        return new ServerMessage(true, 'EL dispositivo no esta disponible', {});
      }
      
      for (const key in settings) {
        if (settings[key] !== lastSettings[key]) {
          if (changes.includes(key)) {
            const newStatus = lastSettings.calculateNewMultiStatus(
              lastSettings.status,
              lastSettings.calcularBit(key),
              true,
            );
            lastSettings.status = newStatus;
            lastSettings.wereApplied = true;
          }
          lastSettings[key] = settings[key];
        }
      }
      await lastSettings.save();

      return new ServerMessage(
        false,
        'Configuraciones actualizadas con exito.',
        {},
      );
    } catch (error) {
      // this.logger.error(error);
      return new ServerMessage(true, 'Ha ocurrido un error', error);
    }
  }
}
