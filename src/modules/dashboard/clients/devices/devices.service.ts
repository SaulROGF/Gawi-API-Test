import { Apn } from './../../../../models/apn.entity';
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
import { Logger } from 'winston';
import { toLocalTime, getTomorrow } from './../../../../utils/utilities';
import { DataloggerHistory } from '../../../../models/dataloggerHistory.entity';
import { DataloggerHistoryAdapter } from '../../devices/devices/classes/datalogger.adapter';
import { getPushAlerts } from './../../devices/devices/classes/datalogger.utils';
import { DataloggerSettings } from '../../../../models/dataloggerSettings.entity';
import { NaturalGasHistory } from '../../../../models/naturalGasHistory.entity';
import { NaturalGasSettings } from '../../../../models/naturalGasSettings.entity';

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
    @Inject('DataloggerHistoryRepository')
    private readonly dataloggerHistoryRepository: typeof DataloggerHistory,

    @Inject('NaturalGasHistoryRepository')
    private readonly naturalGasHistoryRepository: typeof NaturalGasHistory,
    @Inject('NaturalGasSettingsRepository')
    private readonly naturalGasSettingsRepository: typeof NaturalGasSettings,

    @Inject('DataloggerSettingsRepository')
    private readonly dataloggerSettingsRepository: typeof DataloggerSettings,
    @Inject('UserRepository') private readonly userRepository: typeof User,
    @Inject('StateRepository') private readonly stateRepository: typeof State,
    @Inject('TownRepository') private readonly townRepository: typeof Town,
    @Inject('winston') private readonly logger: Logger,
  ) {
    // this.generateDummyData4gasHistories(2);
  }

  /**
   *
   */
  getOnlyDate(dateToFix: Date): string {
    let dateFixed: Date = new Date(dateToFix);
    return (
      dateFixed.toLocaleDateString('es-MX', {
        year: 'numeric',
        timeZone: 'UTC',
      }) +
      '-' +
      dateFixed.toLocaleDateString('es-MX', {
        month: '2-digit',
        timeZone: 'UTC',
      }) +
      '-' +
      dateFixed.toLocaleDateString('es-MX', { day: '2-digit', timeZone: 'UTC' })
    );
  }

  /**
   *
   */
  getDateTimepikerFormat(dateToFix) {
    const fixedType = new Date(dateToFix);

    let montNum = fixedType.getUTCMonth() + 1;
    let fixMont = montNum.toString().length == 1 ? '0' + montNum : montNum;
    let fixDate =
      fixedType.getDate().toString().length == 1
        ? '0' + fixedType.getDate()
        : fixedType.getDate();
    let dateFixed =
      '' + fixDate + '.' + fixMont + '.' + fixedType.getFullYear();

    let fixHour =
      fixedType.getHours().toString().length == 1
        ? '0' + fixedType.getHours()
        : fixedType.getHours();
    let fixMin =
      fixedType.getMinutes().toString().length == 1
        ? '0' + fixedType.getMinutes()
        : fixedType.getMinutes();
    let fixSec =
      fixedType.getSeconds().toString().length == 1
        ? '0' + fixedType.getSeconds()
        : fixedType.getSeconds();
    let timeFixed = '' + fixHour + ':' + fixMin + ':' + fixSec;

    //console.log(dateFixed + ' ' + timeFixed+':00');
    return dateFixed + ' ' + timeFixed;
  }

  /**
   *
   */
  addMonths(months: number, date: Date = new Date()): Date {
    var d = date.getDate();
    date.setMonth(date.getMonth() + +months);
    if (date.getDate() != d) {
      date.setDate(0);
    }
    return date;
  }

  /**
   *
   */
  convertDateToUTC(date: Date) {
    return new Date(
      date.getUTCFullYear(),
      date.getUTCMonth(),
      date.getUTCDate(),
      date.getUTCHours(),
      date.getUTCMinutes(),
      date.getUTCSeconds(),
    );
  }

  /**
   *
   */
  async getAlerts(client: User): Promise<ServerMessage> {
    try {
      if (client == null || client == undefined) {
        return new ServerMessage(true, 'Petición incompleta', {});
      }

      let waterDevices: Device[] = await this.deviceRepository.findAll<Device>({
        where: {
          idUser: client.idUser,
          type: 1,
        },
        include: [
          {
            model: WaterHistory,
            as: 'waterHistory',
            limit: 1,
            order: [['createdAt', 'DESC']],
            /* where: {
            [Op.or]: [
              { invertedFlowAlert: true },
              { bubbleAlert: true },
              { dripAlert: true },
              { manipulationAlert: true },
              { emptyAlert: true },
              { leakAlert: true },
            ],
          }, */
          },
        ],
      });

      let gasDevices: Device[] = await this.deviceRepository.findAll<Device>({
        where: {
          idUser: client.idUser,
          type: 0,
        },
        include: [
          {
            model: GasHistory,
            as: 'gasHistory',
            limit: 1,
            order: [['createdAt', 'DESC']],
            /* where: {
            [Op.or]: [
              { intervalAlert: true },
              { fillingAlert: true },
              { resetAlert: true },
            ],
          }, */
          },
        ],
      });

      let waterDevicesWithAlarms: number = waterDevices.filter(item => {
        if (item.waterHistory.length > 0) {
          if (
            item.waterHistory[0].reversedFlowAlert == true ||
            item.waterHistory[0].bubbleAlert == true ||
            item.waterHistory[0].dripAlert == true ||
            item.waterHistory[0].manipulationAlert == true ||
            item.waterHistory[0].emptyAlert == true ||
            item.waterHistory[0].burstAlert == true
          ) {
            return true;
          } else {
            return false;
          }
        } else {
          return false;
        }
      }).length;

      let gasDevicesWithAlarms: number = gasDevices.filter(item => {
        if (item.gasHistory.length > 0) {
          if (
            item.gasHistory[0].intervalAlert == true ||
            item.gasHistory[0].fillingAlert == true ||
            item.gasHistory[0].resetAlert == true
          ) {
            return true;
          } else {
            return false;
          }
        } else {
          return false;
        }
      }).length;

      return new ServerMessage(false, 'Conectado correctamente', {
        devicesWithAlarms: waterDevicesWithAlarms + gasDevicesWithAlarms,
      });
    } catch (error) {
      // this.logger.error(error);
      return new ServerMessage(true, 'A ocurrido un error', error);
    }
  }

  /**
   *
   */
  async getDevices(clientData: User): Promise<ServerMessage> {
    try {
      const constrants = [
        clientData == null,
        clientData == undefined,
        clientData.idUser == null,
        clientData.idUser == undefined,
      ];

      if (constrants.some(val => val)) {
        return new ServerMessage(true, 'Petición incompleta', {});
      }
      //Validation device exist
      let clientDevices: Device[] = await this.deviceRepository
        .findAll<Device>({
          attributes: { exclude: ['imei'] },
          where: {
            idUser: clientData.idUser,
            /* type : {
              [Op.or]: [0, 1]
            } */
          },
          include: [
            {
              model: Organization,
              as: 'organization',
              attributes: [
                'logoUrl',
                'comercialName',
                'primaryColor',
                'secondaryColor',
              ],
            },
            {
              model: GasHistory,
              as: 'gasHistory',
              limit: 1,
              order: [['createdAt', 'DESC']],
            },
            {
              model: WaterHistory,
              as: 'waterHistory',
              limit: 1,
              order: [['createdAt', 'DESC']],
            },
            {
              model: NaturalGasHistory,
              as: 'naturalGasHistory',
              limit: 1,
              order: [['createdAt', 'DESC']],
            },
            {
              model: WaterSettings,
              as: 'waterSettings',
            },
            {
              model: GasSettings,
              as: 'gasSettings',
            },
            {
              model: DataloggerSettings,
              as: 'dataloggerSettings',
            },
            {
              model: NaturalGasSettings,
              as: 'naturalGasSettings',
            },
            {
              model: DataloggerHistory,
              as: 'dataloggerHistory',
              limit: 1,
              order: [['createdAt', 'DESC']],
            },
          ],
        })
        .map(async (device: Device) => {
          let fixedDevice: any = device;

          //TODO: MANDAR CONSUMO TOTAL DE GAS EN TODA LA HISTORIA DEL DISPOSITIVO
          
          if (device.type == 0) {
            const searchDate: Date = getTomorrow(toLocalTime(new Date()));
            let allGasHistories: GasHistory[] = await this.gasHistoryRepository.findAll<GasHistory>({
              where: {
                idDevice: device.idDevice
              },
              order: [['dateTime', 'DESC']]
            });

            let zeroTankCapacity: boolean = false;

            //START --- LOGICA GAS ACUMULADO DEL PERIODO 
            let acumulatedGasInPeriod: number = device.gasHistory[0].accumulatedConsumption;
            let acumulatedGasConvertion: number = 0;

            if (acumulatedGasInPeriod < 0) {
              acumulatedGasInPeriod = 0;
            }else{
              if (device.tankCapacity === 0) {
                zeroTankCapacity = true;
                acumulatedGasConvertion = 0;
              }else {
                zeroTankCapacity = false;
                acumulatedGasConvertion = (acumulatedGasInPeriod * device.tankCapacity) / 100; //Asignar posteriormente a la cantidad de gas acumulado en el primer registro de historial
              }
            }

            //START --- LOGICA GAS CONSUMIDO ACUMULADO HISTORICO
            let totalGasConsumed:number = 0;

            for (let i = 0; i < allGasHistories.length - 1; i++) {
              let currentMeasure:number = allGasHistories[i].measure;
              let nextMeasure:number = allGasHistories[i + 1].measure;

              // si la medida actual es mayor que la próxima, significa que hubo consumo
              if (currentMeasure > nextMeasure) {
                totalGasConsumed += currentMeasure - nextMeasure;
              }
            }

            
            let totalGasVolume: number = 0;

            //Checar si tiene configurado la capacidad de tanque 
            if (device.tankCapacity === 0) {
              zeroTankCapacity = true;
            }
            // convierte el porcentaje total a volumen
            else {
              totalGasVolume = (totalGasConsumed * device.tankCapacity) / 100;
              zeroTankCapacity = false;
            }

            //END --- LOGICA GAS CONSUMIDO ACUMULADO HISTORICO

            //El objeto que sera guardado que representa el dispositivo de gas en la actual iteracion del ciclo forEach
            
            let modifiedGasHistory: GasHistory = device.gasHistory[0];
            modifiedGasHistory.accumulatedConsumption = totalGasVolume;

            return Object.assign({
                idDevice: device.idDevice,
                name: device.name,
                serialNumber: device.serialNumber,
                type: device.type,
                organization: device.organization,
                gasHistory: [modifiedGasHistory], //TODO: MODIFICAR EL OBJETO QUE SE REGRESA Y AGREGAR LOS VALORES CAMBIADOS DE ACUMULADO, ZEROTANK, ACUMULADO HISTORICO
                gasSetting: device.gasSettings,
                waterHistory: device.waterHistory,
                waterSettings: device.waterSettings,
                zeroTankCapacity: zeroTankCapacity, 
                totalGasConsumed: totalGasVolume,
            });
            
          }
          if (device.type == 1) {
            let todayDay = toLocalTime(new Date());
            let fromDate = new Date(
              todayDay.getFullYear(),
              todayDay.getMonth(),
              device.waterSettings.serviceOutageDay,
              0,
              0,
              1,
            );

            if (device.waterSettings.serviceOutageDay > todayDay.getDate()) {
              fromDate = new Date(
                todayDay.getFullYear(),
                todayDay.getMonth() - 1,
                device.waterSettings.serviceOutageDay,
                0,
                0,
                1,
              );
            }
            fromDate = toLocalTime(fromDate);

            let actualPeriod: WaterHistory[] = await this.waterHistoryRepository.findAll(
              {
                attributes: ['idWaterHistory', 'consumption', 'createdAt'],
                where: {
                  idDevice: device.idDevice,
                  [Op.or]: [
                    {
                      createdAt: {
                        [Op.between]: [
                          (fromDate.toISOString() as unknown) as number,
                          (todayDay.toISOString() as unknown) as number,
                        ],
                      },
                    },
                    {
                      createdAt: fromDate.toISOString(),
                    },
                    {
                      createdAt: todayDay.toISOString(),
                    },
                  ],
                },
                limit: 1,
                order: [['createdAt', 'DESC']],
              },
            );

            let lastPeriodHistory: WaterHistory[] = await this.waterHistoryRepository.findAll(
              {
                attributes: ['idWaterHistory', 'consumption', 'createdAt'],
                where: {
                  idDevice: device.idDevice,
                  createdAt: {
                    [Op.lte]: fromDate.toISOString(),
                  },
                },
                limit: 1,
                order: [['createdAt', 'DESC']],
              },
            );
            //console.log("today",todayDay);
            //console.log("fromDate",fromDate);

            let litersConsumedThisMonth: number = 0;
            let actualPeriodMetry: number = 0;
            let lastPeriodMetry: number = 0;

            if (actualPeriod.length == 0 && lastPeriodHistory.length == 0) {
              litersConsumedThisMonth = 0;
            } else if (
              actualPeriod.length > 0 &&
              lastPeriodHistory.length == 0
            ) {
              litersConsumedThisMonth = actualPeriod[0].consumption;
              actualPeriodMetry = actualPeriod[0].consumption;
            } else if (
              actualPeriod.length == 0 &&
              lastPeriodHistory.length == 1
            ) {
              litersConsumedThisMonth = 0;
            } else if (
              actualPeriod.length > 0 &&
              lastPeriodHistory.length == 1
            ) {
              //Falta el quinto if
              if (
                actualPeriod[0].consumption < lastPeriodHistory[0].consumption
              ) {
                let maximumNumberLiters: number = 999999999999;
                if (device.version == 1) {
                  //For industry version
                  //Si es de tipo industrial o alguna otra version hay que poner el numero de dígitos máximos
                  //escribiendo el mayor numero posible para desplegar
                }
                litersConsumedThisMonth =
                  actualPeriod[0].consumption +
                  (maximumNumberLiters - lastPeriodHistory[0].consumption);
              } else {
                litersConsumedThisMonth =
                  actualPeriod[0].consumption -
                  lastPeriodHistory[0].consumption;
              }
              actualPeriodMetry = actualPeriod[0].consumption;
              lastPeriodMetry = lastPeriodHistory[0].consumption;
            }

            // console.log("Consumo Actual (litros) : ", litersConsumedThisMonth);
            // console.log("Consumo Actual (m3) : ", ( litersConsumedThisMonth / 1000 ));

            return Object.assign({
              litersConsumedThisMonth: litersConsumedThisMonth.toFixed(2),
              actualPeriodMetry: actualPeriodMetry,
              lastPeriodMetry: lastPeriodMetry,

              idDevice: device.idDevice,
              name: device.name,
              serialNumber: device.serialNumber,
              type: device.type,
              organization: device.organization,
              gasHistory: device.gasHistory,
              waterHistory: device.waterHistory,
              waterSettings: device.waterSettings,
            });
          } else if (device.type == 2) {
            let numAlerts = 0;

            if (device.dataloggerHistory.length > 0) {
              //Se crean las alertas en caso de que se requiera
              if (device.dataloggerHistory[0].alerts > 0) {
                let original: DataloggerHistoryAdapter = new DataloggerHistoryAdapter(
                  device.dataloggerHistory[0],
                );

                original.formatAlerts(device.dataloggerSettings);
                let fixedAlerts = original.alerts;

                let binAlerts = fixedAlerts.toString(2).split('');

                binAlerts = binAlerts.filter(alert => {
                  return alert == '1';
                });

                numAlerts = binAlerts.length;
              }
            }

            return Object.assign({
              numAlerts: numAlerts,

              idDevice: device.idDevice,
              name: device.name,
              serialNumber: device.serialNumber,
              type: device.type,
              organization: device.organization,
              gasHistory: device.gasHistory,
              waterHistory: device.waterHistory,
              waterSettings: device.waterSettings,
              dataloggerHistory: device.dataloggerHistory,
              dataloggerSettings: device.dataloggerSettings,
            });
          } else if (device.type == 3) {
            //console.log(dataToSearch);

            let todayDay = toLocalTime(new Date());
            let fromDate = new Date(
              todayDay.getFullYear(),
              todayDay.getMonth(),
              device.naturalGasSettings.serviceOutageDay,
              0,
              0,
              1,
            );

            if (
              device.naturalGasSettings.serviceOutageDay > todayDay.getDate()
            ) {
              fromDate = new Date(
                todayDay.getFullYear(),
                todayDay.getMonth() - 1,
                device.naturalGasSettings.serviceOutageDay,
                0,
                0,
                1,
              );
            }
            fromDate = toLocalTime(fromDate);

            let actualPeriod: NaturalGasHistory[] = await this.naturalGasHistoryRepository.findAll<
              NaturalGasHistory
            >({
              attributes: ['idHistory', 'consumption', 'dateTime'],
              where: {
                idDevice: device.idDevice,
                [Op.or]: [
                  {
                    dateTime: {
                      [Op.between]: [
                        (fromDate.toISOString() as unknown) as number,
                        (todayDay.toISOString() as unknown) as number,
                      ],
                    },
                  },
                  {
                    dateTime: fromDate.toISOString(),
                  },
                  {
                    dateTime: todayDay.toISOString(),
                  },
                ],
              },
              limit: 1,
              order: [['dateTime', 'DESC']],
            });

            let lastPeriodHistory: NaturalGasHistory[] = await this.naturalGasHistoryRepository.findAll<
              NaturalGasHistory
            >({
              attributes: ['idHistory', 'consumption', 'dateTime'],
              where: {
                idDevice: device.idDevice,
                dateTime: {
                  [Op.lte]: fromDate.toISOString(),
                },
              },
              limit: 1,
              order: [['dateTime', 'DESC']],
            });
            //console.log("today",todayDay);
            //console.log("fromDate",fromDate);

            let litersConsumedThisMonth: number = 0;
            let actualPeriodMetry: number = 0;
            let lastPeriodMetry: number = 0;

            if (actualPeriod.length == 0 && lastPeriodHistory.length == 0) {
              litersConsumedThisMonth = 0;
            } else if (
              actualPeriod.length > 0 &&
              lastPeriodHistory.length == 0
            ) {
              litersConsumedThisMonth = actualPeriod[0].consumption;
              actualPeriodMetry = actualPeriod[0].consumption;
            } else if (
              actualPeriod.length == 0 &&
              lastPeriodHistory.length == 1
            ) {
              litersConsumedThisMonth = 0;
            } else if (
              actualPeriod.length > 0 &&
              lastPeriodHistory.length == 1
            ) {
              //Falta el quinto if
              if (
                actualPeriod[0].consumption < lastPeriodHistory[0].consumption
              ) {
                let maximumNumberLiters: number = 999999999999;
                if (device.version == 1) {
                  //For industry version
                  //Si es de tipo industrial o alguna otra version hay que poner el numero de dígitos máximos
                  //escribiendo el mayor numero posible para desplegar
                }
                litersConsumedThisMonth =
                  actualPeriod[0].consumption +
                  (maximumNumberLiters - lastPeriodHistory[0].consumption);
              } else {
                litersConsumedThisMonth =
                  actualPeriod[0].consumption -
                  lastPeriodHistory[0].consumption;
              }
              actualPeriodMetry = actualPeriod[0].consumption;
              lastPeriodMetry = lastPeriodHistory[0].consumption;
            }

            //console.log("Consumo Actual (litros) : ", litersConsumedThisMonth);
            //console.log("Consumo Actual (m3) : ", ( litersConsumedThisMonth / 1000 ));

            return Object.assign({
              litersConsumedThisMonth: litersConsumedThisMonth /* .toFixed(2) */,
              actualPeriodMetry: actualPeriodMetry,
              lastPeriodMetry: lastPeriodMetry,

              idDevice: device.idDevice,
              name: device.name,
              serialNumber: device.serialNumber,
              type: device.type,
              organization: device.organization,
              gasHistory: device.gasHistory,
              waterHistory: device.waterHistory,
              waterSettings: device.waterSettings,
              naturalGasSettings: device.naturalGasSettings,
              naturalGasHistory: device.naturalGasHistory,
            });
          } else {
            return Object.assign(fixedDevice);
          }
        });

      return new ServerMessage(false, 'Dispositivos obtenidos correctamente', {
        clientDevices: clientDevices,
      });
    } catch (error) {
      this.logger.error(error);
      return new ServerMessage(true, 'A ocurrido un error', error);
    }
  }

  



  /**
   *
   */
  async addDevice(
    clientData: User,
    deviceData: Device,
  ): Promise<ServerMessage> {
    try {
      const constrants = [
        clientData == null,
        clientData == undefined,
        deviceData.serialNumber == null,
        deviceData.serialNumber == undefined,
        deviceData.type == null,
        deviceData.type == undefined,
      ];

      if (constrants.some(val => val)) {
        return new ServerMessage(true, 'Petición incompleta', {});
      }

      //Validation device exist
      let deviceToUpdate: Device = await this.deviceRepository.findOne<Device>({
        where: {
          serialNumber: deviceData.serialNumber,
          type: deviceData.type,
        },
        include: [
          {
            model: User,
            as: 'user',
          },
        ],
      });

      if (!deviceToUpdate) {
        return new ServerMessage(true, 'Dispositivo no disponible', {});
      } else if (deviceToUpdate.user.idUser == clientData.idUser) {
        return new ServerMessage(
          true,
          'Dispositivo actualmente en la lista',
          {},
        );
      } /* else if (deviceToUpdate.user.idRole == 7) {
        return new ServerMessage(true, 'Dispositivo no disponible', {});
      } */ else if (
        deviceToUpdate.isActive == false
      ) {
        return new ServerMessage(true, 'Dispositivo no disponible', {});
      }

      deviceToUpdate.idUser = clientData.idUser;
      deviceToUpdate.isActive = false;
      await deviceToUpdate.save();

      return new ServerMessage(false, 'Conectado correctamente', {});
    } catch (error) {
      // this.logger.error(error);
      return new ServerMessage(true, 'A ocurrido un error', error);
    }
  }

  /**
   *
   */
  async getNaturalGasDeviceData(
    clientData: any,
    idDevice: number,
    period: number,
  ): Promise<ServerMessage> {
    try {
      const constrants = [
        clientData == null,
        clientData == undefined,
        idDevice == null,
        idDevice == undefined,
        period == null,
        period == undefined,
      ];

      if (constrants.some(val => val)) {
        return new ServerMessage(true, 'Petición incompleta', {});
      }

      //Validation device exist
      let deviceData: Device = (await this.deviceRepository.findOne<Device>({
        attributes: { exclude: ['imei'] },
        where: {
          idDevice: idDevice,
          type: 3,
          idUser: (clientData as User).idUser,
        },
        include: [
          {
            model: Apn,
            as: 'apn',
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
          {
            model: Organization,
            as: 'organization',
            attributes: [
              'logoUrl',
              'comercialName',
              'primaryColor',
              'secondaryColor',
            ],
          },
          {
            model: NaturalGasHistory,
            as: 'naturalGasHistory',
            limit: 1,
            order: [['dateTime', 'DESC']],
          },
          {
            model: NaturalGasSettings,
            as: 'naturalGasSettings',
          },
        ],
      })) as Device;

      if (!deviceData.naturalGasSettings) {
        return new ServerMessage(true, 'El dispositivo no esta disponible', {});
      }

      let todayDay = toLocalTime(new Date());
      //Se checa si el dispositivo tiene una suscripción activa
      let activeSuscription = false;

      /* if (todayDay > deviceData.validUntil) {
        return new ServerMessage(false, 'Suscripción inactiva', {
          deviceData: deviceData,
          updated: true,
          litersConsumedThisMonth: 0,
          monthMaxConsumption: 0,
          serviceOutageDay: 0,

          actualPeriodMetry: 0,
          lastPeriodMetry: 0,

          actualLabels: [],
          actualPeriodValues: 0,
          limitValueLine: 0,
          lastPeriodUpdate: 'Sin indicar',

          periodHistorial: [],
          activeSuscription: activeSuscription
        });
      } */

      activeSuscription = true;

      if (period > 0) {
        if (
          deviceData.naturalGasSettings.serviceOutageDay < todayDay.getDate()
        ) {
          todayDay = toLocalTime(
            new Date(
              todayDay.getFullYear(),
              todayDay.getMonth() - (period - 1),
              deviceData.naturalGasSettings.serviceOutageDay,
              0,
              0,
              1,
            ),
          );
        } else {
          todayDay = toLocalTime(
            new Date(
              todayDay.getFullYear(),
              todayDay.getMonth() - period,
              deviceData.naturalGasSettings.serviceOutageDay,
              0,
              0,
              1,
            ),
          );
        }
      }

      let fromDate = new Date(
        todayDay.getFullYear(),
        todayDay.getMonth(),
        deviceData.naturalGasSettings.serviceOutageDay,
        0,
        0,
        1,
      );

      if (deviceData.naturalGasSettings.serviceOutageDay > todayDay.getDate()) {
        fromDate = new Date(
          todayDay.getFullYear(),
          todayDay.getMonth() - 1,
          deviceData.naturalGasSettings.serviceOutageDay,
          0,
          0,
          1,
        );
      }

      fromDate = toLocalTime(fromDate);

      //console.log("today",todayDay);
      //console.log("fromDate",fromDate);

      let actualPeriod: NaturalGasHistory[] = await this.naturalGasHistoryRepository.findAll<
        NaturalGasHistory
      >({
        attributes: ['idHistory', 'consumption', 'dateTime'],
        where: {
          idDevice: deviceData.idDevice,
          [Op.or]: [
            {
              dateTime: {
                [Op.between]: [
                  (fromDate.toISOString() as unknown) as number,
                  (todayDay.toISOString() as unknown) as number,
                ],
              },
            },
            {
              dateTime: fromDate.toISOString(),
            },
            {
              dateTime: todayDay.toISOString(),
            },
          ],
        },
        //limit: 1,
        order: [['dateTime', 'DESC']],
      });

      let lastPeriodHistory: NaturalGasHistory[] = await this.naturalGasHistoryRepository.findAll<
        NaturalGasHistory
      >({
        attributes: ['idHistory', 'consumption', 'dateTime'],
        where: {
          idDevice: deviceData.idDevice,
          dateTime: {
            [Op.lte]: fromDate.toISOString(),
          },
        },
        limit: 1,
        order: [['dateTime', 'DESC']],
      });

      //console.log("actual period",actualPeriod);

      let litersConsumedThisMonth: number = 0;
      let actualPeriodMetry: number = 0;
      let lastPeriodMetry: number = 0;

      if (actualPeriod.length == 0 && lastPeriodHistory.length == 0) {
        litersConsumedThisMonth = 0;
      } else if (actualPeriod.length > 0 && lastPeriodHistory.length == 0) {
        litersConsumedThisMonth = actualPeriod[0].consumption;
        actualPeriodMetry = actualPeriod[0].consumption;
      } else if (actualPeriod.length == 0 && lastPeriodHistory.length == 1) {
        litersConsumedThisMonth = 0;
      } else if (actualPeriod.length > 0 && lastPeriodHistory.length == 1) {
        //Falta el quinto if
        if (actualPeriod[0].consumption < lastPeriodHistory[0].consumption) {
          let maximumNumberLiters: number = 999999999999;
          if (deviceData.version == 1) {
            //For industry version
            //Si es de tipo industrial o alguna otra version hay que poner el numero de dígitos máximos
            //escribiendo el mayor numero posible para desplegar
          }
          litersConsumedThisMonth =
            actualPeriod[0].consumption +
            (maximumNumberLiters - lastPeriodHistory[0].consumption);
        } else {
          litersConsumedThisMonth =
            actualPeriod[0].consumption - lastPeriodHistory[0].consumption;
        }
        actualPeriodMetry = actualPeriod[0].consumption;
        lastPeriodMetry = lastPeriodHistory[0].consumption;
      }

      //console.log("Consumo Actual (litros) : ", litersConsumedThisMonth);
      //console.log("Consumo Actual (m3) : ", ( litersConsumedThisMonth / 1000 ));

      let actualLabels: any[] = [];
      let limitValueLine: any[] = [];
      let actualPeriodValues: any[] = [];

      actualPeriod.forEach(async (history: NaturalGasHistory) => {
        //console.log(history.consumption);
        //actualPeriodValues.push(history.consumption - lastPeriodMetry); //litros del mes hasta esa
        actualPeriodValues = [
          new Number(
            (history.consumption - lastPeriodMetry) /* / 1000 */
              .toFixed(2),
          ),
          ...actualPeriodValues,
        ]; //litros del mes hasta esa
        actualLabels = [this.getOnlyDate(history.dateTime), ...actualLabels];
        limitValueLine.push(deviceData.naturalGasSettings.monthMaxConsumption);
      });

      return new ServerMessage(false, 'Información obtenida correctamente', {
        deviceData: deviceData,
        //updated: deviceData.naturalGasSettings.wereApplied,

        litersConsumedThisMonth: new Number(litersConsumedThisMonth.toFixed(2)),
        monthMaxConsumption: deviceData.naturalGasSettings.monthMaxConsumption,
        serviceOutageDay: deviceData.naturalGasSettings.serviceOutageDay,

        actualPeriodMetry: actualPeriodMetry,
        lastPeriodMetry: lastPeriodMetry,

        actualLabels: actualLabels,
        actualPeriodValues: actualPeriodValues,
        limitValueLine: limitValueLine,
        lastPeriodUpdate:
          actualPeriod.length == 0
            ? 'Sin indicar'
            : this.getOnlyDate(actualPeriod[0].dateTime),

        periodHistorial: actualPeriod,
        activeSuscription: activeSuscription,
      });
    } catch (error) {
      // this.logger.error(error);
      return new ServerMessage(true, 'A ocurrido un error', error);
    }
  }

  /**
   *
   */
  async getNaturalGasDeviceSettings(
    client: User,
    idDevice: any,
  ): Promise<ServerMessage> {
    try {
      if (
        client == null ||
        client == undefined ||
        idDevice == null ||
        idDevice == undefined
      ) {
        return new ServerMessage(true, 'Petición incompleta', {});
      }

      let naturalGasSettings: NaturalGasSettings = await this.naturalGasSettingsRepository.findOne<
        NaturalGasSettings
      >({
        where: {
          idDevice: idDevice,
        },
        include: [
          {
            model: Device,
            as: 'device',
            where: {
              //idDevice : idDevice,
              idUser: client.idUser,
              type: 3,
            },
          },
        ],
      });

      if (!naturalGasSettings) {
        return new ServerMessage(true, 'Dispositivo no disponible', {});
      }

      //check if the device belongs to the main organization
      let deviceData: Device = await this.deviceRepository.findOne({
        where: {
          idDevice: idDevice,
          idUser: client.idUser,
          type: 3,
        },
        include: [
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

      return new ServerMessage(
        false,
        'Ajustes del dispositivo obtenidos con éxito',
        {
          belongsToMain:
            deviceData.organization.users.length == 0 ? false : true,
          naturalGasSettings: naturalGasSettings,
        },
      );
    } catch (error) {
      // this.logger.error(error);
      return new ServerMessage(true, 'Ha ocurrido un error', error);
    }
  }

  /**
   *
   */
  async updateSettingsNaturalServiceMonthMaxConsumption(
    client: User,
    settings: any,
  ): Promise<ServerMessage> {
    try {
      if (
        client == null ||
        client == undefined ||
        settings.idDevice == null ||
        settings.idDevice == undefined ||
        settings.monthMaxConsumption == null ||
        settings.monthMaxConsumption == undefined
      ) {
        return new ServerMessage(true, 'Petición incompleta', {});
      }

      let newSettings: NaturalGasSettings = await this.naturalGasSettingsRepository.findOne<
        NaturalGasSettings
      >({
        where: {
          idDevice: settings.idDevice,
        },
      });

      if (!newSettings) {
        return new ServerMessage(true, 'EL dispositivo no esta disponible', {});
      }

      newSettings.monthMaxConsumption = settings.monthMaxConsumption;
      await newSettings.save();

      return new ServerMessage(false, 'Actualizado con éxito.', {});
    } catch (error) {
      // this.logger.error(error);
      return new ServerMessage(true, 'Ha ocurrido un error', error);
    }
  }

  /**
   *
   */
  async getDeviceWaterData(
    clientData: any,
    idDevice: number,
    period: number,
  ): Promise<ServerMessage> {
    try {
      const constrants = [
        clientData == null,
        clientData == undefined,
        idDevice == null,
        idDevice == undefined,
        period == null,
        period == undefined,
      ];

      if (constrants.some(val => val)) {
        return new ServerMessage(true, 'Petición incompleta', {});
      }

      //Validation device exist
      let deviceData: Device = await this.deviceRepository.findOne<Device>({
        attributes: { exclude: ['imei'] },
        where: {
          idDevice: idDevice,
          idUser: (clientData as User).idUser,
        },
        include: [
          {
            model: Apn,
            as: 'apn',
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
          {
            model: Organization,
            as: 'organization',
            attributes: [
              'logoUrl',
              'comercialName',
              'primaryColor',
              'secondaryColor',
            ],
          },
          {
            model: GasHistory,
            as: 'gasHistory',
            limit: 1,
            order: [['createdAt', 'DESC']],
          },
          {
            model: WaterHistory,
            as: 'waterHistory',
            limit: 1,
            order: [['dateTime', 'DESC']],
          },
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

      if (!deviceData.waterSettings) {
        return new ServerMessage(true, 'El dispositivo no esta disponible', {});
      }

      let todayDay = toLocalTime(new Date());
      //Se checa si el dispositivo tiene una suscripción activa
      let activeSuscription = false;

      if (todayDay > deviceData.validUntil) {
        return new ServerMessage(false, 'Suscripción inactiva', {
          deviceData: deviceData,
          updated: true,
          litersConsumedThisMonth: 0,
          monthMaxConsumption: 0,
          serviceOutageDay: 0,

          actualPeriodMetry: 0,
          lastPeriodMetry: 0,

          actualLabels: [],
          actualPeriodValues: 0,
          limitValueLine: 0,
          lastPeriodUpdate: 'Sin indicar',

          periodHistorial: [],
          activeSuscription: activeSuscription,
        });
      }

      activeSuscription = true;

      if (period > 0) {
        if (deviceData.waterSettings.serviceOutageDay < todayDay.getDate()) {
          todayDay = toLocalTime(
            new Date(
              todayDay.getFullYear(),
              todayDay.getMonth() - (period - 1),
              deviceData.waterSettings.serviceOutageDay,
              0,
              0,
              1,
            ),
          );
        } else {
          todayDay = toLocalTime(
            new Date(
              todayDay.getFullYear(),
              todayDay.getMonth() - period,
              deviceData.waterSettings.serviceOutageDay,
              0,
              0,
              1,
            ),
          );
        }
      }

      let fromDate = new Date(
        todayDay.getFullYear(),
        todayDay.getMonth(),
        deviceData.waterSettings.serviceOutageDay,
        0,
        0,
        1,
      );

      if (deviceData.waterSettings.serviceOutageDay > todayDay.getDate()) {
        fromDate = new Date(
          todayDay.getFullYear(),
          todayDay.getMonth() - 1,
          deviceData.waterSettings.serviceOutageDay,
          0,
          0,
          1,
        );
      }

      // console.log("today",todayDay);
      // console.log("fromDate",fromDate);

      fromDate = toLocalTime(fromDate);
      // extrayendo los historiales en donde se efectuó
      // un llenado del tanque, desde el inicio de los
      // registros hasta el día de hoy
      const searchDate: Date = getTomorrow(todayDay);

      let actualPeriod: WaterHistory[] = await this.waterHistoryRepository.findAll(
        {
          attributes: ['idWaterHistory', 'consumption', 'flow', 'dateTime'],
          where: {
            idDevice: deviceData.idDevice,
            [Op.or]: [
              {
                dateTime: {
                  [Op.between]: [
                    (fromDate.toISOString() as unknown) as number,
                    (searchDate.toISOString() as unknown) as number,
                  ],
                },
              },
              {
                dateTime: fromDate.toISOString(),
              },
              {
                dateTime: searchDate.toISOString(),
              },
            ],
          },
          //limit: 1,
          order: [['dateTime', 'DESC']],
        },
      );

      let lastPeriodHistory: WaterHistory[] = await this.waterHistoryRepository.findAll<
        WaterHistory
      >({
        attributes: ['idWaterHistory', 'consumption', 'dateTime'],
        where: {
          idDevice: deviceData.idDevice,
          dateTime: {
            [Op.lte]: fromDate.toISOString(),
          },
        },
        limit: 1,
        order: [['dateTime', 'DESC']],
      });

      //console.log("actual period",actualPeriod);

      let litersConsumedThisMonth: number = 0;
      let actualPeriodMetry: number = 0;
      let lastPeriodMetry: number = 0;

      if (actualPeriod.length == 0 && lastPeriodHistory.length == 0) {
        litersConsumedThisMonth = 0;
      } else if (actualPeriod.length > 0 && lastPeriodHistory.length == 0) {
        litersConsumedThisMonth = actualPeriod[0].consumption;
        actualPeriodMetry = actualPeriod[0].consumption;
      } else if (actualPeriod.length == 0 && lastPeriodHistory.length == 1) {
        litersConsumedThisMonth = 0;
      } else if (actualPeriod.length > 0 && lastPeriodHistory.length == 1) {
        //Falta el quinto if
        if (actualPeriod[0].consumption < lastPeriodHistory[0].consumption) {
          let maximumNumberLiters: number = 999999999999;
          if (deviceData.version == 1) {
            //For industry version
            //Si es de tipo industrial o alguna otra version hay que poner el numero de dígitos máximos
            //escribiendo el mayor numero posible para desplegar
          }
          litersConsumedThisMonth =
            actualPeriod[0].consumption +
            (maximumNumberLiters - lastPeriodHistory[0].consumption);
        } else {
          litersConsumedThisMonth =
            actualPeriod[0].consumption - lastPeriodHistory[0].consumption;
        }
        actualPeriodMetry = actualPeriod[0].consumption;
        lastPeriodMetry = lastPeriodHistory[0].consumption;
      }

      //console.log("Consumo Actual (litros) : ", litersConsumedThisMonth);
      //console.log("Consumo Actual (m3) : ", ( litersConsumedThisMonth / 1000 ));

      let actualLabels: any[] = [];
      let limitValueLine: any[] = [];
      let actualPeriodValues: any[] = [];

      actualPeriod.forEach(async (history: WaterHistory) => {
        //console.log(history.consumption);
        //actualPeriodValues.push(history.consumption - lastPeriodMetry); //litros del mes hasta esa
        actualPeriodValues = [
          new Number((history.consumption - lastPeriodMetry).toFixed(2)),
          ...actualPeriodValues,
        ]; //litros del mes hasta esa
        actualLabels = [this.getOnlyDate(history.dateTime), ...actualLabels];
        limitValueLine.push(deviceData.waterSettings.monthMaxConsumption);
        history.consumption = history.consumption * 1000;
      });

      return new ServerMessage(false, 'Información obtenida correctamente', {
        deviceData: deviceData,
        updated: deviceData.waterSettings.wereApplied,

        litersConsumedThisMonth: new Number(litersConsumedThisMonth.toFixed(2)),
        monthMaxConsumption: deviceData.waterSettings.monthMaxConsumption,
        serviceOutageDay: deviceData.waterSettings.serviceOutageDay,

        actualPeriodMetry: actualPeriodMetry,
        lastPeriodMetry: lastPeriodMetry * 1000,
        actualLabels: actualLabels,
        actualPeriodValues: actualPeriodValues,
        limitValueLine: limitValueLine,
        lastPeriodUpdate:
          actualPeriod.length == 0
            ? 'Sin indicar'
            : this.getOnlyDate(actualPeriod[0].dateTime),

        periodHistorial: actualPeriod,
        activeSuscription: activeSuscription,
      });
    } catch (error) {
      // this.logger.error(error);
      return new ServerMessage(true, 'A ocurrido un error', error);
    }
  }

  /**
   *
   */
  async updateDeviceName(
    clientData: User,
    deviceData: Device,
  ): Promise<ServerMessage> {
    try {
      const constrants = [
        clientData == null,
        clientData == undefined,
        deviceData.idDevice == null,
        deviceData.idDevice == undefined,
        deviceData.name == null,
        deviceData.name == undefined,
      ];

      if (constrants.some(val => val)) {
        return new ServerMessage(true, 'Petición incompleta', {});
      }

      //Validation device exist
      let deviceToUpdate: Device = await this.deviceRepository.findOne<Device>({
        where: {
          idDevice: deviceData.idDevice,
          idUser: clientData.idUser,
        },
        include: [
          {
            model: User,
            as: 'user',
          },
        ],
      });

      if (!deviceToUpdate) {
        return new ServerMessage(true, 'Dispositivo no disponible', {});
      } else if (deviceToUpdate.user.idRole != 7) {
        return new ServerMessage(true, 'Dispositivo no disponible', {});
      }

      deviceToUpdate.name = deviceData.name;
      await deviceToUpdate.save();

      return new ServerMessage(false, 'Nombre actualizado', {});
    } catch (error) {
      // this.logger.error(error);
      return new ServerMessage(
        true,
        'A ocurrido un error actualizando el nombre',
        error,
      );
    }
  }

  /**
   *
   */
  async getIndividualLoggerDeviceData(
    query: { idDevice: number },
    idUser: number,
  ): Promise<ServerMessage> {
    try {
      if (idUser == null || idUser == undefined) {
        return new ServerMessage(true, 'Petición incompleta', {});
      }

      //Validation device exist
      let deviceData: Device = await this.deviceRepository.findOne<Device>({
        attributes: { exclude: ['imei'] },
        where: {
          idDevice: query.idDevice,
          idUser: idUser,
          type: 2,
        },
        include: [
          {
            model: DataloggerSettings,
            as: 'dataloggerSettings',
          },
        ],
      });

      if (!deviceData) {
        return new ServerMessage(true, 'El dispositivo no esta disponible', {});
      }
      //Se checa si el dispositivo tiene una suscripción activa
      let activeSuscription = false;

      if (toLocalTime(new Date()) > deviceData.validUntil) {
        return new ServerMessage(false, 'Suscripción inactiva', {
          deviceData: deviceData,
          toDate: new Date(),
          fromDate: new Date(),
          periodHistorial: [],
          lastHistorial: [],
          activeSuscription: activeSuscription,
        });
      }

      activeSuscription = true;

      let lastHistorial: DataloggerHistory[] = await this.dataloggerHistoryRepository.findAll<
        DataloggerHistory
      >({
        where: {
          idDevice: deviceData.idDevice,
        },
        limit: 1,
        order: [['dateTime', 'DESC']],
      });

      // retornar el periodo solicitado
      return new ServerMessage(false, 'Información obtenida correctamente', {
        deviceData: deviceData,
        activeSuscription: activeSuscription,
        lastHistorial: lastHistorial,
      });
    } catch (error) {
      this.logger.error(error);
      return new ServerMessage(true, 'Ha ocurrido un error', error);
    }
  }

  /**
   *
   */
  async getQueryHistoryFromTOLoggerDeviceData(
    query: { idDevice: number; fromDate: Date; toDate: Date },
    idUser: number,
  ): Promise<ServerMessage> {
    try {
      if (
        idUser == null ||
        idUser == undefined ||
        query.idDevice == null ||
        query.idDevice == undefined ||
        query.fromDate == null ||
        query.fromDate == undefined ||
        query.toDate == null ||
        query.toDate == undefined
      ) {
        return new ServerMessage(true, 'Petición incompleta', {});
      }
      query.fromDate = new Date(query.fromDate);
      query.toDate = new Date(query.toDate);

      //Validation device exist
      let deviceData: Device = await this.deviceRepository.findOne<Device>({
        attributes: { exclude: ['imei'] },
        where: {
          idDevice: query.idDevice,
          idUser: idUser,
          type: 2,
        },
        include: [
          {
            model: DataloggerSettings,
            as: 'dataloggerSettings',
          },
        ],
      });

      if (!deviceData) {
        return new ServerMessage(true, 'El dispositivo no esta disponible', {});
      }
      //Se checa si el dispositivo tiene una suscripción activa
      let activeSuscription = false;

      if (toLocalTime(new Date()) > deviceData.validUntil) {
        return new ServerMessage(false, 'Suscripción inactiva', {
          deviceData: deviceData,
          toDate: new Date(),
          fromDate: new Date(),
          periodHistorial: [],
          lastHistorial: [],
          /* periodHistories: [],
          periodLabels: [],
          periodValues: [],
          lastPeriodUpdate: "Sin registros",
          lastPastPeriodMeasure : 0, */
          activeSuscription: activeSuscription,
        });
      }

      activeSuscription = true;

      let periodHistorial: DataloggerHistory[] = await this.dataloggerHistoryRepository.findAll<
        DataloggerHistory
      >({
        /* attributes: [], */
        where: {
          idDevice: deviceData.idDevice,
          [Op.or]: [
            {
              dateTime: {
                [Op.between]: [
                  (query.fromDate.toISOString() as unknown) as number,
                  (query.toDate.toISOString() as unknown) as number,
                ],
              },
            },
            {
              dateTime: query.fromDate.toISOString(),
            },
            {
              dateTime: query.toDate.toISOString(),
            },
          ],
        },
        //limit: 1,
        order: [['dateTime', 'DESC']],
      });

      /* Genera el color para nuestra grafica */
      let randomColor1 = (Math.random() * (150 - 50) + 50).toFixed(0);
      let randomColor2 = (Math.random() * (150 - 50) + 50).toFixed(0);
      let randomColor3 = (Math.random() * (150 - 50) + 50).toFixed(0);
      let setColor =
        'rgba( ' +
        randomColor1 +
        ' ,' +
        randomColor2 +
        ' ,' +
        randomColor3 +
        ',0.4)';

      let actualFromToLabels: any[] = [];

      let analog1FromToValues: any[] = [];
      let analog2FromToValues: any[] = [];
      let analog3FromToValues: any[] = [];
      let analog4FromToValues: any[] = [];

      let consumption1FromToValues: any[] = [];
      let consumption2FromToValues: any[] = [];

      let flow1FromToValues: any[] = [];
      let flow2FromToValues: any[] = [];

      let batteryLevelFromToValues: any[] = [];
      let signalQualityFromToValues: any[] = [];

      const decodeDigitalInputs = (input: number): Array<number> => {
        const PARAMS: number = 4;
        let ans: Array<number> = [];
        for (let idx: number = 0; idx < PARAMS; ++idx) {
          ans.push((input >>> idx) & 0x01);
        }
        return ans;
      };

      let d1Inputs = [];
      let d2Inputs = [];
      let d3Inputs = [];
      let d4Inputs = [];

      let d1Outputs = [];
      let d2Outputs = [];
      let d3Outputs = [];
      let d4Outputs = [];

      let d1Alarms = [];
      let d2Alarms = [];
      let d3Alarms = [];
      let d4Alarms = [];

      let al1Alarms = [];
      let al2Alarms = [];
      let al3Alarms = [];
      let al4Alarms = [];

      let ah1Alarms = [];
      let ah2Alarms = [];
      let ah3Alarms = [];
      let ah4Alarms = [];

      let ql1Alarms = [];
      let ql2Alarms = [];
      let ql3Alarms = [];
      let ql4Alarms = [];

      periodHistorial.forEach(async (history: DataloggerHistory) => {
        let dateTimeFixed = this.getDateTimepikerFormat(
          this.convertDateToUTC(history.dateTime),
        );
        actualFromToLabels.push(dateTimeFixed);

        analog1FromToValues.push({
          x: dateTimeFixed,
          y: history.analogInput1,
        });

        analog2FromToValues.push({
          x: dateTimeFixed,
          y: history.analogInput2,
        });

        analog3FromToValues.push({
          x: dateTimeFixed,
          y: history.analogInput3,
        });

        analog4FromToValues.push({
          x: dateTimeFixed,
          y: history.analogInput4,
        });

        consumption1FromToValues.push({
          x: dateTimeFixed,
          y: history.consumption1,
        });
        consumption2FromToValues.push({
          x: dateTimeFixed,
          y: history.consumption2,
        });

        flow1FromToValues.push({
          x: dateTimeFixed,
          y: history.flow1,
        });
        flow2FromToValues.push({
          x: dateTimeFixed,
          y: history.flow2,
        });

        batteryLevelFromToValues.push({
          x: dateTimeFixed,
          y: history.batteryLevel,
        });
        signalQualityFromToValues.push({
          x: dateTimeFixed,
          y: history.signalQuality,
        });

        let digitalInputs = decodeDigitalInputs(history.digitalInputs);

        d1Inputs.push({
          x: dateTimeFixed,
          y: digitalInputs[0] ? 0 + 1 : 0,
        });
        d2Inputs.push({
          x: dateTimeFixed,
          y: digitalInputs[1] ? 2 + 1 : 2,
        });
        d3Inputs.push({
          x: dateTimeFixed,
          y: digitalInputs[2] ? 4 + 1 : 4,
        });
        d4Inputs.push({
          x: dateTimeFixed,
          y: digitalInputs[3] ? 8 + 1 : 8,
        });

        let digitalOutputs = decodeDigitalInputs(history.digitalOutputs);

        d1Outputs.push({
          x: dateTimeFixed,
          y: digitalOutputs[0] ? 0 + 1 : 0,
        });
        d2Outputs.push({
          x: dateTimeFixed,
          y: digitalOutputs[1] ? 2 + 1 : 2,
        });
        d3Outputs.push({
          x: dateTimeFixed,
          y: digitalOutputs[2] ? 4 + 1 : 4,
        });
        d4Outputs.push({
          x: dateTimeFixed,
          y: digitalOutputs[3] ? 8 + 1 : 8,
        });

        let original: DataloggerHistoryAdapter = new DataloggerHistoryAdapter(
          history,
        );

        original.formatAlerts(deviceData.dataloggerSettings);
        let fixedAlerts = original.alerts;
        let binAlerts: any = fixedAlerts.toString(2);

        while (binAlerts.length < 16) {
          binAlerts = '0' + binAlerts;
        }
        binAlerts = binAlerts.split('');

        d1Alarms.push({
          x: dateTimeFixed,
          y: binAlerts[15] == '1' ? 0 + 1 : 0,
        });
        d2Alarms.push({
          x: dateTimeFixed,
          y: binAlerts[14] == '1' ? 2 + 1 : 2,
        });
        d3Alarms.push({
          x: dateTimeFixed,
          y: binAlerts[13] == '1' ? 4 + 1 : 4,
        });
        d4Alarms.push({
          x: dateTimeFixed,
          y: binAlerts[12] == '1' ? 6 + 1 : 6,
        });

        al1Alarms.push({
          x: dateTimeFixed,
          y: binAlerts[11] == '1' ? 8 + 1 : 8,
        });
        al2Alarms.push({
          x: dateTimeFixed,
          y: binAlerts[10] == '1' ? 10 + 1 : 10,
        });
        al3Alarms.push({
          x: dateTimeFixed,
          y: binAlerts[9] == '1' ? 12 + 1 : 12,
        });
        al4Alarms.push({
          x: dateTimeFixed,
          y: binAlerts[8] == '1' ? 14 + 1 : 14,
        });

        ah1Alarms.push({
          x: dateTimeFixed,
          y: binAlerts[7] == '1' ? 16 + 1 : 16,
        });
        ah2Alarms.push({
          x: dateTimeFixed,
          y: binAlerts[6] == '1' ? 18 + 1 : 18,
        });
        ah3Alarms.push({
          x: dateTimeFixed,
          y: binAlerts[5] == '1' ? 20 + 1 : 20,
        });
        ah4Alarms.push({
          x: dateTimeFixed,
          y: binAlerts[4] == '1' ? 22 + 1 : 22,
        });

        ql1Alarms.push({
          x: dateTimeFixed,
          y: binAlerts[3] == '1' ? 24 + 1 : 24,
        });
        ql2Alarms.push({
          x: dateTimeFixed,
          y: binAlerts[2] == '1' ? 26 + 1 : 26,
        });
        ql3Alarms.push({
          x: dateTimeFixed,
          y: binAlerts[1] == '1' ? 28 + 1 : 28,
        });
        ql4Alarms.push({
          x: dateTimeFixed,
          y: binAlerts[0] == '1' ? 30 + 1 : 30,
        });
      });

      /* Genera la data de las graficas de las alarmas en un array */
      let alarmsGraphData: any[] = [];

      for (let index = 0; index < 16; index++) {
        // Retorna un número aleatorio entre min (incluido) y max (excluido)
        let randomColor1 = (Math.random() * (150 - 50) + 50).toFixed(0);
        let randomColor2 = (Math.random() * (150 - 50) + 50).toFixed(0);
        let randomColor3 = (Math.random() * (150 - 50) + 50).toFixed(0);
        let color =
          'rgba( ' +
          randomColor1 +
          ' ,' +
          randomColor2 +
          ' ,' +
          randomColor3 +
          ',0.4)';
        let alarmTitle = '';
        let data: any[] = [];

        if (index == 0) {
          alarmTitle = 'Cambio de estado en la entrada digital 1';
          data = d1Alarms;
        } else if (index == 1) {
          alarmTitle = 'Cambio de estado en la entrada digital 2';
          data = d2Alarms;
        } else if (index == 2) {
          alarmTitle = 'Cambio de estado en la entrada digital 3';
          data = d3Alarms;
        } else if (index == 3) {
          alarmTitle = 'Cambio de estado en la entrada digital 4';
          data = d4Alarms;
        } else if (index == 4) {
          alarmTitle = 'Valor por debajo del umbral en analógico 1';
          data = al1Alarms;
        } else if (index == 5) {
          alarmTitle = 'Valor por debajo del umbral en analógico 2';
          data = al2Alarms;
        } else if (index == 6) {
          alarmTitle = 'Valor por debajo del umbral en analógico 3';
          data = al3Alarms;
        } else if (index == 7) {
          alarmTitle = 'Valor por debajo del umbral en analógico 4';
          data = al4Alarms;
        } else if (index == 8) {
          alarmTitle = 'Valor por encima del umbral en analógico 1';
          data = ah1Alarms;
        } else if (index == 9) {
          alarmTitle = 'Valor por encima del umbral en analógico 2';
          data = ah2Alarms;
        } else if (index == 10) {
          alarmTitle = 'Valor por encima del umbral en analógico 3';
          data = ah3Alarms;
        } else if (index == 11) {
          alarmTitle = 'Valor por encima del umbral en analógico 4';
          data = ah4Alarms;
        } else if (index == 12) {
          alarmTitle = 'Flujo 1 por debajo del umbral';
          data = ql1Alarms;
        } else if (index == 13) {
          alarmTitle = 'Flujo 2 por debajo del umbral';
          data = ql2Alarms;
        } else if (index == 14) {
          alarmTitle = 'Flujo 1 por encima del umbral';
          data = ql3Alarms;
        } else if (index == 14) {
          alarmTitle = 'Flujo 2 por encima del umbral';
          data = ql4Alarms;
        }

        alarmsGraphData.push({
          label: alarmTitle,
          fill: false,
          lineTension: 0.1,
          backgroundColor: color,
          borderColor: color,
          borderCapStyle: 'butt',
          borderDash: [],
          borderDashOffset: 0.0,
          borderJoinStyle: 'miter',
          pointBorderColor: color,
          pointBackgroundColor: '#fff',
          pointBorderWidth: 1,
          pointHoverRadius: 5,
          pointHoverBackgroundColor: color,
          pointHoverBorderColor: color,
          pointHoverBorderWidth: 2,
          pointRadius: 1,
          pointHitRadius: 10,
          data: data,
          spanGaps: false,
        });
      }
      /* Genera la data de las graficas de los inputs en un array */
      let digitalInputsGraphData: any[] = [];

      for (let index = 0; index < 4; index++) {
        // Retorna un número aleatorio entre min (incluido) y max (excluido)
        let randomColor1 = (Math.random() * (150 - 50) + 50).toFixed(0);
        let randomColor2 = (Math.random() * (150 - 50) + 50).toFixed(0);
        let randomColor3 = (Math.random() * (150 - 50) + 50).toFixed(0);
        let color =
          'rgba( ' +
          randomColor1 +
          ' ,' +
          randomColor2 +
          ' ,' +
          randomColor3 +
          ',0.4)';
        let alarmTitle = '';
        let data: any[] = [];

        if (index == 0) {
          alarmTitle = 'Entrada digital 1';
          data = d1Inputs;
        } else if (index == 1) {
          alarmTitle = 'Entrada digital 2';
          data = d2Inputs;
        } else if (index == 2) {
          alarmTitle = 'Entrada digital 3';
          data = d3Inputs;
        } else if (index == 3) {
          alarmTitle = 'Entrada digital 4';
          data = d4Inputs;
        }

        digitalInputsGraphData.push({
          label: alarmTitle,
          fill: false,
          lineTension: 0.1,
          backgroundColor: color,
          borderColor: color,
          borderCapStyle: 'butt',
          borderDash: [],
          borderDashOffset: 0.0,
          borderJoinStyle: 'miter',
          pointBorderColor: color,
          pointBackgroundColor: '#fff',
          pointBorderWidth: 1,
          pointHoverRadius: 5,
          pointHoverBackgroundColor: color,
          pointHoverBorderColor: color,
          pointHoverBorderWidth: 2,
          pointRadius: 1,
          pointHitRadius: 10,
          data: data,
          spanGaps: false,
        });
      }
      /* Genera la data de las graficas de los inputs en un array */
      let digitalOutputsGraphData: any[] = [];

      for (let index = 0; index < 4; index++) {
        // Retorna un número aleatorio entre min (incluido) y max (excluido)
        let randomColor1 = (Math.random() * (150 - 50) + 50).toFixed(0);
        let randomColor2 = (Math.random() * (150 - 50) + 50).toFixed(0);
        let randomColor3 = (Math.random() * (150 - 50) + 50).toFixed(0);
        let color =
          'rgba( ' +
          randomColor1 +
          ' ,' +
          randomColor2 +
          ' ,' +
          randomColor3 +
          ',0.4)';
        let alarmTitle = '';
        let data: any[] = [];

        if (index == 0) {
          alarmTitle = 'Salida digital 1';
          data = d1Outputs;
        } else if (index == 1) {
          alarmTitle = 'Salida digital 2';
          data = d2Outputs;
        } else if (index == 2) {
          alarmTitle = 'Salida digital 3';
          data = d3Outputs;
        } else if (index == 3) {
          alarmTitle = 'Salida digital 4';
          data = d4Outputs;
        }

        digitalOutputsGraphData.push({
          label: alarmTitle,
          fill: false,
          lineTension: 0.1,
          backgroundColor: color,
          borderColor: color,
          borderCapStyle: 'butt',
          borderDash: [],
          borderDashOffset: 0.0,
          borderJoinStyle: 'miter',
          pointBorderColor: color,
          pointBackgroundColor: '#fff',
          pointBorderWidth: 1,
          pointHoverRadius: 5,
          pointHoverBackgroundColor: color,
          pointHoverBorderColor: color,
          pointHoverBorderWidth: 2,
          pointRadius: 1,
          pointHitRadius: 10,
          data: data,
          spanGaps: false,
        });
      }

      // retornar el periodo solicitado
      return new ServerMessage(false, 'Información obtenida correctamente', {
        activeSuscription: activeSuscription,

        periodHistorial: periodHistorial,
        actualFromToLabels: actualFromToLabels,
        digitalInputsGraphData: digitalInputsGraphData,
        digitalOutputsGraphData: digitalOutputsGraphData,
        alarmsGraphData: alarmsGraphData,

        analog1FromToValues: {
          label: 'Analogo 1',
          fill: false,
          lineTension: 0.1,
          backgroundColor: setColor,
          borderColor: setColor,
          borderCapStyle: 'butt',
          borderDash: [],
          borderDashOffset: 0.0,
          borderJoinStyle: 'miter',
          pointBorderColor: setColor,
          pointBackgroundColor: '#fff',
          pointBorderWidth: 1,
          pointHoverRadius: 5,
          pointHoverBackgroundColor: setColor,
          pointHoverBorderColor: setColor,
          pointHoverBorderWidth: 2,
          pointRadius: 1,
          pointHitRadius: 10,
          data: analog1FromToValues,
          spanGaps: false,
        },
        analog2FromToValues: {
          label: 'Analogo 2',
          fill: false,
          lineTension: 0.1,
          backgroundColor: setColor,
          borderColor: setColor,
          borderCapStyle: 'butt',
          borderDash: [],
          borderDashOffset: 0.0,
          borderJoinStyle: 'miter',
          pointBorderColor: setColor,
          pointBackgroundColor: '#fff',
          pointBorderWidth: 1,
          pointHoverRadius: 5,
          pointHoverBackgroundColor: setColor,
          pointHoverBorderColor: setColor,
          pointHoverBorderWidth: 2,
          pointRadius: 1,
          pointHitRadius: 10,
          data: analog2FromToValues,
          spanGaps: false,
        },
        analog3FromToValues: {
          label: 'Analogo 3',
          fill: false,
          lineTension: 0.1,
          backgroundColor: setColor,
          borderColor: setColor,
          borderCapStyle: 'butt',
          borderDash: [],
          borderDashOffset: 0.0,
          borderJoinStyle: 'miter',
          pointBorderColor: setColor,
          pointBackgroundColor: '#fff',
          pointBorderWidth: 1,
          pointHoverRadius: 5,
          pointHoverBackgroundColor: setColor,
          pointHoverBorderColor: setColor,
          pointHoverBorderWidth: 2,
          pointRadius: 1,
          pointHitRadius: 10,
          data: analog3FromToValues,
          spanGaps: false,
        },
        analog4FromToValues: {
          label: 'Analogo 4',
          fill: false,
          lineTension: 0.1,
          backgroundColor: setColor,
          borderColor: setColor,
          borderCapStyle: 'butt',
          borderDash: [],
          borderDashOffset: 0.0,
          borderJoinStyle: 'miter',
          pointBorderColor: setColor,
          pointBackgroundColor: '#fff',
          pointBorderWidth: 1,
          pointHoverRadius: 5,
          pointHoverBackgroundColor: setColor,
          pointHoverBorderColor: setColor,
          pointHoverBorderWidth: 2,
          pointRadius: 1,
          pointHitRadius: 10,
          data: analog4FromToValues,
          spanGaps: false,
        },
        consumption1FromToValues: {
          label: 'Consumo 1',
          fill: false,
          lineTension: 0.1,
          backgroundColor: setColor,
          borderColor: setColor,
          borderCapStyle: 'butt',
          borderDash: [],
          borderDashOffset: 0.0,
          borderJoinStyle: 'miter',
          pointBorderColor: setColor,
          pointBackgroundColor: '#fff',
          pointBorderWidth: 1,
          pointHoverRadius: 5,
          pointHoverBackgroundColor: setColor,
          pointHoverBorderColor: setColor,
          pointHoverBorderWidth: 2,
          pointRadius: 1,
          pointHitRadius: 10,
          data: consumption1FromToValues,
          spanGaps: false,
        },
        consumption2FromToValues: {
          label: 'Consumo 2',
          fill: false,
          lineTension: 0.1,
          backgroundColor: setColor,
          borderColor: setColor,
          borderCapStyle: 'butt',
          borderDash: [],
          borderDashOffset: 0.0,
          borderJoinStyle: 'miter',
          pointBorderColor: setColor,
          pointBackgroundColor: '#fff',
          pointBorderWidth: 1,
          pointHoverRadius: 5,
          pointHoverBackgroundColor: setColor,
          pointHoverBorderColor: setColor,
          pointHoverBorderWidth: 2,
          pointRadius: 1,
          pointHitRadius: 10,
          data: consumption2FromToValues,
          spanGaps: false,
        },
        flow1FromToValues: {
          label: 'Flujo 1',
          fill: false,
          lineTension: 0.1,
          backgroundColor: setColor,
          borderColor: setColor,
          borderCapStyle: 'butt',
          borderDash: [],
          borderDashOffset: 0.0,
          borderJoinStyle: 'miter',
          pointBorderColor: setColor,
          pointBackgroundColor: '#fff',
          pointBorderWidth: 1,
          pointHoverRadius: 5,
          pointHoverBackgroundColor: setColor,
          pointHoverBorderColor: setColor,
          pointHoverBorderWidth: 2,
          pointRadius: 1,
          pointHitRadius: 10,
          data: flow1FromToValues,
          spanGaps: false,
        },
        flow2FromToValues: {
          label: 'Flujo 2',
          fill: false,
          lineTension: 0.1,
          backgroundColor: setColor,
          borderColor: setColor,
          borderCapStyle: 'butt',
          borderDash: [],
          borderDashOffset: 0.0,
          borderJoinStyle: 'miter',
          pointBorderColor: setColor,
          pointBackgroundColor: '#fff',
          pointBorderWidth: 1,
          pointHoverRadius: 5,
          pointHoverBackgroundColor: setColor,
          pointHoverBorderColor: setColor,
          pointHoverBorderWidth: 2,
          pointRadius: 1,
          pointHitRadius: 10,
          data: flow2FromToValues,
          spanGaps: false,
        },
        batteryLevelFromToValues: {
          label: 'Bateria',
          fill: false,
          lineTension: 0.1,
          backgroundColor: setColor,
          borderColor: setColor,
          borderCapStyle: 'butt',
          borderDash: [],
          borderDashOffset: 0.0,
          borderJoinStyle: 'miter',
          pointBorderColor: setColor,
          pointBackgroundColor: '#fff',
          pointBorderWidth: 1,
          pointHoverRadius: 5,
          pointHoverBackgroundColor: setColor,
          pointHoverBorderColor: setColor,
          pointHoverBorderWidth: 2,
          pointRadius: 1,
          pointHitRadius: 10,
          data: batteryLevelFromToValues,
          spanGaps: false,
        },
        signalQualityFromToValues: {
          label: 'Señal',
          fill: false,
          lineTension: 0.1,
          backgroundColor: setColor,
          borderColor: setColor,
          borderCapStyle: 'butt',
          borderDash: [],
          borderDashOffset: 0.0,
          borderJoinStyle: 'miter',
          pointBorderColor: setColor,
          pointBackgroundColor: '#fff',
          pointBorderWidth: 1,
          pointHoverRadius: 5,
          pointHoverBackgroundColor: setColor,
          pointHoverBorderColor: setColor,
          pointHoverBorderWidth: 2,
          pointRadius: 1,
          pointHitRadius: 10,
          data: signalQualityFromToValues,
          spanGaps: false,
        },
      });
    } catch (error) {
      this.logger.error(error);
      return new ServerMessage(true, 'Ha ocurrido un error', error);
    }
  }

  /**
   *
   */
  async getLoggerDeviceSettingsEndpoint(
    client: User,
    idDevice: number,
  ): Promise<ServerMessage> {
    try {
      if (
        client == null ||
        client == undefined ||
        idDevice == null ||
        idDevice == undefined
      ) {
        return new ServerMessage(true, 'Petición incompleta', {});
      }
      // consultando el dispositivo con sus settings correspondientes

      //check if the device belongs to the main organization
      let deviceData: Device = await this.deviceRepository.findOne({
        where: {
          idDevice: idDevice,
          idUser: client.idUser,
          type: 2,
        },
        include: [
          {
            model: DataloggerSettings,
            as: 'dataloggerSettings',
            where: {
              idDevice: idDevice,
            },
            include: [
              {
                model: Device,
                as: 'device',
              },
            ],
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
        return new ServerMessage(true, 'El dispositivo no se encuentra', {});
      }

      return new ServerMessage(
        false,
        'Ajustes del dispositivo obtenidos con éxito',
        {
          belongsToMain:
            deviceData.organization.users.length == 0 ? false : true,
          loggerSettings: deviceData.dataloggerSettings,
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
  async updateLoggerNotificationRepeatTime(
    client: User,
    settings: any,
  ): Promise<ServerMessage> {
    try {
      if (
        client == null ||
        client == undefined ||
        settings == null ||
        settings == undefined ||
        settings.repeatTime == null ||
        settings.repeatTime == undefined
      ) {
        return new ServerMessage(true, 'Petición incompleta', {});
      }

      let newSettings: DataloggerSettings = await this.dataloggerSettingsRepository.findOne<
        DataloggerSettings
      >({
        where: {
          idDevice: settings.idDevice,
        },
        include: [
          {
            model: Device,
            as: 'device',
            where: {
              idUser: client.idUser,
              type: 2,
            },
          },
        ],
      });

      if (!newSettings || !newSettings.device) {
        return new ServerMessage(false, 'Dispositivo no disponible', {});
      }

      newSettings.repeatNotificationTime = settings.repeatTime;
      await newSettings.save();

      return new ServerMessage(
        false,
        'Timpo de retraso actualizado correctamente',
        {},
      );
    } catch (error) {
      this.logger.error(error);
      return new ServerMessage(true, 'Ha ocurrido un error', error);
    }
  }

  /**
   *
   */
  async getWaterDeviceSettings(
    client: User,
    idDevice: any,
  ): Promise<ServerMessage> {
    try {
      if (
        client == null ||
        client == undefined ||
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
            model: Device,
            as: 'device',
            where: {
              //idDevice : idDevice,
              idUser: client.idUser,
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
        where: {
          idDevice: idDevice,
          idUser: client.idUser,
          type: 1,
        },
        include: [
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
        'Ajustes del dispositivo obtenidos con éxito',
        {
          belongsToMain:
            deviceData.organization.users.length == 0 ? false : true,
          waterSettings: waterSettings,

          states: states,
          actualTown: deviceData.town,
        },
      );
    } catch (error) {
      // this.logger.error(error);
      return new ServerMessage(true, 'Ha ocurrido un error', error);
    }
  }

  /**
   *
   */
  async updateSettingsServiceOutageDay(
    client: User,
    settings: any,
  ): Promise<ServerMessage> {
    try {
      if (
        client == null ||
        client == undefined ||
        settings.idDevice == null ||
        settings.idDevice == undefined ||
        settings.serviceOutageDay == null ||
        settings.serviceOutageDay == undefined
      ) {
        return new ServerMessage(true, 'Petición incompleta', {});
      }

      let newSettings: WaterSettings = await this.waterSettingsRepository.findOne<
        WaterSettings
      >({
        where: {
          idDevice: settings.idDevice,
        },
      });

      if (!newSettings) {
        return new ServerMessage(true, 'EL dispositivo no esta disponible', {});
      }

      newSettings.serviceOutageDay = settings.serviceOutageDay;
      await newSettings.save();

      return new ServerMessage(false, 'Dia de corte actualizado.', {});
    } catch (error) {
      // this.logger.error(error);
      return new ServerMessage(true, 'Ha ocurrido un error', error);
    }
  }

  /**
   *
   */
  async updateSettingsWaterServiceConsumptionUnits(
    client: User,
    settings: any,
  ): Promise<ServerMessage> {
    try {
      if (
        client == null ||
        client == undefined ||
        settings.idDevice == null ||
        settings.idDevice == undefined ||
        settings.consumptionUnits == null ||
        settings.consumptionUnits == undefined
      ) {
        return new ServerMessage(true, 'Petición incompleta', {});
      }

      let newSettings: WaterSettings = await this.waterSettingsRepository.findOne<
        WaterSettings
      >({
        where: {
          idDevice: settings.idDevice,
        },
      });

      if (!newSettings) {
        return new ServerMessage(true, 'EL dispositivo no esta disponible', {});
      }

      newSettings.consumptionUnits = settings.consumptionUnits;
      newSettings.status = newSettings.calculateNewStatus(1, true);
      newSettings.wereApplied = false;
      await newSettings.save();

      return new ServerMessage(false, 'Unidades de consumo actualizadas.', {});
    } catch (error) {
      // this.logger.error(error);
      return new ServerMessage(true, 'Ha ocurrido un error', error);
    }
  }

  /**
   *
   */
  async updateSettingsWaterServiceSpendingUnits(
    client: User,
    settings: any,
  ): Promise<ServerMessage> {
    try {
      if (
        client == null ||
        client == undefined ||
        settings.idDevice == null ||
        settings.idDevice == undefined ||
        settings.flowUnits == null ||
        settings.flowUnits == undefined
      ) {
        return new ServerMessage(true, 'Petición incompleta', {});
      }

      let newSettings: WaterSettings = await this.waterSettingsRepository.findOne<
        WaterSettings
      >({
        where: {
          idDevice: settings.idDevice,
        },
      });

      if (!newSettings) {
        return new ServerMessage(true, 'EL dispositivo no esta disponible', {});
      }

      newSettings.flowUnits = settings.flowUnits;
      newSettings.status = newSettings.calculateNewStatus(2, true);
      newSettings.wereApplied = false;
      await newSettings.save();

      return new ServerMessage(false, 'Unidades de gasto actualizadas.', {});
    } catch (error) {
      // this.logger.error(error);
      return new ServerMessage(true, 'Ha ocurrido un error', error);
    }
  }

  /**
   *
   */
  async updateSettingsWaterServiceStorageFrequency(
    client: User,
    settings: any,
  ): Promise<ServerMessage> {
    try {
      if (
        client == null ||
        client == undefined ||
        settings.idDevice == null ||
        settings.idDevice == undefined ||
        settings.storageFrequency == null ||
        settings.storageFrequency == undefined
      ) {
        return new ServerMessage(true, 'Petición incompleta', {});
      }

      let newSettings: WaterSettings = await this.waterSettingsRepository.findOne<
        WaterSettings
      >({
        where: {
          idDevice: settings.idDevice,
        },
      });

      if (!newSettings) {
        return new ServerMessage(true, 'EL dispositivo no esta disponible', {});
      }

      newSettings.storageFrequency = settings.storageFrequency;
      newSettings.status = newSettings.calculateNewStatus(3, true);
      newSettings.wereApplied = false;
      await newSettings.save();

      return new ServerMessage(
        false,
        'Frecuencia de almacenamiento actualizada.',
        {},
      );
    } catch (error) {
      // this.logger.error(error);
      return new ServerMessage(true, 'Ha ocurrido un error', error);
    }
  }

  /**
   *
   */
  async updateSettingsWaterServiceStorageTime(
    client: User,
    settings: any,
  ): Promise<ServerMessage> {
    try {
      if (
        client == null ||
        client == undefined ||
        settings.idDevice == null ||
        settings.idDevice == undefined ||
        settings.storageTime == null ||
        settings.storageTime == undefined
      ) {
        return new ServerMessage(true, 'Petición incompleta', {});
      }

      let newSettings: WaterSettings = await this.waterSettingsRepository.findOne<
        WaterSettings
      >({
        where: {
          idDevice: settings.idDevice,
        },
      });

      if (!newSettings) {
        return new ServerMessage(true, 'EL dispositivo no esta disponible', {});
      }

      newSettings.storageTime = settings.storageTime;
      newSettings.status = newSettings.calculateNewStatus(3, true);
      newSettings.wereApplied = false;
      await newSettings.save();

      return new ServerMessage(
        false,
        'Frecuencia de almacenamiento actualizada.',
        {},
      );
    } catch (error) {
      // this.logger.error(error);
      return new ServerMessage(true, 'Ha ocurrido un error', error);
    }
  }

  /**
   *
   */
  async updateSettingsWaterServiceDailyTransmission(
    client: User,
    settings: any,
  ): Promise<ServerMessage> {
    try {
      if (
        client == null ||
        client == undefined ||
        settings.idDevice == null ||
        settings.idDevice == undefined ||
        settings.dailyTransmission == null ||
        settings.dailyTransmission == undefined
      ) {
        return new ServerMessage(true, 'Petición incompleta', {});
      }

      let newSettings: WaterSettings = await this.waterSettingsRepository.findOne<
        WaterSettings
      >({
        where: {
          idDevice: settings.idDevice,
        },
      });

      if (!newSettings) {
        return new ServerMessage(true, 'EL dispositivo no esta disponible', {});
      }

      newSettings.dailyTransmission = settings.dailyTransmission;
      newSettings.status = newSettings.calculateNewStatus(0, true);
      newSettings.wereApplied = false;
      await newSettings.save();

      return new ServerMessage(
        false,
        'Frecuencia de almacenamiento actualizada.',
        {},
      );
    } catch (error) {
      // this.logger.error(error);
      return new ServerMessage(true, 'Ha ocurrido un error', error);
    }
  }

  /**
   *
   */
  async updateSettingsWaterServiceDailyTime(
    client: User,
    settings: any,
  ): Promise<ServerMessage> {
    try {
      if (
        client == null ||
        client == undefined ||
        settings.idDevice == null ||
        settings.idDevice == undefined ||
        settings.dailyTime == null ||
        settings.dailyTime == undefined
      ) {
        return new ServerMessage(true, 'Petición incompleta', {});
      }

      let newSettings: WaterSettings = await this.waterSettingsRepository.findOne<
        WaterSettings
      >({
        where: {
          idDevice: settings.idDevice,
        },
      });

      if (!newSettings) {
        return new ServerMessage(true, 'EL dispositivo no esta disponible', {});
      }

      newSettings.dailyTime = settings.dailyTime;
      newSettings.status = newSettings.calculateNewStatus(0, true);
      newSettings.wereApplied = false;
      await newSettings.save();

      return new ServerMessage(
        false,
        'Frecuencia de almacenamiento actualizada.',
        {},
      );
    } catch (error) {
      // this.logger.error(error);
      return new ServerMessage(true, 'Ha ocurrido un error', error);
    }
  }

  /**
   *
   */
  async updateSettingsWaterServiceCustomDailyTime(
    client: User,
    settings: any,
  ): Promise<ServerMessage> {
    try {
      if (
        client == null ||
        client == undefined ||
        settings.idDevice == null ||
        settings.idDevice == undefined ||
        settings.customDailyTime == null ||
        settings.customDailyTime == undefined
      ) {
        return new ServerMessage(true, 'Petición incompleta', {});
      }

      let newSettings: WaterSettings = await this.waterSettingsRepository.findOne<
        WaterSettings
      >({
        where: {
          idDevice: settings.idDevice,
        },
      });

      if (!newSettings) {
        return new ServerMessage(true, 'EL dispositivo no esta disponible', {});
      }

      newSettings.customDailyTime = settings.customDailyTime;
      newSettings.status = newSettings.calculateNewStatus(4, true);
      newSettings.wereApplied = false;
      await newSettings.save();

      return new ServerMessage(
        false,
        'Transmisión diaria fija actualizada.',
        {},
      );
    } catch (error) {
      // this.logger.error(error);
      return new ServerMessage(true, 'Ha ocurrido un error', error);
    }
  }

  /**
   *
   */
  async updateSettingsWaterServiceIpProtocol(
    client: User,
    settings: any,
  ): Promise<ServerMessage> {
    try {
      if (
        client == null ||
        client == undefined ||
        settings.idDevice == null ||
        settings.idDevice == undefined ||
        settings.ipProtocol == null ||
        settings.ipProtocol == undefined
      ) {
        return new ServerMessage(true, 'Petición incompleta', {});
      }

      let newSettings: WaterSettings = await this.waterSettingsRepository.findOne<
        WaterSettings
      >({
        where: {
          idDevice: settings.idDevice,
        },
      });

      if (!newSettings) {
        return new ServerMessage(true, 'EL dispositivo no esta disponible', {});
      }

      newSettings.ipProtocol = settings.ipProtocol;
      newSettings.status = newSettings.calculateNewStatus(6, true);
      newSettings.wereApplied = false;
      await newSettings.save();

      return new ServerMessage(false, 'Protocolo IP actualizado.', {});
    } catch (error) {
      // this.logger.error(error);
      return new ServerMessage(true, 'Ha ocurrido un error', error);
    }
  }

  /**
   *
   */
  async updateSettingsWaterAuthenticationProtocol(
    client: User,
    settings: any,
  ): Promise<ServerMessage> {
    try {
      if (
        client == null ||
        client == undefined ||
        settings.idDevice == null ||
        settings.idDevice == undefined ||
        settings.auth == null ||
        settings.auth == undefined
      ) {
        return new ServerMessage(true, 'Petición incompleta', {});
      }

      let newSettings: WaterSettings = await this.waterSettingsRepository.findOne<
        WaterSettings
      >({
        where: {
          idDevice: settings.idDevice,
        },
      });

      if (!newSettings) {
        return new ServerMessage(true, 'EL dispositivo no esta disponible', {});
      }

      newSettings.auth = settings.auth;
      newSettings.status = newSettings.calculateNewStatus(6, true);
      newSettings.wereApplied = false;
      await newSettings.save();

      return new ServerMessage(false, 'Protocolo IP actualizado.', {});
    } catch (error) {
      // this.logger.error(error);
      return new ServerMessage(true, 'Ha ocurrido un error', error);
    }
  }

  /**
   *
   */
  async updateSettingsWaterServiceDescriptionLabel(
    client: User,
    settings: any,
  ): Promise<ServerMessage> {
    try {
      if (
        client == null ||
        client == undefined ||
        settings.idDevice == null ||
        settings.idDevice == undefined ||
        settings.label == null ||
        settings.label == undefined
      ) {
        return new ServerMessage(true, 'Petición incompleta', {});
      }

      let newSettings: WaterSettings = await this.waterSettingsRepository.findOne<
        WaterSettings
      >({
        where: {
          idDevice: settings.idDevice,
        },
      });

      if (!newSettings) {
        return new ServerMessage(true, 'EL dispositivo no esta disponible', {});
      }

      newSettings.label = settings.label;
      newSettings.status = newSettings.calculateNewStatus(8, true);
      newSettings.wereApplied = false;
      await newSettings.save();

      return new ServerMessage(false, 'Descripción actualizada.', {});
    } catch (error) {
      // this.logger.error(error);
      return new ServerMessage(true, 'Ha ocurrido un error', error);
    }
  }

  /**
   *
   */
  async updateSettingsWaterConsumptionAlertType(
    client: User,
    settings: any,
  ): Promise<ServerMessage> {
    try {
      if (
        client == null ||
        client == undefined ||
        settings.idDevice == null ||
        settings.idDevice == undefined ||
        settings.consumptionAlertType == null ||
        settings.consumptionAlertType == undefined
      ) {
        return new ServerMessage(true, 'Petición incompleta', {});
      }

      let newSettings: WaterSettings = await this.waterSettingsRepository.findOne<
        WaterSettings
      >({
        where: {
          idDevice: settings.idDevice,
        },
      });

      if (!newSettings) {
        return new ServerMessage(true, 'EL dispositivo no esta disponible', {});
      }

      newSettings.consumptionAlertType = settings.consumptionAlertType;
      newSettings.status = newSettings.calculateNewStatus(13, true);
      newSettings.wereApplied = false;
      await newSettings.save();

      return new ServerMessage(
        false,
        'Tipo de alerta de consumo actualizada.',
        {},
      );
    } catch (error) {
      // this.logger.error(error);
      return new ServerMessage(true, 'Ha ocurrido un error', error);
    }
  }

  /**
   *
   */
  async updateSettingsWaterServicePeriodicFrequency(
    client: User,
    settings: any,
  ): Promise<ServerMessage> {
    try {
      if (
        client == null ||
        client == undefined ||
        settings.idDevice == null ||
        settings.idDevice == undefined ||
        settings.periodicFrequency == null ||
        settings.periodicFrequency == undefined
      ) {
        return new ServerMessage(true, 'Petición incompleta', {});
      }

      let newSettings: WaterSettings = await this.waterSettingsRepository.findOne<
        WaterSettings
      >({
        where: {
          idDevice: settings.idDevice,
        },
      });

      if (!newSettings) {
        return new ServerMessage(true, 'EL dispositivo no esta disponible', {});
      }

      newSettings.periodicFrequency = settings.periodicFrequency;
      newSettings.status = newSettings.calculateNewStatus(5, true);
      newSettings.wereApplied = false;
      await newSettings.save();

      return new ServerMessage(
        false,
        'Transmisión periódica fija actualizada.',
        {},
      );
    } catch (error) {
      // this.logger.error(error);
      return new ServerMessage(true, 'Ha ocurrido un error', error);
    }
  }

  /**
   *
   */
  async updateSettingsWaterServiceDripSetpoint(
    client: User,
    settings: any,
  ): Promise<ServerMessage> {
    try {
      if (
        client == null ||
        client == undefined ||
        settings.idDevice == null ||
        settings.idDevice == undefined ||
        settings.dripSetpoint == null ||
        settings.dripSetpoint == undefined
      ) {
        return new ServerMessage(true, 'Petición incompleta', {});
      }

      let newSettings: WaterSettings = await this.waterSettingsRepository.findOne<
        WaterSettings
      >({
        where: {
          idDevice: settings.idDevice,
        },
      });

      if (!newSettings) {
        return new ServerMessage(true, 'EL dispositivo no esta disponible', {});
      }

      newSettings.dripSetpoint = settings.dripSetpoint;
      newSettings.status = newSettings.calculateNewStatus(9, true);
      newSettings.wereApplied = false;
      await newSettings.save();

      return new ServerMessage(false, 'Setpoint de goteo actualizado.', {});
    } catch (error) {
      // this.logger.error(error);
      return new ServerMessage(true, 'Ha ocurrido un error', error);
    }
  }

  /**
   *
   */
  async updateSettingsWaterServiceBurstSetpoint(
    client: User,
    settings: any,
  ): Promise<ServerMessage> {
    try {
      if (
        client == null ||
        client == undefined ||
        settings.idDevice == null ||
        settings.idDevice == undefined ||
        settings.burstSetpoint == null ||
        settings.burstSetpoint == undefined
      ) {
        return new ServerMessage(true, 'Petición incompleta', {});
      }

      let newSettings: WaterSettings = await this.waterSettingsRepository.findOne<
        WaterSettings
      >({
        where: {
          idDevice: settings.idDevice,
        },
      });

      if (!newSettings) {
        return new ServerMessage(true, 'EL dispositivo no esta disponible', {});
      }

      newSettings.burstSetpoint = settings.burstSetpoint;
      newSettings.status = newSettings.calculateNewStatus(10, true);
      newSettings.wereApplied = false;
      await newSettings.save();

      return new ServerMessage(false, 'Setpoint de fuga actualizado.', {});
    } catch (error) {
      // this.logger.error(error);
      return new ServerMessage(true, 'Ha ocurrido un error', error);
    }
  }

  /**
   *
   */
  async updateSettingsWaterServiceFlowSetpoint(
    client: User,
    settings: any,
  ): Promise<ServerMessage> {
    try {
      if (
        client == null ||
        client == undefined ||
        settings.idDevice == null ||
        settings.idDevice == undefined ||
        settings.flowSetpoint == null ||
        settings.flowSetpoint == undefined
      ) {
        return new ServerMessage(true, 'Petición incompleta', {});
      }

      let newSettings: WaterSettings = await this.waterSettingsRepository.findOne<
        WaterSettings
      >({
        where: {
          idDevice: settings.idDevice,
        },
      });

      if (!newSettings) {
        return new ServerMessage(true, 'EL dispositivo no esta disponible', {});
      }

      newSettings.flowSetpoint = settings.flowSetpoint;
      newSettings.status = newSettings.calculateNewStatus(11, true);
      newSettings.wereApplied = false;
      await newSettings.save();

      return new ServerMessage(
        false,
        'Setpoint de gasto continuo actualizado.',
        {},
      );
    } catch (error) {
      // this.logger.error(error);
      return new ServerMessage(true, 'Ha ocurrido un error', error);
    }
  }

  /**
   *
   */
  async updateSettingsWaterServiceConsumptionSetpoint(
    client: User,
    settings: any,
  ): Promise<ServerMessage> {
    try {
      if (
        client == null ||
        client == undefined ||
        settings.idDevice == null ||
        settings.idDevice == undefined ||
        settings.consumptionSetpoint == null ||
        settings.consumptionSetpoint == undefined
      ) {
        return new ServerMessage(true, 'Petición incompleta', {});
      }

      let newSettings: WaterSettings = await this.waterSettingsRepository.findOne<
        WaterSettings
      >({
        where: {
          idDevice: settings.idDevice,
        },
      });

      if (!newSettings) {
        return new ServerMessage(true, 'EL dispositivo no esta disponible', {});
      }

      newSettings.consumptionSetpoint = settings.consumptionSetpoint;
      newSettings.status = newSettings.calculateNewStatus(12, true);
      newSettings.wereApplied = false;
      await newSettings.save();

      return new ServerMessage(
        false,
        'Set point de alerta de consumo actualizada.',
        {},
      );
    } catch (error) {
      // this.logger.error(error);
      return new ServerMessage(true, 'Ha ocurrido un error', error);
    }
  }

  /**
   *
   */
  async updateSettingsWaterServicePeriodicTime(
    client: User,
    settings: any,
  ): Promise<ServerMessage> {
    try {
      if (
        client == null ||
        client == undefined ||
        settings.idDevice == null ||
        settings.idDevice == undefined ||
        settings.periodicTime == null ||
        settings.periodicTime == undefined
      ) {
        return new ServerMessage(true, 'Petición incompleta', {});
      }

      let newSettings: WaterSettings = await this.waterSettingsRepository.findOne<
        WaterSettings
      >({
        where: {
          idDevice: settings.idDevice,
        },
      });

      if (!newSettings) {
        return new ServerMessage(true, 'EL dispositivo no esta disponible', {});
      }

      newSettings.periodicTime = settings.periodicTime;
      newSettings.status = newSettings.calculateNewStatus(5, true);
      newSettings.wereApplied = false;
      await newSettings.save();

      return new ServerMessage(
        false,
        'Proximo inicio de la transmisión periódica fija actualizada.',
        {},
      );
    } catch (error) {
      // this.logger.error(error);
      return new ServerMessage(true, 'Ha ocurrido un error', error);
    }
  }

  /**
   *
   */
  async updateSettingsWaterServiceMonthMaxConsumption(
    client: User,
    settings: any,
  ): Promise<ServerMessage> {
    try {
      if (
        client == null ||
        client == undefined ||
        settings.idDevice == null ||
        settings.idDevice == undefined ||
        settings.monthMaxConsumption == null ||
        settings.monthMaxConsumption == undefined
      ) {
        return new ServerMessage(true, 'Petición incompleta', {});
      }

      let newSettings: WaterSettings = await this.waterSettingsRepository.findOne<
        WaterSettings
      >({
        where: {
          idDevice: settings.idDevice,
        },
      });

      if (!newSettings) {
        return new ServerMessage(true, 'EL dispositivo no esta disponible', {});
      }

      newSettings.monthMaxConsumption = settings.monthMaxConsumption;
      await newSettings.save();

      return new ServerMessage(false, 'Actualizado con éxito.', {});
    } catch (error) {
      // this.logger.error(error);
      return new ServerMessage(true, 'Ha ocurrido un error', error);
    }
  }

  /**
   *
   */
  async updateSettingsWaterServiceUpdateFlags(
    client: User,
    settings: any,
  ): Promise<ServerMessage> {
    try {
      if (
        client == null ||
        client == undefined ||
        settings.idDevice == null ||
        settings.idDevice == undefined ||
        settings.bubbleFlag == null ||
        settings.bubbleFlag == undefined ||
        settings.dripFlag == null ||
        settings.dripFlag == undefined ||
        settings.emptyFlag == null ||
        settings.emptyFlag == undefined ||
        settings.reversedFlowFlag == null ||
        settings.reversedFlowFlag == undefined ||
        settings.burstFlag == null ||
        settings.burstFlag == undefined ||
        settings.manipulationFlag == null ||
        settings.manipulationFlag == undefined
      ) {
        return new ServerMessage(true, 'Petición incompleta', {});
      }

      let newSettings: WaterSettings = await this.waterSettingsRepository.findOne<
        WaterSettings
      >({
        where: {
          idDevice: settings.idDevice,
        },
      });

      if (!newSettings) {
        return new ServerMessage(true, 'EL dispositivo no esta disponible', {});
      }

      newSettings.bubbleFlag = settings.bubbleFlag;
      newSettings.dripFlag = settings.dripFlag;
      newSettings.emptyFlag = settings.emptyFlag;
      newSettings.reversedFlowFlag = settings.reversedFlowFlag;
      newSettings.burstFlag = settings.burstFlag;
      newSettings.manipulationFlag = settings.manipulationFlag;
      //Only use when flags are sended to the device
      //newSettings.wereApplied = false;
      await newSettings.save();

      return new ServerMessage(false, 'Actualizado con éxito.', {});
    } catch (error) {
      // this.logger.error(error);
      return new ServerMessage(true, 'Ha ocurrido un error', error);
    }
  }

  /**
   *
   */
  async getDeviceClientAddressSettings(
    client: User,
    idDevice: any,
  ): Promise<ServerMessage> {
    try {
      if (
        client == null ||
        client == undefined ||
        idDevice == null ||
        idDevice == undefined
      ) {
        return new ServerMessage(true, 'Petición incompleta', {});
      }

      //check if the device belongs to the main organization
      let deviceData: Device = await this.deviceRepository.findOne({
        where: {
          idDevice: idDevice,
          idUser: client.idUser,
          //type: 1,
        },
        include: [
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
      // this.logger.error(error);
      return new ServerMessage(true, 'Ha ocurrido un error', error);
    }
  }

  /**
   *
   */
  async updateDeviceClientAddressSettings(
    client: User,
    device: Device,
  ): Promise<ServerMessage> {
    try {
      if (
        client == null ||
        client == undefined ||
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
          idUser: client.idUser,
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
      // this.logger.error(error);
      return new ServerMessage(true, 'Ha ocurrido un error', error);
    }
  }

  /**
   *
   */
  async getGasDeviceSettings(
    client: User,
    idDevice: number,
  ): Promise<ServerMessage> {
    try {
      if (
        client == null ||
        client == undefined ||
        idDevice == null ||
        idDevice == undefined
      ) {
        return new ServerMessage(true, 'Petición incompleta', {});
      }
      // consultando el dispositivo con sus settings correspondientes

      //check if the device belongs to the main organization
      let deviceData: Device = await this.deviceRepository.findOne({
        where: {
          idDevice: idDevice,
          idUser: client.idUser,
          type: 0,
        },
        include: [
          {
            model: GasSettings,
            as: 'gasSettings',
            where: {
              idDevice: idDevice,
            },
            include: [
              {
                model: Device,
                as: 'device',
              },
            ],
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
        return new ServerMessage(true, 'El dispositivo no se encuentra', {});
      }

      return new ServerMessage(
        false,
        'Ajustes del dispositivo obtenidos con éxito',
        {
          belongsToMain:
            deviceData.organization.users.length == 0 ? false : true,
          gasSettings: deviceData.gasSettings,
          tankCapacity: deviceData.tankCapacity,
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
  async getGasDeviceData(
    client: User,
    idDevice: number,
    period: number,
  ): Promise<ServerMessage> {
    try {
      if (
        client == null ||
        client == undefined ||
        idDevice == null ||
        idDevice == undefined ||
        period == null ||
        period == undefined
      ) {
        return new ServerMessage(true, 'Petición incompleta', {});
      }

      let deviceData: Device = await this.deviceRepository.findOne({
        attributes: { exclude: ['imei'] },
        where: {
          idDevice: idDevice,
          type: 0,
          idUser: client.idUser,
        },
        include: [
          {
            model: GasSettings,
            as: 'gasSettings',
          },
          {
            model: Apn,
            as: 'apn',
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
      //Se checa si el dispositivo tiene una suscripción activa
      let activeSuscription = false;

      if (toLocalTime(new Date()) > deviceData.validUntil) {
        return new ServerMessage(false, 'Suscripción inactiva', {
          deviceData: deviceData,
          toDate: new Date(),
          fromDate: new Date(),
          periodHistories: [],
          periodLabels: [],
          periodValues: [],
          lastPeriodUpdate: 'Sin registros',
          lastPastPeriodMeasure: 0,
          activeSuscription: activeSuscription,
        });
      }

      activeSuscription = true;

      // extrayendo los historiales en donde se efectuó
      // un llenado del tanque, desde el inicio de los
      // registros hasta el día de hoy
      const searchDate: Date = getTomorrow(toLocalTime(new Date()));

      let fillingHistories: GasHistory[] = await this.gasHistoryRepository.findAll<
        GasHistory
      >({
        where: {
          idDevice: idDevice,
          dateTime: {
            [Op.lte]: searchDate.toISOString(),
          },
          fillingAlert: 1,
        },
        order: [['dateTime', 'DESC']],
      });
      // el periodo solicitado excede el numero de
      // periodos almacenados
      if (+period > fillingHistories.length) {
        //return new ServerMessage(true, 'No existe el periodo solicitado', {});
        return new ServerMessage(false, 'Información obtenida correctamente', {
          deviceData: deviceData,
          toDate: new Date(),
          fromDate: new Date(),
          periodHistories: [],
          periodLabels: [],
          periodValues: [],
          lastPeriodUpdate: 'Sin registros',
          lastPastPeriodMeasure: 0,
          activeSuscription: activeSuscription,
        });
      }

      // calculando las fechas desde (fromDate) hasta (toDate)
      // para determinar el periodo de consumo
      let today: Date =
        period == 0
          ? toLocalTime(new Date())
          : fillingHistories[+period - 1].dateTime;

      let toDate = getTomorrow(toLocalTime(new Date()));
      let fromDate = toLocalTime(new Date());
      let periodHistories: GasHistory[] = [];
      let lastPastPeriodMeasure = 0;

      // this.logger.debug(`# G -> today: ${today.toISOString()}, from: ${fromDate.toISOString()}, to: ${toDate.toISOString()}`);

      if (fillingHistories.length - period == 0) {
        // si no hay fechas de llenado en los historiales, tomamos toda
        // la información hasta la fecha de hoy

        // (por cuestiones de desfases de horario, la busqueda se realizará abarcando hasta el día siguiente al establecido)
        // this.logger.debug(`# G001 -> today: ${today.toISOString()}, from: ${fromDate.toISOString()}, to: ${toDate.toISOString()}`);

        periodHistories = await this.gasHistoryRepository.findAll<GasHistory>({
          where: {
            idDevice: idDevice,
            dateTime: {
              [Op.lt]: toDate.toISOString(),
            },
          },
          order: [['dateTime', 'DESC']],
        });
      } else {
        // en cambio, si hay fechas de llenado en los historiales, tomamos toda
        // la información desde la primer fecha de llenado hasta la fecha de hoy
        fromDate = fillingHistories[period === 0 ? 0 : +period].dateTime;

        // (por cuestiones de desfases de horario, la busqueda se realizará abarcando hasta el día siguiente al establecido)
        //this.logger.debug(`# G002 -> today: ${today.toISOString()}, from: ${fromDate.toISOString()}, to: ${toDate.toISOString()}`);

        periodHistories = await this.gasHistoryRepository.findAll<GasHistory>({
          where: {
            idDevice: idDevice,
            [Op.or]: [
              {
                dateTime: {
                  [Op.between]: [
                    (fromDate.toISOString() as unknown) as number,
                    (toDate.toISOString() as unknown) as number,
                  ],
                },
              },
            ],
            dateTime: {
              [Op.not]: toDate.toISOString(),
            },
          },
          order: [['dateTime', 'DESC']],
        });
        let lastPastPeriodHistory: GasHistory = await this.gasHistoryRepository.findOne<
          GasHistory
        >({
          where: {
            idDevice: idDevice,
            dateTime: {
              [Op.lt]: (fromDate.toISOString() as unknown) as number,
            },
          },
          order: [['dateTime', 'DESC']],
        });

        if (lastPastPeriodHistory) {
          lastPastPeriodMeasure = lastPastPeriodHistory.measure;
        }
      }

      return new ServerMessage(false, 'Información obtenida correctamente', {
        deviceData: deviceData,
        toDate: toDate,
        fromDate: fromDate,
        periodHistories: periodHistories,
        periodLabels: periodHistories.map((item: any) => {
          return this.getOnlyDate(item.dataValues.dateTime);
        }),
        periodValues: periodHistories.map((item: any) => {
          return new Number(
            ((item.dataValues.measure * deviceData.tankCapacity) / 100).toFixed(
              2,
            ),
          );
        }),
        lastPeriodUpdate:
          periodHistories.length == 0
            ? 'Sin registros'
            : this.getOnlyDate(
                new Date(
                  (periodHistories[
                    periodHistories.length - 1
                  ] as any).dataValues.dateTime,
                ),
              ),
        updated: deviceData.gasSettings.wereApplied,
        lastPastPeriodMeasure: lastPastPeriodMeasure,
        activeSuscription: activeSuscription,
      });
    } catch (error) {
      this.logger.error(error);
      return new ServerMessage(true, 'Ha ocurrido un error', error);
    }
  }

  /**
   *
   */
  async updateSettingsTankCapacity(
    client: User,
    settings: any,
  ): Promise<ServerMessage> {
    try {
      if (
        client == null ||
        client == undefined ||
        settings.idDevice == null ||
        settings.idDevice == undefined ||
        settings.tankCapacity == null ||
        settings.tankCapacity == undefined
      ) {
        return new ServerMessage(true, 'Petición incompleta', {
          settings: settings,
        });
      }

      let updateDevice: Device = await this.deviceRepository.findOne<Device>({
        where: {
          idDevice: settings.idDevice,
        },
      });

      if (!updateDevice) {
        return new ServerMessage(false, 'Dispositivo no disponible', {});
      }

      updateDevice.tankCapacity = settings.tankCapacity;
      await updateDevice.save();

      return new ServerMessage(false, 'Capacidad actualizada.', {});
    } catch (error) {
      this.logger.error(error);
      return new ServerMessage(true, 'Ha ocurrido un error', error);
    }
  }

  /**
   *
   */
  async updateSettingsGasInterval(
    client: User,
    settings: any,
  ): Promise<ServerMessage> {
    try {
      if (
        client == null ||
        client == undefined ||
        settings == null ||
        settings == undefined ||
        settings.interval == null ||
        settings.interval == undefined
      ) {
        return new ServerMessage(true, 'Petición incompleta', {});
      }

      let newSettings: GasSettings = await this.gasSettingsRepository.findOne<
        GasSettings
      >({
        where: {
          idDevice: settings.idDevice,
        },
        include: [
          {
            model: Device,
            as: 'device',
            where: {
              idUser: client.idUser,
              type: 0,
            },
          },
        ],
      });

      if (!newSettings || !newSettings.device) {
        return new ServerMessage(false, 'Dispositivo no disponible', {});
      }

      newSettings.interval = settings.interval;
      newSettings.wereApplied = false;
      await newSettings.save();

      return new ServerMessage(false, 'Intervalo atualizado.', {});
    } catch (error) {
      this.logger.error(error);
      return new ServerMessage(true, 'Ha ocurrido un error', error);
    }
  }

  /**
   *
   */
  async updateGasOffset(client: User, settings: any): Promise<ServerMessage> {
    try {
      if (
        client == null ||
        client == undefined ||
        settings == null ||
        settings == undefined ||
        settings.offset == null ||
        settings.offset == undefined
      ) {
        return new ServerMessage(true, 'Petición incompleta', {});
      }

      let newSettings: GasSettings = await this.gasSettingsRepository.findOne<
        GasSettings
      >({
        where: {
          idDevice: settings.idDevice,
        },
        include: [
          {
            model: Device,
            as: 'device',
            where: {
              idUser: client.idUser,
              type: 0,
            },
          },
        ],
      });

      if (!newSettings || !newSettings.device) {
        return new ServerMessage(false, 'Dispositivo no disponible', {});
      }

      newSettings.offset = settings.offset;
      newSettings.wereApplied = false;
      await newSettings.save();

      return new ServerMessage(
        false,
        'Porcentaje actualizado correctamente',
        {},
      );
    } catch (error) {
      this.logger.error(error);
      return new ServerMessage(true, 'Ha ocurrido un error', error);
    }
  }

  /**
   *
   */
  async updateGasOffsetTime(
    client: User,
    settings: any,
  ): Promise<ServerMessage> {
    try {
      if (
        client == null ||
        client == undefined ||
        settings == null ||
        settings == undefined ||
        settings.offsetTime == null ||
        settings.offsetTime == undefined
      ) {
        return new ServerMessage(true, 'Petición incompleta', {});
      }

      let newSettings: GasSettings = await this.gasSettingsRepository.findOne<
        GasSettings
      >({
        where: {
          idDevice: settings.idDevice,
        },
        include: [
          {
            model: Device,
            as: 'device',
            where: {
              idUser: client.idUser,
              type: 0,
            },
          },
        ],
      });

      if (!newSettings || !newSettings.device) {
        return new ServerMessage(false, 'Dispositivo no disponible', {});
      }

      newSettings.offsetTime = settings.offsetTime;
      newSettings.wereApplied = false;
      await newSettings.save();

      return new ServerMessage(
        false,
        'Toma de lectura actualizada correctamente',
        {},
      );
    } catch (error) {
      this.logger.error(error);
      return new ServerMessage(true, 'Ha ocurrido un error', error);
    }
  }

  /**
   *
   */
  async updateTravelMode(client: User, settings: any): Promise<ServerMessage> {
    try {
      if (
        client == null ||
        client == undefined ||
        settings == null ||
        settings == undefined ||
        settings.travelMode == null ||
        settings.travelMode == undefined
      ) {
        return new ServerMessage(true, 'Petición incompleta', {});
      }
      let newSettings: GasSettings = await this.gasSettingsRepository.findOne<
        GasSettings
      >({
        where: {
          idDevice: settings.idDevice,
        },
        include: [
          {
            model: Device,
            as: 'device',
            where: {
              idUser: client.idUser,
              type: 0,
            },
          },
        ],
      });
      if (!newSettings || !newSettings.device) {
        return new ServerMessage(false, 'Dispositivo no disponible', {});
      }
      newSettings.travelMode = settings.travelMode === 'true';
      newSettings.wereApplied = false;
      await newSettings.save();
      return new ServerMessage(false, 'Modo actualizado.', {});
    } catch (error) {
      this.logger.error(error);
      return new ServerMessage(true, 'Ha ocurrido un error', error);
    }
  }

  /**
   *
   */
  async updateSettingsGasMinFillingPercentage(
    client: User,
    settings: any,
  ): Promise<ServerMessage> {
    try {
      if (
        client == null ||
        client == undefined ||
        settings == null ||
        settings == undefined ||
        settings.minFillingPercentage == null ||
        settings.minFillingPercentage == undefined
      ) {
        return new ServerMessage(true, 'Petición incompleta', {});
      }

      let newSettings: GasSettings = await this.gasSettingsRepository.findOne<
        GasSettings
      >({
        where: {
          idDevice: settings.idDevice,
        },
        include: [
          {
            model: Device,
            as: 'device',
            where: {
              idUser: client.idUser,
              type: 0,
            },
          },
        ],
      });

      if (!newSettings || !newSettings.device) {
        return new ServerMessage(false, 'Dispositivo no disponible', {});
      } else if (
        settings.minFillingPercentage < 0 &&
        settings.minFillingPercentage > 30
      ) {
        return new ServerMessage(false, 'Ajuste invalido', {});
      }

      newSettings.minFillingPercentage = settings.minFillingPercentage;
      newSettings.wereApplied = false;
      await newSettings.save();

      return new ServerMessage(false, 'Atualizado.', {});
    } catch (error) {
      // this.logger.error(error);
      return new ServerMessage(true, 'Ha ocurrido un error', error);
    }
  }

  /**
   *
   */
  async updateConsumptionUnitsPeriod(
    client: User,
    settings: any,
  ): Promise<ServerMessage> {
    try {
      if (
        client == null ||
        client == undefined ||
        settings == null ||
        settings == undefined ||
        settings.consumptionUnits == null ||
        settings.consumptionUnits == undefined ||
        settings.consumptionPeriod == null ||
        settings.consumptionPeriod == undefined
      ) {
        return new ServerMessage(true, 'Petición incompleta', {});
      }

      let newSettings: GasSettings = await this.gasSettingsRepository.findOne<
        GasSettings
      >({
        where: {
          idDevice: settings.idDevice,
        },
        include: [
          {
            model: Device,
            as: 'device',
            where: {
              idUser: client.idUser,
              type: 0,
            },
          },
        ],
      });

      if (!newSettings || !newSettings.device) {
        return new ServerMessage(false, 'Dispositivo no disponible', {});
      }

      newSettings.consumptionUnits = this.formatSettingsToString(
        settings.consumptionUnits,
        4,
      );
      newSettings.consumptionPeriod = this.formatSettingsToString(
        settings.consumptionPeriod,
        3,
      );
      newSettings.wereApplied = false;
      await newSettings.save();

      return new ServerMessage(false, 'Unidades de consumo atualizadas.', {});
    } catch (error) {
      // this.logger.error(error);
      return new ServerMessage(true, 'Ha ocurrido un error', error);
    }
  }

  private formatSettingsToString(num: number, len: number) {
    let ans: string = '' + num;
    while (ans.length < len) {
      ans = '0' + ans;
    }
    return ans;
  }

  /**
   *
   */
  private async generateDummyData4gasHistories(days: number) {
    let gasDummyDevice: Device = await this.deviceRepository.findOne<Device>({
      where: {
        name: 'gas_dummy',
      },
    });
    //
    // complete period
    //
    if (gasDummyDevice) {
      let id: number = gasDummyDevice.idDevice;
      for (let day = 1; day <= days; day++) {
        for (let percent = 1; percent <= 100; percent += 20) {
          let measure: number = Math.abs(
            100 - percent + Math.random() * (0.5 - -0.5) + -0.5,
          );
          //
          // create
          //
          await this.gasHistoryRepository.create({
            idDevice: id,
            measure: measure,
            bateryLevel: 99,
            meanConsumption: 60,
            temperature: 25,
            resetAlert: 0,
            intervalAlert: 0,
            fillingAlert: measure < 98.5 ? 0 : 1,
          });
        }
      }
      //
      // half period
      //
      for (let percent = 1; percent <= 45; percent += 20) {
        let measure: number = Math.abs(
          100 - percent + Math.random() * (0.5 - -0.5) + -0.5,
        );
        //
        // create
        //
        await this.gasHistoryRepository.create({
          idDevice: id,
          measure: measure,
          bateryLevel: 99,
          meanConsumption: 60,
          temperature: 25,
          resetAlert: 0,
          intervalAlert: 0,
          fillingAlert: measure < 98.5 ? 0 : 1,
        });
      }
    }
  }

  async getGasDeviceAlerts(
    client: User,
    idDevice: number,
    period: number,
  ): Promise<ServerMessage> {
    try {
      if (
        client == null ||
        client == undefined ||
        idDevice == null ||
        idDevice == undefined ||
        period == null ||
        period == undefined
      ) {
        return new ServerMessage(true, 'Petición incompleta', {});
      }

      let deviceData: Device = await this.deviceRepository.findOne({
        attributes: { exclude: ['imei'] },
        where: {
          idDevice: idDevice,
          type: 0,
          idUser: client.idUser,
        },
        include: [
          {
            model: GasSettings,
            as: 'gasSettings',
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

      // extrayendo los historiales en donde se efectuó
      // un llenado del tanque, desde el inicio de los
      // registros hasta el día de hoy
      const searchDate: Date = getTomorrow(toLocalTime(new Date()));

      let fillingHistories: GasHistory[] = await this.gasHistoryRepository.findAll<
        GasHistory
      >({
        where: {
          idDevice: idDevice,
          dateTime: {
            [Op.lte]: searchDate.toISOString(),
          },
          fillingAlert: 1,
        },
        order: [['dateTime', 'DESC']],
      });

      console.log('FH:', fillingHistories);

      // el periodo solicitado excede el numero de
      // periodos almacenados
      if (+period > fillingHistories.length) {
        return new ServerMessage(false, 'Información obtenida correctamente', {
          deviceData: deviceData,
          toDate: new Date(),
          fromDate: new Date(),
          periodHistories: [],
          periodLabels: [],
          periodValues: [],
          lastPeriodUpdate: 'Sin registros',
        });
      }
      // calculando las fechas desde (fromDate) hasta (toDate)
      // para determinar el periodo de consumo
      let today: Date =
        period == 0
          ? toLocalTime(new Date())
          : fillingHistories[+period - 1].dateTime;

      let toDate = getTomorrow(toLocalTime(new Date())); // let toDate = new Date();
      let fromDate = toLocalTime(new Date()); // let fromDate = new Date();
      let periodHistories: GasHistory[] = [];

      if (fillingHistories.length - period == 0) {
        // si no hay fechas de llenado en los historiales, tomamos toda
        // la información hasta la fecha de hoy
        periodHistories = await this.gasHistoryRepository.findAll<GasHistory>({
          where: {
            idDevice: idDevice,
            dateTime: {
              [Op.lt]: toDate.toISOString(),
            },
          },
          order: [['dateTime', 'ASC']],
        });
      } else {
        // en cambio, si hay fechas de llenado en los historiales, tomamos toda
        // la información desde la primer fecha de llenado hasta la fecha de hoy
        fromDate = fillingHistories[period === 0 ? 0 : +period].dateTime;

        periodHistories = await this.gasHistoryRepository.findAll<GasHistory>({
          where: {
            idDevice: idDevice,
            [Op.or]: [
              {
                dateTime: {
                  [Op.between]: [
                    (fromDate.toISOString() as unknown) as number,
                    (toDate.toISOString() as unknown) as number,
                  ],
                },
              },
            ],
            dateTime: {
              [Op.not]: toDate.toISOString(),
            },
          },
          order: [['dateTime', 'ASC']],
        });
      }

      let alertHistories = periodHistories.filter(
        item => item.fillingAlert || item.resetAlert || item.intervalAlert,
      );

      // retornar el periodo solicitado
      return new ServerMessage(false, 'Información obtenida correctamente', {
        deviceData: deviceData,
        updated: deviceData.gasSettings.wereApplied,
        toDate: toDate,
        fromDate: fromDate,
        alertHistory: alertHistories,
        alertLabels: alertHistories.map((item: any) => {
          return this.getOnlyDate(item.dataValues.dateTime);
        }),
        alertValues: periodHistories.map((item: any) => {
          return item.dataValues.measure;
        }),

        lastAlertUpdate:
          alertHistories.length == 0
            ? 'Sin registros'
            : this.getOnlyDate(
                new Date(
                  (alertHistories[
                    alertHistories.length - 1
                  ] as any).dataValues.dateTime,
                ),
              ),
      });
    } catch (error) {
      // this.logger.error(error);
      return new ServerMessage(true, 'Ha ocurrido un error', error);
    }
  }

  async getWaterDeviceAlerts(
    clientData: any,
    idDevice: number,
    period: number,
  ): Promise<ServerMessage> {
    try {
      const constrants = [
        clientData == null,
        clientData == undefined,
        idDevice == null,
        idDevice == undefined,
        period == null,
        period == undefined,
      ];

      if (constrants.some(val => val)) {
        return new ServerMessage(true, 'Petición incompleta', {});
      }

      //Validation device exist
      let deviceData: Device = await this.deviceRepository.findOne<Device>({
        attributes: { exclude: ['imei'] },
        where: {
          idDevice: idDevice,
          idUser: (clientData as User).idUser,
        },
        include: [
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
          {
            model: Organization,
            as: 'organization',
            attributes: [
              'logoUrl',
              'comercialName',
              'primaryColor',
              'secondaryColor',
            ],
          },
          {
            model: GasHistory,
            as: 'gasHistory',
            limit: 1,
            order: [['createdAt', 'DESC']],
          },
          {
            model: WaterHistory,
            as: 'waterHistory',
            limit: 1,
            order: [['dateTime', 'DESC']],
          },
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

      if (!deviceData.waterSettings) {
        return new ServerMessage(true, 'El dispositivo no esta disponible', {});
      }
      let todayDay = toLocalTime(new Date());

      if (period > 0) {
        if (deviceData.waterSettings.serviceOutageDay < todayDay.getDate()) {
          todayDay = toLocalTime(
            new Date(
              todayDay.getFullYear(),
              todayDay.getMonth() - (period - 1),
              deviceData.waterSettings.serviceOutageDay,
              0,
              0,
              1,
            ),
          );
        } else {
          todayDay = toLocalTime(
            new Date(
              todayDay.getFullYear(),
              todayDay.getMonth() - period,
              deviceData.waterSettings.serviceOutageDay,
              0,
              0,
              1,
            ),
          );
        }
      }

      let fromDate = new Date(
        todayDay.getFullYear(),
        todayDay.getMonth(),
        deviceData.waterSettings.serviceOutageDay,
        0,
        0,
        1,
      );

      if (deviceData.waterSettings.serviceOutageDay > todayDay.getDate()) {
        fromDate = new Date(
          todayDay.getFullYear(),
          todayDay.getMonth() - 1,
          deviceData.waterSettings.serviceOutageDay,
          0,
          0,
          1,
        );
      }
      fromDate = toLocalTime(fromDate);
      // extrayendo los historiales en donde se efectuó
      // un llenado del tanque, desde el inicio de los
      // registros hasta el día de hoy
      const searchDate: Date = getTomorrow(todayDay);

      let actualPeriod: WaterHistory[] = await this.waterHistoryRepository.findAll(
        {
          where: {
            idDevice: deviceData.idDevice,
            [Op.or]: [
              {
                dateTime: {
                  [Op.between]: [
                    (fromDate.toISOString() as unknown) as number,
                    (searchDate.toISOString() as unknown) as number,
                  ],
                },
              },
              {
                dateTime: fromDate.toISOString(),
              },
              {
                dateTime: searchDate.toISOString(),
              },
            ],
          },
          //limit: 1,
          order: [['dateTime', 'DESC']],
        },
      );

      let lastPeriodHistory: WaterHistory[] = await this.waterHistoryRepository.findAll<
        WaterHistory
      >({
        attributes: ['idWaterHistory', 'consumption', 'dateTime'],
        where: {
          idDevice: deviceData.idDevice,
          dateTime: {
            [Op.lte]: fromDate.toISOString(),
          },
        },
        limit: 1,
        order: [['dateTime', 'DESC']],
      });

      //console.log("actual period",actualPeriod);

      let litersConsumedThisMonth: number = 0;
      let actualPeriodMetry: number = 0;
      let lastPeriodMetry: number = 0;

      if (actualPeriod.length == 0 && lastPeriodHistory.length == 0) {
        litersConsumedThisMonth = 0;
      } else if (actualPeriod.length > 0 && lastPeriodHistory.length == 0) {
        litersConsumedThisMonth = actualPeriod[0].consumption;
        actualPeriodMetry = actualPeriod[0].consumption;
      } else if (actualPeriod.length == 0 && lastPeriodHistory.length == 1) {
        litersConsumedThisMonth = 0;
      } else if (actualPeriod.length > 0 && lastPeriodHistory.length == 1) {
        //Falta el quinto if
        if (actualPeriod[0].consumption < lastPeriodHistory[0].consumption) {
          let maximumNumberLiters: number = 999999999999;
          if (deviceData.version == 1) {
            //For industry version
            //Si es de tipo industrial o alguna otra version hay que poner el numero de dígitos máximos
            //escribiendo el mayor numero posible para desplegar
          }
          litersConsumedThisMonth =
            actualPeriod[0].consumption +
            (maximumNumberLiters - lastPeriodHistory[0].consumption);
        } else {
          litersConsumedThisMonth =
            actualPeriod[0].consumption - lastPeriodHistory[0].consumption;
        }
        actualPeriodMetry = actualPeriod[0].consumption;
        lastPeriodMetry = lastPeriodHistory[0].consumption;
      }

      let actualLabels: any[] = [];
      let limitValueLine: any[] = [];
      let actualPeriodValues: any[] = [];

      let alertHistories = actualPeriod.filter(
        item =>
          item.dripAlert ||
          item.manipulationAlert ||
          item.emptyAlert ||
          item.burstAlert ||
          item.bubbleAlert ||
          item.reversedFlowAlert,
      );

      alertHistories.forEach(async (history: WaterHistory) => {
        actualLabels = [this.getOnlyDate(history.dateTime), ...actualLabels];
        limitValueLine.push(deviceData.waterSettings.monthMaxConsumption);
        actualPeriodValues = [
          new Number(
            ((history.consumption - lastPeriodMetry) / 1000).toFixed(2),
          ),
          ...actualPeriodValues,
        ];
      });

      return new ServerMessage(false, 'Información obtenida correctamente', {
        periodHistorial: alertHistories,
        actualLabels: actualLabels,
        actualPeriodValues: actualPeriodValues,
      });
    } catch (error) {
      // this.logger.error(error);
      return new ServerMessage(true, 'A ocurrido un error', error);
    }
  }

  /**
   *
   */
  async detachDevice(
    client: User,
    clientDevice: Device,
  ): Promise<ServerMessage> {
    try {
      //
      // check constrants
      //
      const constrants = [
        client == null,
        client == undefined,
        clientDevice == null,
        clientDevice == undefined,
        clientDevice.idDevice == null,
        clientDevice.idDevice == undefined,
      ];
      if (constrants.some(val => val))
        return new ServerMessage(true, 'Petición incompleta', {});

      //
      // check instances
      //
      let device: Device = await this.deviceRepository.findOne({
        where: {
          idDevice: clientDevice.idDevice,
        },
        include: [
          {
            model: Organization,
            as: 'organization',
          },
        ],
      });

      let storekeepers: User[] = await this.userRepository.findAll({
        where: {
          idOrganization: device.idOrganization,
          idRole: 3,
        },
      });

      //
      // business logic
      //
      let storekeeper: User = storekeepers[0];
      device.idUser = storekeeper.idUser;
      device.isActive = true;
      await device.save();
      return new ServerMessage(
        false,
        'el dispositivo ha sido desvinculado',
        {},
      );


    } catch (error) {
      // this.logger.error(error);
      return new ServerMessage(true, 'A ocurrido un error', error);
    }
  }
}
