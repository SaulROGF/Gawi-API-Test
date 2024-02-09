import { Injectable, Inject, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Device } from './../../../../models/device.entity';
import { DeviceMessage } from './classes/deviceMessage.class';
import { WaterHistory } from './../../../../models/waterHistory.entity';
import { WaterSettings } from './../../../../models/waterSettings.entity';
import { GasHistory } from './../../../../models/gasHistory.entity';
import { GasSettings } from './../../../../models/gasSettings.entity';
import { DataloggerHistory } from '../../../../models/dataloggerHistory.entity';
import { DataloggerSettings } from '../../../../models/dataloggerSettings.entity';
import { NaturalGasHistory } from 'src/models/naturalGasHistory.entity';
import { LoginDto } from './classes/login.dto';
import { WaterHistoryDto } from './classes/waterHistory.dto';
import { GasHistoryDto } from './classes/gasHistory.dto';
import { Logger } from 'winston';
import { ServerMessage } from './../../../../classes/ServerMessage.class';
import * as path from 'path';
import * as ftpService from 'basic-ftp';
import * as fs from 'fs';
import { Apn } from '../../../../models/apn.entity';
import { PushNotificationsService } from '../../../../modules/global/push-notifications/push-notifications.service';
import { toLocalTime, createDateAsUTC } from './../../../../utils/utilities';

import {
  WaterSettingsDto,
  consumptionUnitsValidator,
  flowUnitsValidator,
  ipProtocolValidator,
  authValidator,
  dailyTransmissionValidator,
  consumptionAlertValidator,
} from './classes/waterSettings.dto';
import { DataloggerHistoryAdapter } from './classes/datalogger.adapter';
import { GasHistoryAdapter } from './classes/gas.adapter';
import { getPushAlerts } from './classes/datalogger.utils';
import { Op } from 'sequelize';
import { NaturalGasHistoryDTO } from './classes/naturalGasHistory.dto';
import { NaturalGasSettings } from 'src/models/naturalGasSettings.entity';
import { NaturalGassettingsDto } from './classes/naturalGasSettings.dto';

@Injectable()
export class DevicesService {
  // numero maximo de configuraciones en el medidor de agua
  WD_MAX_CONFGS: number;
  WD_MAX_ALERTS: number;

  constructor(
    private jwtService: JwtService,
    private pushNotificationService: PushNotificationsService,
    @Inject('winston') private readonly logger: Logger,
    @Inject('DeviceRepository')
    private readonly deviceRepository: typeof Device,
    @Inject('ApnRepository') private readonly apnRepository: typeof Apn,
    @Inject('WaterHistoryRepository')
    private readonly waterHistoryRepository: typeof WaterHistory,
    @Inject('WaterSettingsRepository')
    private readonly waterSettingsRepository: typeof WaterSettings,
    @Inject('GasHistoryRepository')
    private readonly gasHistoryRepository: typeof GasHistory,
    @Inject('GasSettingsRepository')
    private readonly gasSettingsRepository: typeof GasSettings,
    @Inject('DataloggerHistoryRepository')
    private readonly dataloggerHistoryRepository: typeof DataloggerHistory,
    @Inject('DataloggerSettingsRepository')
    private readonly dataloggerSettingsRepository: typeof DataloggerSettings,
    @Inject('NaturalGasHistoryRepository')
    private readonly naturalGasHistoryRepository: typeof NaturalGasHistory,
    @Inject('NaturalGasSettingsRepository')
    private readonly naturalGasSettingsRepository: typeof NaturalGasSettings,
  ) {
    // establecer:
    // (1) el numero maximo de configuraciones para el medidor de agua
    // (2) el numero maximo de alertas para el medidor de agua
    this.WD_MAX_CONFGS = 16383;
    this.WD_MAX_ALERTS = 63;
  }

  /**
   * Login para los dispositivos de agua y gas
   * @param body credenciales para hacer el login
   * @returns token generado para el dispositivo
   */
  async login(body: any): Promise<DeviceMessage> {
    try {
      this.logger.debug(`-> [LIN] S.N.: ${body.B} psw: ${body.A}`);
      let loginData: LoginDto = new LoginDto(body);

      if (
        loginData.serialNumber == null ||
        loginData.serialNumber == undefined ||
        loginData.imei == null ||
        loginData.imei == undefined ||
        (loginData.serialNumber.length != 8 && loginData.imei.length != 15)
      ) {
        this.logger.error('-> [692] datos proporcionado son invalidos (BODY)');
        if (
          loginData.serialNumber == null ||
          loginData.serialNumber == undefined
        ) {
          console.log('serialNumber es null o undefined');
        }

        if (loginData.imei == null || loginData.imei == undefined) {
          console.log('imei es null o undefined');
        }

        if (loginData.serialNumber && loginData.serialNumber.length != 8) {
          console.log(loginData.serialNumber);
          console.log(loginData.serialNumber.length);
          console.log('La longitud de serialNumber no es 8');
        }

        if (loginData.imei && loginData.imei.length != 15) {
          console.log(loginData.imei);
          console.log(loginData.imei.length);
          console.log('La longitud de imei no es 15');
        }
        return new DeviceMessage(692, '');
      }
      let device: Device = await this.deviceRepository.findOne<Device>({
        where: {
          // type: 1, // restringido solo para dispositivos de agua
          serialNumber: loginData.serialNumber,
        },
      });

      if (!device) {
        this.logger.error('-> [693] dispositivo no identificado');
        return new DeviceMessage(693, '');
      }
      let checkPass: boolean = await device.validateImei(loginData.imei);
      if (checkPass) {
        let response: any = this.createJwtPayloadDevice(loginData.serialNumber);
        this.logger.debug(`-> [610] ¡éxito! token: ${response.token}`);
        return new DeviceMessage(610, response.token);
      } else {
        this.logger.error('-> [694] credenciales incorrectas');
        return new DeviceMessage(694, '');
      }
    } catch (error) {
      this.logger.error(error);
      return new DeviceMessage(690, '');
    }
  }

  /**
   * almacenar historial de transmision del dispositivo de gas natural
   * @param body historial de transmision
   * @returns confirmación de recepción del historial
   */
  async saveNaturalGasMeasures(body: any): Promise<DeviceMessage> {
    try {
      this.logger.debug('w->[HTY] ' + JSON.stringify(body));
      const historyDTO: NaturalGasHistoryDTO = new NaturalGasHistoryDTO(body);

      //TODO: BORRAR o comentar antes de produccion
      // this.debugAlerts(historyDTO.alerts)

      const constraints = [
        historyDTO.token == null,
        historyDTO.token == undefined,
        historyDTO.consumption == null,
        historyDTO.consumption == undefined,
        historyDTO.temperature == null,
        historyDTO.temperature == undefined,
        historyDTO.signalQuality == null,
        historyDTO.signalQuality == undefined,
        historyDTO.batteryLevel == null,
        historyDTO.batteryLevel == undefined,
        historyDTO.alerts == null,
        historyDTO.alerts == undefined,
        historyDTO.reason == null,
        historyDTO.reason == undefined,
        historyDTO.dateTime == null,
        historyDTO.dateTime == undefined,
      ];

      if (constraints.some(val => val)) {
        this.logger.error('w->[692] datos proporcionado son invalidos (BODY)');
        return new DeviceMessage(692, '');
      }

      //
      // validar la existencia del dispositivo meidante el token generado en el login
      //
      const payload: any = this.jwtService.decode(body.T);
      const device: Device = await this.validateDeviceByJwt(payload);

      //
      // verificando la existencia del APN
      //
      const apn: Apn = await this.apnRepository.findOne<Apn>({
        where: {
          idApn: device.idApn,
        },
      });

      if (!apn) {
        this.logger.error('w->[692] datos proporcionado son invalidos (APN)');
        return new DeviceMessage(692, '');
      }

      //
      // Validando la fecha de lectura del medidor
      //

      const datetime: Date = new Date(historyDTO.dateTime);
      if (
        Object.prototype.toString.call(datetime) !== '[object Date]' ||
        isNaN(datetime.getTime())
      ) {
        this.logger.error(
          'w->[695] fecha proporcionada por el dispositivo es inválida',
        );
        return new DeviceMessage(695, '');
      }

      //
      // almacenando los datos recibidos
      //
      const history: NaturalGasHistory = await this.naturalGasHistoryRepository.create<
        NaturalGasHistory
      >({
        idDevice: device.idDevice,
        consumption: historyDTO.consumption,
        temperature: historyDTO.temperature,
        signalQuality: historyDTO.signalQuality,
        bateryLevel: historyDTO.batteryLevel,
        reason: historyDTO.reason,
        hour: historyDTO.deviceTime,
        consumptionAlert: (historyDTO.alerts >>> 0) & 0x01, // Consumo    0x01
        consumptionExcessAlert: (historyDTO.alerts >>> 1) & 0x01, // Exceso de consumo    0x02
        lowBatteryAlert: (historyDTO.alerts >>> 2) & 0x01, // Bateria baja  0x04
        sensorAlert: (historyDTO.alerts >>> 3) & 0x01, // Fallo del sensor     0x08
        darkAlert: (historyDTO.alerts >>> 4) & 0x01, // Luz baja 0x10
        lightAlert: (historyDTO.alerts >>> 5) & 0x01, // Luz alta
      });
      history.dateTime = createDateAsUTC(datetime);

      await history.save();

      // //
      // // Obteniendo configuraciones disponibles
      // //
      let settings: NaturalGasSettings = await this.naturalGasSettingsRepository.findOne<
        NaturalGasSettings
      >({
        where: {
          idDevice: device.idDevice,
        },
      });
      if (!settings) {
        settings = await this.naturalGasSettingsRepository.create<
          NaturalGasSettings
        >({
          idDevice: device.idDevice,

          wereApplied: 0,
          status: 16383,
          firmwareVersion: 'beta',
          serviceOutageDay: 15,
          monthMaxConsumption: 0.0,
          apiUrl: process.env.API_URL,
          consumptionUnits: 'L',
          storageFrequency: 1440,
          storageTime: '00:00',
          dailyTime: '00:00',
          dailyTransmission: 1,
          customDailyTime: 0,
          periodicFrequency: 1440,
          periodicTime: '00:00',
          ipProtocol: 1,
          auth: 1,
          label: 'Medidor de gas natural beta 1.0',
          consumptionAlertType: 0,
          consumptionAlertSetPoint: 0,
          consumptionExcessFlag: 1,
          lowBatteryFlag: 1,
          sensorFlag: 1,
          darkSetPoint: 10,
          darkFlag: 1,
          lightSetPoint: 90,
          lightFlag: 1,
          isOn: 0,
        });
      }

      if (settings.status == this.WD_MAX_CONFGS) {
        //
        // generando notificacion para el usuario
        //
        const pushResponse = await this.pushNotificationService.send(
          device.idUser,
          'Gawi',
          'Tu medidor de gas ha generado una alerta',
        );
        if (pushResponse.error) {
          this.logger.error(pushResponse);
        }
        // logger
        this.logger.debug(
          'w->[615] historial almacenado correctamente y sin cambios nuevos',
        );
        return new DeviceMessage(615, '');
      } else {
        // comprobando que los valores en digitos sean validos
        if (
          consumptionUnitsValidator[settings.consumptionUnits] == null ||
          consumptionUnitsValidator[settings.consumptionUnits] == undefined ||
          ipProtocolValidator[settings.ipProtocol] == null ||
          ipProtocolValidator[settings.ipProtocol] == undefined ||
          authValidator[settings.auth] == null ||
          authValidator[settings.auth] == undefined
        ) {
          this.logger.error(
            'w->[692] datos proporcionado son invalidos (SETTINGS)',
          );
          return new DeviceMessage(692, '');
        }
        //
        // generando notificacion para el usuario
        //
        const pushResponse = await this.pushNotificationService.send(
          device.idUser,
          'Gawi',
          'Uno de tus medidores ha generado una alerta',
        );
        if (pushResponse.error) {
          this.logger.error(pushResponse.error);
        }
        // generando el stream con las configuraciones para transmitirlas al medidor
        this.logger.debug(
          'w->[612] historial almacenado correctamente y con cambios a aplicar',
        );
        return new DeviceMessage(
          612,
          this.getATcommandsNaturalGas(settings.status, settings, apn),
        );
      }
    } catch (error) {
      this.logger.error(error);
      return error.response.statusCode == 401
        ? new DeviceMessage(401, '')
        : new DeviceMessage(640, '');
    }
  }

  /**
   * marcar settings como aplicados
   * @param idDevice id del dispositivo
   * @returns confirmación de la aplicación de settings
   */
  async saveDataloggerMeasures(body: any): Promise<DeviceMessage> {
    try {
      const ALERT_MASK = 0x01;

      this.logger.debug(`

* datalogger: ${body.P} (${body.Q}, ${body.R}, ${body.S})
* date: ${body.O}T${body.N}
* A: ${body.A}  B: ${body.B}  C: ${body.C}  D: ${body.D}
* E: ${body.E}  F: ${body.F}  G: ${body.G}  H: ${body.H}
* I: ${body.I}  J: ${body.J}
* K: ${body.K}  L: ${body.L}  M: ${body.M}
* token: ${body.T}
`);

      let dataloggerHistory: DataloggerHistoryAdapter = new DataloggerHistoryAdapter(
        body,
      );

      if (dataloggerHistory.check()) {
        this.logger.error('D->[692] datos proporcionado son invalidos (BODY)');
        return new DeviceMessage(692, '');
      }

      if (dataloggerHistory.checkDatetime()) {
        this.logger.error(
          'D->[695] fecha proporcionada por el dispositivo es inválida',
        );
        return new DeviceMessage(695, '');
      }

      const payload: any = this.jwtService.decode(dataloggerHistory.token);
      const device: Device = await this.validateDeviceByJwt(payload);
      const history: DataloggerHistory = await this.dataloggerHistoryRepository.create<
        DataloggerHistory
      >({
        idDevice: device.idDevice,
        signalQuality: dataloggerHistory.signalQuality,
        batteryLevel: dataloggerHistory.batteryLevel,
        digitalInputs: dataloggerHistory.digitalInputs,
        digitalOutputs: dataloggerHistory.digitalOutputs,
        analogInput1: dataloggerHistory.analogInput1,
        analogInput2: dataloggerHistory.analogInput2,
        analogInput3: dataloggerHistory.analogInput3,
        analogInput4: dataloggerHistory.analogInput4,
        flow1: dataloggerHistory.flow1,
        flow2: dataloggerHistory.flow2,
        consumption1: dataloggerHistory.consumption1,
        consumption2: dataloggerHistory.consumption2,
        alerts: dataloggerHistory.alerts,
      });

      history.dateTime = createDateAsUTC(dataloggerHistory.datetime);
      await history.save();

      let settings: DataloggerSettings = await this.dataloggerSettingsRepository.findOne<
        DataloggerSettings
      >({
        where: {
          idDevice: device.idDevice,
        },
      });

      /**
       * @todo settear los tipos de señal provenientes del historial
       */
      if (!settings) {
        settings = await this.dataloggerSettingsRepository.create<
          DataloggerSettings
        >({
          idDevice: device.idDevice,
          signalType1: dataloggerHistory.signalType1,
          signalType2: dataloggerHistory.signalType2,
          signalType3: dataloggerHistory.signalType3,
          signalType4: dataloggerHistory.signalType4,
        });
      } else {
        let signalTypeFlag = false;

        if (settings.signalType1 !== dataloggerHistory.signalType1) {
          settings.signalType1 = dataloggerHistory.signalType1;
          signalTypeFlag = true;
        }

        if (settings.signalType2 !== dataloggerHistory.signalType2) {
          settings.signalType2 = dataloggerHistory.signalType2;
          signalTypeFlag = true;
        }

        if (settings.signalType3 !== dataloggerHistory.signalType3) {
          settings.signalType3 = dataloggerHistory.signalType3;
          signalTypeFlag = true;
        }

        if (settings.signalType4 !== dataloggerHistory.signalType4) {
          settings.signalType4 = dataloggerHistory.signalType4;
          signalTypeFlag = true;
        }
        if (signalTypeFlag) {
          await settings.save();
        }
      }

      dataloggerHistory.formatAlerts(settings);
      const pushAlerts = getPushAlerts(settings);

      //variable de control
      let haveInterval = false;

      if (settings.repeatNotificationTime != '00:00') {
        haveInterval = true;
      }
      //Si el usuario tiene la configuracion seteada en algun intervalo
      //se procede a eliminar las alertas que ya se hayan mandado
      if (haveInterval) {
        //Obtener intervalo
        let timeFix: string[] = settings.repeatNotificationTime.split(':');

        let time = parseInt(timeFix[0]);

        let dateFrom = new Date();
        dateFrom.setHours(dateFrom.getHours() - time);
        dateFrom.setMinutes(parseInt(timeFix[1]));

        //obtener los registros dentro del intervalo indicado
        let dataloggerRegisters: DataloggerHistory[] = await this.dataloggerHistoryRepository.findAll<
          DataloggerHistory
        >({
          where: {
            idDevice: device.idDevice,
            dateTime: {
              [Op.gte]: toLocalTime(dateFrom).toISOString(),
              /* [Op.between]: [
                  (dateFrom.toISOString() as unknown as number),
                  (todayDay.toISOString() as unknown as number)
                ], */
            },
          },
          order: [['dateTime', 'DESC']],
        });

        console.log(dataloggerRegisters.length);

        //funcion para hacer un reverse a los string
        let reverseString = str => {
          if (str === '') return '';
          else return reverseString(str.substr(1)) + str.charAt(0);
        };
        //Variable para guardar las alertas mandadas anteriormente durante el periodo indicado
        let alerts = [];

        //Se crean las cadenas de string en formato binario de las alertas
        //de los registros actuales
        for (let index = 0; index < dataloggerRegisters.length; index++) {
          const originalRegister = dataloggerRegisters[index];

          //logica usada en las graifcas para interpretar el numero de las alertas
          let original: DataloggerHistoryAdapter = new DataloggerHistoryAdapter(
            originalRegister,
          );

          original.formatAlerts(settings);
          let fixedAlerts = original.alerts;
          let binAlerts: any = fixedAlerts.toString(2);

          while (binAlerts.length < 16) {
            binAlerts = '0' + binAlerts;
          }
          //binAlerts = binAlerts.split("");
          //se acomoda el arreglo para que las alertas hagan match con el indice
          //y lo guardamos para luego revisar si alguna alarma no se encuentra en ellas
          alerts.push(reverseString(binAlerts));
          console.log(reverseString(binAlerts));
        }
        // Se quita el ultimo elemento porque que es el registro
        // que acabamos de crear
        alerts.pop();

        //se empieza a crear el string del binario de las alertas
        //para luego comparar si alguna de las alarmas que viene
        //se mando previamente
        let binOriginalAlerts: any = dataloggerHistory.alerts.toString(2);

        while (binOriginalAlerts.length < 16) {
          binOriginalAlerts = '0' + binOriginalAlerts;
        }
        let fixedOrigianlAlerts = reverseString(binOriginalAlerts);

        //console.log(fixedOrigianlAlerts);
        //Variable con la indormacion de las alertas que de deben mandar
        let newAlerts = [];

        //Se obtiene la informacion de las alertas que se deben de mandar en esta
        //transmisión
        for (let idx = 0; idx < dataloggerHistory.ALERTS_LEN; idx++) {
          if ((dataloggerHistory.alerts >>> idx) & ALERT_MASK) {
            const alert = pushAlerts[idx];
            const banner = `El dispositivo '${device.name}' indica un ${alert}`;
            newAlerts.push({ idx, banner });
          }
        }
        //console.log(newAlerts);
        // Logica para checar si la alert ya se habia mandado dentro del
        // intervalo establecido por el usuario por medio de los registros en el

        for (let index = 0; index < alerts.length; index++) {
          const actualBinaryString = alerts[index];

          for (let index = 0; index < actualBinaryString.length; index++) {
            const binaryChar = actualBinaryString[index];

            if (binaryChar == '1') {
              //Si la alerta esta levantada se busca si ya se encuentra
              //en las nuevas alertas que queremos mandar y si esta la quitamos
              let indexAlert = newAlerts.findIndex(newAlert => {
                return index == newAlert.idx;
              });
              //si se encuentra se elimina del arreglo con la información de las nuevas alertas
              if (indexAlert > -1) {
                newAlerts.splice(indexAlert, 1);
              }
            }
          }
        }
        //console.log("newAlerts");
        //console.log(newAlerts);
        //Se envían las alertas restantes (en caso que no se encontraran en los registros )
        for (let index = 0; index < newAlerts.length; index++) {
          const alertToSend = newAlerts[index];

          const pushResponse = await this.pushNotificationService.send(
            device.idUser,
            'Gawi',
            alertToSend.banner,
          );
          if (pushResponse.error) {
            this.logger.error(pushResponse);
          }
        }
      } else {
        for (let idx = 0; idx < dataloggerHistory.ALERTS_LEN; idx++) {
          if (((dataloggerHistory.alerts >>> idx) & ALERT_MASK) != 0) {
            const alert = pushAlerts[idx];
            const banner = `El dispositivo '${device.name}' indica un ${alert}`;
            const pushResponse = await this.pushNotificationService.send(
              device.idUser,
              'Gawi',
              banner,
            );
            if (pushResponse.error) {
              this.logger.error(pushResponse);
            }
          }
        }
      }

      this.logger.debug(
        'D->[615] historial almacenado correctamente y sin cambios nuevos',
      );
      return new DeviceMessage(615, '');
    } catch (error) {
      this.logger.error(error);
      return error.response.statusCode == 401
        ? new DeviceMessage(401, '')
        : new DeviceMessage(690, '');
    }
  }

  /**
   * almacenar historial de transmision del dispositivo de agua
   * @param body historial de transmision
   * @returns confirmación de recepción del historial
   */
  async saveWaterDeviceData(body: any): Promise<DeviceMessage> {
    try {
      this.logger.debug('w->[HTY] ' + JSON.stringify(body));
      let historyDTO: WaterHistoryDto = new WaterHistoryDto(body);

      //TODO: BORRAR o comentar antes de produccion
      // this.debugAlerts(historyDTO.alerts)

      const constraints = [
        historyDTO.token == null,
        historyDTO.token == undefined,
        historyDTO.consumption == null,
        historyDTO.consumption == undefined,
        historyDTO.reversedConsumption == null,
        historyDTO.reversedConsumption == undefined,
        historyDTO.flow == null,
        historyDTO.flow == undefined,
        historyDTO.temperature == null,
        historyDTO.temperature == undefined,
        historyDTO.signalQuality == null,
        historyDTO.signalQuality == undefined,
        historyDTO.batteryLevel == null,
        historyDTO.batteryLevel == undefined,
        historyDTO.alerts == null,
        historyDTO.alerts == undefined,
        historyDTO.reason == null,
        historyDTO.reason == undefined,
        historyDTO.deviceDatetime == null,
        historyDTO.deviceDatetime == undefined,
      ];

      if (constraints.some(val => val)) {
        this.logger.error('w->[692] datos proporcionado son invalidos (BODY)');
        return new DeviceMessage(692, '');
      }

      //
      // validar la existencia del dispositivo meidante el token generado en el login
      //
      let payload: any = this.jwtService.decode(body.T);
      let device: Device = await this.validateDeviceByJwt(payload);

      //
      // verificando la existencia del APN
      //
      let apn: Apn = await this.apnRepository.findOne<Apn>({
        where: {
          idApn: device.idApn,
        },
      });

      if (!apn) {
        this.logger.error('w->[692] datos proporcionado son invalidos (APN)');
        return new DeviceMessage(692, '');
      }

      //
      // Validando la fecha de lectura del medidor
      //

      let datetime: Date = new Date(historyDTO.deviceDatetime);
      if (
        Object.prototype.toString.call(datetime) !== '[object Date]' ||
        isNaN(datetime.getTime())
      ) {
        this.logger.error(
          'w->[695] fecha proporcionada por el dispositivo es inválida',
        );
        return new DeviceMessage(695, '');
      }

      //
      // alamcenando los datos recibidos
      //
      let history: WaterHistory = await this.waterHistoryRepository.create<
        WaterHistory
      >({
        idDevice: device.idDevice,
        consumption: historyDTO.consumption,
        flow: historyDTO.flow,
        temperature: historyDTO.temperature,
        signalQuality: historyDTO.signalQuality,
        bateryLevel: historyDTO.batteryLevel,
        dripAlert: (historyDTO.alerts >>> 0) & 0x01, // Goteo    0x01
        emptyAlert: (historyDTO.alerts >>> 1) & 0x01, // Vacío    0x02
        reversedFlowAlert: (historyDTO.alerts >>> 2) & 0x01, // Inverso  0x04
        burstAlert: (historyDTO.alerts >>> 3) & 0x01, // Fuga     0x08
        bubbleAlert: (historyDTO.alerts >>> 4) & 0x01, // Burbujas 0x10
        manipulationAlert: (historyDTO.alerts >>> 5) & 0x01, // Manipulación aún no implementada
        reason: historyDTO.reason,
        reversedConsumption: historyDTO.reversedConsumption,
      });
      history.dateTime = createDateAsUTC(datetime);

      await history.save();

      //
      // Obteniendo configuraciones disponibles
      //
      let settings: WaterSettings = await this.waterSettingsRepository.findOne<
        WaterSettings
      >({
        where: {
          idDevice: device.idDevice,
        },
      });

      if (!settings) {
        settings = await this.waterSettingsRepository.create<WaterSettings>({
          idDevice: device.idDevice,
          apiUrl: process.env.API_URL,
          consumptionUnits: 'M3',
          flowUnits: 'LPS',
          storageFrequency: 60,
          storageTime: '23:15',
          dailyTransmission: 1,
          dailyTime: '16:35',
          customDailyTime: 2,
          periodicFrequency: 120,
          periodicTime: '00:50',
        });
      }

      if (settings.status == this.WD_MAX_CONFGS) {
        //
        // generando notificacion para el usuario
        //
        let pushResponse = await this.pushNotificationService.send(
          device.idUser,
          'Gawi',
          'Tu medidor de agua ha generado una alerta',
        );
        if (pushResponse.error) {
          this.logger.error(pushResponse);
        }
        // logger
        this.logger.debug(
          'w->[615] historial almacenado correctamente y sin cambios nuevos',
        );
        return new DeviceMessage(615, '');
      } else {
        // comprobando que los valores en digitos sean validos
        if (
          consumptionUnitsValidator[settings.consumptionUnits] == null ||
          consumptionUnitsValidator[settings.consumptionUnits] == undefined ||
          flowUnitsValidator[settings.flowUnits] == null ||
          flowUnitsValidator[settings.flowUnits] == undefined ||
          ipProtocolValidator[settings.ipProtocol] == null ||
          ipProtocolValidator[settings.ipProtocol] == undefined ||
          authValidator[settings.auth] == null ||
          authValidator[settings.auth] == undefined ||
          dailyTransmissionValidator[settings.dailyTransmission] == null ||
          dailyTransmissionValidator[settings.dailyTransmission] == undefined ||
          consumptionAlertValidator[settings.consumptionAlertType] == null ||
          consumptionAlertValidator[settings.consumptionAlertType] == undefined
        ) {
          this.logger.error(
            'w->[692] datos proporcionado son invalidos (SETTINGS)',
          );
          return new DeviceMessage(692, '');
        }
        //
        // generando notificacion para el usuario
        //
        let pushResponse = await this.pushNotificationService.send(
          device.idUser,
          'Gawi',
          'Uno de tus medidores ha generado una alerta',
        );
        if (pushResponse.error) {
          this.logger.error(pushResponse.error);
        }
        // generando el stream con las configuraciones para transmitirlas al medidor
        this.logger.debug(
          'w->[612] historial almacenado correctamente y con cambios a aplicar',
        );
        return new DeviceMessage(
          612,
          this.getATcommands(settings.status, settings, apn),
        );
      }
    } catch (error) {
      this.logger.error(error);
      return error.response.statusCode == 401
        ? new DeviceMessage(401, '')
        : new DeviceMessage(640, '');
    }
  }

  /**
   * marcar settings del dispositivo de agua como aplicados
   * @param body configuraciones aplicadas en el medidor
   * @returns
   */
  async markWaterDeviceSettingsAsApplied(body: any): Promise<DeviceMessage> {
    try {
      this.logger.debug('w->[MRK] ' + JSON.stringify(body));
      const constraints = [
        body.T == null,
        body.T == undefined,
        body.S == null,
        body.S == undefined,
      ];

      if (constraints.some(val => val)) {
        this.logger.error('w->[692] datos proporcionado son invalidos (BODY)');
        return new DeviceMessage(692, '');
      }
      /**
       * validar la existencia del dispositivo meidante el token
       */
      let payload: any = this.jwtService.decode(body.T);
      let device: Device = await this.validateDeviceByJwt(payload);

      /**
       * verificando la existencia del APN
       */
      let apn: Apn = await this.apnRepository.findOne<Apn>({
        where: {
          idApn: device.idApn,
        },
      });

      if (!apn) {
        this.logger.error('w->[692] datos proporcionado son invalidos (APN)');
        return new DeviceMessage(692, '');
      }

      let settings: WaterSettings = await this.waterSettingsRepository.findOne<
        WaterSettings
      >({
        where: {
          idDevice: device.idDevice,
        },
      });

      if (!settings) {
        this.logger.error('no existen los settings para un dispositivo valido');
        return new DeviceMessage(690, '');
      }

      if (body.S == this.WD_MAX_CONFGS) {
        // aplicar las actualizaciones recibidas del medidor en la DB
        // y poner a true la bandera de configuraciones aplicadas
        settings.status = settings.status | body.S;
        settings.wereApplied = true;
        await settings.save();
        this.logger.debug(
          'w->[614] configuraciones aplicadas: ' + settings.status.toString(2),
        );
        return new DeviceMessage(614, '');
      } else {
        // comprobando que los valores en digitos sean validos
        if (
          consumptionUnitsValidator[settings.consumptionUnits] == null ||
          consumptionUnitsValidator[settings.consumptionUnits] == undefined ||
          flowUnitsValidator[settings.flowUnits] == null ||
          flowUnitsValidator[settings.flowUnits] == undefined ||
          ipProtocolValidator[settings.ipProtocol] == null ||
          ipProtocolValidator[settings.ipProtocol] == undefined ||
          authValidator[settings.auth] == null ||
          authValidator[settings.auth] == undefined ||
          dailyTransmissionValidator[settings.dailyTransmission] == null ||
          dailyTransmissionValidator[settings.dailyTransmission] == undefined ||
          consumptionAlertValidator[settings.consumptionAlertType] == null ||
          consumptionAlertValidator[settings.consumptionAlertType] == undefined
        ) {
          this.logger.error(
            'w->[692] datos proporcionado son invalidos (SETTINGS)',
          );
          return new DeviceMessage(692, '');
        }
        // generando el stream con las configuraciones para transmitirlas al medidor
        this.logger.debug('w->[613] cambios a aplicar');
        return new DeviceMessage(
          613,
          this.getATcommands(body.S, settings, apn),
        );
      }
    } catch (error) {
      this.logger.error(error);
      return error.response.statusCode == 401
        ? new DeviceMessage(401, '')
        : new DeviceMessage(640, '');
    }
  }

   /**
   * marcar settings del dispositivo de gas natural como aplicados
   * @param body configuraciones aplicadas en el medidor
   * @returns
   */
   async markNaturalGasSettingsAsApplied(body: any): Promise<DeviceMessage> {
    try {
      this.logger.debug('w->[MRK] ' + JSON.stringify(body));
      const constraints = [
        body.T == null,
        body.T == undefined,
        body.S == null,
        body.S == undefined,
      ];

      if (constraints.some(val => val)) {
        this.logger.error('w->[692] datos proporcionado son invalidos (BODY)');
        return new DeviceMessage(692, '');
      }
      /**
       * validar la existencia del dispositivo meidante el token
       */
      const payload: any = this.jwtService.decode(body.T);
      const device: Device = await this.validateDeviceByJwt(payload);

      /**
       * verificando la existencia del APN
       */
      const apn: Apn = await this.apnRepository.findOne<Apn>({
        where: {
          idApn: device.idApn,
        },
      });

      if (!apn) {
        this.logger.error('w->[692] datos proporcionado son invalidos (APN)');
        return new DeviceMessage(692, '');
      }

      const settings: NaturalGasSettings = await this.naturalGasSettingsRepository.findOne<
      NaturalGasSettings
      >({
        where: {
          idDevice: device.idDevice,
        },
      });

      if (!settings) {
        this.logger.error('no existen los settings para un dispositivo valido');
        return new DeviceMessage(690, '');
      }

      if (body.S == this.WD_MAX_CONFGS) {
        // aplicar las actualizaciones recibidas del medidor en la DB
        // y poner a true la bandera de configuraciones aplicadas
        settings.status = settings.status | body.S;
        settings.wereApplied = true;
        await settings.save();
        this.logger.debug(
          'w->[614] configuraciones aplicadas: ' + settings.status.toString(2),
        );
        return new DeviceMessage(614, '');
      } else {
        // comprobando que los valores en digitos sean validos
        if (
          consumptionUnitsValidator[settings.consumptionUnits] == null ||
          consumptionUnitsValidator[settings.consumptionUnits] == undefined ||
          ipProtocolValidator[settings.ipProtocol] == null ||
          ipProtocolValidator[settings.ipProtocol] == undefined ||
          authValidator[settings.auth] == null ||
          authValidator[settings.auth] == undefined ||
          consumptionAlertValidator[settings.consumptionAlertType] == null ||
          consumptionAlertValidator[settings.consumptionAlertType] == undefined
        ) {
          this.logger.error(
            'w->[692] datos proporcionado son invalidos (SETTINGS)',
          );
          return new DeviceMessage(692, '');
        }
        // generando el stream con las configuraciones para transmitirlas al medidor
        this.logger.debug('w->[613] cambios a aplicar');
        return new DeviceMessage(
          613,
          this.getATcommandsNaturalGas(body.S, settings, apn),
        );
      }
    } catch (error) {
      this.logger.error(error);
      return error.response.statusCode == 401
        ? new DeviceMessage(401, '')
        : new DeviceMessage(640, '');
    }
  }

  /**
   * marcar settings del dispositivo de gas como aplicados
   * @param serialNumber numero de serie del dispositivo
   * @returns confirmación de la aplicación de settings
   */
  async markGasSettingsAsApplied(serialNumber: string): Promise<DeviceMessage> {
    try {
      this.logger.debug('g->[MRK] <' + serialNumber + '>');
      let gasDevice: Device = await this.deviceRepository.findOne({
        where: {
          serialNumber: serialNumber,
        },
      });
      if (!gasDevice) {
        this.logger.error('g->[ 93] dispositivo no identificado');
        return new DeviceMessage(93, '');
      }
      let settings: GasSettings = await this.gasSettingsRepository.findOne<
        GasSettings
      >({
        where: {
          idDevice: gasDevice.idDevice,
        },
      });
      settings.wereApplied = true;
      await settings.save();
      this.logger.debug('g->[ 13] configuraciones aplicadas');
      return new DeviceMessage(13, '');
    } catch (error) {
      this.logger.error(error);
      return new DeviceMessage(90, '');
    }
  }

  //TODO: Revisar lo del consumo por periodo del dispositivo de gas
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
  async saveGasDeviceData(
    deviceDate: string,
    deviceTime: string,
    imei: string,
    serialNumber: string,
    measure: string,
    consumption: string,
    meanConsumption: string,
    alerts: string,
    bateryLevel: string,
    temperature: string,
    signalQuality: string,
  ): Promise<DeviceMessage> {
    try {
      this.logger.debug(
        '# g->[HTY] ' +
          JSON.stringify({
            A: deviceDate,
            B: deviceTime,
            C: imei,
            D: serialNumber,
            E: measure,
            F: consumption,
            G: meanConsumption,
            H: alerts,
            I: bateryLevel,
            J: temperature,
            K: signalQuality,
          }),
      );

      const constraints = [
        deviceDate == null,
        deviceDate == undefined,
        deviceTime == null,
        deviceTime == undefined,
        imei == null,
        imei == undefined,
        serialNumber == null,
        serialNumber == undefined,
        measure == null,
        measure == undefined,
        consumption == null,
        consumption == undefined,
        meanConsumption == null,
        meanConsumption == undefined,
        alerts == null,
        alerts == undefined,
        bateryLevel == null,
        bateryLevel == undefined,
        temperature == null,
        temperature == undefined,
        signalQuality == null,
        signalQuality == undefined,
      ];
      if (constraints.some(val => val)) {
        this.logger.error(
          '# g->[ 92] datos proporcionado son invalidos (BODY)',
        );
        return new DeviceMessage(92, '');
      }

      let gasDeviceData: GasHistoryDto = new GasHistoryDto(
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

      //
      // validar la existencia del dispositivo
      //
      let gasDevice: Device = await this.deviceRepository.findOne({
        where: {
          serialNumber: serialNumber,
        },
      });
      if (!gasDevice) {
        this.logger.error('# g->[ 93] dispositivo no identificado');
        return new DeviceMessage(93, '');
      }

      //
      // Validando la fecha de lectura del medidor
      //
      let datetime: Date = new Date(gasDeviceData.datetime);
      if (
        Object.prototype.toString.call(datetime) !== '[object Date]' ||
        isNaN(datetime.getTime())
      ) {
        this.logger.error(
          '# g->[ 95] fecha proporcionada por el dispositivo es inválida',
        );
        return new DeviceMessage(95, '');
      }

      //
      // almacenando el historial en la base de datos
      //
      let history: GasHistory = await this.gasHistoryRepository.create<
        GasHistory
      >({
        idDevice: gasDevice.idDevice,
        measure: gasDeviceData.measure,
        bateryLevel: gasDeviceData.bateryLevel,
        accumulatedConsumption: gasDeviceData.accumulatedConsumption,
        meanConsumption: gasDeviceData.meanConsumption,
        intervalAlert: gasDeviceData.intervalAlert,
        fillingAlert: gasDeviceData.fillingAlert,
        resetAlert: gasDeviceData.resetAlert,
        temperature: gasDeviceData.temperature,
        signalQuality: gasDeviceData.signalQuality,
      });
      history.dateTime = createDateAsUTC(datetime);
      await history.save();

      let settings: GasSettings = await this.gasSettingsRepository.findOne<
        GasSettings
      >({
        where: {
          idDevice: gasDevice.idDevice,
        },
      });

      if (!settings) {
        settings = await this.gasSettingsRepository.create<GasSettings>({
          idDevice: gasDevice.idDevice,
          destUrl: process.env.API_URL,
          closingHour: '23:59',
          consumptionUnits: '0060',
          interval: 25, // 2 chars, ej: 25
          minFillingPercentage: 9, // 2 chars, ej: 09
          consumptionPeriod: '010', // 3 chars, ej: 010
          minsBetweenMeasurements: 10, // 4 chars, ej: 0010
          travelMode: 0,
          wereApplied: false,
        });
      }
      /**
       * @todo eliminar cuando ya estemos en producción: esto es solo una prueba para un medidor de forma individual
       */
      const gasConfigs: string = this.getGasSettingsString(settings);

      if (settings.offsetTime !== '00:01') {
        settings.offsetTime = '00:01';
        await settings.save();
      }

      // generando notificacion para el usuario
      this.sendAlertNotification(gasDevice.idUser, history, settings);
      // operacion éxitosa
      if (settings.wereApplied) {
        this.logger.debug(
          '# g->[ 12] historial almacenado correctamente y sin cambios nuevos',
        );
        return new DeviceMessage(12, '');
      } else {
        this.logger.debug(
          `# g->[ 15] historial almacenado correctamente y con cambios a aplicar: ${gasConfigs}`,
        );
        return new DeviceMessage(15, gasConfigs);
      }
    } catch (error) {
      this.logger.error(error);
      return new DeviceMessage(90, '');
    }
  }

  /**
   *
   *  | alerta        | descripcion                        | banner                                                  |
   *  |---------------|------------------------------------|---------------------------------------------------------|
   *  | intervalAlert | consumo de intervalo               | `Tu tanque se ha vaciado un ${interval}%` .             |
   *  | fillingAlert  | fin de llenado mínimo seleccionado | `Tu tanque ha sido llenado un ${minFillingPercentage}%` |
   *  | resetAlert    | en caso de reset del equipo        |                                                         |
   */
  private async sendAlertNotification(
    idUser: number,
    history: GasHistory,
    settings: GasSettings,
  ) {
    if (settings.travelMode == true) {
      let pushResponse = await this.pushNotificationService.send(
        idUser,
        'Gawi Gas: Modo viaje',
        '¡Se ha detectado un consumo en tu tanque!',
      );
      if (pushResponse.error == true) {
        this.logger.error(pushResponse.message);
      }
    } else {
      if (history.intervalAlert == true) {
        let pushResponse = await this.pushNotificationService.send(
          idUser,
          'Gawi Gas',
          `El nivel de gas ha bajado ${settings.interval}%`, //TODO:  CAMBIAR LO DE LA NOTIFICACION CADA QUE SE VACIA EL GAS
        );
        if (pushResponse.error == true) {
          this.logger.error(pushResponse.message);
        }
      }
      if (history.fillingAlert == true) {
        let pushResponse = await this.pushNotificationService.send(
          idUser,
          'Gawi Gas',
          `Tu tanque se ha llenado un ${settings.minFillingPercentage}%`,
        );
        if (pushResponse.error == true) {
          this.logger.error(pushResponse.message);
        }
      }
    }
  }

  /**
   * Generar un backup de los historiales y proporcionarlo via FTP
   * a un cliente
   * @param idOrganization organización a la que pertenecen los dispositivos
   * de cuyos historiales se harán backup
   * @returns veredicto
   */
  async serverByFTP(idOrganization: number): Promise<ServerMessage> {
    try {
      if (idOrganization == null || idOrganization == undefined) {
        return new ServerMessage(
          true,
          'datos proporcionado son invalidos (BODY)',
          null,
        );
      }

      let histories: Device[] = await this.deviceRepository.findAll<Device>({
        attributes: ['serialNumber'], // {exclude: ["imei", "idDevice"]},
        where: {
          idOrganization: idOrganization,
        },
        include: [
          {
            model: WaterHistory,
            as: 'waterHistory',
            attributes: {
              exclude: ['idWaterHistory', 'idDevice', 'exceptionCode'],
            },
            limit: 1000,
          },
        ],
      });

      if (!histories) {
        return new ServerMessage(true, 'Sin historiales a extraer', null);
      }

      /**
       * generando backup de historiales
       */
      const [backupFilename, backupFilePath] = this.getBackupPath('backup_');
      const {
        Parser,
        transforms: { unwind },
      } = require('json2csv');
      const transforms = [unwind({ paths: ['waterHistory'] })];
      const fields = [
        'serialNumber',
        'idDevice',
        'waterHistory.bateryLevel',
        'waterHistory.signalQuality',
        'waterHistory.consumption',
        'waterHistory.temperature',
        'waterHistory.spending',
        'waterHistory.dripAlert',
        'waterHistory.manipulationAlert',
        'waterHistory.emptyAlert',
        'waterHistory.leakAlert',
        'waterHistory.bubbleAlert',
        'waterHistory.invertedFlowAlert',
        'waterHistory.inverseConsumption',
        'waterHistory.dateTime',
        'waterHistory.createdAt',
      ];
      const parser = new Parser({ fields, transforms });
      const backup = parser.parse(JSON.parse(JSON.stringify(histories)));
      fs.writeFileSync(backupFilePath, backup);

      /**
       * Servir el archivo generado a través de FTP
       */
      const client = new ftpService.Client();
      await client.access({
        host: process.env.FTP_HOST,
        user: process.env.FTP_USR,
        password: process.env.FTP_PSW,
        secure: false,
      });
      await client.uploadFrom(backupFilePath, backupFilename);

      return new ServerMessage(false, 'archivo servido', null);
    } catch (error) {
      this.logger.error(error);
      return new ServerMessage(true, 'Ha ocurrido un error', error);
    }
  }

  /**
   * Generar la tabla para el calculo de CRC23
   * @returns tabla generada
   */
  private createCRC32Table(): number[] {
    let table = new Array(256 * 8);
    let i = 0,
      j = 0,
      crc = 0;
    for (i = 0; i < 256; ++i) {
      crc = i;
      for (j = 0; j < 8; ++j) {
        crc = crc & 0x00000001 ? (crc >>> 1) ^ 0xedb88320 : crc >>> 1;
      }
      table[i] = crc;
    }
    return table;
  }

  /**
   * Actualizar el resultado del calculo CRC32
   * @param crc valor actual del CRC
   * @param c
   * @returns
   */
  private updateCRC32(crc: number, c: number): number {
    let table = this.createCRC32Table();
    return (crc >>> 8) ^ table[(crc ^ c) & 0xff];
  }

  /**
   * Calcular de checksum de la cadena proporcionada mediante CRC-32
   * @param str cadena de caracteres suministrada
   * @returns valor hexadecimal en minusculas del checksum calculado
   */
  private computeCRC32(str: string): string {
    let checksum: number = 0xffffffff;

    for (let i = 0; i < str.length; i++) {
      let char: number = str.charCodeAt(i);
      checksum = this.updateCRC32(checksum, char & 0xff);
      checksum = this.updateCRC32(checksum, char >>> 8);
    }

    let ans: string = (checksum >>> 0).toString(16);
    while (ans.length < 8) {
      ans = '0' + ans;
    }
    return ans;
  }

  /**
   * Formatear los settings del gas a una cadena de caracteres
   * @param settings configuraciones a aplicar al medidior de gas
   * @returns cadena con los settings
   */
  private getGasSettingsString(settings: GasSettings): string {
    return (
      settings.closingHour +
      ',' + // 5 unidades
      this.fixLenWithZero(Number(settings.consumptionUnits), 4) +
      ',' + // 4 unidades
      this.fixLenWithZero(settings.minsBetweenMeasurements, 4) +
      ',' + // 4 unidades
      this.fixLenWithZero(Number(settings.consumptionPeriod), 3) +
      ',' + // 3 unidades
      this.fixLenWithZero(settings.minFillingPercentage, 2) +
      ',' + // 3 unidades
      this.fixLenWithZero(settings.interval, 2) +
      ',' + // 2 unidades
      (settings.travelMode ? '1' : '0') +
      ',' + // 1 unidad
      this.fixLenWithZero(settings.offset, 3) +
      ',' + // 3 unidades
      settings.offsetTime +
      ',' + // 5 unidades
      settings.destUrl
    );
  }

  /**
   * añadir ceros a la izquierda en un valor dada
   * @param num cantidad a transformar
   * @param len longitud de la cadena resultante
   * @returns cadena generada
   */
  private fixLenWithZero(num: number, len: number) {
    let ans: string = '' + num;
    while (ans.length < len) {
      ans = '0' + ans;
    }
    return ans;
  }

  private checkIsApplied(status: number, pos: number): boolean {
    return ((status >>> pos) & 0x01) === 1;
  }

  /**
   * Formatear los settings del aque a una cadena de caracteres con los comandos AT
   * @param status estado de la configuraciones provenientes del medidor o del usuario
   * @param settings configuraciones a aplicar al medidior de agua
   * @param apn APN vinculado al dispositivo
   * @returns cadena con los comandos AT lista para ser transmitida
   */
  private getATcommands(status: number, settings: WaterSettings, apn: Apn) {
    const settingsCmd: WaterSettingsDto = new WaterSettingsDto(settings, apn);
    const commands: string[] = settingsCmd.getCommands();
    let stream: string = '';

    for (const [pos, cmd] of commands.entries()) {
      if (
        settingsCmd.totalLength <
        stream.length + settingsCmd.checksumLength + settingsCmd.headerLength
      )
        break;

      if (!this.checkIsApplied(status, pos)) stream += cmd;
    }

    return stream + '$' + this.computeCRC32(stream);
  }

  /**
   * Formatear los settings del aque a una cadena de caracteres con los comandos AT
   * @param status estado de la configuraciones provenientes del medidor o del usuario
   * @param settings configuraciones a aplicar al medidior de agua
   * @param apn APN vinculado al dispositivo
   * @returns cadena con los comandos AT lista para ser transmitida
   */
  private getATcommandsNaturalGas(
    status: number,
    settings: NaturalGasSettings,
    apn: Apn,
  ) {
    const settingsCmd: NaturalGassettingsDto = new NaturalGassettingsDto(
      settings,
      apn,
    );
    const commands: string[] = settingsCmd.getCommands();
    let stream = '';

    for (const [pos, cmd] of commands.entries()) {
      if (
        settingsCmd.totalLength <
        stream.length + settingsCmd.checksumLength + settingsCmd.headerLength
      )
        break;

      if (!this.checkIsApplied(status, pos)) stream += cmd;
    }

    return stream + '$' + this.computeCRC32(stream);
  }

  /**
   * Generar un token dado un numero de serie
   * @param serialNumber numero de serie del dispositivo
   * @returns token generado y su expiración
   */
  private createJwtPayloadDevice(serialNumber: string) {
    let data: any = {
      serialNumber: serialNumber,
    };
    return {
      expiresIn: 2 * 365 * 24 * 60 * 60,
      token: this.jwtService.sign(data),
    };
  }

  /**
   * Validar una variable para determinar si es nula o indefinida
   * @param varTest variable para evaluar
   * @returns veredicto
   */
  private checkNullUndefined(varTest: any): boolean {
    return varTest == null || varTest == undefined ? true : false;
  }

  /**
   * Validar el token proporcionado por el dispositivo
   * @param payload token proporcionado
   * @returns veredicto
   */
  async validateDeviceByJwt(payload: any) {
    const constraints = [payload == null, payload == undefined];
    if (constraints.some(val => val)) {
      throw new UnauthorizedException();
    }
    let device: any = await this.deviceRepository.findOne({
      where: {
        serialNumber: payload.serialNumber,
      },
    });
    if (!device) {
      throw new UnauthorizedException();
    }
    return device;
  }

  /**
   * Generar datos dado un dispositivo
   * @param device dispositivo dado
   * @returns datos generados
   */
  async generateDeviceData(device: Device) {
    return {
      idDevice: this.checkNullUndefined(device.idDevice) ? -1 : device.idDevice,
      serialNumber: this.checkNullUndefined(device.serialNumber)
        ? -1
        : device.serialNumber,
    };
  }

  /**
   * Obtener la ruta en la carpeta storage, dado el nombre de un archivo
   * proximo a generarse
   * @param label nombre del archivo
   * @returns ruta generada
   */
  private getBackupPath(label: string): string[] {
    let filename: string = label + Date.now() + '.csv';
    let filePath: string = path.join(
      __dirname,
      '../../../../..',
      'storage/backup/',
      filename,
    );
    return [filename, filePath];
  }

  //ESTA FUNCION ES PARA DEBUGEAR LAS ALERTAS
  private debugAlerts(alerts: number) {
    let binaryString: string = alerts.toString(2).padStart(8, '0');

    console.log(`Alert value: ${alerts}, Binary: ${binaryString}`);
    console.log(`Drip Alert: ${(alerts >>> 0) & 0x01}`);
    console.log(`Empty Alert: ${(alerts >>> 1) & 0x01}`);
    console.log(`Inverted Flow Alert: ${(alerts >>> 2) & 0x01}`);
    console.log(`Leak Alert: ${(alerts >>> 3) & 0x01}`);
    console.log(`Bubble Alert: ${(alerts >>> 4) & 0x01}`);
    console.log(`Manipulation Alert: ${(alerts >>> 5) & 0x01}`);
  }
}
