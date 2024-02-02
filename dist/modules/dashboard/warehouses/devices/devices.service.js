"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DevicesService = void 0;
const common_1 = require("@nestjs/common");
const ServerMessage_class_1 = require("../../../../classes/ServerMessage.class");
const sequelize_1 = require("sequelize");
const naturalGasSettings_entity_1 = require("../../../../models/naturalGasSettings.entity");
let DevicesService = class DevicesService {
    constructor(deviceRepository, waterSettingsRepository, dataloggerSettingsRepository, gasSettingsRepository, naturalGasSettingsRepository, apnRepository, logger) {
        this.deviceRepository = deviceRepository;
        this.waterSettingsRepository = waterSettingsRepository;
        this.dataloggerSettingsRepository = dataloggerSettingsRepository;
        this.gasSettingsRepository = gasSettingsRepository;
        this.naturalGasSettingsRepository = naturalGasSettingsRepository;
        this.apnRepository = apnRepository;
        this.logger = logger;
    }
    async getApnList() {
        try {
            let apnList = await this.apnRepository.findAll({}).map(async (apn) => {
                let apnFixed = apn.toJSON();
                apnFixed.noDevices = await this.deviceRepository.count({
                    where: {
                        idApn: apn.idApn,
                    }
                });
                return apnFixed;
            });
            return new ServerMessage_class_1.ServerMessage(false, 'Apn obtenidos correctamente', {
                apnList: apnList
            });
        }
        catch (error) {
            this.logger.error(error);
            return new ServerMessage_class_1.ServerMessage(true, 'A ocurrido un error', error);
        }
    }
    async loadHomeDataWarehouse(userWarehouse) {
        try {
            if (userWarehouse == null ||
                userWarehouse == undefined) {
                return new ServerMessage_class_1.ServerMessage(true, "Campos inválidos", {});
            }
            let todayDate = new Date();
            let dates = [];
            let datesLabels = [];
            let valuesWater = [];
            let valuesGas = [];
            for (let index = 0; index < 7; index++) {
                todayDate = new Date();
                todayDate.setHours(0);
                todayDate.setMinutes(0);
                todayDate.setSeconds(0);
                dates.push(new Date(todayDate.setDate(todayDate.getDate() - index)));
                let montNum = new Date(dates[index]).getUTCMonth() + 1;
                let fixMont = montNum.toString().length == 1 ? "0" + montNum : montNum;
                datesLabels.push("" + new Date(dates[index]).getFullYear() + "-" + fixMont + "-" + new Date(dates[index]).getDate());
                let finaleOfDay = new Date(dates[index]);
                finaleOfDay.setHours(23);
                finaleOfDay.setMinutes(59);
                let alreadyDevices = await this.deviceRepository.findAll({
                    attributes: [
                        'type',
                        [sequelize_1.Sequelize.literal(`MONTH(createdAt)`), 'mont'],
                        [sequelize_1.Sequelize.literal(`DAY(createdAt)`), 'day'],
                        'createdAt',
                        [sequelize_1.Sequelize.literal(`COUNT(*)`), 'count']
                    ],
                    where: {
                        idUser: userWarehouse.idUser,
                        createdAt: {
                            [sequelize_1.Op.gte]: dates[index],
                            [sequelize_1.Op.lte]: finaleOfDay,
                        }
                    },
                    group: [
                        'type'
                    ],
                });
                let fixedValues = [0, 0];
                alreadyDevices.forEach((deviceCountData) => {
                    fixedValues[deviceCountData.dataValues.type] = deviceCountData.dataValues.count;
                });
                valuesGas.push(fixedValues[0]);
                valuesWater.push(fixedValues[1]);
            }
            return new ServerMessage_class_1.ServerMessage(false, "Datos de pa pagina principal del almacenista obtenidos con éxito.", {
                barChartData: [
                    { data: valuesWater, label: 'Agua' },
                    { data: valuesGas, label: 'Gas' }
                ],
                barChartLabels: datesLabels,
            });
        }
        catch (error) {
            this.logger.error(error);
            return new ServerMessage_class_1.ServerMessage(true, "A ocurrido un error creando el dispositivo", error);
        }
    }
    async createDevice(userWarehouse, newDeviceData) {
        try {
            if (newDeviceData.imei == null ||
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
                newDeviceData.boardVersion == undefined) {
                return new ServerMessage_class_1.ServerMessage(true, "Campos inválidos", {});
            }
            else if (newDeviceData.imei.length != 15 || newDeviceData.serialNumber.length != 8) {
                return new ServerMessage_class_1.ServerMessage(true, "Campos inválidos", {});
            }
            let alreadyDevice = await this.deviceRepository.findOne({
                where: {
                    serialNumber: newDeviceData.serialNumber,
                    type: newDeviceData.type,
                }
            });
            if (alreadyDevice) {
                return new ServerMessage_class_1.ServerMessage(true, "Dispositivo actualmente registrado", {});
            }
            let newDeviceWater = await this.deviceRepository.create({
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
            });
            let createSettingsResult = await this.createDeviceSetings(newDeviceWater);
            if (createSettingsResult.error == true) {
                return createSettingsResult;
            }
            return new ServerMessage_class_1.ServerMessage(false, "Dispositivo creado con éxito.", newDeviceWater);
        }
        catch (error) {
            this.logger.error(error);
            return new ServerMessage_class_1.ServerMessage(true, "A ocurrido un error creando el dispositivo", error);
        }
    }
    async createDeviceSetings(deviceData) {
        try {
            if (deviceData.type == 0) {
                let newGasSettings = await this.gasSettingsRepository.create({
                    idDevice: deviceData.idDevice,
                    destUrl: process.env.API_URL,
                    closingHour: '00:01',
                    consumptionUnits: '0060',
                    consumptionPeriod: '010',
                    minFillingPercentage: 10,
                    interval: 5,
                    minsBetweenMeasurements: 10,
                    wereApplied: false,
                    firmwareVersion: "",
                });
            }
            else if (deviceData.type == 1) {
                let newWaterSettings = await this.waterSettingsRepository.create({
                    idDevice: deviceData.idDevice,
                    firmwareVersion: "1.0.0",
                    serviceOutageDay: 1,
                    monthMaxConsumption: 0.0,
                    wereApplied: true,
                    status: 16383,
                    apiUrl: process.env.API_URL,
                    consumptionUnits: "M3",
                    flowUnits: "LPS",
                    storageFrequency: 60,
                    storageTime: "00:00",
                    dailyTransmission: 1,
                    dailyTime: "00:00",
                    customDailyTime: 0,
                    periodicFrequency: 1440,
                    periodicTime: "00:00",
                    ipProtocol: 1,
                    auth: 0,
                    label: "",
                    consumptionAlertType: 0,
                    consumptionSetpoint: 1,
                    dripSetpoint: 30,
                    burstSetpoint: 30,
                    flowSetpoint: 30,
                    dripFlag: true,
                    manipulationFlag: true,
                    reversedFlowFlag: true,
                    burstFlag: true,
                    bubbleFlag: true,
                    emptyFlag: true,
                });
            }
            else if (deviceData.type == 2) {
                let newDataloggerSettings = await this.dataloggerSettingsRepository.create({
                    idDevice: deviceData.idDevice,
                });
            }
            else if (deviceData.type == 3) {
                const newGasNaturalSettings = await this.naturalGasSettingsRepository.create({
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
            return new ServerMessage_class_1.ServerMessage(false, "Ajustes del dispositivo creados con exito.", {});
        }
        catch (error) {
            this.logger.error(error);
            return new ServerMessage_class_1.ServerMessage(true, "A ocurrido un error creando el dispositivo", error);
        }
    }
    async createMultipleDevices(userWarehouse, newDevicesData) {
        try {
            if (newDevicesData == null ||
                newDevicesData == undefined ||
                newDevicesData.length == 0) {
                return new ServerMessage_class_1.ServerMessage(true, "Campos inválidos", {});
            }
            let errors = [];
            for (let index = 0; index < newDevicesData.length; index++) {
                const newDevice = newDevicesData[index];
                let alreadyDevice = await this.deviceRepository.findOne({
                    where: {
                        serialNumber: newDevice.serialNumber,
                        type: newDevice.type,
                    }
                });
                if (alreadyDevice) {
                    errors.push(new ServerMessage_class_1.ServerMessage(true, "Dispositivo actualmente registrado", newDevice));
                }
                else {
                    if (newDevice.imei == null ||
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
                        newDevice.boardVersion == undefined) {
                        return new ServerMessage_class_1.ServerMessage(true, "Campos inválidos", {});
                    }
                    else if (newDevice.imei.length != 15 || newDevice.serialNumber.length != 8) {
                        return new ServerMessage_class_1.ServerMessage(true, "Campos inválidos", {});
                    }
                    let newDeviceSaved = await this.deviceRepository.create({
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
                    });
                    let createSettingsResult = await this.createDeviceSetings(newDeviceSaved);
                    if (createSettingsResult.error == true) {
                        return createSettingsResult;
                    }
                    errors.push(new ServerMessage_class_1.ServerMessage(false, "Dispositivo añadido con éxito", newDevice));
                }
            }
            return new ServerMessage_class_1.ServerMessage(false, "Dispositivos creados con éxito.", {
                errors: errors
            });
        }
        catch (error) {
            this.logger.error(error);
            return new ServerMessage_class_1.ServerMessage(true, "A ocurrido un error creando el dispositivo", error);
        }
    }
    async checkAlreadyDevice(deviceData) {
        try {
            if (deviceData.serialNumber == null ||
                deviceData.serialNumber == undefined ||
                deviceData.type == null ||
                deviceData.type == undefined) {
                return new ServerMessage_class_1.ServerMessage(true, "Campos inválidos", {});
            }
            else if (deviceData.serialNumber.length != 8) {
                return new ServerMessage_class_1.ServerMessage(true, "Campos inválidos", {});
            }
            let alreadyDevice = await this.deviceRepository.findOne({
                where: {
                    serialNumber: deviceData.serialNumber,
                    type: deviceData.type,
                }
            });
            if (!alreadyDevice) {
                return new ServerMessage_class_1.ServerMessage(true, "Dispositivo sin registrar", {});
            }
            return new ServerMessage_class_1.ServerMessage(false, "Dispositivo actualmente activo", alreadyDevice);
        }
        catch (error) {
            this.logger.error(error);
            return new ServerMessage_class_1.ServerMessage(true, "A ocurrido un error verificando el dispositivo", error);
        }
    }
};
DevicesService = __decorate([
    common_1.Injectable(),
    __param(0, common_1.Inject('DeviceRepository')),
    __param(1, common_1.Inject('WaterSettingsRepository')),
    __param(2, common_1.Inject('DataloggerSettingsRepository')),
    __param(3, common_1.Inject('GasSettingsRepository')),
    __param(4, common_1.Inject('NaturalGasSettingsRepository')),
    __param(5, common_1.Inject('ApnRepository')),
    __param(6, common_1.Inject('winston')),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object, Object, Object])
], DevicesService);
exports.DevicesService = DevicesService;
//# sourceMappingURL=devices.service.js.map