import { Injectable, Inject } from '@nestjs/common';
import { Town } from './../../../../models/town.entity';
import { User } from '../../../../models/user.entity';
import { ServerMessage } from '../../../../classes/ServerMessage.class';
import { State } from './../../../../models/state.entity';
import { Device } from '../../../../models/device.entity';
import { Organization } from '../../../../models/organization.entity';
import { GasHistory } from '../../../../models/gasHistory.entity';
import { WaterHistory } from '../../../../models/waterHistory.entity';
import { WaterSettings } from '../../../../models/waterSettings.entity';
import { GasSettings } from '../../../../models/gasSettings.entity';
import { Op } from 'sequelize';
import { Apn } from '../../../../models/apn.entity';
import { Logger } from 'winston';

@Injectable()
export class DevicesService {
  constructor(
    @Inject('DeviceRepository')
    private readonly deviceRepository: typeof Device,
    @Inject('WaterHistoryRepository')
    private readonly waterHistoryRepository: typeof WaterHistory,
    @Inject('GasHistoryRepository')
    private readonly gasHistoryRepository: typeof GasHistory,
    @Inject('WaterSettingsRepository')
    private readonly waterSettingsRepository: typeof WaterSettings,
    @Inject('GasSettingsRepository')
    private readonly gasSettingsRepository: typeof GasSettings,
    @Inject('UserRepository') private readonly userRepository: typeof User,
    @Inject('StateRepository') private readonly stateRepository: typeof State,
    @Inject('TownRepository') private readonly townRepository: typeof Town,
    @Inject('ApnRepository') private readonly apnRepository: typeof Apn,
    @Inject('winston') private readonly logger: Logger,
  ) {
    // this.generateDummyData4gasHistories(2);
  }

  /**
   *
   */
  async getApnCatalog(): Promise<ServerMessage> {
    try {
      let apnCatalog: Apn[] = await this.apnRepository.findAll({});

      return new ServerMessage(false, 'Catalogo de apns obtenido con éxito', {
        apnCatalog: apnCatalog,
      });
    } catch (error) {
      return new ServerMessage(true, 'Ha ocurrido un error', error);
    }
  }
  /**
   *
   */
  async getCheckDeviceExist(
    technician: User,
    body: { serialNumber: string; type: string },
  ): Promise<ServerMessage> {
    try {
      if (
        technician == null ||
        technician == undefined ||
        body.serialNumber == null ||
        body.serialNumber == undefined ||
        body.type == null ||
        body.type == undefined
      ) {
        return new ServerMessage(true, 'Petición incompleta', {});
      }

      //check if the device belongs to the main organization
      let deviceData: Device = await this.deviceRepository.findOne({
        where: {
          serialNumber: body.serialNumber,
          idOrganization: technician.idOrganization,
          type: parseInt(body.type),
        },
      });

      if (!deviceData) {
        return new ServerMessage(true, 'Dispositivo no disponible', {
          serialNumber: body.serialNumber,
          idOrganization: technician.idOrganization,
          type: parseInt(body.type),
        });
      }
      // return data
      return new ServerMessage(false, 'Dispositivo obtenido con éxito', {
        idDevice: deviceData.idDevice,
      });
    } catch (error) {
      this.logger.error(error);
      return new ServerMessage(true, 'Ha ocurrido un error', error);
    }
  }

  /**
   *
   */
  async getWaterDeviceSettings(
    technician: User,
    idDevice: any,
  ): Promise<ServerMessage> {
    try {
      if (
        technician == null ||
        technician == undefined ||
        idDevice == null ||
        idDevice == undefined
      ) {
        return new ServerMessage(true, 'Petición incompleta', {});
      }

      let waterSettings: WaterSettings = await this.waterSettingsRepository.findOne<
        WaterSettings
      >({
        where: {
          idDevice: idDevice,
        },
        include: [
          {
            attributes: { exclude: ['imei'] },
            model: Device,
            as: 'device',
            where: {
              //idDevice : idDevice,
              idOrganization: technician.idOrganization,
              type: 1,
            },
          },
        ],
      });

      if (!waterSettings) {
        return new ServerMessage(true, 'Dispositivo no disponible', {});
      }

      //check if the device belongs to the main organization
      let deviceData: Device = await this.deviceRepository.findOne({
        attributes: { exclude: ['imei'] },
        where: {
          idDevice: idDevice,
          idOrganization: technician.idOrganization,
          type: 1,
        },
        include: [
          {
            model: Apn,
            as: 'apn',
          },
          {
            model: Organization,
            as: 'organization',
            required: true,
            include: [
              {
                model: User,
                as: 'users',
                required: true,
                where: {
                  idRole: 1,
                },
                limit: 1,
              },
            ],
          },
          {
            model: Town,
            as: 'town',
            include: [
              {
                model: State,
                as: 'state',
              },
            ],
          },
        ],
      });

      //Get states catalog
      /* let states: State[] = await this.stateRepository.findAll<State>({
                include: [
                    {
                        model: Town,
                        as: 'towns',
                    },
                ],
            }); */

      // return data
      return new ServerMessage(
        false,
        'Ajustes del dispositivo obtenidos con éxito',
        {
          belongsToMain:
            deviceData.organization.users.length == 0 ? false : true,
          waterSettings: waterSettings,

          //states: states,
          actualTown: deviceData.town,
          actualApn: deviceData.apn,
        },
      );
    } catch (error) {
      this.logger.error(error);
      return new ServerMessage(true, 'Ha ocurrido un error', error);
    }
  }
  /**
   *
   */
  async syncWaterSettingsNewData(
    technician: User,
    body: {
      idApn: number;
      newWatterSettings: WaterSettings;
      type: number;
      serialNumber: string;
    },
    isNfc: boolean,
  ): Promise<ServerMessage> {
    try {
      if (
        technician == null ||
        technician == undefined ||
        body.idApn == null ||
        body.idApn == undefined ||
        body.newWatterSettings == null ||
        body.newWatterSettings == undefined ||
        body.type == null ||
        body.type == undefined ||
        body.serialNumber == null ||
        body.serialNumber == undefined ||
        isNfc == null ||
        isNfc == undefined
      ) {
        return new ServerMessage(true, 'Petición incompleta', {});
      }

      //check if the device belongs to the main organization
      let deviceData: Device = await this.deviceRepository.findOne({
        where: {
          serialNumber: body.serialNumber,
          idOrganization: technician.idOrganization,
          type: body.type,
        },
        include: [
          {
            model: WaterSettings,
            as: 'waterSettings',
          },
          {
            model: GasSettings,
            as: 'gasSettings',
          },
        ],
      });

      if (!deviceData) {
        return new ServerMessage(true, 'Dispositivo no disponible', {});
      }

      if (body.type == 0) {
        // Gas
      } else if (
        body.type == 1 &&
        body.newWatterSettings != null &&
        body.newWatterSettings != undefined
      ) {
        // Agua
        deviceData.idApn = body.idApn;
        deviceData.firmwareVersion = body.newWatterSettings.firmwareVersion;
        await deviceData.save();

        deviceData.waterSettings.firmwareVersion =
          body.newWatterSettings.firmwareVersion;
        deviceData.waterSettings.consumptionUnits =
          body.newWatterSettings.consumptionUnits;
        deviceData.waterSettings.flowUnits = body.newWatterSettings.flowUnits;
        deviceData.waterSettings.storageFrequency =
          body.newWatterSettings.storageFrequency;
        deviceData.waterSettings.storageTime =
          body.newWatterSettings.storageTime;
        deviceData.waterSettings.dailyTime = body.newWatterSettings.dailyTime;
        deviceData.waterSettings.dailyTransmission =
          body.newWatterSettings.dailyTransmission;
        deviceData.waterSettings.periodicFrequency =
          body.newWatterSettings.periodicFrequency;
        deviceData.waterSettings.periodicTime =
          body.newWatterSettings.periodicTime;
        deviceData.waterSettings.customDailyTime =
          body.newWatterSettings.customDailyTime;
        deviceData.waterSettings.burstSetpoint =
          body.newWatterSettings.burstSetpoint;
        deviceData.waterSettings.dripSetpoint =
          body.newWatterSettings.dripSetpoint;
        deviceData.waterSettings.flowSetpoint =
          body.newWatterSettings.flowSetpoint;
        deviceData.waterSettings.consumptionSetpoint =
          body.newWatterSettings.consumptionSetpoint;
        deviceData.waterSettings.consumptionAlertType =
          body.newWatterSettings.consumptionAlertType;
        deviceData.waterSettings.ipProtocol = body.newWatterSettings.ipProtocol;
        deviceData.waterSettings.auth = body.newWatterSettings.auth;
        deviceData.waterSettings.apiUrl = body.newWatterSettings.apiUrl;
        deviceData.waterSettings.label = body.newWatterSettings.label;

        if (isNfc == true) {
          deviceData.waterSettings.wereApplied = true;
        }
        await deviceData.waterSettings.save();

        if (isNfc == true) {
          return new ServerMessage(
            false,
            'Ajustes sincronizados con éxito',
            {},
          );
        } else {
          return new ServerMessage(false, 'Ajustes guardados con éxito', {});
        }
      } else {
        return new ServerMessage(true, 'Ajustes inválidos', {});
      }
    } catch (error) {
      this.logger.error(error);
      return new ServerMessage(true, 'Ha ocurrido un error', error);
    }
  }

  /**
   *
   */
  async getDeviceTechnicianAddressSettings(
    technician: User,
    idDevice: any,
  ): Promise<ServerMessage> {
    try {
      if (
        technician == null ||
        technician == undefined ||
        idDevice == null ||
        idDevice == undefined
      ) {
        return new ServerMessage(true, 'Petición incompleta', {});
      }

      //check if the device belongs to the main organization
      let deviceData: Device = await this.deviceRepository.findOne({
        attributes: { exclude: ['imei'] },
        where: {
          idDevice: idDevice,
          idOrganization: technician.idOrganization,
          //type: 1,
        },
        include: [
          {
            model: User,
            as: 'user',
          },
          {
            model: Organization,
            as: 'organization',
            include: [
              {
                model: User,
                as: 'users',
                where: {
                  idRole: 1,
                },
                limit: 1,
              },
            ],
          },
          {
            model: Town,
            as: 'town',
            include: [
              {
                model: State,
                as: 'state',
              },
            ],
          },
        ],
      });

      if (!deviceData) {
        return new ServerMessage(true, 'Dispositivo no disponible', {});
      }

      //Get states catalog
      let states: State[] = await this.stateRepository.findAll<State>({
        include: [
          {
            model: Town,
            as: 'towns',
          },
        ],
      });

      // return data
      return new ServerMessage(
        false,
        'Direccion del dispositivo obtenida con éxito',
        {
          belongsToMain:
            deviceData.organization.users.length == 0 ? false : true,
          deviceData: deviceData,

          states: states,
          actualTown: deviceData.town,
        },
      );
    } catch (error) {
      this.logger.error(error);
      return new ServerMessage(true, 'Ha ocurrido un error', error);
    }
  }

  /**
   *
   */
  async updateDeviceTechnicianAddressSettings(
    technician: User,
    device: Device,
  ): Promise<ServerMessage> {
    try {
      if (
        technician == null ||
        technician == undefined ||
        device.idDevice == null ||
        device.idDevice == undefined ||
        device.address == null ||
        device.address == undefined ||
        device.extNumber == null ||
        device.extNumber == undefined ||
        device.idTown == null ||
        device.idTown == undefined ||
        device.intNumber == null ||
        device.intNumber == undefined ||
        device.latitude == null ||
        device.latitude == undefined ||
        device.longitude == null ||
        device.longitude == undefined ||
        device.suburb == null ||
        device.suburb == undefined ||
        device.zipCode == null ||
        device.zipCode == undefined
      ) {
        return new ServerMessage(true, 'Petición incompleta', {});
      } else if (device.latitude == 0 || device.longitude == 0) {
        return new ServerMessage(true, 'Coordenadas incorrectas', {});
      }

      //check if the device belongs to the main organization
      let deviceData: Device = await this.deviceRepository.findOne({
        where: {
          idDevice: device.idDevice,
          idOrganization: technician.idOrganization,
          //type: 1,
        },
      });

      if (!deviceData) {
        return new ServerMessage(true, 'Dispositivo no disponible', {});
      }

      deviceData.address = device.address;
      deviceData.extNumber = device.extNumber;
      deviceData.idTown = device.idTown;
      deviceData.intNumber = device.intNumber;
      deviceData.latitude = device.latitude;
      deviceData.longitude = device.longitude;
      deviceData.suburb = device.suburb;
      deviceData.zipCode = device.zipCode;

      await deviceData.save();

      // return data
      return new ServerMessage(false, 'Dirección actualizada con éxito', {});
    } catch (error) {
      this.logger.error(error);
      return new ServerMessage(true, 'Ha ocurrido un error', error);
    }
  }

  /**
   *
   * @returns
   */
  async updateDeviceOnOffSettingsNFC(
    user: User,
    body: any,
  ): Promise<ServerMessage> {
    try {
      if (
        body.type === undefined ||
        body.type === null ||
        body.isOn === undefined ||
        body.isOn === null ||
        body.serialNumber === undefined ||
        body.serialNumber === null
      ) {
        return new ServerMessage(true, 'Petición incompleta', {});
      }
      let device: Device = await this.deviceRepository.findOne({
        where: {
          type: body.type,
          serialNumber: body.serialNumber,
        },
        include: [
          {
            model: WaterSettings,
            as: 'waterSettings',
          },
        ],
      });
      device.waterSettings.isOn = body.isOn;
      await device.waterSettings.save();
      return new ServerMessage(false, 'Operación realizada con éxito', {});
    } catch (error) {
      this.logger.error(error);
      return new ServerMessage(true, 'Ha ocurrido un error', error);
    }
  }
}
