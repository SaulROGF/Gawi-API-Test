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
const apn_entity_1 = require("./../../../../models/apn.entity");
const common_1 = require("@nestjs/common");
const town_entity_1 = require("./../../../../models/town.entity");
const user_entity_1 = require("../../../../models/user.entity");
const ServerMessage_class_1 = require("../../../../classes/ServerMessage.class");
const state_entity_1 = require("./../../../../models/state.entity");
const device_entity_1 = require("../../../../models/device.entity");
const organization_entity_1 = require("../../../../models/organization.entity");
const gasHistory_entity_1 = require("../../../../models/gasHistory.entity");
const waterHistory_entity_1 = require("../../../../models/waterHistory.entity");
const waterSettings_entity_1 = require("../../../../models/waterSettings.entity");
const gasSettings_entity_1 = require("../../../../models/gasSettings.entity");
const sequelize_1 = require("sequelize");
const utilities_1 = require("./../../../../utils/utilities");
const dataloggerHistory_entity_1 = require("../../../../models/dataloggerHistory.entity");
const datalogger_adapter_1 = require("../../devices/devices/classes/datalogger.adapter");
const dataloggerSettings_entity_1 = require("../../../../models/dataloggerSettings.entity");
const naturalGasHistory_entity_1 = require("../../../../models/naturalGasHistory.entity");
const naturalGasSettings_entity_1 = require("../../../../models/naturalGasSettings.entity");
let DevicesService = class DevicesService {
    constructor(deviceRepository, waterHistoryRepository, gasHistoryRepository, waterSettingsRepository, gasSettingsRepository, dataloggerHistoryRepository, naturalGasHistoryRepository, naturalGasSettingsRepository, dataloggerSettingsRepository, userRepository, stateRepository, townRepository, logger) {
        this.deviceRepository = deviceRepository;
        this.waterHistoryRepository = waterHistoryRepository;
        this.gasHistoryRepository = gasHistoryRepository;
        this.waterSettingsRepository = waterSettingsRepository;
        this.gasSettingsRepository = gasSettingsRepository;
        this.dataloggerHistoryRepository = dataloggerHistoryRepository;
        this.naturalGasHistoryRepository = naturalGasHistoryRepository;
        this.naturalGasSettingsRepository = naturalGasSettingsRepository;
        this.dataloggerSettingsRepository = dataloggerSettingsRepository;
        this.userRepository = userRepository;
        this.stateRepository = stateRepository;
        this.townRepository = townRepository;
        this.logger = logger;
    }
    getOnlyDate(dateToFix) {
        let dateFixed = new Date(dateToFix);
        return (dateFixed.toLocaleDateString('es-MX', {
            year: 'numeric',
            timeZone: 'UTC',
        }) +
            '-' +
            dateFixed.toLocaleDateString('es-MX', {
                month: '2-digit',
                timeZone: 'UTC',
            }) +
            '-' +
            dateFixed.toLocaleDateString('es-MX', { day: '2-digit', timeZone: 'UTC' }));
    }
    getDateTimepikerFormat(dateToFix) {
        const fixedType = new Date(dateToFix);
        let montNum = fixedType.getUTCMonth() + 1;
        let fixMont = montNum.toString().length == 1 ? '0' + montNum : montNum;
        let fixDate = fixedType.getDate().toString().length == 1
            ? '0' + fixedType.getDate()
            : fixedType.getDate();
        let dateFixed = '' + fixDate + '.' + fixMont + '.' + fixedType.getFullYear();
        let fixHour = fixedType.getHours().toString().length == 1
            ? '0' + fixedType.getHours()
            : fixedType.getHours();
        let fixMin = fixedType.getMinutes().toString().length == 1
            ? '0' + fixedType.getMinutes()
            : fixedType.getMinutes();
        let fixSec = fixedType.getSeconds().toString().length == 1
            ? '0' + fixedType.getSeconds()
            : fixedType.getSeconds();
        let timeFixed = '' + fixHour + ':' + fixMin + ':' + fixSec;
        return dateFixed + ' ' + timeFixed;
    }
    addMonths(months, date = new Date()) {
        var d = date.getDate();
        date.setMonth(date.getMonth() + +months);
        if (date.getDate() != d) {
            date.setDate(0);
        }
        return date;
    }
    convertDateToUTC(date) {
        return new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds());
    }
    async getAlerts(client) {
        try {
            if (client == null || client == undefined) {
                return new ServerMessage_class_1.ServerMessage(true, 'Petición incompleta', {});
            }
            let waterDevices = await this.deviceRepository.findAll({
                where: {
                    idUser: client.idUser,
                    type: 1,
                },
                include: [
                    {
                        model: waterHistory_entity_1.WaterHistory,
                        as: 'waterHistory',
                        limit: 1,
                        order: [['createdAt', 'DESC']],
                    },
                ],
            });
            let gasDevices = await this.deviceRepository.findAll({
                where: {
                    idUser: client.idUser,
                    type: 0,
                },
                include: [
                    {
                        model: gasHistory_entity_1.GasHistory,
                        as: 'gasHistory',
                        limit: 1,
                        order: [['createdAt', 'DESC']],
                    },
                ],
            });
            let waterDevicesWithAlarms = waterDevices.filter(item => {
                if (item.waterHistory.length > 0) {
                    if (item.waterHistory[0].reversedFlowAlert == true ||
                        item.waterHistory[0].bubbleAlert == true ||
                        item.waterHistory[0].dripAlert == true ||
                        item.waterHistory[0].manipulationAlert == true ||
                        item.waterHistory[0].emptyAlert == true ||
                        item.waterHistory[0].burstAlert == true) {
                        return true;
                    }
                    else {
                        return false;
                    }
                }
                else {
                    return false;
                }
            }).length;
            let gasDevicesWithAlarms = gasDevices.filter(item => {
                if (item.gasHistory.length > 0) {
                    if (item.gasHistory[0].intervalAlert == true ||
                        item.gasHistory[0].fillingAlert == true ||
                        item.gasHistory[0].resetAlert == true) {
                        return true;
                    }
                    else {
                        return false;
                    }
                }
                else {
                    return false;
                }
            }).length;
            return new ServerMessage_class_1.ServerMessage(false, 'Conectado correctamente', {
                devicesWithAlarms: waterDevicesWithAlarms + gasDevicesWithAlarms,
            });
        }
        catch (error) {
            return new ServerMessage_class_1.ServerMessage(true, 'A ocurrido un error', error);
        }
    }
    async getDevices(clientData) {
        try {
            const constrants = [
                clientData == null,
                clientData == undefined,
                clientData.idUser == null,
                clientData.idUser == undefined,
            ];
            if (constrants.some(val => val)) {
                return new ServerMessage_class_1.ServerMessage(true, 'Petición incompleta', {});
            }
            let clientDevices = await this.deviceRepository
                .findAll({
                attributes: { exclude: ['imei'] },
                where: {
                    idUser: clientData.idUser,
                },
                include: [
                    {
                        model: organization_entity_1.Organization,
                        as: 'organization',
                        attributes: [
                            'logoUrl',
                            'comercialName',
                            'primaryColor',
                            'secondaryColor',
                        ],
                    },
                    {
                        model: gasHistory_entity_1.GasHistory,
                        as: 'gasHistory',
                        limit: 1,
                        order: [['createdAt', 'DESC']],
                    },
                    {
                        model: waterHistory_entity_1.WaterHistory,
                        as: 'waterHistory',
                        limit: 1,
                        order: [['createdAt', 'DESC']],
                    },
                    {
                        model: naturalGasHistory_entity_1.NaturalGasHistory,
                        as: 'naturalGasHistory',
                        limit: 1,
                        order: [['createdAt', 'DESC']],
                    },
                    {
                        model: waterSettings_entity_1.WaterSettings,
                        as: 'waterSettings',
                    },
                    {
                        model: gasSettings_entity_1.GasSettings,
                        as: 'gasSettings',
                    },
                    {
                        model: dataloggerSettings_entity_1.DataloggerSettings,
                        as: 'dataloggerSettings',
                    },
                    {
                        model: naturalGasSettings_entity_1.NaturalGasSettings,
                        as: 'naturalGasSettings',
                    },
                    {
                        model: dataloggerHistory_entity_1.DataloggerHistory,
                        as: 'dataloggerHistory',
                        limit: 1,
                        order: [['createdAt', 'DESC']],
                    },
                ],
            })
                .map(async (device) => {
                let fixedDevice = device;
                if (device.type == 0) {
                    const searchDate = utilities_1.getTomorrow(utilities_1.toLocalTime(new Date()));
                    let allGasHistories = await this.gasHistoryRepository.findAll({
                        where: {
                            idDevice: device.idDevice
                        },
                        order: [['dateTime', 'DESC']]
                    });
                    let zeroTankCapacity = false;
                    let acumulatedGasInPeriod = device.gasHistory[0].accumulatedConsumption;
                    let acumulatedGasConvertion = 0;
                    if (acumulatedGasInPeriod < 0) {
                        acumulatedGasInPeriod = 0;
                    }
                    else {
                        if (device.tankCapacity === 0) {
                            zeroTankCapacity = true;
                            acumulatedGasConvertion = 0;
                        }
                        else {
                            zeroTankCapacity = false;
                            acumulatedGasConvertion = (acumulatedGasInPeriod * device.tankCapacity) / 100;
                        }
                    }
                    let totalGasConsumed = 0;
                    for (let i = 0; i < allGasHistories.length - 1; i++) {
                        let currentMeasure = allGasHistories[i].measure;
                        let nextMeasure = allGasHistories[i + 1].measure;
                        if (currentMeasure > nextMeasure) {
                            totalGasConsumed += currentMeasure - nextMeasure;
                        }
                    }
                    let totalGasVolume = 0;
                    if (device.tankCapacity === 0) {
                        zeroTankCapacity = true;
                    }
                    else {
                        totalGasVolume = (totalGasConsumed * device.tankCapacity) / 100;
                        zeroTankCapacity = false;
                    }
                    let modifiedGasHistory = device.gasHistory[0];
                    modifiedGasHistory.accumulatedConsumption = totalGasVolume;
                    return Object.assign({
                        idDevice: device.idDevice,
                        name: device.name,
                        serialNumber: device.serialNumber,
                        type: device.type,
                        organization: device.organization,
                        gasHistory: [modifiedGasHistory],
                        gasSetting: device.gasSettings,
                        waterHistory: device.waterHistory,
                        waterSettings: device.waterSettings,
                        zeroTankCapacity: zeroTankCapacity,
                        totalGasConsumed: totalGasVolume,
                    });
                }
                if (device.type == 1) {
                    let todayDay = utilities_1.toLocalTime(new Date());
                    let fromDate = new Date(todayDay.getFullYear(), todayDay.getMonth(), device.waterSettings.serviceOutageDay, 0, 0, 1);
                    if (device.waterSettings.serviceOutageDay > todayDay.getDate()) {
                        fromDate = new Date(todayDay.getFullYear(), todayDay.getMonth() - 1, device.waterSettings.serviceOutageDay, 0, 0, 1);
                    }
                    fromDate = utilities_1.toLocalTime(fromDate);
                    let actualPeriod = await this.waterHistoryRepository.findAll({
                        attributes: ['idWaterHistory', 'consumption', 'createdAt'],
                        where: {
                            idDevice: device.idDevice,
                            [sequelize_1.Op.or]: [
                                {
                                    createdAt: {
                                        [sequelize_1.Op.between]: [
                                            fromDate.toISOString(),
                                            todayDay.toISOString(),
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
                    });
                    let lastPeriodHistory = await this.waterHistoryRepository.findAll({
                        attributes: ['idWaterHistory', 'consumption', 'createdAt'],
                        where: {
                            idDevice: device.idDevice,
                            createdAt: {
                                [sequelize_1.Op.lte]: fromDate.toISOString(),
                            },
                        },
                        limit: 1,
                        order: [['createdAt', 'DESC']],
                    });
                    let litersConsumedThisMonth = 0;
                    let actualPeriodMetry = 0;
                    let lastPeriodMetry = 0;
                    if (actualPeriod.length == 0 && lastPeriodHistory.length == 0) {
                        litersConsumedThisMonth = 0;
                    }
                    else if (actualPeriod.length > 0 &&
                        lastPeriodHistory.length == 0) {
                        litersConsumedThisMonth = actualPeriod[0].consumption;
                        actualPeriodMetry = actualPeriod[0].consumption;
                    }
                    else if (actualPeriod.length == 0 &&
                        lastPeriodHistory.length == 1) {
                        litersConsumedThisMonth = 0;
                    }
                    else if (actualPeriod.length > 0 &&
                        lastPeriodHistory.length == 1) {
                        if (actualPeriod[0].consumption < lastPeriodHistory[0].consumption) {
                            let maximumNumberLiters = 999999999999;
                            if (device.version == 1) {
                            }
                            litersConsumedThisMonth =
                                actualPeriod[0].consumption +
                                    (maximumNumberLiters - lastPeriodHistory[0].consumption);
                        }
                        else {
                            litersConsumedThisMonth =
                                actualPeriod[0].consumption -
                                    lastPeriodHistory[0].consumption;
                        }
                        actualPeriodMetry = actualPeriod[0].consumption;
                        lastPeriodMetry = lastPeriodHistory[0].consumption;
                    }
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
                }
                else if (device.type == 2) {
                    let numAlerts = 0;
                    if (device.dataloggerHistory.length > 0) {
                        if (device.dataloggerHistory[0].alerts > 0) {
                            let original = new datalogger_adapter_1.DataloggerHistoryAdapter(device.dataloggerHistory[0]);
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
                }
                else if (device.type == 3) {
                    let todayDay = utilities_1.toLocalTime(new Date());
                    let fromDate = new Date(todayDay.getFullYear(), todayDay.getMonth(), device.naturalGasSettings.serviceOutageDay, 0, 0, 1);
                    if (device.naturalGasSettings.serviceOutageDay > todayDay.getDate()) {
                        fromDate = new Date(todayDay.getFullYear(), todayDay.getMonth() - 1, device.naturalGasSettings.serviceOutageDay, 0, 0, 1);
                    }
                    fromDate = utilities_1.toLocalTime(fromDate);
                    let actualPeriod = await this.naturalGasHistoryRepository.findAll({
                        attributes: ['idHistory', 'consumption', 'dateTime'],
                        where: {
                            idDevice: device.idDevice,
                            [sequelize_1.Op.or]: [
                                {
                                    dateTime: {
                                        [sequelize_1.Op.between]: [
                                            fromDate.toISOString(),
                                            todayDay.toISOString(),
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
                    let lastPeriodHistory = await this.naturalGasHistoryRepository.findAll({
                        attributes: ['idHistory', 'consumption', 'dateTime'],
                        where: {
                            idDevice: device.idDevice,
                            dateTime: {
                                [sequelize_1.Op.lte]: fromDate.toISOString(),
                            },
                        },
                        limit: 1,
                        order: [['dateTime', 'DESC']],
                    });
                    let litersConsumedThisMonth = 0;
                    let actualPeriodMetry = 0;
                    let lastPeriodMetry = 0;
                    if (actualPeriod.length == 0 && lastPeriodHistory.length == 0) {
                        litersConsumedThisMonth = 0;
                    }
                    else if (actualPeriod.length > 0 &&
                        lastPeriodHistory.length == 0) {
                        litersConsumedThisMonth = actualPeriod[0].consumption;
                        actualPeriodMetry = actualPeriod[0].consumption;
                    }
                    else if (actualPeriod.length == 0 &&
                        lastPeriodHistory.length == 1) {
                        litersConsumedThisMonth = 0;
                    }
                    else if (actualPeriod.length > 0 &&
                        lastPeriodHistory.length == 1) {
                        if (actualPeriod[0].consumption < lastPeriodHistory[0].consumption) {
                            let maximumNumberLiters = 999999999999;
                            if (device.version == 1) {
                            }
                            litersConsumedThisMonth =
                                actualPeriod[0].consumption +
                                    (maximumNumberLiters - lastPeriodHistory[0].consumption);
                        }
                        else {
                            litersConsumedThisMonth =
                                actualPeriod[0].consumption -
                                    lastPeriodHistory[0].consumption;
                        }
                        actualPeriodMetry = actualPeriod[0].consumption;
                        lastPeriodMetry = lastPeriodHistory[0].consumption;
                    }
                    return Object.assign({
                        litersConsumedThisMonth: litersConsumedThisMonth,
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
                }
                else {
                    return Object.assign(fixedDevice);
                }
            });
            return new ServerMessage_class_1.ServerMessage(false, 'Dispositivos obtenidos correctamente', {
                clientDevices: clientDevices,
            });
        }
        catch (error) {
            this.logger.error(error);
            return new ServerMessage_class_1.ServerMessage(true, 'A ocurrido un error', error);
        }
    }
    async addDevice(clientData, deviceData) {
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
                return new ServerMessage_class_1.ServerMessage(true, 'Petición incompleta', {});
            }
            let deviceToUpdate = await this.deviceRepository.findOne({
                where: {
                    serialNumber: deviceData.serialNumber,
                    type: deviceData.type,
                },
                include: [
                    {
                        model: user_entity_1.User,
                        as: 'user',
                    },
                ],
            });
            if (!deviceToUpdate) {
                return new ServerMessage_class_1.ServerMessage(true, 'Dispositivo no disponible', {});
            }
            else if (deviceToUpdate.user.idUser == clientData.idUser) {
                return new ServerMessage_class_1.ServerMessage(true, 'Dispositivo actualmente en la lista', {});
            }
            else if (deviceToUpdate.isActive == false) {
                return new ServerMessage_class_1.ServerMessage(true, 'Dispositivo no disponible', {});
            }
            deviceToUpdate.idUser = clientData.idUser;
            deviceToUpdate.isActive = false;
            await deviceToUpdate.save();
            return new ServerMessage_class_1.ServerMessage(false, 'Conectado correctamente', {});
        }
        catch (error) {
            return new ServerMessage_class_1.ServerMessage(true, 'A ocurrido un error', error);
        }
    }
    async getNaturalGasDeviceData(clientData, idDevice, period) {
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
                return new ServerMessage_class_1.ServerMessage(true, 'Petición incompleta', {});
            }
            let deviceData = (await this.deviceRepository.findOne({
                attributes: { exclude: ['imei'] },
                where: {
                    idDevice: idDevice,
                    type: 3,
                    idUser: clientData.idUser,
                },
                include: [
                    {
                        model: apn_entity_1.Apn,
                        as: 'apn',
                    },
                    {
                        model: town_entity_1.Town,
                        as: 'town',
                        include: [
                            {
                                model: state_entity_1.State,
                                as: 'state',
                            },
                        ],
                    },
                    {
                        model: organization_entity_1.Organization,
                        as: 'organization',
                        attributes: [
                            'logoUrl',
                            'comercialName',
                            'primaryColor',
                            'secondaryColor',
                        ],
                    },
                    {
                        model: naturalGasHistory_entity_1.NaturalGasHistory,
                        as: 'naturalGasHistory',
                        limit: 1,
                        order: [['dateTime', 'DESC']],
                    },
                    {
                        model: naturalGasSettings_entity_1.NaturalGasSettings,
                        as: 'naturalGasSettings',
                    },
                ],
            }));
            if (!deviceData.naturalGasSettings) {
                return new ServerMessage_class_1.ServerMessage(true, 'El dispositivo no esta disponible', {});
            }
            let todayDay = utilities_1.toLocalTime(new Date());
            let activeSuscription = false;
            activeSuscription = true;
            if (period > 0) {
                if (deviceData.naturalGasSettings.serviceOutageDay < todayDay.getDate()) {
                    todayDay = utilities_1.toLocalTime(new Date(todayDay.getFullYear(), todayDay.getMonth() - (period - 1), deviceData.naturalGasSettings.serviceOutageDay, 0, 0, 1));
                }
                else {
                    todayDay = utilities_1.toLocalTime(new Date(todayDay.getFullYear(), todayDay.getMonth() - period, deviceData.naturalGasSettings.serviceOutageDay, 0, 0, 1));
                }
            }
            let fromDate = new Date(todayDay.getFullYear(), todayDay.getMonth(), deviceData.naturalGasSettings.serviceOutageDay, 0, 0, 1);
            if (deviceData.naturalGasSettings.serviceOutageDay > todayDay.getDate()) {
                fromDate = new Date(todayDay.getFullYear(), todayDay.getMonth() - 1, deviceData.naturalGasSettings.serviceOutageDay, 0, 0, 1);
            }
            fromDate = utilities_1.toLocalTime(fromDate);
            let actualPeriod = await this.naturalGasHistoryRepository.findAll({
                attributes: ['idHistory', 'consumption', 'dateTime'],
                where: {
                    idDevice: deviceData.idDevice,
                    [sequelize_1.Op.or]: [
                        {
                            dateTime: {
                                [sequelize_1.Op.between]: [
                                    fromDate.toISOString(),
                                    todayDay.toISOString(),
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
                order: [['dateTime', 'DESC']],
            });
            let lastPeriodHistory = await this.naturalGasHistoryRepository.findAll({
                attributes: ['idHistory', 'consumption', 'dateTime'],
                where: {
                    idDevice: deviceData.idDevice,
                    dateTime: {
                        [sequelize_1.Op.lte]: fromDate.toISOString(),
                    },
                },
                limit: 1,
                order: [['dateTime', 'DESC']],
            });
            let litersConsumedThisMonth = 0;
            let actualPeriodMetry = 0;
            let lastPeriodMetry = 0;
            if (actualPeriod.length == 0 && lastPeriodHistory.length == 0) {
                litersConsumedThisMonth = 0;
            }
            else if (actualPeriod.length > 0 && lastPeriodHistory.length == 0) {
                litersConsumedThisMonth = actualPeriod[0].consumption;
                actualPeriodMetry = actualPeriod[0].consumption;
            }
            else if (actualPeriod.length == 0 && lastPeriodHistory.length == 1) {
                litersConsumedThisMonth = 0;
            }
            else if (actualPeriod.length > 0 && lastPeriodHistory.length == 1) {
                if (actualPeriod[0].consumption < lastPeriodHistory[0].consumption) {
                    let maximumNumberLiters = 999999999999;
                    if (deviceData.version == 1) {
                    }
                    litersConsumedThisMonth =
                        actualPeriod[0].consumption +
                            (maximumNumberLiters - lastPeriodHistory[0].consumption);
                }
                else {
                    litersConsumedThisMonth =
                        actualPeriod[0].consumption - lastPeriodHistory[0].consumption;
                }
                actualPeriodMetry = actualPeriod[0].consumption;
                lastPeriodMetry = lastPeriodHistory[0].consumption;
            }
            let actualLabels = [];
            let limitValueLine = [];
            let actualPeriodValues = [];
            actualPeriod.forEach(async (history) => {
                actualPeriodValues = [
                    new Number((history.consumption - lastPeriodMetry)
                        .toFixed(2)),
                    ...actualPeriodValues,
                ];
                actualLabels = [this.getOnlyDate(history.dateTime), ...actualLabels];
                limitValueLine.push(deviceData.naturalGasSettings.monthMaxConsumption);
            });
            return new ServerMessage_class_1.ServerMessage(false, 'Información obtenida correctamente', {
                deviceData: deviceData,
                litersConsumedThisMonth: new Number(litersConsumedThisMonth.toFixed(2)),
                monthMaxConsumption: deviceData.naturalGasSettings.monthMaxConsumption,
                serviceOutageDay: deviceData.naturalGasSettings.serviceOutageDay,
                actualPeriodMetry: actualPeriodMetry,
                lastPeriodMetry: lastPeriodMetry,
                actualLabels: actualLabels,
                actualPeriodValues: actualPeriodValues,
                limitValueLine: limitValueLine,
                lastPeriodUpdate: actualPeriod.length == 0
                    ? 'Sin indicar'
                    : this.getOnlyDate(actualPeriod[0].dateTime),
                periodHistorial: actualPeriod,
                activeSuscription: activeSuscription,
            });
        }
        catch (error) {
            return new ServerMessage_class_1.ServerMessage(true, 'A ocurrido un error', error);
        }
    }
    async getNaturalGasDeviceSettings(client, idDevice) {
        try {
            if (client == null ||
                client == undefined ||
                idDevice == null ||
                idDevice == undefined) {
                return new ServerMessage_class_1.ServerMessage(true, 'Petición incompleta', {});
            }
            let naturalGasSettings = await this.naturalGasSettingsRepository.findOne({
                where: {
                    idDevice: idDevice,
                },
                include: [
                    {
                        model: device_entity_1.Device,
                        as: 'device',
                        where: {
                            idUser: client.idUser,
                            type: 3,
                        },
                    },
                ],
            });
            if (!naturalGasSettings) {
                return new ServerMessage_class_1.ServerMessage(true, 'Dispositivo no disponible', {});
            }
            let deviceData = await this.deviceRepository.findOne({
                where: {
                    idDevice: idDevice,
                    idUser: client.idUser,
                    type: 3,
                },
                include: [
                    {
                        model: organization_entity_1.Organization,
                        as: 'organization',
                        include: [
                            {
                                model: user_entity_1.User,
                                as: 'users',
                                where: {
                                    idRole: 1,
                                },
                                limit: 1,
                            },
                        ],
                    },
                    {
                        model: town_entity_1.Town,
                        as: 'town',
                        include: [
                            {
                                model: state_entity_1.State,
                                as: 'state',
                            },
                        ],
                    },
                ],
            });
            return new ServerMessage_class_1.ServerMessage(false, 'Ajustes del dispositivo obtenidos con éxito', {
                belongsToMain: deviceData.organization.users.length == 0 ? false : true,
                naturalGasSettings: naturalGasSettings,
            });
        }
        catch (error) {
            return new ServerMessage_class_1.ServerMessage(true, 'Ha ocurrido un error', error);
        }
    }
    async updateSettingsNaturalServiceMonthMaxConsumption(client, settings) {
        try {
            if (client == null ||
                client == undefined ||
                settings.idDevice == null ||
                settings.idDevice == undefined ||
                settings.monthMaxConsumption == null ||
                settings.monthMaxConsumption == undefined) {
                return new ServerMessage_class_1.ServerMessage(true, 'Petición incompleta', {});
            }
            let newSettings = await this.naturalGasSettingsRepository.findOne({
                where: {
                    idDevice: settings.idDevice,
                },
            });
            if (!newSettings) {
                return new ServerMessage_class_1.ServerMessage(true, 'EL dispositivo no esta disponible', {});
            }
            newSettings.monthMaxConsumption = settings.monthMaxConsumption;
            await newSettings.save();
            return new ServerMessage_class_1.ServerMessage(false, 'Actualizado con éxito.', {});
        }
        catch (error) {
            return new ServerMessage_class_1.ServerMessage(true, 'Ha ocurrido un error', error);
        }
    }
    async getDeviceWaterData(clientData, idDevice, period) {
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
                return new ServerMessage_class_1.ServerMessage(true, 'Petición incompleta', {});
            }
            let deviceData = await this.deviceRepository.findOne({
                attributes: { exclude: ['imei'] },
                where: {
                    idDevice: idDevice,
                    idUser: clientData.idUser,
                },
                include: [
                    {
                        model: apn_entity_1.Apn,
                        as: 'apn',
                    },
                    {
                        model: town_entity_1.Town,
                        as: 'town',
                        include: [
                            {
                                model: state_entity_1.State,
                                as: 'state',
                            },
                        ],
                    },
                    {
                        model: organization_entity_1.Organization,
                        as: 'organization',
                        attributes: [
                            'logoUrl',
                            'comercialName',
                            'primaryColor',
                            'secondaryColor',
                        ],
                    },
                    {
                        model: gasHistory_entity_1.GasHistory,
                        as: 'gasHistory',
                        limit: 1,
                        order: [['createdAt', 'DESC']],
                    },
                    {
                        model: waterHistory_entity_1.WaterHistory,
                        as: 'waterHistory',
                        limit: 1,
                        order: [['dateTime', 'DESC']],
                    },
                    {
                        model: waterSettings_entity_1.WaterSettings,
                        as: 'waterSettings',
                    },
                    {
                        model: gasSettings_entity_1.GasSettings,
                        as: 'gasSettings',
                    },
                ],
            });
            if (!deviceData.waterSettings) {
                return new ServerMessage_class_1.ServerMessage(true, 'El dispositivo no esta disponible', {});
            }
            let todayDay = utilities_1.toLocalTime(new Date());
            let activeSuscription = false;
            if (todayDay > deviceData.validUntil) {
                return new ServerMessage_class_1.ServerMessage(false, 'Suscripción inactiva', {
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
                    todayDay = utilities_1.toLocalTime(new Date(todayDay.getFullYear(), todayDay.getMonth() - (period - 1), deviceData.waterSettings.serviceOutageDay, 0, 0, 1));
                }
                else {
                    todayDay = utilities_1.toLocalTime(new Date(todayDay.getFullYear(), todayDay.getMonth() - period, deviceData.waterSettings.serviceOutageDay, 0, 0, 1));
                }
            }
            let fromDate = new Date(todayDay.getFullYear(), todayDay.getMonth(), deviceData.waterSettings.serviceOutageDay, 0, 0, 1);
            if (deviceData.waterSettings.serviceOutageDay > todayDay.getDate()) {
                fromDate = new Date(todayDay.getFullYear(), todayDay.getMonth() - 1, deviceData.waterSettings.serviceOutageDay, 0, 0, 1);
            }
            fromDate = utilities_1.toLocalTime(fromDate);
            const searchDate = utilities_1.getTomorrow(todayDay);
            let actualPeriod = await this.waterHistoryRepository.findAll({
                attributes: ['idWaterHistory', 'consumption', 'flow', 'dateTime'],
                where: {
                    idDevice: deviceData.idDevice,
                    [sequelize_1.Op.or]: [
                        {
                            dateTime: {
                                [sequelize_1.Op.between]: [
                                    fromDate.toISOString(),
                                    searchDate.toISOString(),
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
                order: [['dateTime', 'DESC']],
            });
            let lastPeriodHistory = await this.waterHistoryRepository.findAll({
                attributes: ['idWaterHistory', 'consumption', 'dateTime'],
                where: {
                    idDevice: deviceData.idDevice,
                    dateTime: {
                        [sequelize_1.Op.lte]: fromDate.toISOString(),
                    },
                },
                limit: 1,
                order: [['dateTime', 'DESC']],
            });
            let litersConsumedThisMonth = 0;
            let actualPeriodMetry = 0;
            let lastPeriodMetry = 0;
            if (actualPeriod.length == 0 && lastPeriodHistory.length == 0) {
                litersConsumedThisMonth = 0;
            }
            else if (actualPeriod.length > 0 && lastPeriodHistory.length == 0) {
                litersConsumedThisMonth = actualPeriod[0].consumption;
                actualPeriodMetry = actualPeriod[0].consumption;
            }
            else if (actualPeriod.length == 0 && lastPeriodHistory.length == 1) {
                litersConsumedThisMonth = 0;
            }
            else if (actualPeriod.length > 0 && lastPeriodHistory.length == 1) {
                if (actualPeriod[0].consumption < lastPeriodHistory[0].consumption) {
                    let maximumNumberLiters = 999999999999;
                    if (deviceData.version == 1) {
                    }
                    litersConsumedThisMonth =
                        actualPeriod[0].consumption +
                            (maximumNumberLiters - lastPeriodHistory[0].consumption);
                }
                else {
                    litersConsumedThisMonth =
                        actualPeriod[0].consumption - lastPeriodHistory[0].consumption;
                }
                actualPeriodMetry = actualPeriod[0].consumption;
                lastPeriodMetry = lastPeriodHistory[0].consumption;
            }
            let actualLabels = [];
            let limitValueLine = [];
            let actualPeriodValues = [];
            actualPeriod.forEach(async (history) => {
                actualPeriodValues = [
                    new Number((history.consumption - lastPeriodMetry).toFixed(2)),
                    ...actualPeriodValues,
                ];
                actualLabels = [this.getOnlyDate(history.dateTime), ...actualLabels];
                limitValueLine.push(deviceData.waterSettings.monthMaxConsumption);
                history.consumption = history.consumption * 1000;
            });
            return new ServerMessage_class_1.ServerMessage(false, 'Información obtenida correctamente', {
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
                lastPeriodUpdate: actualPeriod.length == 0
                    ? 'Sin indicar'
                    : this.getOnlyDate(actualPeriod[0].dateTime),
                periodHistorial: actualPeriod,
                activeSuscription: activeSuscription,
            });
        }
        catch (error) {
            return new ServerMessage_class_1.ServerMessage(true, 'A ocurrido un error', error);
        }
    }
    async updateDeviceName(clientData, deviceData) {
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
                return new ServerMessage_class_1.ServerMessage(true, 'Petición incompleta', {});
            }
            let deviceToUpdate = await this.deviceRepository.findOne({
                where: {
                    idDevice: deviceData.idDevice,
                    idUser: clientData.idUser,
                },
                include: [
                    {
                        model: user_entity_1.User,
                        as: 'user',
                    },
                ],
            });
            if (!deviceToUpdate) {
                return new ServerMessage_class_1.ServerMessage(true, 'Dispositivo no disponible', {});
            }
            else if (deviceToUpdate.user.idRole != 7) {
                return new ServerMessage_class_1.ServerMessage(true, 'Dispositivo no disponible', {});
            }
            deviceToUpdate.name = deviceData.name;
            await deviceToUpdate.save();
            return new ServerMessage_class_1.ServerMessage(false, 'Nombre actualizado', {});
        }
        catch (error) {
            return new ServerMessage_class_1.ServerMessage(true, 'A ocurrido un error actualizando el nombre', error);
        }
    }
    async getIndividualLoggerDeviceData(query, idUser) {
        try {
            if (idUser == null || idUser == undefined) {
                return new ServerMessage_class_1.ServerMessage(true, 'Petición incompleta', {});
            }
            let deviceData = await this.deviceRepository.findOne({
                attributes: { exclude: ['imei'] },
                where: {
                    idDevice: query.idDevice,
                    idUser: idUser,
                    type: 2,
                },
                include: [
                    {
                        model: dataloggerSettings_entity_1.DataloggerSettings,
                        as: 'dataloggerSettings',
                    },
                ],
            });
            if (!deviceData) {
                return new ServerMessage_class_1.ServerMessage(true, 'El dispositivo no esta disponible', {});
            }
            let activeSuscription = false;
            if (utilities_1.toLocalTime(new Date()) > deviceData.validUntil) {
                return new ServerMessage_class_1.ServerMessage(false, 'Suscripción inactiva', {
                    deviceData: deviceData,
                    toDate: new Date(),
                    fromDate: new Date(),
                    periodHistorial: [],
                    lastHistorial: [],
                    activeSuscription: activeSuscription,
                });
            }
            activeSuscription = true;
            let lastHistorial = await this.dataloggerHistoryRepository.findAll({
                where: {
                    idDevice: deviceData.idDevice,
                },
                limit: 1,
                order: [['dateTime', 'DESC']],
            });
            return new ServerMessage_class_1.ServerMessage(false, 'Información obtenida correctamente', {
                deviceData: deviceData,
                activeSuscription: activeSuscription,
                lastHistorial: lastHistorial,
            });
        }
        catch (error) {
            this.logger.error(error);
            return new ServerMessage_class_1.ServerMessage(true, 'Ha ocurrido un error', error);
        }
    }
    async getQueryHistoryFromTOLoggerDeviceData(query, idUser) {
        try {
            if (idUser == null ||
                idUser == undefined ||
                query.idDevice == null ||
                query.idDevice == undefined ||
                query.fromDate == null ||
                query.fromDate == undefined ||
                query.toDate == null ||
                query.toDate == undefined) {
                return new ServerMessage_class_1.ServerMessage(true, 'Petición incompleta', {});
            }
            query.fromDate = new Date(query.fromDate);
            query.toDate = new Date(query.toDate);
            let deviceData = await this.deviceRepository.findOne({
                attributes: { exclude: ['imei'] },
                where: {
                    idDevice: query.idDevice,
                    idUser: idUser,
                    type: 2,
                },
                include: [
                    {
                        model: dataloggerSettings_entity_1.DataloggerSettings,
                        as: 'dataloggerSettings',
                    },
                ],
            });
            if (!deviceData) {
                return new ServerMessage_class_1.ServerMessage(true, 'El dispositivo no esta disponible', {});
            }
            let activeSuscription = false;
            if (utilities_1.toLocalTime(new Date()) > deviceData.validUntil) {
                return new ServerMessage_class_1.ServerMessage(false, 'Suscripción inactiva', {
                    deviceData: deviceData,
                    toDate: new Date(),
                    fromDate: new Date(),
                    periodHistorial: [],
                    lastHistorial: [],
                    activeSuscription: activeSuscription,
                });
            }
            activeSuscription = true;
            let periodHistorial = await this.dataloggerHistoryRepository.findAll({
                where: {
                    idDevice: deviceData.idDevice,
                    [sequelize_1.Op.or]: [
                        {
                            dateTime: {
                                [sequelize_1.Op.between]: [
                                    query.fromDate.toISOString(),
                                    query.toDate.toISOString(),
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
                order: [['dateTime', 'DESC']],
            });
            let randomColor1 = (Math.random() * (150 - 50) + 50).toFixed(0);
            let randomColor2 = (Math.random() * (150 - 50) + 50).toFixed(0);
            let randomColor3 = (Math.random() * (150 - 50) + 50).toFixed(0);
            let setColor = 'rgba( ' +
                randomColor1 +
                ' ,' +
                randomColor2 +
                ' ,' +
                randomColor3 +
                ',0.4)';
            let actualFromToLabels = [];
            let analog1FromToValues = [];
            let analog2FromToValues = [];
            let analog3FromToValues = [];
            let analog4FromToValues = [];
            let consumption1FromToValues = [];
            let consumption2FromToValues = [];
            let flow1FromToValues = [];
            let flow2FromToValues = [];
            let batteryLevelFromToValues = [];
            let signalQualityFromToValues = [];
            const decodeDigitalInputs = (input) => {
                const PARAMS = 4;
                let ans = [];
                for (let idx = 0; idx < PARAMS; ++idx) {
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
            periodHistorial.forEach(async (history) => {
                let dateTimeFixed = this.getDateTimepikerFormat(this.convertDateToUTC(history.dateTime));
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
                let original = new datalogger_adapter_1.DataloggerHistoryAdapter(history);
                original.formatAlerts(deviceData.dataloggerSettings);
                let fixedAlerts = original.alerts;
                let binAlerts = fixedAlerts.toString(2);
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
            let alarmsGraphData = [];
            for (let index = 0; index < 16; index++) {
                let randomColor1 = (Math.random() * (150 - 50) + 50).toFixed(0);
                let randomColor2 = (Math.random() * (150 - 50) + 50).toFixed(0);
                let randomColor3 = (Math.random() * (150 - 50) + 50).toFixed(0);
                let color = 'rgba( ' +
                    randomColor1 +
                    ' ,' +
                    randomColor2 +
                    ' ,' +
                    randomColor3 +
                    ',0.4)';
                let alarmTitle = '';
                let data = [];
                if (index == 0) {
                    alarmTitle = 'Cambio de estado en la entrada digital 1';
                    data = d1Alarms;
                }
                else if (index == 1) {
                    alarmTitle = 'Cambio de estado en la entrada digital 2';
                    data = d2Alarms;
                }
                else if (index == 2) {
                    alarmTitle = 'Cambio de estado en la entrada digital 3';
                    data = d3Alarms;
                }
                else if (index == 3) {
                    alarmTitle = 'Cambio de estado en la entrada digital 4';
                    data = d4Alarms;
                }
                else if (index == 4) {
                    alarmTitle = 'Valor por debajo del umbral en analógico 1';
                    data = al1Alarms;
                }
                else if (index == 5) {
                    alarmTitle = 'Valor por debajo del umbral en analógico 2';
                    data = al2Alarms;
                }
                else if (index == 6) {
                    alarmTitle = 'Valor por debajo del umbral en analógico 3';
                    data = al3Alarms;
                }
                else if (index == 7) {
                    alarmTitle = 'Valor por debajo del umbral en analógico 4';
                    data = al4Alarms;
                }
                else if (index == 8) {
                    alarmTitle = 'Valor por encima del umbral en analógico 1';
                    data = ah1Alarms;
                }
                else if (index == 9) {
                    alarmTitle = 'Valor por encima del umbral en analógico 2';
                    data = ah2Alarms;
                }
                else if (index == 10) {
                    alarmTitle = 'Valor por encima del umbral en analógico 3';
                    data = ah3Alarms;
                }
                else if (index == 11) {
                    alarmTitle = 'Valor por encima del umbral en analógico 4';
                    data = ah4Alarms;
                }
                else if (index == 12) {
                    alarmTitle = 'Flujo 1 por debajo del umbral';
                    data = ql1Alarms;
                }
                else if (index == 13) {
                    alarmTitle = 'Flujo 2 por debajo del umbral';
                    data = ql2Alarms;
                }
                else if (index == 14) {
                    alarmTitle = 'Flujo 1 por encima del umbral';
                    data = ql3Alarms;
                }
                else if (index == 14) {
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
            let digitalInputsGraphData = [];
            for (let index = 0; index < 4; index++) {
                let randomColor1 = (Math.random() * (150 - 50) + 50).toFixed(0);
                let randomColor2 = (Math.random() * (150 - 50) + 50).toFixed(0);
                let randomColor3 = (Math.random() * (150 - 50) + 50).toFixed(0);
                let color = 'rgba( ' +
                    randomColor1 +
                    ' ,' +
                    randomColor2 +
                    ' ,' +
                    randomColor3 +
                    ',0.4)';
                let alarmTitle = '';
                let data = [];
                if (index == 0) {
                    alarmTitle = 'Entrada digital 1';
                    data = d1Inputs;
                }
                else if (index == 1) {
                    alarmTitle = 'Entrada digital 2';
                    data = d2Inputs;
                }
                else if (index == 2) {
                    alarmTitle = 'Entrada digital 3';
                    data = d3Inputs;
                }
                else if (index == 3) {
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
            let digitalOutputsGraphData = [];
            for (let index = 0; index < 4; index++) {
                let randomColor1 = (Math.random() * (150 - 50) + 50).toFixed(0);
                let randomColor2 = (Math.random() * (150 - 50) + 50).toFixed(0);
                let randomColor3 = (Math.random() * (150 - 50) + 50).toFixed(0);
                let color = 'rgba( ' +
                    randomColor1 +
                    ' ,' +
                    randomColor2 +
                    ' ,' +
                    randomColor3 +
                    ',0.4)';
                let alarmTitle = '';
                let data = [];
                if (index == 0) {
                    alarmTitle = 'Salida digital 1';
                    data = d1Outputs;
                }
                else if (index == 1) {
                    alarmTitle = 'Salida digital 2';
                    data = d2Outputs;
                }
                else if (index == 2) {
                    alarmTitle = 'Salida digital 3';
                    data = d3Outputs;
                }
                else if (index == 3) {
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
            return new ServerMessage_class_1.ServerMessage(false, 'Información obtenida correctamente', {
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
        }
        catch (error) {
            this.logger.error(error);
            return new ServerMessage_class_1.ServerMessage(true, 'Ha ocurrido un error', error);
        }
    }
    async getLoggerDeviceSettingsEndpoint(client, idDevice) {
        try {
            if (client == null ||
                client == undefined ||
                idDevice == null ||
                idDevice == undefined) {
                return new ServerMessage_class_1.ServerMessage(true, 'Petición incompleta', {});
            }
            let deviceData = await this.deviceRepository.findOne({
                where: {
                    idDevice: idDevice,
                    idUser: client.idUser,
                    type: 2,
                },
                include: [
                    {
                        model: dataloggerSettings_entity_1.DataloggerSettings,
                        as: 'dataloggerSettings',
                        where: {
                            idDevice: idDevice,
                        },
                        include: [
                            {
                                model: device_entity_1.Device,
                                as: 'device',
                            },
                        ],
                    },
                    {
                        model: organization_entity_1.Organization,
                        as: 'organization',
                        include: [
                            {
                                model: user_entity_1.User,
                                as: 'users',
                                where: {
                                    idRole: 1,
                                },
                                limit: 1,
                            },
                        ],
                    },
                    {
                        model: town_entity_1.Town,
                        as: 'town',
                        include: [
                            {
                                model: state_entity_1.State,
                                as: 'state',
                            },
                        ],
                    },
                ],
            });
            if (!deviceData) {
                return new ServerMessage_class_1.ServerMessage(true, 'El dispositivo no se encuentra', {});
            }
            return new ServerMessage_class_1.ServerMessage(false, 'Ajustes del dispositivo obtenidos con éxito', {
                belongsToMain: deviceData.organization.users.length == 0 ? false : true,
                loggerSettings: deviceData.dataloggerSettings,
            });
        }
        catch (error) {
            this.logger.error(error);
            return new ServerMessage_class_1.ServerMessage(true, 'Ha ocurrido un error', error);
        }
    }
    async updateLoggerNotificationRepeatTime(client, settings) {
        try {
            if (client == null ||
                client == undefined ||
                settings == null ||
                settings == undefined ||
                settings.repeatTime == null ||
                settings.repeatTime == undefined) {
                return new ServerMessage_class_1.ServerMessage(true, 'Petición incompleta', {});
            }
            let newSettings = await this.dataloggerSettingsRepository.findOne({
                where: {
                    idDevice: settings.idDevice,
                },
                include: [
                    {
                        model: device_entity_1.Device,
                        as: 'device',
                        where: {
                            idUser: client.idUser,
                            type: 2,
                        },
                    },
                ],
            });
            if (!newSettings || !newSettings.device) {
                return new ServerMessage_class_1.ServerMessage(false, 'Dispositivo no disponible', {});
            }
            newSettings.repeatNotificationTime = settings.repeatTime;
            await newSettings.save();
            return new ServerMessage_class_1.ServerMessage(false, 'Timpo de retraso actualizado correctamente', {});
        }
        catch (error) {
            this.logger.error(error);
            return new ServerMessage_class_1.ServerMessage(true, 'Ha ocurrido un error', error);
        }
    }
    async getWaterDeviceSettings(client, idDevice) {
        try {
            if (client == null ||
                client == undefined ||
                idDevice == null ||
                idDevice == undefined) {
                return new ServerMessage_class_1.ServerMessage(true, 'Petición incompleta', {});
            }
            let waterSettings = await this.waterSettingsRepository.findOne({
                where: {
                    idDevice: idDevice,
                },
                include: [
                    {
                        model: device_entity_1.Device,
                        as: 'device',
                        where: {
                            idUser: client.idUser,
                            type: 1,
                        },
                    },
                ],
            });
            if (!waterSettings) {
                return new ServerMessage_class_1.ServerMessage(true, 'Dispositivo no disponible', {});
            }
            let deviceData = await this.deviceRepository.findOne({
                where: {
                    idDevice: idDevice,
                    idUser: client.idUser,
                    type: 1,
                },
                include: [
                    {
                        model: organization_entity_1.Organization,
                        as: 'organization',
                        include: [
                            {
                                model: user_entity_1.User,
                                as: 'users',
                                where: {
                                    idRole: 1,
                                },
                                limit: 1,
                            },
                        ],
                    },
                    {
                        model: town_entity_1.Town,
                        as: 'town',
                        include: [
                            {
                                model: state_entity_1.State,
                                as: 'state',
                            },
                        ],
                    },
                ],
            });
            let states = await this.stateRepository.findAll({
                include: [
                    {
                        model: town_entity_1.Town,
                        as: 'towns',
                    },
                ],
            });
            return new ServerMessage_class_1.ServerMessage(false, 'Ajustes del dispositivo obtenidos con éxito', {
                belongsToMain: deviceData.organization.users.length == 0 ? false : true,
                waterSettings: waterSettings,
                states: states,
                actualTown: deviceData.town,
            });
        }
        catch (error) {
            return new ServerMessage_class_1.ServerMessage(true, 'Ha ocurrido un error', error);
        }
    }
    async updateSettingsServiceOutageDay(client, settings) {
        try {
            if (client == null ||
                client == undefined ||
                settings.idDevice == null ||
                settings.idDevice == undefined ||
                settings.serviceOutageDay == null ||
                settings.serviceOutageDay == undefined) {
                return new ServerMessage_class_1.ServerMessage(true, 'Petición incompleta', {});
            }
            let newSettings = await this.waterSettingsRepository.findOne({
                where: {
                    idDevice: settings.idDevice,
                },
            });
            if (!newSettings) {
                return new ServerMessage_class_1.ServerMessage(true, 'EL dispositivo no esta disponible', {});
            }
            newSettings.serviceOutageDay = settings.serviceOutageDay;
            await newSettings.save();
            return new ServerMessage_class_1.ServerMessage(false, 'Dia de corte actualizado.', {});
        }
        catch (error) {
            return new ServerMessage_class_1.ServerMessage(true, 'Ha ocurrido un error', error);
        }
    }
    async updateSettingsWaterServiceConsumptionUnits(client, settings) {
        try {
            if (client == null ||
                client == undefined ||
                settings.idDevice == null ||
                settings.idDevice == undefined ||
                settings.consumptionUnits == null ||
                settings.consumptionUnits == undefined) {
                return new ServerMessage_class_1.ServerMessage(true, 'Petición incompleta', {});
            }
            let newSettings = await this.waterSettingsRepository.findOne({
                where: {
                    idDevice: settings.idDevice,
                },
            });
            if (!newSettings) {
                return new ServerMessage_class_1.ServerMessage(true, 'EL dispositivo no esta disponible', {});
            }
            newSettings.consumptionUnits = settings.consumptionUnits;
            newSettings.status = newSettings.calculateNewStatus(1, true);
            newSettings.wereApplied = false;
            await newSettings.save();
            return new ServerMessage_class_1.ServerMessage(false, 'Unidades de consumo actualizadas.', {});
        }
        catch (error) {
            return new ServerMessage_class_1.ServerMessage(true, 'Ha ocurrido un error', error);
        }
    }
    async updateSettingsWaterServiceSpendingUnits(client, settings) {
        try {
            if (client == null ||
                client == undefined ||
                settings.idDevice == null ||
                settings.idDevice == undefined ||
                settings.flowUnits == null ||
                settings.flowUnits == undefined) {
                return new ServerMessage_class_1.ServerMessage(true, 'Petición incompleta', {});
            }
            let newSettings = await this.waterSettingsRepository.findOne({
                where: {
                    idDevice: settings.idDevice,
                },
            });
            if (!newSettings) {
                return new ServerMessage_class_1.ServerMessage(true, 'EL dispositivo no esta disponible', {});
            }
            newSettings.flowUnits = settings.flowUnits;
            newSettings.status = newSettings.calculateNewStatus(2, true);
            newSettings.wereApplied = false;
            await newSettings.save();
            return new ServerMessage_class_1.ServerMessage(false, 'Unidades de gasto actualizadas.', {});
        }
        catch (error) {
            return new ServerMessage_class_1.ServerMessage(true, 'Ha ocurrido un error', error);
        }
    }
    async updateSettingsWaterServiceStorageFrequency(client, settings) {
        try {
            if (client == null ||
                client == undefined ||
                settings.idDevice == null ||
                settings.idDevice == undefined ||
                settings.storageFrequency == null ||
                settings.storageFrequency == undefined) {
                return new ServerMessage_class_1.ServerMessage(true, 'Petición incompleta', {});
            }
            let newSettings = await this.waterSettingsRepository.findOne({
                where: {
                    idDevice: settings.idDevice,
                },
            });
            if (!newSettings) {
                return new ServerMessage_class_1.ServerMessage(true, 'EL dispositivo no esta disponible', {});
            }
            newSettings.storageFrequency = settings.storageFrequency;
            newSettings.status = newSettings.calculateNewStatus(3, true);
            newSettings.wereApplied = false;
            await newSettings.save();
            return new ServerMessage_class_1.ServerMessage(false, 'Frecuencia de almacenamiento actualizada.', {});
        }
        catch (error) {
            return new ServerMessage_class_1.ServerMessage(true, 'Ha ocurrido un error', error);
        }
    }
    async updateSettingsWaterServiceStorageTime(client, settings) {
        try {
            if (client == null ||
                client == undefined ||
                settings.idDevice == null ||
                settings.idDevice == undefined ||
                settings.storageTime == null ||
                settings.storageTime == undefined) {
                return new ServerMessage_class_1.ServerMessage(true, 'Petición incompleta', {});
            }
            let newSettings = await this.waterSettingsRepository.findOne({
                where: {
                    idDevice: settings.idDevice,
                },
            });
            if (!newSettings) {
                return new ServerMessage_class_1.ServerMessage(true, 'EL dispositivo no esta disponible', {});
            }
            newSettings.storageTime = settings.storageTime;
            newSettings.status = newSettings.calculateNewStatus(3, true);
            newSettings.wereApplied = false;
            await newSettings.save();
            return new ServerMessage_class_1.ServerMessage(false, 'Frecuencia de almacenamiento actualizada.', {});
        }
        catch (error) {
            return new ServerMessage_class_1.ServerMessage(true, 'Ha ocurrido un error', error);
        }
    }
    async updateSettingsWaterServiceDailyTransmission(client, settings) {
        try {
            if (client == null ||
                client == undefined ||
                settings.idDevice == null ||
                settings.idDevice == undefined ||
                settings.dailyTransmission == null ||
                settings.dailyTransmission == undefined) {
                return new ServerMessage_class_1.ServerMessage(true, 'Petición incompleta', {});
            }
            let newSettings = await this.waterSettingsRepository.findOne({
                where: {
                    idDevice: settings.idDevice,
                },
            });
            if (!newSettings) {
                return new ServerMessage_class_1.ServerMessage(true, 'EL dispositivo no esta disponible', {});
            }
            newSettings.dailyTransmission = settings.dailyTransmission;
            newSettings.status = newSettings.calculateNewStatus(0, true);
            newSettings.wereApplied = false;
            await newSettings.save();
            return new ServerMessage_class_1.ServerMessage(false, 'Frecuencia de almacenamiento actualizada.', {});
        }
        catch (error) {
            return new ServerMessage_class_1.ServerMessage(true, 'Ha ocurrido un error', error);
        }
    }
    async updateSettingsWaterServiceDailyTime(client, settings) {
        try {
            if (client == null ||
                client == undefined ||
                settings.idDevice == null ||
                settings.idDevice == undefined ||
                settings.dailyTime == null ||
                settings.dailyTime == undefined) {
                return new ServerMessage_class_1.ServerMessage(true, 'Petición incompleta', {});
            }
            let newSettings = await this.waterSettingsRepository.findOne({
                where: {
                    idDevice: settings.idDevice,
                },
            });
            if (!newSettings) {
                return new ServerMessage_class_1.ServerMessage(true, 'EL dispositivo no esta disponible', {});
            }
            newSettings.dailyTime = settings.dailyTime;
            newSettings.status = newSettings.calculateNewStatus(0, true);
            newSettings.wereApplied = false;
            await newSettings.save();
            return new ServerMessage_class_1.ServerMessage(false, 'Frecuencia de almacenamiento actualizada.', {});
        }
        catch (error) {
            return new ServerMessage_class_1.ServerMessage(true, 'Ha ocurrido un error', error);
        }
    }
    async updateSettingsWaterServiceCustomDailyTime(client, settings) {
        try {
            if (client == null ||
                client == undefined ||
                settings.idDevice == null ||
                settings.idDevice == undefined ||
                settings.customDailyTime == null ||
                settings.customDailyTime == undefined) {
                return new ServerMessage_class_1.ServerMessage(true, 'Petición incompleta', {});
            }
            let newSettings = await this.waterSettingsRepository.findOne({
                where: {
                    idDevice: settings.idDevice,
                },
            });
            if (!newSettings) {
                return new ServerMessage_class_1.ServerMessage(true, 'EL dispositivo no esta disponible', {});
            }
            newSettings.customDailyTime = settings.customDailyTime;
            newSettings.status = newSettings.calculateNewStatus(4, true);
            newSettings.wereApplied = false;
            await newSettings.save();
            return new ServerMessage_class_1.ServerMessage(false, 'Transmisión diaria fija actualizada.', {});
        }
        catch (error) {
            return new ServerMessage_class_1.ServerMessage(true, 'Ha ocurrido un error', error);
        }
    }
    async updateSettingsWaterServiceIpProtocol(client, settings) {
        try {
            if (client == null ||
                client == undefined ||
                settings.idDevice == null ||
                settings.idDevice == undefined ||
                settings.ipProtocol == null ||
                settings.ipProtocol == undefined) {
                return new ServerMessage_class_1.ServerMessage(true, 'Petición incompleta', {});
            }
            let newSettings = await this.waterSettingsRepository.findOne({
                where: {
                    idDevice: settings.idDevice,
                },
            });
            if (!newSettings) {
                return new ServerMessage_class_1.ServerMessage(true, 'EL dispositivo no esta disponible', {});
            }
            newSettings.ipProtocol = settings.ipProtocol;
            newSettings.status = newSettings.calculateNewStatus(6, true);
            newSettings.wereApplied = false;
            await newSettings.save();
            return new ServerMessage_class_1.ServerMessage(false, 'Protocolo IP actualizado.', {});
        }
        catch (error) {
            return new ServerMessage_class_1.ServerMessage(true, 'Ha ocurrido un error', error);
        }
    }
    async updateSettingsWaterAuthenticationProtocol(client, settings) {
        try {
            if (client == null ||
                client == undefined ||
                settings.idDevice == null ||
                settings.idDevice == undefined ||
                settings.auth == null ||
                settings.auth == undefined) {
                return new ServerMessage_class_1.ServerMessage(true, 'Petición incompleta', {});
            }
            let newSettings = await this.waterSettingsRepository.findOne({
                where: {
                    idDevice: settings.idDevice,
                },
            });
            if (!newSettings) {
                return new ServerMessage_class_1.ServerMessage(true, 'EL dispositivo no esta disponible', {});
            }
            newSettings.auth = settings.auth;
            newSettings.status = newSettings.calculateNewStatus(6, true);
            newSettings.wereApplied = false;
            await newSettings.save();
            return new ServerMessage_class_1.ServerMessage(false, 'Protocolo IP actualizado.', {});
        }
        catch (error) {
            return new ServerMessage_class_1.ServerMessage(true, 'Ha ocurrido un error', error);
        }
    }
    async updateSettingsWaterServiceDescriptionLabel(client, settings) {
        try {
            if (client == null ||
                client == undefined ||
                settings.idDevice == null ||
                settings.idDevice == undefined ||
                settings.label == null ||
                settings.label == undefined) {
                return new ServerMessage_class_1.ServerMessage(true, 'Petición incompleta', {});
            }
            let newSettings = await this.waterSettingsRepository.findOne({
                where: {
                    idDevice: settings.idDevice,
                },
            });
            if (!newSettings) {
                return new ServerMessage_class_1.ServerMessage(true, 'EL dispositivo no esta disponible', {});
            }
            newSettings.label = settings.label;
            newSettings.status = newSettings.calculateNewStatus(8, true);
            newSettings.wereApplied = false;
            await newSettings.save();
            return new ServerMessage_class_1.ServerMessage(false, 'Descripción actualizada.', {});
        }
        catch (error) {
            return new ServerMessage_class_1.ServerMessage(true, 'Ha ocurrido un error', error);
        }
    }
    async updateSettingsWaterConsumptionAlertType(client, settings) {
        try {
            if (client == null ||
                client == undefined ||
                settings.idDevice == null ||
                settings.idDevice == undefined ||
                settings.consumptionAlertType == null ||
                settings.consumptionAlertType == undefined) {
                return new ServerMessage_class_1.ServerMessage(true, 'Petición incompleta', {});
            }
            let newSettings = await this.waterSettingsRepository.findOne({
                where: {
                    idDevice: settings.idDevice,
                },
            });
            if (!newSettings) {
                return new ServerMessage_class_1.ServerMessage(true, 'EL dispositivo no esta disponible', {});
            }
            newSettings.consumptionAlertType = settings.consumptionAlertType;
            newSettings.status = newSettings.calculateNewStatus(13, true);
            newSettings.wereApplied = false;
            await newSettings.save();
            return new ServerMessage_class_1.ServerMessage(false, 'Tipo de alerta de consumo actualizada.', {});
        }
        catch (error) {
            return new ServerMessage_class_1.ServerMessage(true, 'Ha ocurrido un error', error);
        }
    }
    async updateSettingsWaterServicePeriodicFrequency(client, settings) {
        try {
            if (client == null ||
                client == undefined ||
                settings.idDevice == null ||
                settings.idDevice == undefined ||
                settings.periodicFrequency == null ||
                settings.periodicFrequency == undefined) {
                return new ServerMessage_class_1.ServerMessage(true, 'Petición incompleta', {});
            }
            let newSettings = await this.waterSettingsRepository.findOne({
                where: {
                    idDevice: settings.idDevice,
                },
            });
            if (!newSettings) {
                return new ServerMessage_class_1.ServerMessage(true, 'EL dispositivo no esta disponible', {});
            }
            newSettings.periodicFrequency = settings.periodicFrequency;
            newSettings.status = newSettings.calculateNewStatus(5, true);
            newSettings.wereApplied = false;
            await newSettings.save();
            return new ServerMessage_class_1.ServerMessage(false, 'Transmisión periódica fija actualizada.', {});
        }
        catch (error) {
            return new ServerMessage_class_1.ServerMessage(true, 'Ha ocurrido un error', error);
        }
    }
    async updateSettingsWaterServiceDripSetpoint(client, settings) {
        try {
            if (client == null ||
                client == undefined ||
                settings.idDevice == null ||
                settings.idDevice == undefined ||
                settings.dripSetpoint == null ||
                settings.dripSetpoint == undefined) {
                return new ServerMessage_class_1.ServerMessage(true, 'Petición incompleta', {});
            }
            let newSettings = await this.waterSettingsRepository.findOne({
                where: {
                    idDevice: settings.idDevice,
                },
            });
            if (!newSettings) {
                return new ServerMessage_class_1.ServerMessage(true, 'EL dispositivo no esta disponible', {});
            }
            newSettings.dripSetpoint = settings.dripSetpoint;
            newSettings.status = newSettings.calculateNewStatus(9, true);
            newSettings.wereApplied = false;
            await newSettings.save();
            return new ServerMessage_class_1.ServerMessage(false, 'Setpoint de goteo actualizado.', {});
        }
        catch (error) {
            return new ServerMessage_class_1.ServerMessage(true, 'Ha ocurrido un error', error);
        }
    }
    async updateSettingsWaterServiceBurstSetpoint(client, settings) {
        try {
            if (client == null ||
                client == undefined ||
                settings.idDevice == null ||
                settings.idDevice == undefined ||
                settings.burstSetpoint == null ||
                settings.burstSetpoint == undefined) {
                return new ServerMessage_class_1.ServerMessage(true, 'Petición incompleta', {});
            }
            let newSettings = await this.waterSettingsRepository.findOne({
                where: {
                    idDevice: settings.idDevice,
                },
            });
            if (!newSettings) {
                return new ServerMessage_class_1.ServerMessage(true, 'EL dispositivo no esta disponible', {});
            }
            newSettings.burstSetpoint = settings.burstSetpoint;
            newSettings.status = newSettings.calculateNewStatus(10, true);
            newSettings.wereApplied = false;
            await newSettings.save();
            return new ServerMessage_class_1.ServerMessage(false, 'Setpoint de fuga actualizado.', {});
        }
        catch (error) {
            return new ServerMessage_class_1.ServerMessage(true, 'Ha ocurrido un error', error);
        }
    }
    async updateSettingsWaterServiceFlowSetpoint(client, settings) {
        try {
            if (client == null ||
                client == undefined ||
                settings.idDevice == null ||
                settings.idDevice == undefined ||
                settings.flowSetpoint == null ||
                settings.flowSetpoint == undefined) {
                return new ServerMessage_class_1.ServerMessage(true, 'Petición incompleta', {});
            }
            let newSettings = await this.waterSettingsRepository.findOne({
                where: {
                    idDevice: settings.idDevice,
                },
            });
            if (!newSettings) {
                return new ServerMessage_class_1.ServerMessage(true, 'EL dispositivo no esta disponible', {});
            }
            newSettings.flowSetpoint = settings.flowSetpoint;
            newSettings.status = newSettings.calculateNewStatus(11, true);
            newSettings.wereApplied = false;
            await newSettings.save();
            return new ServerMessage_class_1.ServerMessage(false, 'Setpoint de gasto continuo actualizado.', {});
        }
        catch (error) {
            return new ServerMessage_class_1.ServerMessage(true, 'Ha ocurrido un error', error);
        }
    }
    async updateSettingsWaterServiceConsumptionSetpoint(client, settings) {
        try {
            if (client == null ||
                client == undefined ||
                settings.idDevice == null ||
                settings.idDevice == undefined ||
                settings.consumptionSetpoint == null ||
                settings.consumptionSetpoint == undefined) {
                return new ServerMessage_class_1.ServerMessage(true, 'Petición incompleta', {});
            }
            let newSettings = await this.waterSettingsRepository.findOne({
                where: {
                    idDevice: settings.idDevice,
                },
            });
            if (!newSettings) {
                return new ServerMessage_class_1.ServerMessage(true, 'EL dispositivo no esta disponible', {});
            }
            newSettings.consumptionSetpoint = settings.consumptionSetpoint;
            newSettings.status = newSettings.calculateNewStatus(12, true);
            newSettings.wereApplied = false;
            await newSettings.save();
            return new ServerMessage_class_1.ServerMessage(false, 'Set point de alerta de consumo actualizada.', {});
        }
        catch (error) {
            return new ServerMessage_class_1.ServerMessage(true, 'Ha ocurrido un error', error);
        }
    }
    async updateSettingsWaterServicePeriodicTime(client, settings) {
        try {
            if (client == null ||
                client == undefined ||
                settings.idDevice == null ||
                settings.idDevice == undefined ||
                settings.periodicTime == null ||
                settings.periodicTime == undefined) {
                return new ServerMessage_class_1.ServerMessage(true, 'Petición incompleta', {});
            }
            let newSettings = await this.waterSettingsRepository.findOne({
                where: {
                    idDevice: settings.idDevice,
                },
            });
            if (!newSettings) {
                return new ServerMessage_class_1.ServerMessage(true, 'EL dispositivo no esta disponible', {});
            }
            newSettings.periodicTime = settings.periodicTime;
            newSettings.status = newSettings.calculateNewStatus(5, true);
            newSettings.wereApplied = false;
            await newSettings.save();
            return new ServerMessage_class_1.ServerMessage(false, 'Proximo inicio de la transmisión periódica fija actualizada.', {});
        }
        catch (error) {
            return new ServerMessage_class_1.ServerMessage(true, 'Ha ocurrido un error', error);
        }
    }
    async updateSettingsWaterServiceMonthMaxConsumption(client, settings) {
        try {
            if (client == null ||
                client == undefined ||
                settings.idDevice == null ||
                settings.idDevice == undefined ||
                settings.monthMaxConsumption == null ||
                settings.monthMaxConsumption == undefined) {
                return new ServerMessage_class_1.ServerMessage(true, 'Petición incompleta', {});
            }
            let newSettings = await this.waterSettingsRepository.findOne({
                where: {
                    idDevice: settings.idDevice,
                },
            });
            if (!newSettings) {
                return new ServerMessage_class_1.ServerMessage(true, 'EL dispositivo no esta disponible', {});
            }
            newSettings.monthMaxConsumption = settings.monthMaxConsumption;
            await newSettings.save();
            return new ServerMessage_class_1.ServerMessage(false, 'Actualizado con éxito.', {});
        }
        catch (error) {
            return new ServerMessage_class_1.ServerMessage(true, 'Ha ocurrido un error', error);
        }
    }
    async updateSettingsWaterServiceUpdateFlags(client, settings) {
        try {
            if (client == null ||
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
                settings.manipulationFlag == undefined) {
                return new ServerMessage_class_1.ServerMessage(true, 'Petición incompleta', {});
            }
            let newSettings = await this.waterSettingsRepository.findOne({
                where: {
                    idDevice: settings.idDevice,
                },
            });
            if (!newSettings) {
                return new ServerMessage_class_1.ServerMessage(true, 'EL dispositivo no esta disponible', {});
            }
            newSettings.bubbleFlag = settings.bubbleFlag;
            newSettings.dripFlag = settings.dripFlag;
            newSettings.emptyFlag = settings.emptyFlag;
            newSettings.reversedFlowFlag = settings.reversedFlowFlag;
            newSettings.burstFlag = settings.burstFlag;
            newSettings.manipulationFlag = settings.manipulationFlag;
            await newSettings.save();
            return new ServerMessage_class_1.ServerMessage(false, 'Actualizado con éxito.', {});
        }
        catch (error) {
            return new ServerMessage_class_1.ServerMessage(true, 'Ha ocurrido un error', error);
        }
    }
    async getDeviceClientAddressSettings(client, idDevice) {
        try {
            if (client == null ||
                client == undefined ||
                idDevice == null ||
                idDevice == undefined) {
                return new ServerMessage_class_1.ServerMessage(true, 'Petición incompleta', {});
            }
            let deviceData = await this.deviceRepository.findOne({
                where: {
                    idDevice: idDevice,
                    idUser: client.idUser,
                },
                include: [
                    {
                        model: organization_entity_1.Organization,
                        as: 'organization',
                        include: [
                            {
                                model: user_entity_1.User,
                                as: 'users',
                                where: {
                                    idRole: 1,
                                },
                                limit: 1,
                            },
                        ],
                    },
                    {
                        model: town_entity_1.Town,
                        as: 'town',
                        include: [
                            {
                                model: state_entity_1.State,
                                as: 'state',
                            },
                        ],
                    },
                ],
            });
            if (!deviceData) {
                return new ServerMessage_class_1.ServerMessage(true, 'Dispositivo no disponible', {});
            }
            let states = await this.stateRepository.findAll({
                include: [
                    {
                        model: town_entity_1.Town,
                        as: 'towns',
                    },
                ],
            });
            return new ServerMessage_class_1.ServerMessage(false, 'Direccion del dispositivo obtenida con éxito', {
                belongsToMain: deviceData.organization.users.length == 0 ? false : true,
                deviceData: deviceData,
                states: states,
                actualTown: deviceData.town,
            });
        }
        catch (error) {
            return new ServerMessage_class_1.ServerMessage(true, 'Ha ocurrido un error', error);
        }
    }
    async updateDeviceClientAddressSettings(client, device) {
        try {
            if (client == null ||
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
                device.zipCode == undefined) {
                return new ServerMessage_class_1.ServerMessage(true, 'Petición incompleta', {});
            }
            else if (device.latitude == 0 || device.longitude == 0) {
                return new ServerMessage_class_1.ServerMessage(true, 'Coordenadas incorrectas', {});
            }
            let deviceData = await this.deviceRepository.findOne({
                where: {
                    idDevice: device.idDevice,
                    idUser: client.idUser,
                },
            });
            if (!deviceData) {
                return new ServerMessage_class_1.ServerMessage(true, 'Dispositivo no disponible', {});
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
            return new ServerMessage_class_1.ServerMessage(false, 'Dirección actualizada con éxito', {});
        }
        catch (error) {
            return new ServerMessage_class_1.ServerMessage(true, 'Ha ocurrido un error', error);
        }
    }
    async getGasDeviceSettings(client, idDevice) {
        try {
            if (client == null ||
                client == undefined ||
                idDevice == null ||
                idDevice == undefined) {
                return new ServerMessage_class_1.ServerMessage(true, 'Petición incompleta', {});
            }
            let deviceData = await this.deviceRepository.findOne({
                where: {
                    idDevice: idDevice,
                    idUser: client.idUser,
                    type: 0,
                },
                include: [
                    {
                        model: gasSettings_entity_1.GasSettings,
                        as: 'gasSettings',
                        where: {
                            idDevice: idDevice,
                        },
                        include: [
                            {
                                model: device_entity_1.Device,
                                as: 'device',
                            },
                        ],
                    },
                    {
                        model: organization_entity_1.Organization,
                        as: 'organization',
                        include: [
                            {
                                model: user_entity_1.User,
                                as: 'users',
                                where: {
                                    idRole: 1,
                                },
                                limit: 1,
                            },
                        ],
                    },
                    {
                        model: town_entity_1.Town,
                        as: 'town',
                        include: [
                            {
                                model: state_entity_1.State,
                                as: 'state',
                            },
                        ],
                    },
                ],
            });
            if (!deviceData) {
                return new ServerMessage_class_1.ServerMessage(true, 'El dispositivo no se encuentra', {});
            }
            return new ServerMessage_class_1.ServerMessage(false, 'Ajustes del dispositivo obtenidos con éxito', {
                belongsToMain: deviceData.organization.users.length == 0 ? false : true,
                gasSettings: deviceData.gasSettings,
                tankCapacity: deviceData.tankCapacity,
            });
        }
        catch (error) {
            this.logger.error(error);
            return new ServerMessage_class_1.ServerMessage(true, 'Ha ocurrido un error', error);
        }
    }
    async getGasDeviceData(client, idDevice, period) {
        try {
            if (client == null ||
                client == undefined ||
                idDevice == null ||
                idDevice == undefined ||
                period == null ||
                period == undefined) {
                return new ServerMessage_class_1.ServerMessage(true, 'Petición incompleta', {});
            }
            let deviceData = await this.deviceRepository.findOne({
                attributes: { exclude: ['imei'] },
                where: {
                    idDevice: idDevice,
                    type: 0,
                    idUser: client.idUser,
                },
                include: [
                    {
                        model: gasSettings_entity_1.GasSettings,
                        as: 'gasSettings',
                    },
                    {
                        model: apn_entity_1.Apn,
                        as: 'apn',
                    },
                    {
                        model: town_entity_1.Town,
                        as: 'town',
                        include: [
                            {
                                model: state_entity_1.State,
                                as: 'state',
                            },
                        ],
                    },
                ],
            });
            if (!deviceData) {
                return new ServerMessage_class_1.ServerMessage(true, 'Dispositivo no disponible', {});
            }
            let activeSuscription = false;
            if (utilities_1.toLocalTime(new Date()) > deviceData.validUntil) {
                return new ServerMessage_class_1.ServerMessage(false, 'Suscripción inactiva', {
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
            const searchDate = utilities_1.getTomorrow(utilities_1.toLocalTime(new Date()));
            let fillingHistories = await this.gasHistoryRepository.findAll({
                where: {
                    idDevice: idDevice,
                    dateTime: {
                        [sequelize_1.Op.lte]: searchDate.toISOString(),
                    },
                    fillingAlert: 1,
                },
                order: [['dateTime', 'DESC']],
            });
            if (+period > fillingHistories.length) {
                return new ServerMessage_class_1.ServerMessage(false, 'Información obtenida correctamente', {
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
            let today = period == 0
                ? utilities_1.toLocalTime(new Date())
                : fillingHistories[+period - 1].dateTime;
            let toDate = utilities_1.getTomorrow(utilities_1.toLocalTime(new Date()));
            let fromDate = utilities_1.toLocalTime(new Date());
            let periodHistories = [];
            let lastPastPeriodMeasure = 0;
            if (fillingHistories.length - period == 0) {
                periodHistories = await this.gasHistoryRepository.findAll({
                    where: {
                        idDevice: idDevice,
                        dateTime: {
                            [sequelize_1.Op.lt]: toDate.toISOString(),
                        },
                    },
                    order: [['dateTime', 'DESC']],
                });
            }
            else {
                fromDate = fillingHistories[period === 0 ? 0 : +period].dateTime;
                periodHistories = await this.gasHistoryRepository.findAll({
                    where: {
                        idDevice: idDevice,
                        [sequelize_1.Op.or]: [
                            {
                                dateTime: {
                                    [sequelize_1.Op.between]: [
                                        fromDate.toISOString(),
                                        toDate.toISOString(),
                                    ],
                                },
                            },
                        ],
                        dateTime: {
                            [sequelize_1.Op.not]: toDate.toISOString(),
                        },
                    },
                    order: [['dateTime', 'DESC']],
                });
                let lastPastPeriodHistory = await this.gasHistoryRepository.findOne({
                    where: {
                        idDevice: idDevice,
                        dateTime: {
                            [sequelize_1.Op.lt]: fromDate.toISOString(),
                        },
                    },
                    order: [['dateTime', 'DESC']],
                });
                if (lastPastPeriodHistory) {
                    lastPastPeriodMeasure = lastPastPeriodHistory.measure;
                }
            }
            return new ServerMessage_class_1.ServerMessage(false, 'Información obtenida correctamente', {
                deviceData: deviceData,
                toDate: toDate,
                fromDate: fromDate,
                periodHistories: periodHistories,
                periodLabels: periodHistories.map((item) => {
                    return this.getOnlyDate(item.dataValues.dateTime);
                }),
                periodValues: periodHistories.map((item) => {
                    return new Number(((item.dataValues.measure * deviceData.tankCapacity) / 100).toFixed(2));
                }),
                lastPeriodUpdate: periodHistories.length == 0
                    ? 'Sin registros'
                    : this.getOnlyDate(new Date(periodHistories[periodHistories.length - 1].dataValues.dateTime)),
                updated: deviceData.gasSettings.wereApplied,
                lastPastPeriodMeasure: lastPastPeriodMeasure,
                activeSuscription: activeSuscription,
            });
        }
        catch (error) {
            this.logger.error(error);
            return new ServerMessage_class_1.ServerMessage(true, 'Ha ocurrido un error', error);
        }
    }
    async updateSettingsTankCapacity(client, settings) {
        try {
            if (client == null ||
                client == undefined ||
                settings.idDevice == null ||
                settings.idDevice == undefined ||
                settings.tankCapacity == null ||
                settings.tankCapacity == undefined) {
                return new ServerMessage_class_1.ServerMessage(true, 'Petición incompleta', {
                    settings: settings,
                });
            }
            let updateDevice = await this.deviceRepository.findOne({
                where: {
                    idDevice: settings.idDevice,
                },
            });
            if (!updateDevice) {
                return new ServerMessage_class_1.ServerMessage(false, 'Dispositivo no disponible', {});
            }
            updateDevice.tankCapacity = settings.tankCapacity;
            await updateDevice.save();
            return new ServerMessage_class_1.ServerMessage(false, 'Capacidad actualizada.', {});
        }
        catch (error) {
            this.logger.error(error);
            return new ServerMessage_class_1.ServerMessage(true, 'Ha ocurrido un error', error);
        }
    }
    async updateSettingsGasInterval(client, settings) {
        try {
            if (client == null ||
                client == undefined ||
                settings == null ||
                settings == undefined ||
                settings.interval == null ||
                settings.interval == undefined) {
                return new ServerMessage_class_1.ServerMessage(true, 'Petición incompleta', {});
            }
            let newSettings = await this.gasSettingsRepository.findOne({
                where: {
                    idDevice: settings.idDevice,
                },
                include: [
                    {
                        model: device_entity_1.Device,
                        as: 'device',
                        where: {
                            idUser: client.idUser,
                            type: 0,
                        },
                    },
                ],
            });
            if (!newSettings || !newSettings.device) {
                return new ServerMessage_class_1.ServerMessage(false, 'Dispositivo no disponible', {});
            }
            newSettings.interval = settings.interval;
            newSettings.wereApplied = false;
            await newSettings.save();
            return new ServerMessage_class_1.ServerMessage(false, 'Intervalo atualizado.', {});
        }
        catch (error) {
            this.logger.error(error);
            return new ServerMessage_class_1.ServerMessage(true, 'Ha ocurrido un error', error);
        }
    }
    async updateGasOffset(client, settings) {
        try {
            if (client == null ||
                client == undefined ||
                settings == null ||
                settings == undefined ||
                settings.offset == null ||
                settings.offset == undefined) {
                return new ServerMessage_class_1.ServerMessage(true, 'Petición incompleta', {});
            }
            let newSettings = await this.gasSettingsRepository.findOne({
                where: {
                    idDevice: settings.idDevice,
                },
                include: [
                    {
                        model: device_entity_1.Device,
                        as: 'device',
                        where: {
                            idUser: client.idUser,
                            type: 0,
                        },
                    },
                ],
            });
            if (!newSettings || !newSettings.device) {
                return new ServerMessage_class_1.ServerMessage(false, 'Dispositivo no disponible', {});
            }
            newSettings.offset = settings.offset;
            newSettings.wereApplied = false;
            await newSettings.save();
            return new ServerMessage_class_1.ServerMessage(false, 'Porcentaje actualizado correctamente', {});
        }
        catch (error) {
            this.logger.error(error);
            return new ServerMessage_class_1.ServerMessage(true, 'Ha ocurrido un error', error);
        }
    }
    async updateGasOffsetTime(client, settings) {
        try {
            if (client == null ||
                client == undefined ||
                settings == null ||
                settings == undefined ||
                settings.offsetTime == null ||
                settings.offsetTime == undefined) {
                return new ServerMessage_class_1.ServerMessage(true, 'Petición incompleta', {});
            }
            let newSettings = await this.gasSettingsRepository.findOne({
                where: {
                    idDevice: settings.idDevice,
                },
                include: [
                    {
                        model: device_entity_1.Device,
                        as: 'device',
                        where: {
                            idUser: client.idUser,
                            type: 0,
                        },
                    },
                ],
            });
            if (!newSettings || !newSettings.device) {
                return new ServerMessage_class_1.ServerMessage(false, 'Dispositivo no disponible', {});
            }
            newSettings.offsetTime = settings.offsetTime;
            newSettings.wereApplied = false;
            await newSettings.save();
            return new ServerMessage_class_1.ServerMessage(false, 'Toma de lectura actualizada correctamente', {});
        }
        catch (error) {
            this.logger.error(error);
            return new ServerMessage_class_1.ServerMessage(true, 'Ha ocurrido un error', error);
        }
    }
    async updateTravelMode(client, settings) {
        try {
            if (client == null ||
                client == undefined ||
                settings == null ||
                settings == undefined ||
                settings.travelMode == null ||
                settings.travelMode == undefined) {
                return new ServerMessage_class_1.ServerMessage(true, 'Petición incompleta', {});
            }
            let newSettings = await this.gasSettingsRepository.findOne({
                where: {
                    idDevice: settings.idDevice,
                },
                include: [
                    {
                        model: device_entity_1.Device,
                        as: 'device',
                        where: {
                            idUser: client.idUser,
                            type: 0,
                        },
                    },
                ],
            });
            if (!newSettings || !newSettings.device) {
                return new ServerMessage_class_1.ServerMessage(false, 'Dispositivo no disponible', {});
            }
            newSettings.travelMode = settings.travelMode === 'true';
            newSettings.wereApplied = false;
            await newSettings.save();
            return new ServerMessage_class_1.ServerMessage(false, 'Modo actualizado.', {});
        }
        catch (error) {
            this.logger.error(error);
            return new ServerMessage_class_1.ServerMessage(true, 'Ha ocurrido un error', error);
        }
    }
    async updateSettingsGasMinFillingPercentage(client, settings) {
        try {
            if (client == null ||
                client == undefined ||
                settings == null ||
                settings == undefined ||
                settings.minFillingPercentage == null ||
                settings.minFillingPercentage == undefined) {
                return new ServerMessage_class_1.ServerMessage(true, 'Petición incompleta', {});
            }
            let newSettings = await this.gasSettingsRepository.findOne({
                where: {
                    idDevice: settings.idDevice,
                },
                include: [
                    {
                        model: device_entity_1.Device,
                        as: 'device',
                        where: {
                            idUser: client.idUser,
                            type: 0,
                        },
                    },
                ],
            });
            if (!newSettings || !newSettings.device) {
                return new ServerMessage_class_1.ServerMessage(false, 'Dispositivo no disponible', {});
            }
            else if (settings.minFillingPercentage < 0 &&
                settings.minFillingPercentage > 30) {
                return new ServerMessage_class_1.ServerMessage(false, 'Ajuste invalido', {});
            }
            newSettings.minFillingPercentage = settings.minFillingPercentage;
            newSettings.wereApplied = false;
            await newSettings.save();
            return new ServerMessage_class_1.ServerMessage(false, 'Atualizado.', {});
        }
        catch (error) {
            return new ServerMessage_class_1.ServerMessage(true, 'Ha ocurrido un error', error);
        }
    }
    async updateConsumptionUnitsPeriod(client, settings) {
        try {
            if (client == null ||
                client == undefined ||
                settings == null ||
                settings == undefined ||
                settings.consumptionUnits == null ||
                settings.consumptionUnits == undefined ||
                settings.consumptionPeriod == null ||
                settings.consumptionPeriod == undefined) {
                return new ServerMessage_class_1.ServerMessage(true, 'Petición incompleta', {});
            }
            let newSettings = await this.gasSettingsRepository.findOne({
                where: {
                    idDevice: settings.idDevice,
                },
                include: [
                    {
                        model: device_entity_1.Device,
                        as: 'device',
                        where: {
                            idUser: client.idUser,
                            type: 0,
                        },
                    },
                ],
            });
            if (!newSettings || !newSettings.device) {
                return new ServerMessage_class_1.ServerMessage(false, 'Dispositivo no disponible', {});
            }
            newSettings.consumptionUnits = this.formatSettingsToString(settings.consumptionUnits, 4);
            newSettings.consumptionPeriod = this.formatSettingsToString(settings.consumptionPeriod, 3);
            newSettings.wereApplied = false;
            await newSettings.save();
            return new ServerMessage_class_1.ServerMessage(false, 'Unidades de consumo atualizadas.', {});
        }
        catch (error) {
            return new ServerMessage_class_1.ServerMessage(true, 'Ha ocurrido un error', error);
        }
    }
    formatSettingsToString(num, len) {
        let ans = '' + num;
        while (ans.length < len) {
            ans = '0' + ans;
        }
        return ans;
    }
    async generateDummyData4gasHistories(days) {
        let gasDummyDevice = await this.deviceRepository.findOne({
            where: {
                name: 'gas_dummy',
            },
        });
        if (gasDummyDevice) {
            let id = gasDummyDevice.idDevice;
            for (let day = 1; day <= days; day++) {
                for (let percent = 1; percent <= 100; percent += 20) {
                    let measure = Math.abs(100 - percent + Math.random() * (0.5 - -0.5) + -0.5);
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
            for (let percent = 1; percent <= 45; percent += 20) {
                let measure = Math.abs(100 - percent + Math.random() * (0.5 - -0.5) + -0.5);
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
    async getGasDeviceAlerts(client, idDevice, period) {
        try {
            if (client == null ||
                client == undefined ||
                idDevice == null ||
                idDevice == undefined ||
                period == null ||
                period == undefined) {
                return new ServerMessage_class_1.ServerMessage(true, 'Petición incompleta', {});
            }
            let deviceData = await this.deviceRepository.findOne({
                attributes: { exclude: ['imei'] },
                where: {
                    idDevice: idDevice,
                    type: 0,
                    idUser: client.idUser,
                },
                include: [
                    {
                        model: gasSettings_entity_1.GasSettings,
                        as: 'gasSettings',
                    },
                    {
                        model: town_entity_1.Town,
                        as: 'town',
                        include: [
                            {
                                model: state_entity_1.State,
                                as: 'state',
                            },
                        ],
                    },
                ],
            });
            if (!deviceData) {
                return new ServerMessage_class_1.ServerMessage(true, 'Dispositivo no disponible', {});
            }
            const searchDate = utilities_1.getTomorrow(utilities_1.toLocalTime(new Date()));
            let fillingHistories = await this.gasHistoryRepository.findAll({
                where: {
                    idDevice: idDevice,
                    dateTime: {
                        [sequelize_1.Op.lte]: searchDate.toISOString(),
                    },
                    fillingAlert: 1,
                },
                order: [['dateTime', 'DESC']],
            });
            console.log('FH:', fillingHistories);
            if (+period > fillingHistories.length) {
                return new ServerMessage_class_1.ServerMessage(false, 'Información obtenida correctamente', {
                    deviceData: deviceData,
                    toDate: new Date(),
                    fromDate: new Date(),
                    periodHistories: [],
                    periodLabels: [],
                    periodValues: [],
                    lastPeriodUpdate: 'Sin registros',
                });
            }
            let today = period == 0
                ? utilities_1.toLocalTime(new Date())
                : fillingHistories[+period - 1].dateTime;
            let toDate = utilities_1.getTomorrow(utilities_1.toLocalTime(new Date()));
            let fromDate = utilities_1.toLocalTime(new Date());
            let periodHistories = [];
            if (fillingHistories.length - period == 0) {
                periodHistories = await this.gasHistoryRepository.findAll({
                    where: {
                        idDevice: idDevice,
                        dateTime: {
                            [sequelize_1.Op.lt]: toDate.toISOString(),
                        },
                    },
                    order: [['dateTime', 'ASC']],
                });
            }
            else {
                fromDate = fillingHistories[period === 0 ? 0 : +period].dateTime;
                periodHistories = await this.gasHistoryRepository.findAll({
                    where: {
                        idDevice: idDevice,
                        [sequelize_1.Op.or]: [
                            {
                                dateTime: {
                                    [sequelize_1.Op.between]: [
                                        fromDate.toISOString(),
                                        toDate.toISOString(),
                                    ],
                                },
                            },
                        ],
                        dateTime: {
                            [sequelize_1.Op.not]: toDate.toISOString(),
                        },
                    },
                    order: [['dateTime', 'ASC']],
                });
            }
            let alertHistories = periodHistories.filter(item => item.fillingAlert || item.resetAlert || item.intervalAlert);
            return new ServerMessage_class_1.ServerMessage(false, 'Información obtenida correctamente', {
                deviceData: deviceData,
                updated: deviceData.gasSettings.wereApplied,
                toDate: toDate,
                fromDate: fromDate,
                alertHistory: alertHistories,
                alertLabels: alertHistories.map((item) => {
                    return this.getOnlyDate(item.dataValues.dateTime);
                }),
                alertValues: periodHistories.map((item) => {
                    return item.dataValues.measure;
                }),
                lastAlertUpdate: alertHistories.length == 0
                    ? 'Sin registros'
                    : this.getOnlyDate(new Date(alertHistories[alertHistories.length - 1].dataValues.dateTime)),
            });
        }
        catch (error) {
            return new ServerMessage_class_1.ServerMessage(true, 'Ha ocurrido un error', error);
        }
    }
    async getWaterDeviceAlerts(clientData, idDevice, period) {
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
                return new ServerMessage_class_1.ServerMessage(true, 'Petición incompleta', {});
            }
            let deviceData = await this.deviceRepository.findOne({
                attributes: { exclude: ['imei'] },
                where: {
                    idDevice: idDevice,
                    idUser: clientData.idUser,
                },
                include: [
                    {
                        model: town_entity_1.Town,
                        as: 'town',
                        include: [
                            {
                                model: state_entity_1.State,
                                as: 'state',
                            },
                        ],
                    },
                    {
                        model: organization_entity_1.Organization,
                        as: 'organization',
                        attributes: [
                            'logoUrl',
                            'comercialName',
                            'primaryColor',
                            'secondaryColor',
                        ],
                    },
                    {
                        model: gasHistory_entity_1.GasHistory,
                        as: 'gasHistory',
                        limit: 1,
                        order: [['createdAt', 'DESC']],
                    },
                    {
                        model: waterHistory_entity_1.WaterHistory,
                        as: 'waterHistory',
                        limit: 1,
                        order: [['dateTime', 'DESC']],
                    },
                    {
                        model: waterSettings_entity_1.WaterSettings,
                        as: 'waterSettings',
                    },
                    {
                        model: gasSettings_entity_1.GasSettings,
                        as: 'gasSettings',
                    },
                ],
            });
            if (!deviceData.waterSettings) {
                return new ServerMessage_class_1.ServerMessage(true, 'El dispositivo no esta disponible', {});
            }
            let todayDay = utilities_1.toLocalTime(new Date());
            if (period > 0) {
                if (deviceData.waterSettings.serviceOutageDay < todayDay.getDate()) {
                    todayDay = utilities_1.toLocalTime(new Date(todayDay.getFullYear(), todayDay.getMonth() - (period - 1), deviceData.waterSettings.serviceOutageDay, 0, 0, 1));
                }
                else {
                    todayDay = utilities_1.toLocalTime(new Date(todayDay.getFullYear(), todayDay.getMonth() - period, deviceData.waterSettings.serviceOutageDay, 0, 0, 1));
                }
            }
            let fromDate = new Date(todayDay.getFullYear(), todayDay.getMonth(), deviceData.waterSettings.serviceOutageDay, 0, 0, 1);
            if (deviceData.waterSettings.serviceOutageDay > todayDay.getDate()) {
                fromDate = new Date(todayDay.getFullYear(), todayDay.getMonth() - 1, deviceData.waterSettings.serviceOutageDay, 0, 0, 1);
            }
            fromDate = utilities_1.toLocalTime(fromDate);
            const searchDate = utilities_1.getTomorrow(todayDay);
            let actualPeriod = await this.waterHistoryRepository.findAll({
                where: {
                    idDevice: deviceData.idDevice,
                    [sequelize_1.Op.or]: [
                        {
                            dateTime: {
                                [sequelize_1.Op.between]: [
                                    fromDate.toISOString(),
                                    searchDate.toISOString(),
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
                order: [['dateTime', 'DESC']],
            });
            let lastPeriodHistory = await this.waterHistoryRepository.findAll({
                attributes: ['idWaterHistory', 'consumption', 'dateTime'],
                where: {
                    idDevice: deviceData.idDevice,
                    dateTime: {
                        [sequelize_1.Op.lte]: fromDate.toISOString(),
                    },
                },
                limit: 1,
                order: [['dateTime', 'DESC']],
            });
            let litersConsumedThisMonth = 0;
            let actualPeriodMetry = 0;
            let lastPeriodMetry = 0;
            if (actualPeriod.length == 0 && lastPeriodHistory.length == 0) {
                litersConsumedThisMonth = 0;
            }
            else if (actualPeriod.length > 0 && lastPeriodHistory.length == 0) {
                litersConsumedThisMonth = actualPeriod[0].consumption;
                actualPeriodMetry = actualPeriod[0].consumption;
            }
            else if (actualPeriod.length == 0 && lastPeriodHistory.length == 1) {
                litersConsumedThisMonth = 0;
            }
            else if (actualPeriod.length > 0 && lastPeriodHistory.length == 1) {
                if (actualPeriod[0].consumption < lastPeriodHistory[0].consumption) {
                    let maximumNumberLiters = 999999999999;
                    if (deviceData.version == 1) {
                    }
                    litersConsumedThisMonth =
                        actualPeriod[0].consumption +
                            (maximumNumberLiters - lastPeriodHistory[0].consumption);
                }
                else {
                    litersConsumedThisMonth =
                        actualPeriod[0].consumption - lastPeriodHistory[0].consumption;
                }
                actualPeriodMetry = actualPeriod[0].consumption;
                lastPeriodMetry = lastPeriodHistory[0].consumption;
            }
            let actualLabels = [];
            let limitValueLine = [];
            let actualPeriodValues = [];
            let alertHistories = actualPeriod.filter(item => item.dripAlert ||
                item.manipulationAlert ||
                item.emptyAlert ||
                item.burstAlert ||
                item.bubbleAlert ||
                item.reversedFlowAlert);
            alertHistories.forEach(async (history) => {
                actualLabels = [this.getOnlyDate(history.dateTime), ...actualLabels];
                limitValueLine.push(deviceData.waterSettings.monthMaxConsumption);
                actualPeriodValues = [
                    new Number(((history.consumption - lastPeriodMetry) / 1000).toFixed(2)),
                    ...actualPeriodValues,
                ];
            });
            return new ServerMessage_class_1.ServerMessage(false, 'Información obtenida correctamente', {
                periodHistorial: alertHistories,
                actualLabels: actualLabels,
                actualPeriodValues: actualPeriodValues,
            });
        }
        catch (error) {
            return new ServerMessage_class_1.ServerMessage(true, 'A ocurrido un error', error);
        }
    }
    async detachDevice(client, clientDevice) {
        try {
            const constrants = [
                client == null,
                client == undefined,
                clientDevice == null,
                clientDevice == undefined,
                clientDevice.idDevice == null,
                clientDevice.idDevice == undefined,
            ];
            if (constrants.some(val => val))
                return new ServerMessage_class_1.ServerMessage(true, 'Petición incompleta', {});
            let device = await this.deviceRepository.findOne({
                where: {
                    idDevice: clientDevice.idDevice,
                },
                include: [
                    {
                        model: organization_entity_1.Organization,
                        as: 'organization',
                    },
                ],
            });
            let storekeepers = await this.userRepository.findAll({
                where: {
                    idOrganization: device.idOrganization,
                    idRole: 3,
                },
            });
            let storekeeper = storekeepers[0];
            device.idUser = storekeeper.idUser;
            device.isActive = true;
            await device.save();
            return new ServerMessage_class_1.ServerMessage(false, 'el dispositivo ha sido desvinculado', {});
        }
        catch (error) {
            return new ServerMessage_class_1.ServerMessage(true, 'A ocurrido un error', error);
        }
    }
};
DevicesService = __decorate([
    common_1.Injectable(),
    __param(0, common_1.Inject('DeviceRepository')),
    __param(1, common_1.Inject('WaterHistoryRepository')),
    __param(2, common_1.Inject('GasHistoryRepository')),
    __param(3, common_1.Inject('WaterSettingsRepository')),
    __param(4, common_1.Inject('GasSettingsRepository')),
    __param(5, common_1.Inject('DataloggerHistoryRepository')),
    __param(6, common_1.Inject('NaturalGasHistoryRepository')),
    __param(7, common_1.Inject('NaturalGasSettingsRepository')),
    __param(8, common_1.Inject('DataloggerSettingsRepository')),
    __param(9, common_1.Inject('UserRepository')),
    __param(10, common_1.Inject('StateRepository')),
    __param(11, common_1.Inject('TownRepository')),
    __param(12, common_1.Inject('winston')),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object, Object, Object, Object, Object, Object, Object, Object, Object])
], DevicesService);
exports.DevicesService = DevicesService;
//# sourceMappingURL=devices.service.js.map