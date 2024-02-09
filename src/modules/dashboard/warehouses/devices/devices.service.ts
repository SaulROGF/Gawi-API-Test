import { GasSettings } from './../../../../models/gasSettings.entity';
import { Device } from './../../../../models/device.entity';
import { Injectable, Inject } from '@nestjs/common';
import { ServerMessage } from '../../../../classes/ServerMessage.class';
import { User } from '../../../../models/user.entity';
import { Sequelize, Op } from 'sequelize';
import { WaterSettings } from '../../../../models/waterSettings.entity';
import { Apn } from '../../../../models/apn.entity';
import { Logger } from 'winston';
import { DataloggerSettings } from '../../../../models/dataloggerSettings.entity';
import { NaturalGasSettings } from 'src/models/naturalGasSettings.entity';

@Injectable()
export class DevicesService {
    constructor(
        //Es una manera de dar de alta el repositorio de la tabla de usuarios
        @Inject('DeviceRepository') private readonly deviceRepository: typeof Device,
        @Inject('WaterSettingsRepository') private readonly waterSettingsRepository: typeof WaterSettings,
        @Inject('DataloggerSettingsRepository') private readonly dataloggerSettingsRepository: typeof DataloggerSettings,
        @Inject('GasSettingsRepository') private readonly gasSettingsRepository: typeof GasSettings,
        @Inject('NaturalGasSettingsRepository')
        private readonly naturalGasSettingsRepository: typeof NaturalGasSettings,
        @Inject('ApnRepository') private readonly apnRepository: typeof Apn,
        @Inject('winston') private readonly logger: Logger,
    ) {
    }

    /**
    *
    */
    async getApnList(): Promise<ServerMessage> {
        try {
            let apnList: any[] = await this.apnRepository.findAll<Apn>({

            }).map(async (apn: Apn) => {
                let apnFixed: any = apn.toJSON();

                apnFixed.noDevices = await this.deviceRepository.count({
                    where: {
                        idApn: apn.idApn,
                    }
                });

                return apnFixed
            });

            return new ServerMessage(false, 'Apn obtenidos correctamente', {
                apnList: apnList
            });
        } catch (error) {
            this.logger.error(error);
            return new ServerMessage(true, 'A ocurrido un error', error);
        }
    }

    async loadHomeDataWarehouse(userWarehouse: User): Promise<ServerMessage> {
        try {
            if (
                userWarehouse == null ||
                userWarehouse == undefined
            ) {
                return new ServerMessage(true, "Campos inválidos", {});
            }

            let todayDate = new Date();
            let dates: Date[] = [];
            let datesLabels: string[] = [];
            let valuesWater: any[] = [];
            let valuesGas: any[] = [];

            for (let index = 0; index < 7; index++) {
                todayDate = new Date();
                todayDate.setHours(0);
                todayDate.setMinutes(0);
                todayDate.setSeconds(0);
                dates.push(new Date(todayDate.setDate(todayDate.getDate() - index)));

                let montNum = new Date(dates[index]).getUTCMonth() + 1;
                let fixMont = montNum.toString().length == 1 ? "0" + montNum : montNum;
                datesLabels.push("" + new Date(dates[index]).getFullYear() + "-" + fixMont + "-" + new Date(dates[index]).getDate());

                let finaleOfDay: Date = new Date(dates[index]);
                finaleOfDay.setHours(23);
                finaleOfDay.setMinutes(59);

                let alreadyDevices: any[] = await this.deviceRepository.findAll<Device>({
                    attributes: [
                        'type',
                        [Sequelize.literal(`MONTH(createdAt)`), 'mont'],
                        [Sequelize.literal(`DAY(createdAt)`), 'day'],
                        'createdAt',
                        [Sequelize.literal(`COUNT(*)`), 'count']
                    ],
                    where: {
                        idUser: userWarehouse.idUser,
                        createdAt: {
                            [Op.gte]: dates[index],
                            [Op.lte]: finaleOfDay,
                        }
                    },
                    group: [
                        'type'
                    ],
                });

                let fixedValues: any[] = [0, 0];//[gas,agua]

                alreadyDevices.forEach((deviceCountData: any/*  { type : number , month : number,day : number,  createdAt : string,count : number} */) => {
                    fixedValues[deviceCountData.dataValues.type] = deviceCountData.dataValues.count;
                });
                valuesGas.push(fixedValues[0]);
                valuesWater.push(fixedValues[1]);
            }

            return new ServerMessage(false, "Datos de pa pagina principal del almacenista obtenidos con éxito.", {
                //dates : dates,
                barChartData: [
                    { data: valuesWater, label: 'Agua' },
                    { data: valuesGas, label: 'Gas' }
                ],
                barChartLabels: datesLabels,
            });
        } catch (error) {
            this.logger.error(error);
            return new ServerMessage(true, "A ocurrido un error creando el dispositivo", error);
        }
    }

    async createDevice(userWarehouse: User, newDeviceData: Device): Promise<ServerMessage> {
        try {
            if (
                newDeviceData.imei == null ||
                newDeviceData.imei == undefined ||
                newDeviceData.idApn == null ||
                newDeviceData.idApn == undefined ||
                newDeviceData.serialNumber == null ||
                newDeviceData.serialNumber == undefined ||
                newDeviceData.type == null ||
                newDeviceData.type == undefined ||
                newDeviceData.firmwareVersion == null ||
                newDeviceData.firmwareVersion == undefined ||
                newDeviceData.boardVersion == null ||
                newDeviceData.boardVersion == undefined
            ) {
                return new ServerMessage(true, "Campos inválidos", {});
            } else if (newDeviceData.imei.length != 15 || newDeviceData.serialNumber.length != 8) {
                return new ServerMessage(true, "Campos inválidos", {});
            }

            let alreadyDevice: Device = await this.deviceRepository.findOne<Device>({
                where: {
                    serialNumber: newDeviceData.serialNumber,
                    type: newDeviceData.type,
                }
            });

            if (alreadyDevice) {
                return new ServerMessage(true, "Dispositivo actualmente registrado", {});
            }

            let newDeviceWater: Device = await this.deviceRepository.create<Device>({
                //idDevice: number.
                idUser: userWarehouse.idUser,
                idTown: userWarehouse.idTown,
                idOrganization: userWarehouse.idOrganization,
                idApn: newDeviceData.idApn,
                imei: newDeviceData.imei,
                name: "",
                serialNumber: newDeviceData.serialNumber,
                type: newDeviceData.type,
                version: 0,
                tankCapacity: 0,
                latitude: 0,
                longitude: 0,
                address: "",
                extNumber: "",
                intNumber: "",
                suburb: "",
                zipCode: "",
                firmwareVersion: newDeviceData.firmwareVersion,
                boardVersion: newDeviceData.boardVersion,
                //createdAt : Date,
                //updatedAt : Date
            });

            let createSettingsResult : ServerMessage = await this.createDeviceSetings(newDeviceWater); 

            if(createSettingsResult.error == true){
                return createSettingsResult;
            }

            return new ServerMessage(false, "Dispositivo creado con éxito.", newDeviceWater);
        } catch (error) {
            this.logger.error(error);
            return new ServerMessage(true, "A ocurrido un error creando el dispositivo", error);
        }
    }


    async createDeviceSetings(deviceData: Device): Promise<ServerMessage> {
        try {
            if (deviceData.type == 0) {
                let newGasSettings: GasSettings = await this.gasSettingsRepository.create({
                    idDevice: deviceData.idDevice,
                    destUrl: process.env.API_URL,
                    closingHour: '00:01',         // 5 digitos
                    consumptionUnits: '0060',     // 4 digitos
                    consumptionPeriod: '010',     // 3 digitos  
                    minFillingPercentage: 10,     // 2 digitos
                    interval: 5,                  // 2 digitos
                    minsBetweenMeasurements: 10,  // 4 digitos
                    wereApplied: false,
                    firmwareVersion: "",
                });

            } else if (deviceData.type == 1) {
                let newWaterSettings: WaterSettings = await this.waterSettingsRepository.create<WaterSettings>({
                    //idWaterSettings: number,
                    /**
                     * Llaves foraneas
                     */
                    idDevice: deviceData.idDevice,
                    /**
                     * Configuraciones requeridas
                     */
                    firmwareVersion: "1.0.0",
                    serviceOutageDay: 1,
                    monthMaxConsumption: 0.0,
                    wereApplied: true,
                    status: 16383, // sin ninguna cfg por actualizar
                    /**
                     * Configuraciones generales
                     */
                    apiUrl: process.env.API_URL,
                    consumptionUnits: "M3",
                    flowUnits: "LPS",
                    storageFrequency: 60,//0 a 60 = cada hora
                    storageTime: "00:00",
                    dailyTransmission: 1,//0 o 1 des/act
                    dailyTime: "00:00",
                    customDailyTime: 0,//0 o 1 (12 am/12 pm)
                    periodicFrequency: 1440, // cada cuantos minutos transmite periódicamente ( 0 a 1440 )
                    periodicTime: "00:00",
                    ipProtocol: 1, //  del 0 al 2
                    auth: 0, //  del 0 al 3
                    label: "", // max len 50
                    consumptionAlertType: 0, // 0 o 1 (continua/mensual)
                    consumptionSetpoint: 1, // 1 a  ??? 1 litro/min
                    dripSetpoint: 30,// 0 a 1440 medida en minutos
                    burstSetpoint: 30,// 0 a 1440 medida en minutos
                    flowSetpoint: 30,// 0 a 1440 medida en minutos
                    /**
                     * Configuraciones de las alertas
                     */
                    dripFlag: true,
                    manipulationFlag: true,
                    reversedFlowFlag: true,
                    burstFlag: true,
                    bubbleFlag: true,
                    emptyFlag: true,
                    //updatedAt: Date,
                    //createdAt: Date
                });
            } else if (deviceData.type == 2) {
                let newDataloggerSettings: DataloggerSettings = await this.dataloggerSettingsRepository.create<DataloggerSettings>({
                    /**
                     * Llaves foraneas
                     */
                     idDevice: deviceData.idDevice,
                });
            }else if (deviceData.type == 3) {
                //Gas natural

               const newGasNaturalSettings: NaturalGasSettings = await this.naturalGasSettingsRepository.create<NaturalGasSettings>({
                idDevice: deviceData.idDevice,
                wereApplied: 0,
                status: 16383,
                firmwareVersion: "beta",
                serviceOutageDay: 15,
                monthMaxConsumption: 0.0,
                apiUrl: process.env.API_URL,
                consumptionUnits: "L",
                storageFrequency: 1440,
                storageTime: "00:00",
                dailyTime: "00:00",
                customDailyTime: 0,
                dailyTransmission: 1,
                periodicFrequency: 1440,
                periodicTime: "00:00",
                ipProtocol: 1,
                auth: 1,
                label: "Medidor de gas natural beta 1.0",
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
            newGasNaturalSettings.save();
            }

            return new ServerMessage(false, "Ajustes del dispositivo creados con exito.", {});
        } catch (error) {
            this.logger.error(error);
            return new ServerMessage(true, "A ocurrido un error creando el dispositivo", error);
        }
    }

    async createMultipleDevices(userWarehouse: User, newDevicesData: Device[]): Promise<ServerMessage> {
        try {
            if (
                newDevicesData == null ||
                newDevicesData == undefined ||
                newDevicesData.length == 0
            ) {
                return new ServerMessage(true, "Campos inválidos", {});
            }

            let errors: ServerMessage[] = [];

            for (let index = 0; index < newDevicesData.length; index++) {
                const newDevice: Device = newDevicesData[index];
                let alreadyDevice: Device = await this.deviceRepository.findOne<Device>({
                    where: {
                        serialNumber: newDevice.serialNumber,
                        type: newDevice.type,
                    }
                });

                if (alreadyDevice) {
                    errors.push(new ServerMessage(true, "Dispositivo actualmente registrado", newDevice));
                } else {
                    if (
                        newDevice.imei == null ||
                        newDevice.imei == undefined ||
                        newDevice.idApn == null ||
                        newDevice.idApn == undefined ||
                        newDevice.serialNumber == null ||
                        newDevice.serialNumber == undefined ||
                        newDevice.type == null ||
                        newDevice.type == undefined ||
                        newDevice.firmwareVersion == null ||
                        newDevice.firmwareVersion == undefined ||
                        newDevice.boardVersion == null ||
                        newDevice.boardVersion == undefined
                    ) {
                        return new ServerMessage(true, "Campos inválidos", {});
                    } else if (newDevice.imei.length != 15 || newDevice.serialNumber.length != 8) {
                        return new ServerMessage(true, "Campos inválidos", {});
                    }

                    let newDeviceSaved: Device = await this.deviceRepository.create<Device>({
                        //idDevice: number.
                        idUser: userWarehouse.idUser,
                        idTown: userWarehouse.idTown,
                        idApn: newDevice.idApn,
                        idOrganization: userWarehouse.idOrganization,
                        imei: newDevice.imei,
                        serialNumber: newDevice.serialNumber,
                        type: newDevice.type,
                        version: 0,
                        tankCapacity: 0,
                        latitude: 0,
                        longitude: 0,
                        address: "",
                        extNumber: "",
                        intNumber: "",
                        suburb: "",
                        zipCode: "",
                        firmwareVersion: newDevice.firmwareVersion,
                        boardVersion: newDevice.boardVersion,
                        //createdAt : Date,
                        //updatedAt : Date
                    });

                    let createSettingsResult : ServerMessage = await this.createDeviceSetings(newDeviceSaved); 

                    if(createSettingsResult.error == true){
                        return createSettingsResult;
                    }

                    errors.push(new ServerMessage(false, "Dispositivo añadido con éxito", newDevice));
                }
            }

            return new ServerMessage(false, "Dispositivos creados con éxito.", {
                errors: errors
            });
        } catch (error) {
            this.logger.error(error);
            return new ServerMessage(true, "A ocurrido un error creando el dispositivo", error);
        }
    }

    async checkAlreadyDevice(deviceData: Device): Promise<ServerMessage> {
        try {
            if (
                deviceData.serialNumber == null ||
                deviceData.serialNumber == undefined ||
                deviceData.type == null ||
                deviceData.type == undefined
            ) {
                return new ServerMessage(true, "Campos inválidos", {});
            } else if (deviceData.serialNumber.length != 8) {
                return new ServerMessage(true, "Campos inválidos", {});
            }

            let alreadyDevice: Device = await this.deviceRepository.findOne<Device>({
                where: {
                    serialNumber: deviceData.serialNumber,
                    type: deviceData.type,
                }
            });

            if (!alreadyDevice) {
                return new ServerMessage(true, "Dispositivo sin registrar", {});
            }

            return new ServerMessage(false, "Dispositivo actualmente activo", alreadyDevice);
        } catch (error) {
            this.logger.error(error);
            return new ServerMessage(true, "A ocurrido un error verificando el dispositivo", error);
        }
    }


}
