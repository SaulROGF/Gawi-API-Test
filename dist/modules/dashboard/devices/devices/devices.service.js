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
const jwt_1 = require("@nestjs/jwt");
const deviceMessage_class_1 = require("./classes/deviceMessage.class");
const waterHistory_entity_1 = require("./../../../../models/waterHistory.entity");
const naturalGasHistory_entity_1 = require("../../../../models/naturalGasHistory.entity");
const login_dto_1 = require("./classes/login.dto");
const waterHistory_dto_1 = require("./classes/waterHistory.dto");
const gasHistory_dto_1 = require("./classes/gasHistory.dto");
const ServerMessage_class_1 = require("./../../../../classes/ServerMessage.class");
const path = require("path");
const ftpService = require("basic-ftp");
const fs = require("fs");
const push_notifications_service_1 = require("../../../../modules/global/push-notifications/push-notifications.service");
const utilities_1 = require("./../../../../utils/utilities");
const waterSettings_dto_1 = require("./classes/waterSettings.dto");
const datalogger_adapter_1 = require("./classes/datalogger.adapter");
const datalogger_utils_1 = require("./classes/datalogger.utils");
const sequelize_1 = require("sequelize");
const naturalGasHistory_dto_1 = require("./classes/naturalGasHistory.dto");
const naturalGasSettings_entity_1 = require("../../../../models/naturalGasSettings.entity");
const naturalGasSettings_dto_1 = require("./classes/naturalGasSettings.dto");
let DevicesService = class DevicesService {
    constructor(jwtService, pushNotificationService, logger, deviceRepository, apnRepository, waterHistoryRepository, waterSettingsRepository, gasHistoryRepository, gasSettingsRepository, dataloggerHistoryRepository, dataloggerSettingsRepository, naturalGasHistoryRepository, naturalGasSettingsRepository) {
        this.jwtService = jwtService;
        this.pushNotificationService = pushNotificationService;
        this.logger = logger;
        this.deviceRepository = deviceRepository;
        this.apnRepository = apnRepository;
        this.waterHistoryRepository = waterHistoryRepository;
        this.waterSettingsRepository = waterSettingsRepository;
        this.gasHistoryRepository = gasHistoryRepository;
        this.gasSettingsRepository = gasSettingsRepository;
        this.dataloggerHistoryRepository = dataloggerHistoryRepository;
        this.dataloggerSettingsRepository = dataloggerSettingsRepository;
        this.naturalGasHistoryRepository = naturalGasHistoryRepository;
        this.naturalGasSettingsRepository = naturalGasSettingsRepository;
        this.WD_MAX_CONFGS = 16383;
        this.WD_MAX_ALERTS = 63;
    }
    async login(body) {
        try {
            this.logger.debug(`-> [LIN] S.N.: ${body.B} psw: ${body.A}`);
            let loginData = new login_dto_1.LoginDto(body);
            if (loginData.serialNumber == null ||
                loginData.serialNumber == undefined ||
                loginData.imei == null ||
                loginData.imei == undefined ||
                (loginData.serialNumber.length != 8 && loginData.imei.length != 15)) {
                this.logger.error('-> [692] datos proporcionado son invalidos (BODY)');
                if (loginData.serialNumber == null ||
                    loginData.serialNumber == undefined) {
                    console.log(...oo_oo(`31839590_100_10_100_57_4`, 'serialNumber es null o undefined'));
                }
                if (loginData.imei == null || loginData.imei == undefined) {
                    console.log(...oo_oo(`31839590_104_10_104_49_4`, 'imei es null o undefined'));
                }
                if (loginData.serialNumber && loginData.serialNumber.length != 8) {
                    console.log(...oo_oo(`31839590_108_10_108_45_4`, loginData.serialNumber));
                    console.log(...oo_oo(`31839590_109_10_109_52_4`, loginData.serialNumber.length));
                    console.log(...oo_oo(`31839590_110_10_110_60_4`, 'La longitud de serialNumber no es 8'));
                }
                if (loginData.imei && loginData.imei.length != 15) {
                    console.log(...oo_oo(`31839590_114_10_114_37_4`, loginData.imei));
                    console.log(...oo_oo(`31839590_115_10_115_44_4`, loginData.imei.length));
                    console.log(...oo_oo(`31839590_116_10_116_53_4`, 'La longitud de imei no es 15'));
                }
                return new deviceMessage_class_1.DeviceMessage(692, '');
            }
            let device = await this.deviceRepository.findOne({
                where: {
                    serialNumber: loginData.serialNumber,
                },
            });
            if (!device) {
                this.logger.error('-> [693] dispositivo no identificado');
                return new deviceMessage_class_1.DeviceMessage(693, '');
            }
            let checkPass = await device.validateImei(loginData.imei);
            if (checkPass) {
                let response = this.createJwtPayloadDevice(loginData.serialNumber);
                this.logger.debug(`-> [610] ¡éxito! token: ${response.token}`);
                return new deviceMessage_class_1.DeviceMessage(610, response.token);
            }
            else {
                this.logger.error('-> [694] credenciales incorrectas');
                return new deviceMessage_class_1.DeviceMessage(694, '');
            }
        }
        catch (error) {
            this.logger.error(error);
            return new deviceMessage_class_1.DeviceMessage(690, '');
        }
    }
    async saveNaturalGasMeasures(body) {
        try {
            this.logger.debug('w->[HTY] ' + JSON.stringify(body));
            const historyDTO = new naturalGasHistory_dto_1.NaturalGasHistoryDTO(body);
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
                return new deviceMessage_class_1.DeviceMessage(692, '');
            }
            const payload = this.jwtService.decode(body.T);
            const device = await this.validateDeviceByJwt(payload);
            const apn = await this.apnRepository.findOne({
                where: {
                    idApn: device.idApn,
                },
            });
            if (!apn) {
                this.logger.error('w->[692] datos proporcionado son invalidos (APN)');
                return new deviceMessage_class_1.DeviceMessage(692, '');
            }
            const datetime = new Date(historyDTO.dateTime);
            if (Object.prototype.toString.call(datetime) !== '[object Date]' ||
                isNaN(datetime.getTime())) {
                this.logger.error('w->[695] fecha proporcionada por el dispositivo es inválida');
                return new deviceMessage_class_1.DeviceMessage(695, '');
            }
            const history = await this.naturalGasHistoryRepository.create({
                idDevice: device.idDevice,
                consumption: historyDTO.consumption,
                temperature: historyDTO.temperature,
                signalQuality: historyDTO.signalQuality,
                bateryLevel: historyDTO.batteryLevel,
                reason: historyDTO.reason,
                hour: historyDTO.deviceTime,
                consumptionAlert: (historyDTO.alerts >>> 0) & 0x01,
                consumptionExcessAlert: (historyDTO.alerts >>> 1) & 0x01,
                lowBatteryAlert: (historyDTO.alerts >>> 2) & 0x01,
                sensorAlert: (historyDTO.alerts >>> 3) & 0x01,
                darkAlert: (historyDTO.alerts >>> 4) & 0x01,
                lightAlert: (historyDTO.alerts >>> 5) & 0x01,
            });
            history.dateTime = utilities_1.createDateAsUTC(datetime);
            await history.save();
            let settings = await this.naturalGasSettingsRepository.findOne({
                where: {
                    idDevice: device.idDevice,
                },
            });
            if (!settings) {
                settings = await this.naturalGasSettingsRepository.create({
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
                const pushResponse = await this.pushNotificationService.send(device.idUser, 'Gawi', 'Tu medidor de gas ha generado una alerta');
                if (pushResponse.error) {
                    this.logger.error(pushResponse);
                }
                this.logger.debug('w->[615] historial almacenado correctamente y sin cambios nuevos');
                return new deviceMessage_class_1.DeviceMessage(615, '');
            }
            else {
                if (waterSettings_dto_1.consumptionUnitsValidator[settings.consumptionUnits] == null ||
                    waterSettings_dto_1.consumptionUnitsValidator[settings.consumptionUnits] == undefined ||
                    waterSettings_dto_1.ipProtocolValidator[settings.ipProtocol] == null ||
                    waterSettings_dto_1.ipProtocolValidator[settings.ipProtocol] == undefined ||
                    waterSettings_dto_1.authValidator[settings.auth] == null ||
                    waterSettings_dto_1.authValidator[settings.auth] == undefined) {
                    this.logger.error('w->[692] datos proporcionado son invalidos (SETTINGS)');
                    return new deviceMessage_class_1.DeviceMessage(692, '');
                }
                const pushResponse = await this.pushNotificationService.send(device.idUser, 'Gawi', 'Uno de tus medidores ha generado una alerta');
                if (pushResponse.error) {
                    this.logger.error(pushResponse.error);
                }
                this.logger.debug('w->[612] historial almacenado correctamente y con cambios a aplicar');
                return new deviceMessage_class_1.DeviceMessage(612, this.getATcommandsNaturalGas(settings.status, settings, apn));
            }
        }
        catch (error) {
            this.logger.error(error);
            return error.response.statusCode == 401
                ? new deviceMessage_class_1.DeviceMessage(401, '')
                : new deviceMessage_class_1.DeviceMessage(640, '');
        }
    }
    async saveDataloggerMeasures(body) {
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
            let dataloggerHistory = new datalogger_adapter_1.DataloggerHistoryAdapter(body);
            if (dataloggerHistory.check()) {
                this.logger.error('D->[692] datos proporcionado son invalidos (BODY)');
                return new deviceMessage_class_1.DeviceMessage(692, '');
            }
            if (dataloggerHistory.checkDatetime()) {
                this.logger.error('D->[695] fecha proporcionada por el dispositivo es inválida');
                return new deviceMessage_class_1.DeviceMessage(695, '');
            }
            const payload = this.jwtService.decode(dataloggerHistory.token);
            const device = await this.validateDeviceByJwt(payload);
            const history = await this.dataloggerHistoryRepository.create({
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
            history.dateTime = utilities_1.createDateAsUTC(dataloggerHistory.datetime);
            await history.save();
            let settings = await this.dataloggerSettingsRepository.findOne({
                where: {
                    idDevice: device.idDevice,
                },
            });
            if (!settings) {
                settings = await this.dataloggerSettingsRepository.create({
                    idDevice: device.idDevice,
                    signalType1: dataloggerHistory.signalType1,
                    signalType2: dataloggerHistory.signalType2,
                    signalType3: dataloggerHistory.signalType3,
                    signalType4: dataloggerHistory.signalType4,
                });
            }
            else {
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
            const pushAlerts = datalogger_utils_1.getPushAlerts(settings);
            let haveInterval = false;
            if (settings.repeatNotificationTime != '00:00') {
                haveInterval = true;
            }
            if (haveInterval) {
                let timeFix = settings.repeatNotificationTime.split(':');
                let time = parseInt(timeFix[0]);
                let dateFrom = new Date();
                dateFrom.setHours(dateFrom.getHours() - time);
                dateFrom.setMinutes(parseInt(timeFix[1]));
                let dataloggerRegisters = await this.dataloggerHistoryRepository.findAll({
                    where: {
                        idDevice: device.idDevice,
                        dateTime: {
                            [sequelize_1.Op.gte]: utilities_1.toLocalTime(dateFrom).toISOString(),
                        },
                    },
                    order: [['dateTime', 'DESC']],
                });
                console.log(...oo_oo(`31839590_494_8_494_47_4`, dataloggerRegisters.length));
                let reverseString = str => {
                    if (str === '')
                        return '';
                    else
                        return reverseString(str.substr(1)) + str.charAt(0);
                };
                let alerts = [];
                for (let index = 0; index < dataloggerRegisters.length; index++) {
                    const originalRegister = dataloggerRegisters[index];
                    let original = new datalogger_adapter_1.DataloggerHistoryAdapter(originalRegister);
                    original.formatAlerts(settings);
                    let fixedAlerts = original.alerts;
                    let binAlerts = fixedAlerts.toString(2);
                    while (binAlerts.length < 16) {
                        binAlerts = '0' + binAlerts;
                    }
                    alerts.push(reverseString(binAlerts));
                    console.log(...oo_oo(`31839590_525_10_525_47_4`, reverseString(binAlerts)));
                }
                alerts.pop();
                let binOriginalAlerts = dataloggerHistory.alerts.toString(2);
                while (binOriginalAlerts.length < 16) {
                    binOriginalAlerts = '0' + binOriginalAlerts;
                }
                let fixedOrigianlAlerts = reverseString(binOriginalAlerts);
                let newAlerts = [];
                for (let idx = 0; idx < dataloggerHistory.ALERTS_LEN; idx++) {
                    if ((dataloggerHistory.alerts >>> idx) & ALERT_MASK) {
                        const alert = pushAlerts[idx];
                        const banner = `El dispositivo '${device.name}' indica un ${alert}`;
                        newAlerts.push({ idx, banner });
                    }
                }
                for (let index = 0; index < alerts.length; index++) {
                    const actualBinaryString = alerts[index];
                    for (let index = 0; index < actualBinaryString.length; index++) {
                        const binaryChar = actualBinaryString[index];
                        if (binaryChar == '1') {
                            let indexAlert = newAlerts.findIndex(newAlert => {
                                return index == newAlert.idx;
                            });
                            if (indexAlert > -1) {
                                newAlerts.splice(indexAlert, 1);
                            }
                        }
                    }
                }
                for (let index = 0; index < newAlerts.length; index++) {
                    const alertToSend = newAlerts[index];
                    const pushResponse = await this.pushNotificationService.send(device.idUser, 'Gawi', alertToSend.banner);
                    if (pushResponse.error) {
                        this.logger.error(pushResponse);
                    }
                }
            }
            else {
                for (let idx = 0; idx < dataloggerHistory.ALERTS_LEN; idx++) {
                    if (((dataloggerHistory.alerts >>> idx) & ALERT_MASK) != 0) {
                        const alert = pushAlerts[idx];
                        const banner = `El dispositivo '${device.name}' indica un ${alert}`;
                        const pushResponse = await this.pushNotificationService.send(device.idUser, 'Gawi', banner);
                        if (pushResponse.error) {
                            this.logger.error(pushResponse);
                        }
                    }
                }
            }
            this.logger.debug('D->[615] historial almacenado correctamente y sin cambios nuevos');
            return new deviceMessage_class_1.DeviceMessage(615, '');
        }
        catch (error) {
            this.logger.error(error);
            return error.response.statusCode == 401
                ? new deviceMessage_class_1.DeviceMessage(401, '')
                : new deviceMessage_class_1.DeviceMessage(690, '');
        }
    }
    async saveWaterDeviceData(body) {
        try {
            this.logger.debug('w->[HTY] ' + JSON.stringify(body));
            let historyDTO = new waterHistory_dto_1.WaterHistoryDto(body);
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
                return new deviceMessage_class_1.DeviceMessage(692, '');
            }
            let payload = this.jwtService.decode(body.T);
            let device = await this.validateDeviceByJwt(payload);
            let apn = await this.apnRepository.findOne({
                where: {
                    idApn: device.idApn,
                },
            });
            if (!apn) {
                this.logger.error('w->[692] datos proporcionado son invalidos (APN)');
                return new deviceMessage_class_1.DeviceMessage(692, '');
            }
            let datetime = new Date(historyDTO.deviceDatetime);
            if (Object.prototype.toString.call(datetime) !== '[object Date]' ||
                isNaN(datetime.getTime())) {
                this.logger.error('w->[695] fecha proporcionada por el dispositivo es inválida');
                return new deviceMessage_class_1.DeviceMessage(695, '');
            }
            let history = await this.waterHistoryRepository.create({
                idDevice: device.idDevice,
                consumption: historyDTO.consumption,
                flow: historyDTO.flow,
                temperature: historyDTO.temperature,
                signalQuality: historyDTO.signalQuality,
                bateryLevel: historyDTO.batteryLevel,
                dripAlert: (historyDTO.alerts >>> 0) & 0x01,
                emptyAlert: (historyDTO.alerts >>> 1) & 0x01,
                reversedFlowAlert: (historyDTO.alerts >>> 2) & 0x01,
                burstAlert: (historyDTO.alerts >>> 3) & 0x01,
                bubbleAlert: (historyDTO.alerts >>> 4) & 0x01,
                manipulationAlert: (historyDTO.alerts >>> 5) & 0x01,
                reason: historyDTO.reason,
                reversedConsumption: historyDTO.reversedConsumption,
            });
            history.dateTime = utilities_1.createDateAsUTC(datetime);
            await history.save();
            let settings = await this.waterSettingsRepository.findOne({
                where: {
                    idDevice: device.idDevice,
                },
            });
            if (!settings) {
                settings = await this.waterSettingsRepository.create({
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
                let pushResponse = await this.pushNotificationService.send(device.idUser, 'Gawi', 'Tu medidor de agua ha generado una alerta');
                if (pushResponse.error) {
                    this.logger.error(pushResponse);
                }
                this.logger.debug('w->[615] historial almacenado correctamente y sin cambios nuevos');
                return new deviceMessage_class_1.DeviceMessage(615, '');
            }
            else {
                if (waterSettings_dto_1.consumptionUnitsValidator[settings.consumptionUnits] == null ||
                    waterSettings_dto_1.consumptionUnitsValidator[settings.consumptionUnits] == undefined ||
                    waterSettings_dto_1.flowUnitsValidator[settings.flowUnits] == null ||
                    waterSettings_dto_1.flowUnitsValidator[settings.flowUnits] == undefined ||
                    waterSettings_dto_1.ipProtocolValidator[settings.ipProtocol] == null ||
                    waterSettings_dto_1.ipProtocolValidator[settings.ipProtocol] == undefined ||
                    waterSettings_dto_1.authValidator[settings.auth] == null ||
                    waterSettings_dto_1.authValidator[settings.auth] == undefined ||
                    waterSettings_dto_1.dailyTransmissionValidator[settings.dailyTransmission] == null ||
                    waterSettings_dto_1.dailyTransmissionValidator[settings.dailyTransmission] == undefined ||
                    waterSettings_dto_1.consumptionAlertValidator[settings.consumptionAlertType] == null ||
                    waterSettings_dto_1.consumptionAlertValidator[settings.consumptionAlertType] == undefined) {
                    this.logger.error('w->[692] datos proporcionado son invalidos (SETTINGS)');
                    return new deviceMessage_class_1.DeviceMessage(692, '');
                }
                let pushResponse = await this.pushNotificationService.send(device.idUser, 'Gawi', 'Uno de tus medidores ha generado una alerta');
                if (pushResponse.error) {
                    this.logger.error(pushResponse.error);
                }
                this.logger.debug('w->[612] historial almacenado correctamente y con cambios a aplicar');
                return new deviceMessage_class_1.DeviceMessage(612, this.getATcommands(settings.status, settings, apn));
            }
        }
        catch (error) {
            this.logger.error(error);
            return error.response.statusCode == 401
                ? new deviceMessage_class_1.DeviceMessage(401, '')
                : new deviceMessage_class_1.DeviceMessage(640, '');
        }
    }
    async markWaterDeviceSettingsAsApplied(body) {
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
                return new deviceMessage_class_1.DeviceMessage(692, '');
            }
            let payload = this.jwtService.decode(body.T);
            let device = await this.validateDeviceByJwt(payload);
            let apn = await this.apnRepository.findOne({
                where: {
                    idApn: device.idApn,
                },
            });
            if (!apn) {
                this.logger.error('w->[692] datos proporcionado son invalidos (APN)');
                return new deviceMessage_class_1.DeviceMessage(692, '');
            }
            let settings = await this.waterSettingsRepository.findOne({
                where: {
                    idDevice: device.idDevice,
                },
            });
            if (!settings) {
                this.logger.error('no existen los settings para un dispositivo valido');
                return new deviceMessage_class_1.DeviceMessage(690, '');
            }
            if (body.S == this.WD_MAX_CONFGS) {
                settings.status = settings.status | body.S;
                settings.wereApplied = true;
                await settings.save();
                this.logger.debug('w->[614] configuraciones aplicadas: ' + settings.status.toString(2));
                return new deviceMessage_class_1.DeviceMessage(614, '');
            }
            else {
                if (waterSettings_dto_1.consumptionUnitsValidator[settings.consumptionUnits] == null ||
                    waterSettings_dto_1.consumptionUnitsValidator[settings.consumptionUnits] == undefined ||
                    waterSettings_dto_1.flowUnitsValidator[settings.flowUnits] == null ||
                    waterSettings_dto_1.flowUnitsValidator[settings.flowUnits] == undefined ||
                    waterSettings_dto_1.ipProtocolValidator[settings.ipProtocol] == null ||
                    waterSettings_dto_1.ipProtocolValidator[settings.ipProtocol] == undefined ||
                    waterSettings_dto_1.authValidator[settings.auth] == null ||
                    waterSettings_dto_1.authValidator[settings.auth] == undefined ||
                    waterSettings_dto_1.dailyTransmissionValidator[settings.dailyTransmission] == null ||
                    waterSettings_dto_1.dailyTransmissionValidator[settings.dailyTransmission] == undefined ||
                    waterSettings_dto_1.consumptionAlertValidator[settings.consumptionAlertType] == null ||
                    waterSettings_dto_1.consumptionAlertValidator[settings.consumptionAlertType] == undefined) {
                    this.logger.error('w->[692] datos proporcionado son invalidos (SETTINGS)');
                    return new deviceMessage_class_1.DeviceMessage(692, '');
                }
                this.logger.debug('w->[613] cambios a aplicar');
                return new deviceMessage_class_1.DeviceMessage(613, this.getATcommands(body.S, settings, apn));
            }
        }
        catch (error) {
            this.logger.error(error);
            return error.response.statusCode == 401
                ? new deviceMessage_class_1.DeviceMessage(401, '')
                : new deviceMessage_class_1.DeviceMessage(640, '');
        }
    }
    async markNaturalGasSettingsAsApplied(body) {
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
                return new deviceMessage_class_1.DeviceMessage(692, '');
            }
            const payload = this.jwtService.decode(body.T);
            const device = await this.validateDeviceByJwt(payload);
            const apn = await this.apnRepository.findOne({
                where: {
                    idApn: device.idApn,
                },
            });
            if (!apn) {
                this.logger.error('w->[692] datos proporcionado son invalidos (APN)');
                return new deviceMessage_class_1.DeviceMessage(692, '');
            }
            const settings = await this.naturalGasSettingsRepository.findOne({
                where: {
                    idDevice: device.idDevice,
                },
            });
            if (!settings) {
                this.logger.error('no existen los settings para un dispositivo valido');
                return new deviceMessage_class_1.DeviceMessage(690, '');
            }
            if (body.S == this.WD_MAX_CONFGS) {
                settings.status = settings.status | body.S;
                settings.wereApplied = true;
                await settings.save();
                this.logger.debug('w->[614] configuraciones aplicadas: ' + settings.status.toString(2));
                return new deviceMessage_class_1.DeviceMessage(614, '');
            }
            else {
                if (waterSettings_dto_1.consumptionUnitsValidator[settings.consumptionUnits] == null ||
                    waterSettings_dto_1.consumptionUnitsValidator[settings.consumptionUnits] == undefined ||
                    waterSettings_dto_1.ipProtocolValidator[settings.ipProtocol] == null ||
                    waterSettings_dto_1.ipProtocolValidator[settings.ipProtocol] == undefined ||
                    waterSettings_dto_1.authValidator[settings.auth] == null ||
                    waterSettings_dto_1.authValidator[settings.auth] == undefined ||
                    waterSettings_dto_1.consumptionAlertValidator[settings.consumptionAlertType] == null ||
                    waterSettings_dto_1.consumptionAlertValidator[settings.consumptionAlertType] == undefined) {
                    this.logger.error('w->[692] datos proporcionado son invalidos (SETTINGS)');
                    return new deviceMessage_class_1.DeviceMessage(692, '');
                }
                this.logger.debug('w->[613] cambios a aplicar');
                return new deviceMessage_class_1.DeviceMessage(613, this.getATcommandsNaturalGas(body.S, settings, apn));
            }
        }
        catch (error) {
            this.logger.error(error);
            return error.response.statusCode == 401
                ? new deviceMessage_class_1.DeviceMessage(401, '')
                : new deviceMessage_class_1.DeviceMessage(640, '');
        }
    }
    async markGasSettingsAsApplied(serialNumber) {
        try {
            this.logger.debug('g->[MRK] <' + serialNumber + '>');
            let gasDevice = await this.deviceRepository.findOne({
                where: {
                    serialNumber: serialNumber,
                },
            });
            if (!gasDevice) {
                this.logger.error('g->[ 93] dispositivo no identificado');
                return new deviceMessage_class_1.DeviceMessage(93, '');
            }
            let settings = await this.gasSettingsRepository.findOne({
                where: {
                    idDevice: gasDevice.idDevice,
                },
            });
            settings.wereApplied = true;
            await settings.save();
            this.logger.debug('g->[ 13] configuraciones aplicadas');
            return new deviceMessage_class_1.DeviceMessage(13, '');
        }
        catch (error) {
            this.logger.error(error);
            return new deviceMessage_class_1.DeviceMessage(90, '');
        }
    }
    async saveGasDeviceData(deviceDate, deviceTime, imei, serialNumber, measure, consumption, meanConsumption, alerts, bateryLevel, temperature, signalQuality) {
        try {
            this.logger.debug('# g->[HTY] ' +
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
                }));
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
                this.logger.error('# g->[ 92] datos proporcionado son invalidos (BODY)');
                return new deviceMessage_class_1.DeviceMessage(92, '');
            }
            let gasDeviceData = new gasHistory_dto_1.GasHistoryDto(deviceDate, deviceTime, imei, serialNumber, measure, consumption, meanConsumption, alerts, bateryLevel, temperature, signalQuality);
            let gasDevice = await this.deviceRepository.findOne({
                where: {
                    serialNumber: serialNumber,
                },
            });
            if (!gasDevice) {
                this.logger.error('# g->[ 93] dispositivo no identificado');
                return new deviceMessage_class_1.DeviceMessage(93, '');
            }
            let datetime = new Date(gasDeviceData.datetime);
            if (Object.prototype.toString.call(datetime) !== '[object Date]' ||
                isNaN(datetime.getTime())) {
                this.logger.error('# g->[ 95] fecha proporcionada por el dispositivo es inválida');
                return new deviceMessage_class_1.DeviceMessage(95, '');
            }
            let history = await this.gasHistoryRepository.create({
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
            history.dateTime = utilities_1.createDateAsUTC(datetime);
            await history.save();
            let settings = await this.gasSettingsRepository.findOne({
                where: {
                    idDevice: gasDevice.idDevice,
                },
            });
            if (!settings) {
                settings = await this.gasSettingsRepository.create({
                    idDevice: gasDevice.idDevice,
                    destUrl: process.env.API_URL,
                    closingHour: '23:59',
                    consumptionUnits: '0060',
                    interval: 25,
                    minFillingPercentage: 9,
                    consumptionPeriod: '010',
                    minsBetweenMeasurements: 10,
                    travelMode: 0,
                    wereApplied: false,
                });
            }
            const gasConfigs = this.getGasSettingsString(settings);
            if (settings.offsetTime !== '00:01') {
                settings.offsetTime = '00:01';
                await settings.save();
            }
            this.sendAlertNotification(gasDevice.idUser, history, settings);
            if (settings.wereApplied) {
                this.logger.debug('# g->[ 12] historial almacenado correctamente y sin cambios nuevos');
                return new deviceMessage_class_1.DeviceMessage(12, '');
            }
            else {
                this.logger.debug(`# g->[ 15] historial almacenado correctamente y con cambios a aplicar: ${gasConfigs}`);
                return new deviceMessage_class_1.DeviceMessage(15, gasConfigs);
            }
        }
        catch (error) {
            this.logger.error(error);
            return new deviceMessage_class_1.DeviceMessage(90, '');
        }
    }
    async sendAlertNotification(idUser, history, settings) {
        if (settings.travelMode == true) {
            let pushResponse = await this.pushNotificationService.send(idUser, 'Gawi Gas: Modo viaje', '¡Se ha detectado un consumo en tu tanque!');
            if (pushResponse.error == true) {
                this.logger.error(pushResponse.message);
            }
        }
        else {
            if (history.intervalAlert == true) {
                let pushResponse = await this.pushNotificationService.send(idUser, 'Gawi Gas', `El nivel de gas ha bajado ${settings.interval}%`);
                if (pushResponse.error == true) {
                    this.logger.error(pushResponse.message);
                }
            }
            if (history.fillingAlert == true) {
                let pushResponse = await this.pushNotificationService.send(idUser, 'Gawi Gas', `Tu tanque se ha llenado un ${settings.minFillingPercentage}%`);
                if (pushResponse.error == true) {
                    this.logger.error(pushResponse.message);
                }
            }
        }
    }
    async serverByFTP(idOrganization) {
        try {
            if (idOrganization == null || idOrganization == undefined) {
                return new ServerMessage_class_1.ServerMessage(true, 'datos proporcionado son invalidos (BODY)', null);
            }
            let histories = await this.deviceRepository.findAll({
                attributes: ['serialNumber'],
                where: {
                    idOrganization: idOrganization,
                },
                include: [
                    {
                        model: waterHistory_entity_1.WaterHistory,
                        as: 'waterHistory',
                        attributes: {
                            exclude: ['idWaterHistory', 'idDevice', 'exceptionCode'],
                        },
                        limit: 1000,
                    },
                ],
            });
            if (!histories) {
                return new ServerMessage_class_1.ServerMessage(true, 'Sin historiales a extraer', null);
            }
            const [backupFilename, backupFilePath] = this.getBackupPath('backup_');
            const { Parser, transforms: { unwind }, } = require('json2csv');
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
            const client = new ftpService.Client();
            await client.access({
                host: process.env.FTP_HOST,
                user: process.env.FTP_USR,
                password: process.env.FTP_PSW,
                secure: false,
            });
            await client.uploadFrom(backupFilePath, backupFilename);
            return new ServerMessage_class_1.ServerMessage(false, 'archivo servido', null);
        }
        catch (error) {
            this.logger.error(error);
            return new ServerMessage_class_1.ServerMessage(true, 'Ha ocurrido un error', error);
        }
    }
    createCRC32Table() {
        let table = new Array(256 * 8);
        let i = 0, j = 0, crc = 0;
        for (i = 0; i < 256; ++i) {
            crc = i;
            for (j = 0; j < 8; ++j) {
                crc = crc & 0x00000001 ? (crc >>> 1) ^ 0xedb88320 : crc >>> 1;
            }
            table[i] = crc;
        }
        return table;
    }
    updateCRC32(crc, c) {
        let table = this.createCRC32Table();
        return (crc >>> 8) ^ table[(crc ^ c) & 0xff];
    }
    computeCRC32(str) {
        let checksum = 0xffffffff;
        for (let i = 0; i < str.length; i++) {
            let char = str.charCodeAt(i);
            checksum = this.updateCRC32(checksum, char & 0xff);
            checksum = this.updateCRC32(checksum, char >>> 8);
        }
        let ans = (checksum >>> 0).toString(16);
        while (ans.length < 8) {
            ans = '0' + ans;
        }
        return ans;
    }
    getGasSettingsString(settings) {
        return (settings.closingHour +
            ',' +
            this.fixLenWithZero(Number(settings.consumptionUnits), 4) +
            ',' +
            this.fixLenWithZero(settings.minsBetweenMeasurements, 4) +
            ',' +
            this.fixLenWithZero(Number(settings.consumptionPeriod), 3) +
            ',' +
            this.fixLenWithZero(settings.minFillingPercentage, 2) +
            ',' +
            this.fixLenWithZero(settings.interval, 2) +
            ',' +
            (settings.travelMode ? '1' : '0') +
            ',' +
            this.fixLenWithZero(settings.offset, 3) +
            ',' +
            settings.offsetTime +
            ',' +
            settings.destUrl);
    }
    fixLenWithZero(num, len) {
        let ans = '' + num;
        while (ans.length < len) {
            ans = '0' + ans;
        }
        return ans;
    }
    checkIsApplied(status, pos) {
        return ((status >>> pos) & 0x01) === 1;
    }
    getATcommands(status, settings, apn) {
        const settingsCmd = new waterSettings_dto_1.WaterSettingsDto(settings, apn);
        const commands = settingsCmd.getCommands();
        let stream = '';
        for (const [pos, cmd] of commands.entries()) {
            if (settingsCmd.totalLength <
                stream.length + settingsCmd.checksumLength + settingsCmd.headerLength)
                break;
            if (!this.checkIsApplied(status, pos))
                stream += cmd;
        }
        return stream + '$' + this.computeCRC32(stream);
    }
    getATcommandsNaturalGas(status, settings, apn) {
        const settingsCmd = new naturalGasSettings_dto_1.NaturalGassettingsDto(settings, apn);
        const commands = settingsCmd.getCommands();
        let stream = '';
        for (const [pos, cmd] of commands.entries()) {
            if (settingsCmd.totalLength <
                stream.length + settingsCmd.checksumLength + settingsCmd.headerLength)
                break;
            if (!this.checkIsApplied(status, pos))
                stream += cmd;
        }
        return stream + '$' + this.computeCRC32(stream);
    }
    createJwtPayloadDevice(serialNumber) {
        let data = {
            serialNumber: serialNumber,
        };
        return {
            expiresIn: 2 * 365 * 24 * 60 * 60,
            token: this.jwtService.sign(data),
        };
    }
    checkNullUndefined(varTest) {
        return varTest == null || varTest == undefined ? true : false;
    }
    async validateDeviceByJwt(payload) {
        const constraints = [payload == null, payload == undefined];
        if (constraints.some(val => val)) {
            throw new common_1.UnauthorizedException();
        }
        let device = await this.deviceRepository.findOne({
            where: {
                serialNumber: payload.serialNumber,
            },
        });
        if (!device) {
            throw new common_1.UnauthorizedException();
        }
        return device;
    }
    async generateDeviceData(device) {
        return {
            idDevice: this.checkNullUndefined(device.idDevice) ? -1 : device.idDevice,
            serialNumber: this.checkNullUndefined(device.serialNumber)
                ? -1
                : device.serialNumber,
        };
    }
    getBackupPath(label) {
        let filename = label + Date.now() + '.csv';
        let filePath = path.join(__dirname, '../../../../..', 'storage/backup/', filename);
        return [filename, filePath];
    }
    debugAlerts(alerts) {
        let binaryString = alerts.toString(2).padStart(8, '0');
        console.log(...oo_oo(`31839590_1601_4_1601_66_4`, `Alert value: ${alerts}, Binary: ${binaryString}`));
        console.log(...oo_oo(`31839590_1602_4_1602_55_4`, `Drip Alert: ${(alerts >>> 0) & 0x01}`));
        console.log(...oo_oo(`31839590_1603_4_1603_56_4`, `Empty Alert: ${(alerts >>> 1) & 0x01}`));
        console.log(...oo_oo(`31839590_1604_4_1604_64_4`, `Inverted Flow Alert: ${(alerts >>> 2) & 0x01}`));
        console.log(...oo_oo(`31839590_1605_4_1605_55_4`, `Leak Alert: ${(alerts >>> 3) & 0x01}`));
        console.log(...oo_oo(`31839590_1606_4_1606_57_4`, `Bubble Alert: ${(alerts >>> 4) & 0x01}`));
        console.log(...oo_oo(`31839590_1607_4_1607_63_4`, `Manipulation Alert: ${(alerts >>> 5) & 0x01}`));
    }
};
DevicesService = __decorate([
    common_1.Injectable(),
    __param(2, common_1.Inject('winston')),
    __param(3, common_1.Inject('DeviceRepository')),
    __param(4, common_1.Inject('ApnRepository')),
    __param(5, common_1.Inject('WaterHistoryRepository')),
    __param(6, common_1.Inject('WaterSettingsRepository')),
    __param(7, common_1.Inject('GasHistoryRepository')),
    __param(8, common_1.Inject('GasSettingsRepository')),
    __param(9, common_1.Inject('DataloggerHistoryRepository')),
    __param(10, common_1.Inject('DataloggerSettingsRepository')),
    __param(11, common_1.Inject('NaturalGasHistoryRepository')),
    __param(12, common_1.Inject('NaturalGasSettingsRepository')),
    __metadata("design:paramtypes", [jwt_1.JwtService,
        push_notifications_service_1.PushNotificationsService, Object, Object, Object, Object, Object, Object, Object, Object, Object, Object, Object])
], DevicesService);
exports.DevicesService = DevicesService;
;
function oo_cm() { try {
    return (0, eval)("globalThis._console_ninja") || (0, eval)("/* https://github.com/wallabyjs/console-ninja#how-does-it-work */'use strict';var _0x12c47f=_0x341f;(function(_0x3a64c1,_0x2796b6){var _0x4248c5=_0x341f,_0x515740=_0x3a64c1();while(!![]){try{var _0x3e8e6d=-parseInt(_0x4248c5(0x1ba))/0x1*(parseInt(_0x4248c5(0x1d9))/0x2)+-parseInt(_0x4248c5(0x219))/0x3+parseInt(_0x4248c5(0x17e))/0x4+-parseInt(_0x4248c5(0x1db))/0x5+-parseInt(_0x4248c5(0x16f))/0x6*(-parseInt(_0x4248c5(0x220))/0x7)+parseInt(_0x4248c5(0x199))/0x8*(parseInt(_0x4248c5(0x22a))/0x9)+parseInt(_0x4248c5(0x216))/0xa;if(_0x3e8e6d===_0x2796b6)break;else _0x515740['push'](_0x515740['shift']());}catch(_0x41611e){_0x515740['push'](_0x515740['shift']());}}}(_0x4b66,0x9b0b7));function _0x4b66(){var _0x9cf38b=['strLength','_setNodeId','autoExpandPreviousObjects','_isMap','totalStrLength','node','_maxConnectAttemptCount','_hasMapOnItsPath','array','WebSocket','timeEnd','process','constructor','catch','String','dockerizedApp','error','\\x20browser','1558002JvClgk','trace','enumerable','_Symbol','logger\\x20websocket\\x20error','autoExpand','null','call','function','elements','_numberRegExp','onopen','disabledLog','_webSocketErrorDocsLink','[object\\x20BigInt]','3174748aoSBqZ','location','Error','message','_addLoadNode','_isUndefined','stringify','set','_capIfString','now','failed\\x20to\\x20find\\x20and\\x20load\\x20WebSocket','versions','nodeModules','disabledTrace','getWebSocketClass','elapsed','readyState','NEXT_RUNTIME','object','expId','_propertyName','_consoleNinjaAllowedToStart','setter',\"/Users/poncianix/.vscode/extensions/wallabyjs.console-ninja-1.0.285/node_modules\",'pop','_inBrowser','onmessage','8yhNMuy','1.0.0','bind','isArray','unknown','_treeNodePropertiesBeforeFullValue','_setNodeQueryPath','host','onerror','getPrototypeOf','split','_isPrimitiveType','isExpressionToEvaluate','_inNextEdge','log','[object\\x20Array]','funcName','Map','port','create','1707494937410','number','index','unref','includes','_isArray','capped','sortProps','_allowedToSend','_p_','stackTraceLimit','depth','astro','31WvNDTT','[object\\x20Map]','_p_length','stack','','push','Boolean','cappedProps','hits','_console_ninja_session','string','_setNodeExpandableState','then','parent','_isPrimitiveWrapperType','_console_ninja','serialize','_hasSymbolPropertyOnItsPath','_type','_setNodeExpressionPath','length','_isNegativeZero','_connected','undefined','parse','_getOwnPropertyNames','join','next.js','_WebSocketClass','autoExpandLimit','_dateToString','56814UBthwj','reload','415010KkcbEq','symbol','_getOwnPropertyDescriptor','prototype','_additionalMetadata','_connectAttemptCount','webpack','autoExpandMaxDepth','_property','onclose','autoExpandPropertyCount','_p_name','Console\\x20Ninja\\x20failed\\x20to\\x20send\\x20logs,\\x20restarting\\x20the\\x20process\\x20may\\x20help;\\x20also\\x20see\\x20','_cleanNode','_addProperty','_objectToString','_regExpToString','level','reduceLimits','_addObjectProperty','env','console','unshift','Number','value','negativeZero','_undefined','allStrLength','substr','','gateway.docker.internal','Set','_addFunctionsNode','toString','Buffer','warn','_WebSocket','send','_processTreeNodeResult','type','time',[\"localhost\",\"127.0.0.1\",\"example.cypress.io\",\"Sauls-Laptop.local\",\"192.168.1.82\"],'[object\\x20Date]','current','_setNodePermissions','name','positiveInfinity','_disposeWebsocket','_blacklistedProperty','POSITIVE_INFINITY','forEach','127.0.0.1','remix','_getOwnPropertySymbols','expressionsToEvaluate','rootExpression','perf_hooks','hasOwnProperty','edge','11516520vyxnNA','nan','hrtime','2844600HivaiU','timeStamp','path','...','angular','52656','test','7uFnCCs','props','RegExp','date','_connectToHostNow','_attemptToReconnectShortly','https://tinyurl.com/37x8b79t','global','logger\\x20failed\\x20to\\x20connect\\x20to\\x20host,\\x20see\\x20','failed\\x20to\\x20connect\\x20to\\x20host:\\x20','3076884nmiGNe','sort','resolveGetters','_ws','noFunctions','boolean','data','_socket','slice','default','_sortProps','_connecting','concat','toLowerCase','_isSet','performance','getOwnPropertySymbols',':logPointId:','count','_allowedToConnectOnSend','getter','cappedElements','getOwnPropertyDescriptor','Console\\x20Ninja\\x20failed\\x20to\\x20send\\x20logs,\\x20refreshing\\x20the\\x20page\\x20may\\x20help;\\x20also\\x20see\\x20','hostname','_sendErrorMessage','_reconnectTimeout','NEGATIVE_INFINITY','_setNodeLabel','bigint','_quotedRegExp','[object\\x20Set]','url','\\x20server','getOwnPropertyNames','get'];_0x4b66=function(){return _0x9cf38b;};return _0x4b66();}var j=Object[_0x12c47f(0x1ac)],H=Object['defineProperty'],G=Object['getOwnPropertyDescriptor'],ee=Object[_0x12c47f(0x24c)],te=Object[_0x12c47f(0x1a2)],ne=Object[_0x12c47f(0x1de)][_0x12c47f(0x214)],re=(_0x5ccae2,_0x33dabb,_0x497022,_0x180ac7)=>{var _0x2c1e03=_0x12c47f;if(_0x33dabb&&typeof _0x33dabb==_0x2c1e03(0x190)||typeof _0x33dabb==_0x2c1e03(0x177)){for(let _0x4211a5 of ee(_0x33dabb))!ne[_0x2c1e03(0x176)](_0x5ccae2,_0x4211a5)&&_0x4211a5!==_0x497022&&H(_0x5ccae2,_0x4211a5,{'get':()=>_0x33dabb[_0x4211a5],'enumerable':!(_0x180ac7=G(_0x33dabb,_0x4211a5))||_0x180ac7[_0x2c1e03(0x171)]});}return _0x5ccae2;},x=(_0xa05a30,_0x29d4ad,_0x2a98bf)=>(_0x2a98bf=_0xa05a30!=null?j(te(_0xa05a30)):{},re(_0x29d4ad||!_0xa05a30||!_0xa05a30['__es'+'Module']?H(_0x2a98bf,_0x12c47f(0x233),{'value':_0xa05a30,'enumerable':!0x0}):_0x2a98bf,_0xa05a30)),X=class{constructor(_0x28a2d9,_0x2647f3,_0x3e3fd3,_0xe1e069,_0x3817f1){var _0x7b8e53=_0x12c47f;this['global']=_0x28a2d9,this['host']=_0x2647f3,this[_0x7b8e53(0x1ab)]=_0x3e3fd3,this[_0x7b8e53(0x18a)]=_0xe1e069,this[_0x7b8e53(0x16c)]=_0x3817f1,this[_0x7b8e53(0x1b5)]=!0x0,this[_0x7b8e53(0x23d)]=!0x0,this['_connected']=!0x1,this['_connecting']=!0x1,this[_0x7b8e53(0x1a6)]=_0x28a2d9['process']?.[_0x7b8e53(0x1ef)]?.['NEXT_RUNTIME']===_0x7b8e53(0x215),this[_0x7b8e53(0x197)]=!this['global'][_0x7b8e53(0x168)]?.['versions']?.[_0x7b8e53(0x162)]&&!this['_inNextEdge'],this[_0x7b8e53(0x1d6)]=null,this[_0x7b8e53(0x1e0)]=0x0,this[_0x7b8e53(0x163)]=0x14,this[_0x7b8e53(0x17c)]=_0x7b8e53(0x226),this[_0x7b8e53(0x243)]=(this[_0x7b8e53(0x197)]?_0x7b8e53(0x241):_0x7b8e53(0x1e7))+this[_0x7b8e53(0x17c)];}async[_0x12c47f(0x18c)](){var _0x4cadba=_0x12c47f;if(this[_0x4cadba(0x1d6)])return this['_WebSocketClass'];let _0x5abb6d;if(this[_0x4cadba(0x197)]||this[_0x4cadba(0x1a6)])_0x5abb6d=this[_0x4cadba(0x227)][_0x4cadba(0x166)];else{if(this[_0x4cadba(0x227)]['process']?.[_0x4cadba(0x1ff)])_0x5abb6d=this['global'][_0x4cadba(0x168)]?.[_0x4cadba(0x1ff)];else try{let _0x2f8195=await import(_0x4cadba(0x21b));_0x5abb6d=(await import((await import(_0x4cadba(0x24a)))['pathToFileURL'](_0x2f8195['join'](this[_0x4cadba(0x18a)],'ws/index.js'))['toString']()))[_0x4cadba(0x233)];}catch{try{_0x5abb6d=require(require(_0x4cadba(0x21b))[_0x4cadba(0x1d4)](this[_0x4cadba(0x18a)],'ws'));}catch{throw new Error(_0x4cadba(0x188));}}}return this[_0x4cadba(0x1d6)]=_0x5abb6d,_0x5abb6d;}[_0x12c47f(0x224)](){var _0x21ad7d=_0x12c47f;this['_connecting']||this['_connected']||this[_0x21ad7d(0x1e0)]>=this[_0x21ad7d(0x163)]||(this['_allowedToConnectOnSend']=!0x1,this['_connecting']=!0x0,this[_0x21ad7d(0x1e0)]++,this[_0x21ad7d(0x22d)]=new Promise((_0x823a16,_0x3a3860)=>{var _0x3aa4e7=_0x21ad7d;this[_0x3aa4e7(0x18c)]()[_0x3aa4e7(0x1c6)](_0x4d422c=>{var _0xb7e2dd=_0x3aa4e7;let _0x44cbd3=new _0x4d422c('ws://'+(!this[_0xb7e2dd(0x197)]&&this[_0xb7e2dd(0x16c)]?_0xb7e2dd(0x1f9):this[_0xb7e2dd(0x1a0)])+':'+this[_0xb7e2dd(0x1ab)]);_0x44cbd3['onerror']=()=>{var _0x235006=_0xb7e2dd;this[_0x235006(0x1b5)]=!0x1,this[_0x235006(0x20a)](_0x44cbd3),this['_attemptToReconnectShortly'](),_0x3a3860(new Error(_0x235006(0x173)));},_0x44cbd3['onopen']=()=>{var _0x1bd03c=_0xb7e2dd;this[_0x1bd03c(0x197)]||_0x44cbd3[_0x1bd03c(0x231)]&&_0x44cbd3[_0x1bd03c(0x231)][_0x1bd03c(0x1b0)]&&_0x44cbd3[_0x1bd03c(0x231)][_0x1bd03c(0x1b0)](),_0x823a16(_0x44cbd3);},_0x44cbd3['onclose']=()=>{var _0x5b55c8=_0xb7e2dd;this['_allowedToConnectOnSend']=!0x0,this['_disposeWebsocket'](_0x44cbd3),this[_0x5b55c8(0x225)]();},_0x44cbd3[_0xb7e2dd(0x198)]=_0x437b20=>{var _0x25dead=_0xb7e2dd;try{_0x437b20&&_0x437b20[_0x25dead(0x230)]&&this[_0x25dead(0x197)]&&JSON[_0x25dead(0x1d2)](_0x437b20[_0x25dead(0x230)])['method']===_0x25dead(0x1da)&&this[_0x25dead(0x227)][_0x25dead(0x17f)][_0x25dead(0x1da)]();}catch{}};})[_0x3aa4e7(0x1c6)](_0x47a542=>(this[_0x3aa4e7(0x1d0)]=!0x0,this[_0x3aa4e7(0x235)]=!0x1,this[_0x3aa4e7(0x23d)]=!0x1,this['_allowedToSend']=!0x0,this[_0x3aa4e7(0x1e0)]=0x0,_0x47a542))[_0x3aa4e7(0x16a)](_0x2b2034=>(this['_connected']=!0x1,this['_connecting']=!0x1,console[_0x3aa4e7(0x1fe)](_0x3aa4e7(0x228)+this[_0x3aa4e7(0x17c)]),_0x3a3860(new Error(_0x3aa4e7(0x229)+(_0x2b2034&&_0x2b2034[_0x3aa4e7(0x181)])))));}));}[_0x12c47f(0x20a)](_0xbc6464){var _0x3ad943=_0x12c47f;this[_0x3ad943(0x1d0)]=!0x1,this[_0x3ad943(0x235)]=!0x1;try{_0xbc6464[_0x3ad943(0x1e4)]=null,_0xbc6464[_0x3ad943(0x1a1)]=null,_0xbc6464[_0x3ad943(0x17a)]=null;}catch{}try{_0xbc6464[_0x3ad943(0x18e)]<0x2&&_0xbc6464['close']();}catch{}}[_0x12c47f(0x225)](){var _0x12cd49=_0x12c47f;clearTimeout(this[_0x12cd49(0x244)]),!(this['_connectAttemptCount']>=this[_0x12cd49(0x163)])&&(this['_reconnectTimeout']=setTimeout(()=>{var _0x588246=_0x12cd49;this[_0x588246(0x1d0)]||this['_connecting']||(this[_0x588246(0x224)](),this[_0x588246(0x22d)]?.['catch'](()=>this[_0x588246(0x225)]()));},0x1f4),this[_0x12cd49(0x244)][_0x12cd49(0x1b0)]&&this[_0x12cd49(0x244)]['unref']());}async[_0x12c47f(0x200)](_0x34ebe4){var _0x18d749=_0x12c47f;try{if(!this[_0x18d749(0x1b5)])return;this[_0x18d749(0x23d)]&&this['_connectToHostNow'](),(await this[_0x18d749(0x22d)])['send'](JSON[_0x18d749(0x184)](_0x34ebe4));}catch(_0x5ab0fc){console[_0x18d749(0x1fe)](this['_sendErrorMessage']+':\\x20'+(_0x5ab0fc&&_0x5ab0fc[_0x18d749(0x181)])),this[_0x18d749(0x1b5)]=!0x1,this[_0x18d749(0x225)]();}}};function b(_0x16cfcc,_0x484b75,_0xb420ec,_0x51b7ad,_0x1fd050,_0x4ee1f9){var _0x578164=_0x12c47f;let _0x2dfffa=_0xb420ec[_0x578164(0x1a3)](',')['map'](_0x143e55=>{var _0x20d9d7=_0x578164;try{_0x16cfcc[_0x20d9d7(0x1c3)]||((_0x1fd050===_0x20d9d7(0x1d5)||_0x1fd050===_0x20d9d7(0x20f)||_0x1fd050===_0x20d9d7(0x1b9)||_0x1fd050===_0x20d9d7(0x21d))&&(_0x1fd050+=!_0x16cfcc[_0x20d9d7(0x168)]?.[_0x20d9d7(0x189)]?.[_0x20d9d7(0x162)]&&_0x16cfcc['process']?.[_0x20d9d7(0x1ef)]?.[_0x20d9d7(0x18f)]!==_0x20d9d7(0x215)?_0x20d9d7(0x16e):_0x20d9d7(0x24b)),_0x16cfcc[_0x20d9d7(0x1c3)]={'id':+new Date(),'tool':_0x1fd050});let _0x571ffb=new X(_0x16cfcc,_0x484b75,_0x143e55,_0x51b7ad,_0x4ee1f9);return _0x571ffb[_0x20d9d7(0x200)][_0x20d9d7(0x19b)](_0x571ffb);}catch(_0x31ba95){return console[_0x20d9d7(0x1fe)]('logger\\x20failed\\x20to\\x20connect\\x20to\\x20host',_0x31ba95&&_0x31ba95[_0x20d9d7(0x181)]),()=>{};}});return _0x5d733b=>_0x2dfffa[_0x578164(0x20d)](_0x5e84b4=>_0x5e84b4(_0x5d733b));}function W(_0x15621a){var _0x111d9=_0x12c47f;let _0x503751=function(_0x4f6b6e,_0x44baf8){return _0x44baf8-_0x4f6b6e;},_0x103972;if(_0x15621a['performance'])_0x103972=function(){var _0x5b7c3d=_0x341f;return _0x15621a[_0x5b7c3d(0x239)][_0x5b7c3d(0x187)]();};else{if(_0x15621a['process']&&_0x15621a['process']['hrtime']&&_0x15621a[_0x111d9(0x168)]?.['env']?.[_0x111d9(0x18f)]!==_0x111d9(0x215))_0x103972=function(){var _0x40c619=_0x111d9;return _0x15621a[_0x40c619(0x168)][_0x40c619(0x218)]();},_0x503751=function(_0x19b88c,_0x174ce6){return 0x3e8*(_0x174ce6[0x0]-_0x19b88c[0x0])+(_0x174ce6[0x1]-_0x19b88c[0x1])/0xf4240;};else try{let {performance:_0x35e6dd}=require(_0x111d9(0x213));_0x103972=function(){return _0x35e6dd['now']();};}catch{_0x103972=function(){return+new Date();};}}return{'elapsed':_0x503751,'timeStamp':_0x103972,'now':()=>Date['now']()};}function J(_0x2a1a5c,_0x3104db,_0x233151){var _0xde5036=_0x12c47f;if(_0x2a1a5c['_consoleNinjaAllowedToStart']!==void 0x0)return _0x2a1a5c['_consoleNinjaAllowedToStart'];let _0xb3e7a2=_0x2a1a5c[_0xde5036(0x168)]?.[_0xde5036(0x189)]?.[_0xde5036(0x162)]||_0x2a1a5c['process']?.[_0xde5036(0x1ef)]?.['NEXT_RUNTIME']===_0xde5036(0x215);return _0xb3e7a2&&_0x233151==='nuxt'?_0x2a1a5c[_0xde5036(0x193)]=!0x1:_0x2a1a5c[_0xde5036(0x193)]=_0xb3e7a2||!_0x3104db||_0x2a1a5c[_0xde5036(0x17f)]?.[_0xde5036(0x242)]&&_0x3104db[_0xde5036(0x1b1)](_0x2a1a5c['location'][_0xde5036(0x242)]),_0x2a1a5c[_0xde5036(0x193)];}function Y(_0x2d02e6,_0x3ac908,_0xe3ec79,_0xc6c657){var _0x1c22b8=_0x12c47f;_0x2d02e6=_0x2d02e6,_0x3ac908=_0x3ac908,_0xe3ec79=_0xe3ec79,_0xc6c657=_0xc6c657;let _0x397d58=W(_0x2d02e6),_0xeea918=_0x397d58[_0x1c22b8(0x18d)],_0x1b05b2=_0x397d58[_0x1c22b8(0x21a)];class _0x3c254e{constructor(){var _0x43a4e7=_0x1c22b8;this['_keyStrRegExp']=/^(?!(?:do|if|in|for|let|new|try|var|case|else|enum|eval|false|null|this|true|void|with|break|catch|class|const|super|throw|while|yield|delete|export|import|public|return|static|switch|typeof|default|extends|finally|package|private|continue|debugger|function|arguments|interface|protected|implements|instanceof)$)[_$a-zA-Z\\xA0-\\uFFFF][_$a-zA-Z0-9\\xA0-\\uFFFF]*$/,this[_0x43a4e7(0x179)]=/^(0|[1-9][0-9]*)$/,this[_0x43a4e7(0x248)]=/'([^\\\\']|\\\\')*'/,this[_0x43a4e7(0x1f5)]=_0x2d02e6[_0x43a4e7(0x1d1)],this['_HTMLAllCollection']=_0x2d02e6['HTMLAllCollection'],this[_0x43a4e7(0x1dd)]=Object[_0x43a4e7(0x240)],this[_0x43a4e7(0x1d3)]=Object[_0x43a4e7(0x24c)],this['_Symbol']=_0x2d02e6['Symbol'],this['_regExpToString']=RegExp[_0x43a4e7(0x1de)][_0x43a4e7(0x1fc)],this[_0x43a4e7(0x1d8)]=Date[_0x43a4e7(0x1de)][_0x43a4e7(0x1fc)];}['serialize'](_0x47251c,_0x48c524,_0x42dbb1,_0x5ee62d){var _0x396d0f=_0x1c22b8,_0x4a455d=this,_0x2b3c2a=_0x42dbb1[_0x396d0f(0x174)];function _0x329cf7(_0xf00d3c,_0x163298,_0x17eb9e){var _0x3a2a65=_0x396d0f;_0x163298[_0x3a2a65(0x202)]=_0x3a2a65(0x19d),_0x163298['error']=_0xf00d3c[_0x3a2a65(0x181)],_0x3c5117=_0x17eb9e[_0x3a2a65(0x162)][_0x3a2a65(0x206)],_0x17eb9e[_0x3a2a65(0x162)][_0x3a2a65(0x206)]=_0x163298,_0x4a455d[_0x3a2a65(0x19e)](_0x163298,_0x17eb9e);}try{_0x42dbb1[_0x396d0f(0x1ec)]++,_0x42dbb1[_0x396d0f(0x174)]&&_0x42dbb1['autoExpandPreviousObjects']['push'](_0x48c524);var _0x258082,_0xf4127,_0x5ce2af,_0x261f39,_0x11d8c9=[],_0x364dc7=[],_0x2314cf,_0xe705ce=this[_0x396d0f(0x1cc)](_0x48c524),_0x460077=_0xe705ce===_0x396d0f(0x165),_0x5c7b2b=!0x1,_0x390cbd=_0xe705ce===_0x396d0f(0x177),_0x1f269b=this['_isPrimitiveType'](_0xe705ce),_0x2e13d2=this[_0x396d0f(0x1c8)](_0xe705ce),_0xa3a055=_0x1f269b||_0x2e13d2,_0x4a55ac={},_0x50404e=0x0,_0xa31672=!0x1,_0x3c5117,_0x2b54a4=/^(([1-9]{1}[0-9]*)|0)$/;if(_0x42dbb1[_0x396d0f(0x1b8)]){if(_0x460077){if(_0xf4127=_0x48c524[_0x396d0f(0x1ce)],_0xf4127>_0x42dbb1['elements']){for(_0x5ce2af=0x0,_0x261f39=_0x42dbb1['elements'],_0x258082=_0x5ce2af;_0x258082<_0x261f39;_0x258082++)_0x364dc7[_0x396d0f(0x1bf)](_0x4a455d['_addProperty'](_0x11d8c9,_0x48c524,_0xe705ce,_0x258082,_0x42dbb1));_0x47251c[_0x396d0f(0x23f)]=!0x0;}else{for(_0x5ce2af=0x0,_0x261f39=_0xf4127,_0x258082=_0x5ce2af;_0x258082<_0x261f39;_0x258082++)_0x364dc7[_0x396d0f(0x1bf)](_0x4a455d['_addProperty'](_0x11d8c9,_0x48c524,_0xe705ce,_0x258082,_0x42dbb1));}_0x42dbb1['autoExpandPropertyCount']+=_0x364dc7['length'];}if(!(_0xe705ce===_0x396d0f(0x175)||_0xe705ce==='undefined')&&!_0x1f269b&&_0xe705ce!==_0x396d0f(0x16b)&&_0xe705ce!==_0x396d0f(0x1fd)&&_0xe705ce!=='bigint'){var _0x7dc11f=_0x5ee62d[_0x396d0f(0x221)]||_0x42dbb1[_0x396d0f(0x221)];if(this['_isSet'](_0x48c524)?(_0x258082=0x0,_0x48c524[_0x396d0f(0x20d)](function(_0xe8506a){var _0x287f3a=_0x396d0f;if(_0x50404e++,_0x42dbb1[_0x287f3a(0x1e5)]++,_0x50404e>_0x7dc11f){_0xa31672=!0x0;return;}if(!_0x42dbb1[_0x287f3a(0x1a5)]&&_0x42dbb1[_0x287f3a(0x174)]&&_0x42dbb1[_0x287f3a(0x1e5)]>_0x42dbb1['autoExpandLimit']){_0xa31672=!0x0;return;}_0x364dc7['push'](_0x4a455d[_0x287f3a(0x1e9)](_0x11d8c9,_0x48c524,_0x287f3a(0x1fa),_0x258082++,_0x42dbb1,function(_0x556cb0){return function(){return _0x556cb0;};}(_0xe8506a)));})):this[_0x396d0f(0x160)](_0x48c524)&&_0x48c524[_0x396d0f(0x20d)](function(_0x327361,_0x2d6c5f){var _0x3e3dd1=_0x396d0f;if(_0x50404e++,_0x42dbb1[_0x3e3dd1(0x1e5)]++,_0x50404e>_0x7dc11f){_0xa31672=!0x0;return;}if(!_0x42dbb1['isExpressionToEvaluate']&&_0x42dbb1[_0x3e3dd1(0x174)]&&_0x42dbb1[_0x3e3dd1(0x1e5)]>_0x42dbb1['autoExpandLimit']){_0xa31672=!0x0;return;}var _0x11d6b5=_0x2d6c5f[_0x3e3dd1(0x1fc)]();_0x11d6b5[_0x3e3dd1(0x1ce)]>0x64&&(_0x11d6b5=_0x11d6b5[_0x3e3dd1(0x232)](0x0,0x64)+_0x3e3dd1(0x21c)),_0x364dc7[_0x3e3dd1(0x1bf)](_0x4a455d['_addProperty'](_0x11d8c9,_0x48c524,_0x3e3dd1(0x1aa),_0x11d6b5,_0x42dbb1,function(_0x23378b){return function(){return _0x23378b;};}(_0x327361)));}),!_0x5c7b2b){try{for(_0x2314cf in _0x48c524)if(!(_0x460077&&_0x2b54a4['test'](_0x2314cf))&&!this[_0x396d0f(0x20b)](_0x48c524,_0x2314cf,_0x42dbb1)){if(_0x50404e++,_0x42dbb1[_0x396d0f(0x1e5)]++,_0x50404e>_0x7dc11f){_0xa31672=!0x0;break;}if(!_0x42dbb1[_0x396d0f(0x1a5)]&&_0x42dbb1[_0x396d0f(0x174)]&&_0x42dbb1[_0x396d0f(0x1e5)]>_0x42dbb1[_0x396d0f(0x1d7)]){_0xa31672=!0x0;break;}_0x364dc7[_0x396d0f(0x1bf)](_0x4a455d[_0x396d0f(0x1ee)](_0x11d8c9,_0x4a55ac,_0x48c524,_0xe705ce,_0x2314cf,_0x42dbb1));}}catch{}if(_0x4a55ac[_0x396d0f(0x1bc)]=!0x0,_0x390cbd&&(_0x4a55ac[_0x396d0f(0x1e6)]=!0x0),!_0xa31672){var _0x4b5f06=[][_0x396d0f(0x236)](this[_0x396d0f(0x1d3)](_0x48c524))[_0x396d0f(0x236)](this[_0x396d0f(0x210)](_0x48c524));for(_0x258082=0x0,_0xf4127=_0x4b5f06['length'];_0x258082<_0xf4127;_0x258082++)if(_0x2314cf=_0x4b5f06[_0x258082],!(_0x460077&&_0x2b54a4[_0x396d0f(0x21f)](_0x2314cf[_0x396d0f(0x1fc)]()))&&!this[_0x396d0f(0x20b)](_0x48c524,_0x2314cf,_0x42dbb1)&&!_0x4a55ac[_0x396d0f(0x1b6)+_0x2314cf[_0x396d0f(0x1fc)]()]){if(_0x50404e++,_0x42dbb1[_0x396d0f(0x1e5)]++,_0x50404e>_0x7dc11f){_0xa31672=!0x0;break;}if(!_0x42dbb1['isExpressionToEvaluate']&&_0x42dbb1[_0x396d0f(0x174)]&&_0x42dbb1[_0x396d0f(0x1e5)]>_0x42dbb1[_0x396d0f(0x1d7)]){_0xa31672=!0x0;break;}_0x364dc7['push'](_0x4a455d['_addObjectProperty'](_0x11d8c9,_0x4a55ac,_0x48c524,_0xe705ce,_0x2314cf,_0x42dbb1));}}}}}if(_0x47251c[_0x396d0f(0x202)]=_0xe705ce,_0xa3a055?(_0x47251c['value']=_0x48c524['valueOf'](),this[_0x396d0f(0x186)](_0xe705ce,_0x47251c,_0x42dbb1,_0x5ee62d)):_0xe705ce===_0x396d0f(0x223)?_0x47251c[_0x396d0f(0x1f3)]=this[_0x396d0f(0x1d8)][_0x396d0f(0x176)](_0x48c524):_0xe705ce===_0x396d0f(0x247)?_0x47251c[_0x396d0f(0x1f3)]=_0x48c524[_0x396d0f(0x1fc)]():_0xe705ce===_0x396d0f(0x222)?_0x47251c[_0x396d0f(0x1f3)]=this[_0x396d0f(0x1eb)][_0x396d0f(0x176)](_0x48c524):_0xe705ce===_0x396d0f(0x1dc)&&this[_0x396d0f(0x172)]?_0x47251c[_0x396d0f(0x1f3)]=this[_0x396d0f(0x172)]['prototype']['toString']['call'](_0x48c524):!_0x42dbb1['depth']&&!(_0xe705ce==='null'||_0xe705ce===_0x396d0f(0x1d1))&&(delete _0x47251c['value'],_0x47251c['capped']=!0x0),_0xa31672&&(_0x47251c[_0x396d0f(0x1c1)]=!0x0),_0x3c5117=_0x42dbb1[_0x396d0f(0x162)][_0x396d0f(0x206)],_0x42dbb1[_0x396d0f(0x162)]['current']=_0x47251c,this[_0x396d0f(0x19e)](_0x47251c,_0x42dbb1),_0x364dc7[_0x396d0f(0x1ce)]){for(_0x258082=0x0,_0xf4127=_0x364dc7[_0x396d0f(0x1ce)];_0x258082<_0xf4127;_0x258082++)_0x364dc7[_0x258082](_0x258082);}_0x11d8c9['length']&&(_0x47251c[_0x396d0f(0x221)]=_0x11d8c9);}catch(_0xcfa7a0){_0x329cf7(_0xcfa7a0,_0x47251c,_0x42dbb1);}return this[_0x396d0f(0x1df)](_0x48c524,_0x47251c),this['_treeNodePropertiesAfterFullValue'](_0x47251c,_0x42dbb1),_0x42dbb1['node'][_0x396d0f(0x206)]=_0x3c5117,_0x42dbb1[_0x396d0f(0x1ec)]--,_0x42dbb1[_0x396d0f(0x174)]=_0x2b3c2a,_0x42dbb1[_0x396d0f(0x174)]&&_0x42dbb1[_0x396d0f(0x250)][_0x396d0f(0x196)](),_0x47251c;}[_0x1c22b8(0x210)](_0x672991){var _0x9ccdc3=_0x1c22b8;return Object[_0x9ccdc3(0x23a)]?Object[_0x9ccdc3(0x23a)](_0x672991):[];}[_0x1c22b8(0x238)](_0xde0740){var _0x539c78=_0x1c22b8;return!!(_0xde0740&&_0x2d02e6['Set']&&this[_0x539c78(0x1ea)](_0xde0740)===_0x539c78(0x249)&&_0xde0740['forEach']);}[_0x1c22b8(0x20b)](_0x3c20ec,_0x327190,_0x2ae08f){var _0x3a9b8b=_0x1c22b8;return _0x2ae08f[_0x3a9b8b(0x22e)]?typeof _0x3c20ec[_0x327190]==_0x3a9b8b(0x177):!0x1;}[_0x1c22b8(0x1cc)](_0x30ef19){var _0x21129e=_0x1c22b8,_0x55fadc='';return _0x55fadc=typeof _0x30ef19,_0x55fadc==='object'?this[_0x21129e(0x1ea)](_0x30ef19)===_0x21129e(0x1a8)?_0x55fadc='array':this[_0x21129e(0x1ea)](_0x30ef19)===_0x21129e(0x205)?_0x55fadc=_0x21129e(0x223):this[_0x21129e(0x1ea)](_0x30ef19)===_0x21129e(0x17d)?_0x55fadc=_0x21129e(0x247):_0x30ef19===null?_0x55fadc=_0x21129e(0x175):_0x30ef19[_0x21129e(0x169)]&&(_0x55fadc=_0x30ef19[_0x21129e(0x169)][_0x21129e(0x208)]||_0x55fadc):_0x55fadc==='undefined'&&this['_HTMLAllCollection']&&_0x30ef19 instanceof this['_HTMLAllCollection']&&(_0x55fadc='HTMLAllCollection'),_0x55fadc;}['_objectToString'](_0x574ba5){var _0x5dd75e=_0x1c22b8;return Object[_0x5dd75e(0x1de)]['toString'][_0x5dd75e(0x176)](_0x574ba5);}[_0x1c22b8(0x1a4)](_0x1c2f0f){var _0x435b81=_0x1c22b8;return _0x1c2f0f===_0x435b81(0x22f)||_0x1c2f0f==='string'||_0x1c2f0f===_0x435b81(0x1ae);}[_0x1c22b8(0x1c8)](_0x5982a8){var _0x392aca=_0x1c22b8;return _0x5982a8===_0x392aca(0x1c0)||_0x5982a8==='String'||_0x5982a8===_0x392aca(0x1f2);}['_addProperty'](_0x33bb2c,_0x486242,_0x506ede,_0x27ebd9,_0xc20249,_0x90b162){var _0x57d374=this;return function(_0x49f588){var _0xae69c3=_0x341f,_0x5bfa33=_0xc20249[_0xae69c3(0x162)][_0xae69c3(0x206)],_0x3f459e=_0xc20249[_0xae69c3(0x162)][_0xae69c3(0x1af)],_0x1bc60d=_0xc20249[_0xae69c3(0x162)]['parent'];_0xc20249[_0xae69c3(0x162)][_0xae69c3(0x1c7)]=_0x5bfa33,_0xc20249['node']['index']=typeof _0x27ebd9==_0xae69c3(0x1ae)?_0x27ebd9:_0x49f588,_0x33bb2c[_0xae69c3(0x1bf)](_0x57d374[_0xae69c3(0x1e3)](_0x486242,_0x506ede,_0x27ebd9,_0xc20249,_0x90b162)),_0xc20249[_0xae69c3(0x162)]['parent']=_0x1bc60d,_0xc20249[_0xae69c3(0x162)]['index']=_0x3f459e;};}[_0x1c22b8(0x1ee)](_0x12a86d,_0x1f9037,_0x37978d,_0x3abbf9,_0x499266,_0x3a0280,_0x396298){var _0x2f6e6c=_0x1c22b8,_0x4f9212=this;return _0x1f9037[_0x2f6e6c(0x1b6)+_0x499266[_0x2f6e6c(0x1fc)]()]=!0x0,function(_0x2653f8){var _0x15dc5d=_0x2f6e6c,_0x54eff4=_0x3a0280[_0x15dc5d(0x162)]['current'],_0x3b0271=_0x3a0280[_0x15dc5d(0x162)]['index'],_0x2edfee=_0x3a0280['node'][_0x15dc5d(0x1c7)];_0x3a0280['node'][_0x15dc5d(0x1c7)]=_0x54eff4,_0x3a0280['node'][_0x15dc5d(0x1af)]=_0x2653f8,_0x12a86d['push'](_0x4f9212['_property'](_0x37978d,_0x3abbf9,_0x499266,_0x3a0280,_0x396298)),_0x3a0280[_0x15dc5d(0x162)][_0x15dc5d(0x1c7)]=_0x2edfee,_0x3a0280[_0x15dc5d(0x162)][_0x15dc5d(0x1af)]=_0x3b0271;};}['_property'](_0x39474c,_0x14ec8c,_0x4fdb13,_0x22e8c6,_0x4f87f1){var _0x32a4b2=_0x1c22b8,_0x223958=this;_0x4f87f1||(_0x4f87f1=function(_0x4919fd,_0x33ded8){return _0x4919fd[_0x33ded8];});var _0xf6b87e=_0x4fdb13[_0x32a4b2(0x1fc)](),_0x3c0a9b=_0x22e8c6[_0x32a4b2(0x211)]||{},_0x3f172b=_0x22e8c6[_0x32a4b2(0x1b8)],_0x221ae4=_0x22e8c6[_0x32a4b2(0x1a5)];try{var _0x32044f=this[_0x32a4b2(0x160)](_0x39474c),_0x32945a=_0xf6b87e;_0x32044f&&_0x32945a[0x0]==='\\x27'&&(_0x32945a=_0x32945a[_0x32a4b2(0x1f7)](0x1,_0x32945a[_0x32a4b2(0x1ce)]-0x2));var _0x1637bd=_0x22e8c6['expressionsToEvaluate']=_0x3c0a9b[_0x32a4b2(0x1b6)+_0x32945a];_0x1637bd&&(_0x22e8c6[_0x32a4b2(0x1b8)]=_0x22e8c6[_0x32a4b2(0x1b8)]+0x1),_0x22e8c6[_0x32a4b2(0x1a5)]=!!_0x1637bd;var _0x2a6d51=typeof _0x4fdb13==_0x32a4b2(0x1dc),_0x544c88={'name':_0x2a6d51||_0x32044f?_0xf6b87e:this['_propertyName'](_0xf6b87e)};if(_0x2a6d51&&(_0x544c88[_0x32a4b2(0x1dc)]=!0x0),!(_0x14ec8c===_0x32a4b2(0x165)||_0x14ec8c===_0x32a4b2(0x180))){var _0x245f3b=this[_0x32a4b2(0x1dd)](_0x39474c,_0x4fdb13);if(_0x245f3b&&(_0x245f3b[_0x32a4b2(0x185)]&&(_0x544c88[_0x32a4b2(0x194)]=!0x0),_0x245f3b[_0x32a4b2(0x24d)]&&!_0x1637bd&&!_0x22e8c6['resolveGetters']))return _0x544c88[_0x32a4b2(0x23e)]=!0x0,this['_processTreeNodeResult'](_0x544c88,_0x22e8c6),_0x544c88;}var _0x179319;try{_0x179319=_0x4f87f1(_0x39474c,_0x4fdb13);}catch(_0x1afb69){return _0x544c88={'name':_0xf6b87e,'type':'unknown','error':_0x1afb69['message']},this[_0x32a4b2(0x201)](_0x544c88,_0x22e8c6),_0x544c88;}var _0x313c10=this['_type'](_0x179319),_0x29c989=this[_0x32a4b2(0x1a4)](_0x313c10);if(_0x544c88[_0x32a4b2(0x202)]=_0x313c10,_0x29c989)this[_0x32a4b2(0x201)](_0x544c88,_0x22e8c6,_0x179319,function(){var _0x5599a0=_0x32a4b2;_0x544c88[_0x5599a0(0x1f3)]=_0x179319['valueOf'](),!_0x1637bd&&_0x223958[_0x5599a0(0x186)](_0x313c10,_0x544c88,_0x22e8c6,{});});else{var _0x406654=_0x22e8c6[_0x32a4b2(0x174)]&&_0x22e8c6[_0x32a4b2(0x1ec)]<_0x22e8c6['autoExpandMaxDepth']&&_0x22e8c6['autoExpandPreviousObjects']['indexOf'](_0x179319)<0x0&&_0x313c10!=='function'&&_0x22e8c6['autoExpandPropertyCount']<_0x22e8c6[_0x32a4b2(0x1d7)];_0x406654||_0x22e8c6[_0x32a4b2(0x1ec)]<_0x3f172b||_0x1637bd?(this[_0x32a4b2(0x1ca)](_0x544c88,_0x179319,_0x22e8c6,_0x1637bd||{}),this[_0x32a4b2(0x1df)](_0x179319,_0x544c88)):this[_0x32a4b2(0x201)](_0x544c88,_0x22e8c6,_0x179319,function(){var _0x1c7d10=_0x32a4b2;_0x313c10===_0x1c7d10(0x175)||_0x313c10===_0x1c7d10(0x1d1)||(delete _0x544c88['value'],_0x544c88[_0x1c7d10(0x1b3)]=!0x0);});}return _0x544c88;}finally{_0x22e8c6[_0x32a4b2(0x211)]=_0x3c0a9b,_0x22e8c6[_0x32a4b2(0x1b8)]=_0x3f172b,_0x22e8c6['isExpressionToEvaluate']=_0x221ae4;}}['_capIfString'](_0x5d5f64,_0x4f6944,_0x273572,_0x5c12a2){var _0x485068=_0x1c22b8,_0x29ec16=_0x5c12a2['strLength']||_0x273572[_0x485068(0x24e)];if((_0x5d5f64===_0x485068(0x1c4)||_0x5d5f64===_0x485068(0x16b))&&_0x4f6944['value']){let _0x42c7ac=_0x4f6944['value']['length'];_0x273572[_0x485068(0x1f6)]+=_0x42c7ac,_0x273572[_0x485068(0x1f6)]>_0x273572[_0x485068(0x161)]?(_0x4f6944[_0x485068(0x1b3)]='',delete _0x4f6944['value']):_0x42c7ac>_0x29ec16&&(_0x4f6944[_0x485068(0x1b3)]=_0x4f6944[_0x485068(0x1f3)][_0x485068(0x1f7)](0x0,_0x29ec16),delete _0x4f6944['value']);}}['_isMap'](_0x163e75){var _0x40feb0=_0x1c22b8;return!!(_0x163e75&&_0x2d02e6[_0x40feb0(0x1aa)]&&this[_0x40feb0(0x1ea)](_0x163e75)===_0x40feb0(0x1bb)&&_0x163e75[_0x40feb0(0x20d)]);}[_0x1c22b8(0x192)](_0x3da9e1){var _0x488a1f=_0x1c22b8;if(_0x3da9e1['match'](/^\\d+$/))return _0x3da9e1;var _0x32e9f0;try{_0x32e9f0=JSON[_0x488a1f(0x184)](''+_0x3da9e1);}catch{_0x32e9f0='\\x22'+this['_objectToString'](_0x3da9e1)+'\\x22';}return _0x32e9f0['match'](/^\"([a-zA-Z_][a-zA-Z_0-9]*)\"$/)?_0x32e9f0=_0x32e9f0['substr'](0x1,_0x32e9f0[_0x488a1f(0x1ce)]-0x2):_0x32e9f0=_0x32e9f0['replace'](/'/g,'\\x5c\\x27')['replace'](/\\\\\"/g,'\\x22')['replace'](/(^\"|\"$)/g,'\\x27'),_0x32e9f0;}[_0x1c22b8(0x201)](_0xb370ff,_0x38f2ac,_0x5e4b7e,_0x106b79){var _0x38cb27=_0x1c22b8;this[_0x38cb27(0x19e)](_0xb370ff,_0x38f2ac),_0x106b79&&_0x106b79(),this[_0x38cb27(0x1df)](_0x5e4b7e,_0xb370ff),this['_treeNodePropertiesAfterFullValue'](_0xb370ff,_0x38f2ac);}[_0x1c22b8(0x19e)](_0x2905a0,_0x217982){var _0x2f3009=_0x1c22b8;this[_0x2f3009(0x24f)](_0x2905a0,_0x217982),this[_0x2f3009(0x19f)](_0x2905a0,_0x217982),this[_0x2f3009(0x1cd)](_0x2905a0,_0x217982),this[_0x2f3009(0x207)](_0x2905a0,_0x217982);}[_0x1c22b8(0x24f)](_0x3a06fa,_0x2381ad){}[_0x1c22b8(0x19f)](_0x2a31f3,_0x243337){}[_0x1c22b8(0x246)](_0x35900a,_0x3a6371){}[_0x1c22b8(0x183)](_0x540e9b){return _0x540e9b===this['_undefined'];}['_treeNodePropertiesAfterFullValue'](_0x14bdc9,_0x192538){var _0x1806e7=_0x1c22b8;this[_0x1806e7(0x246)](_0x14bdc9,_0x192538),this['_setNodeExpandableState'](_0x14bdc9),_0x192538[_0x1806e7(0x1b4)]&&this[_0x1806e7(0x234)](_0x14bdc9),this[_0x1806e7(0x1fb)](_0x14bdc9,_0x192538),this[_0x1806e7(0x182)](_0x14bdc9,_0x192538),this[_0x1806e7(0x1e8)](_0x14bdc9);}[_0x1c22b8(0x1df)](_0x459a70,_0x339e9f){var _0x5e76d5=_0x1c22b8;let _0x1924c3;try{_0x2d02e6['console']&&(_0x1924c3=_0x2d02e6[_0x5e76d5(0x1f0)][_0x5e76d5(0x16d)],_0x2d02e6[_0x5e76d5(0x1f0)][_0x5e76d5(0x16d)]=function(){}),_0x459a70&&typeof _0x459a70[_0x5e76d5(0x1ce)]==_0x5e76d5(0x1ae)&&(_0x339e9f[_0x5e76d5(0x1ce)]=_0x459a70['length']);}catch{}finally{_0x1924c3&&(_0x2d02e6[_0x5e76d5(0x1f0)]['error']=_0x1924c3);}if(_0x339e9f[_0x5e76d5(0x202)]===_0x5e76d5(0x1ae)||_0x339e9f['type']===_0x5e76d5(0x1f2)){if(isNaN(_0x339e9f['value']))_0x339e9f[_0x5e76d5(0x217)]=!0x0,delete _0x339e9f[_0x5e76d5(0x1f3)];else switch(_0x339e9f[_0x5e76d5(0x1f3)]){case Number[_0x5e76d5(0x20c)]:_0x339e9f[_0x5e76d5(0x209)]=!0x0,delete _0x339e9f[_0x5e76d5(0x1f3)];break;case Number[_0x5e76d5(0x245)]:_0x339e9f['negativeInfinity']=!0x0,delete _0x339e9f[_0x5e76d5(0x1f3)];break;case 0x0:this[_0x5e76d5(0x1cf)](_0x339e9f[_0x5e76d5(0x1f3)])&&(_0x339e9f[_0x5e76d5(0x1f4)]=!0x0);break;}}else _0x339e9f['type']===_0x5e76d5(0x177)&&typeof _0x459a70[_0x5e76d5(0x208)]==_0x5e76d5(0x1c4)&&_0x459a70[_0x5e76d5(0x208)]&&_0x339e9f[_0x5e76d5(0x208)]&&_0x459a70[_0x5e76d5(0x208)]!==_0x339e9f[_0x5e76d5(0x208)]&&(_0x339e9f[_0x5e76d5(0x1a9)]=_0x459a70[_0x5e76d5(0x208)]);}[_0x1c22b8(0x1cf)](_0xf76722){return 0x1/_0xf76722===Number['NEGATIVE_INFINITY'];}[_0x1c22b8(0x234)](_0x29084b){var _0x507367=_0x1c22b8;!_0x29084b['props']||!_0x29084b[_0x507367(0x221)][_0x507367(0x1ce)]||_0x29084b[_0x507367(0x202)]===_0x507367(0x165)||_0x29084b[_0x507367(0x202)]===_0x507367(0x1aa)||_0x29084b[_0x507367(0x202)]==='Set'||_0x29084b[_0x507367(0x221)][_0x507367(0x22b)](function(_0x1414ab,_0x5511c7){var _0x555151=_0x507367,_0x1a1117=_0x1414ab[_0x555151(0x208)][_0x555151(0x237)](),_0x5b7583=_0x5511c7[_0x555151(0x208)][_0x555151(0x237)]();return _0x1a1117<_0x5b7583?-0x1:_0x1a1117>_0x5b7583?0x1:0x0;});}['_addFunctionsNode'](_0x40aa8e,_0x51cdc8){var _0x35abcd=_0x1c22b8;if(!(_0x51cdc8[_0x35abcd(0x22e)]||!_0x40aa8e['props']||!_0x40aa8e[_0x35abcd(0x221)]['length'])){for(var _0x3daf4c=[],_0x392ae9=[],_0x2a9497=0x0,_0x5dfe90=_0x40aa8e['props'][_0x35abcd(0x1ce)];_0x2a9497<_0x5dfe90;_0x2a9497++){var _0x1cb8ea=_0x40aa8e[_0x35abcd(0x221)][_0x2a9497];_0x1cb8ea['type']===_0x35abcd(0x177)?_0x3daf4c[_0x35abcd(0x1bf)](_0x1cb8ea):_0x392ae9[_0x35abcd(0x1bf)](_0x1cb8ea);}if(!(!_0x392ae9[_0x35abcd(0x1ce)]||_0x3daf4c['length']<=0x1)){_0x40aa8e[_0x35abcd(0x221)]=_0x392ae9;var _0x37d771={'functionsNode':!0x0,'props':_0x3daf4c};this['_setNodeId'](_0x37d771,_0x51cdc8),this[_0x35abcd(0x246)](_0x37d771,_0x51cdc8),this[_0x35abcd(0x1c5)](_0x37d771),this[_0x35abcd(0x207)](_0x37d771,_0x51cdc8),_0x37d771['id']+='\\x20f',_0x40aa8e[_0x35abcd(0x221)][_0x35abcd(0x1f1)](_0x37d771);}}}['_addLoadNode'](_0x4f94f9,_0x3a8b57){}[_0x1c22b8(0x1c5)](_0x1916b2){}[_0x1c22b8(0x1b2)](_0x3deed2){var _0x1f0d81=_0x1c22b8;return Array[_0x1f0d81(0x19c)](_0x3deed2)||typeof _0x3deed2==_0x1f0d81(0x190)&&this['_objectToString'](_0x3deed2)===_0x1f0d81(0x1a8);}['_setNodePermissions'](_0x247473,_0x424c62){}['_cleanNode'](_0x395e0c){var _0x53383d=_0x1c22b8;delete _0x395e0c[_0x53383d(0x1cb)],delete _0x395e0c['_hasSetOnItsPath'],delete _0x395e0c[_0x53383d(0x164)];}[_0x1c22b8(0x1cd)](_0x5b3be9,_0x20f926){}}let _0x4d33ec=new _0x3c254e(),_0x1cd97c={'props':0x64,'elements':0x64,'strLength':0x400*0x32,'totalStrLength':0x400*0x32,'autoExpandLimit':0x1388,'autoExpandMaxDepth':0xa},_0x1a7893={'props':0x5,'elements':0x5,'strLength':0x100,'totalStrLength':0x100*0x3,'autoExpandLimit':0x1e,'autoExpandMaxDepth':0x2};function _0x8d6058(_0x3d884e,_0x3a50dc,_0x3a1086,_0x3c5749,_0x20ddc6,_0x26f0f5){var _0x1e28b8=_0x1c22b8;let _0x3f8a55,_0x3668bf;try{_0x3668bf=_0x1b05b2(),_0x3f8a55=_0xe3ec79[_0x3a50dc],!_0x3f8a55||_0x3668bf-_0x3f8a55['ts']>0x1f4&&_0x3f8a55['count']&&_0x3f8a55['time']/_0x3f8a55['count']<0x64?(_0xe3ec79[_0x3a50dc]=_0x3f8a55={'count':0x0,'time':0x0,'ts':_0x3668bf},_0xe3ec79[_0x1e28b8(0x1c2)]={}):_0x3668bf-_0xe3ec79[_0x1e28b8(0x1c2)]['ts']>0x32&&_0xe3ec79['hits']['count']&&_0xe3ec79[_0x1e28b8(0x1c2)][_0x1e28b8(0x203)]/_0xe3ec79[_0x1e28b8(0x1c2)][_0x1e28b8(0x23c)]<0x64&&(_0xe3ec79['hits']={});let _0x219271=[],_0x33899c=_0x3f8a55['reduceLimits']||_0xe3ec79[_0x1e28b8(0x1c2)]['reduceLimits']?_0x1a7893:_0x1cd97c,_0x4b74f4=_0x4e3639=>{var _0x3c3238=_0x1e28b8;let _0x426b6e={};return _0x426b6e[_0x3c3238(0x221)]=_0x4e3639[_0x3c3238(0x221)],_0x426b6e[_0x3c3238(0x178)]=_0x4e3639[_0x3c3238(0x178)],_0x426b6e[_0x3c3238(0x24e)]=_0x4e3639[_0x3c3238(0x24e)],_0x426b6e[_0x3c3238(0x161)]=_0x4e3639[_0x3c3238(0x161)],_0x426b6e[_0x3c3238(0x1d7)]=_0x4e3639['autoExpandLimit'],_0x426b6e[_0x3c3238(0x1e2)]=_0x4e3639['autoExpandMaxDepth'],_0x426b6e[_0x3c3238(0x1b4)]=!0x1,_0x426b6e['noFunctions']=!_0x3ac908,_0x426b6e[_0x3c3238(0x1b8)]=0x1,_0x426b6e[_0x3c3238(0x1ec)]=0x0,_0x426b6e[_0x3c3238(0x191)]='root_exp_id',_0x426b6e[_0x3c3238(0x212)]='root_exp',_0x426b6e[_0x3c3238(0x174)]=!0x0,_0x426b6e[_0x3c3238(0x250)]=[],_0x426b6e['autoExpandPropertyCount']=0x0,_0x426b6e[_0x3c3238(0x22c)]=!0x0,_0x426b6e[_0x3c3238(0x1f6)]=0x0,_0x426b6e['node']={'current':void 0x0,'parent':void 0x0,'index':0x0},_0x426b6e;};for(var _0xbd3a60=0x0;_0xbd3a60<_0x20ddc6[_0x1e28b8(0x1ce)];_0xbd3a60++)_0x219271['push'](_0x4d33ec[_0x1e28b8(0x1ca)]({'timeNode':_0x3d884e===_0x1e28b8(0x203)||void 0x0},_0x20ddc6[_0xbd3a60],_0x4b74f4(_0x33899c),{}));if(_0x3d884e===_0x1e28b8(0x170)){let _0x3fde84=Error[_0x1e28b8(0x1b7)];try{Error[_0x1e28b8(0x1b7)]=0x1/0x0,_0x219271[_0x1e28b8(0x1bf)](_0x4d33ec[_0x1e28b8(0x1ca)]({'stackNode':!0x0},new Error()[_0x1e28b8(0x1bd)],_0x4b74f4(_0x33899c),{'strLength':0x1/0x0}));}finally{Error[_0x1e28b8(0x1b7)]=_0x3fde84;}}return{'method':_0x1e28b8(0x1a7),'version':_0xc6c657,'args':[{'ts':_0x3a1086,'session':_0x3c5749,'args':_0x219271,'id':_0x3a50dc,'context':_0x26f0f5}]};}catch(_0x502fb2){return{'method':_0x1e28b8(0x1a7),'version':_0xc6c657,'args':[{'ts':_0x3a1086,'session':_0x3c5749,'args':[{'type':_0x1e28b8(0x19d),'error':_0x502fb2&&_0x502fb2[_0x1e28b8(0x181)]}],'id':_0x3a50dc,'context':_0x26f0f5}]};}finally{try{if(_0x3f8a55&&_0x3668bf){let _0x113db4=_0x1b05b2();_0x3f8a55[_0x1e28b8(0x23c)]++,_0x3f8a55['time']+=_0xeea918(_0x3668bf,_0x113db4),_0x3f8a55['ts']=_0x113db4,_0xe3ec79[_0x1e28b8(0x1c2)][_0x1e28b8(0x23c)]++,_0xe3ec79[_0x1e28b8(0x1c2)]['time']+=_0xeea918(_0x3668bf,_0x113db4),_0xe3ec79[_0x1e28b8(0x1c2)]['ts']=_0x113db4,(_0x3f8a55['count']>0x32||_0x3f8a55[_0x1e28b8(0x203)]>0x64)&&(_0x3f8a55[_0x1e28b8(0x1ed)]=!0x0),(_0xe3ec79[_0x1e28b8(0x1c2)][_0x1e28b8(0x23c)]>0x3e8||_0xe3ec79[_0x1e28b8(0x1c2)]['time']>0x12c)&&(_0xe3ec79[_0x1e28b8(0x1c2)][_0x1e28b8(0x1ed)]=!0x0);}}catch{}}}return _0x8d6058;}function _0x341f(_0x200ec3,_0x1032ab){var _0x4b6626=_0x4b66();return _0x341f=function(_0x341ff9,_0x29670b){_0x341ff9=_0x341ff9-0x160;var _0x4a1dc5=_0x4b6626[_0x341ff9];return _0x4a1dc5;},_0x341f(_0x200ec3,_0x1032ab);}((_0x56c8d4,_0x172cd2,_0x16d12a,_0x4a1a8b,_0x16f8ae,_0x4e7e12,_0x44f374,_0x5e2b98,_0x558bd2,_0x5a80fb)=>{var _0x42bd1f=_0x12c47f;if(_0x56c8d4['_console_ninja'])return _0x56c8d4['_console_ninja'];if(!J(_0x56c8d4,_0x5e2b98,_0x16f8ae))return _0x56c8d4[_0x42bd1f(0x1c9)]={'consoleLog':()=>{},'consoleTrace':()=>{},'consoleTime':()=>{},'consoleTimeEnd':()=>{},'autoLog':()=>{},'autoLogMany':()=>{},'autoTraceMany':()=>{},'coverage':()=>{},'autoTrace':()=>{},'autoTime':()=>{},'autoTimeEnd':()=>{}},_0x56c8d4[_0x42bd1f(0x1c9)];let _0x4fb100=W(_0x56c8d4),_0x43fff8=_0x4fb100[_0x42bd1f(0x18d)],_0x3cf443=_0x4fb100['timeStamp'],_0x5d236b=_0x4fb100['now'],_0x1f5fa9={'hits':{},'ts':{}},_0xbb7825=Y(_0x56c8d4,_0x558bd2,_0x1f5fa9,_0x4e7e12),_0x290a80=_0x1887ec=>{_0x1f5fa9['ts'][_0x1887ec]=_0x3cf443();},_0x5d480c=(_0x10ee54,_0x413758)=>{let _0x5ebc81=_0x1f5fa9['ts'][_0x413758];if(delete _0x1f5fa9['ts'][_0x413758],_0x5ebc81){let _0x3eaf89=_0x43fff8(_0x5ebc81,_0x3cf443());_0x320312(_0xbb7825('time',_0x10ee54,_0x5d236b(),_0x3bfac5,[_0x3eaf89],_0x413758));}},_0x4984cb=_0x123b27=>_0x456b20=>{var _0x413109=_0x42bd1f;try{_0x290a80(_0x456b20),_0x123b27(_0x456b20);}finally{_0x56c8d4[_0x413109(0x1f0)][_0x413109(0x203)]=_0x123b27;}},_0x2893ac=_0x32925d=>_0x5f4ca0=>{var _0x432a68=_0x42bd1f;try{let [_0x56ac7e,_0x57dd54]=_0x5f4ca0[_0x432a68(0x1a3)](_0x432a68(0x23b));_0x5d480c(_0x57dd54,_0x56ac7e),_0x32925d(_0x56ac7e);}finally{_0x56c8d4[_0x432a68(0x1f0)][_0x432a68(0x167)]=_0x32925d;}};_0x56c8d4[_0x42bd1f(0x1c9)]={'consoleLog':(_0x1777d9,_0x454cb4)=>{var _0x51ccf2=_0x42bd1f;_0x56c8d4['console'][_0x51ccf2(0x1a7)]['name']!==_0x51ccf2(0x17b)&&_0x320312(_0xbb7825(_0x51ccf2(0x1a7),_0x1777d9,_0x5d236b(),_0x3bfac5,_0x454cb4));},'consoleTrace':(_0x4cc588,_0x443f2b)=>{var _0x41c41e=_0x42bd1f;_0x56c8d4[_0x41c41e(0x1f0)]['log']['name']!==_0x41c41e(0x18b)&&_0x320312(_0xbb7825('trace',_0x4cc588,_0x5d236b(),_0x3bfac5,_0x443f2b));},'consoleTime':()=>{var _0x614515=_0x42bd1f;_0x56c8d4[_0x614515(0x1f0)][_0x614515(0x203)]=_0x4984cb(_0x56c8d4[_0x614515(0x1f0)][_0x614515(0x203)]);},'consoleTimeEnd':()=>{var _0x3a9c01=_0x42bd1f;_0x56c8d4[_0x3a9c01(0x1f0)][_0x3a9c01(0x167)]=_0x2893ac(_0x56c8d4[_0x3a9c01(0x1f0)][_0x3a9c01(0x167)]);},'autoLog':(_0x262c42,_0x47d477)=>{var _0x36fd67=_0x42bd1f;_0x320312(_0xbb7825(_0x36fd67(0x1a7),_0x47d477,_0x5d236b(),_0x3bfac5,[_0x262c42]));},'autoLogMany':(_0x1e4f71,_0x45e380)=>{_0x320312(_0xbb7825('log',_0x1e4f71,_0x5d236b(),_0x3bfac5,_0x45e380));},'autoTrace':(_0x3fbde2,_0x4f0e09)=>{var _0x467540=_0x42bd1f;_0x320312(_0xbb7825(_0x467540(0x170),_0x4f0e09,_0x5d236b(),_0x3bfac5,[_0x3fbde2]));},'autoTraceMany':(_0x507517,_0x537fb1)=>{_0x320312(_0xbb7825('trace',_0x507517,_0x5d236b(),_0x3bfac5,_0x537fb1));},'autoTime':(_0x18af83,_0x1d6b10,_0x3d7b3a)=>{_0x290a80(_0x3d7b3a);},'autoTimeEnd':(_0x188597,_0xada254,_0x4e4680)=>{_0x5d480c(_0xada254,_0x4e4680);},'coverage':_0x51a9a2=>{_0x320312({'method':'coverage','version':_0x4e7e12,'args':[{'id':_0x51a9a2}]});}};let _0x320312=b(_0x56c8d4,_0x172cd2,_0x16d12a,_0x4a1a8b,_0x16f8ae,_0x5a80fb),_0x3bfac5=_0x56c8d4[_0x42bd1f(0x1c3)];return _0x56c8d4[_0x42bd1f(0x1c9)];})(globalThis,_0x12c47f(0x20e),_0x12c47f(0x21e),_0x12c47f(0x195),_0x12c47f(0x1e1),_0x12c47f(0x19a),_0x12c47f(0x1ad),_0x12c47f(0x204),_0x12c47f(0x1f8),_0x12c47f(0x1be));");
}
catch (e) { } }
;
function oo_oo(i, ...v) { try {
    oo_cm().consoleLog(i, v);
}
catch (e) { } return v; }
;
oo_oo;
function oo_tr(i, ...v) { try {
    oo_cm().consoleTrace(i, v);
}
catch (e) { } return v; }
;
oo_tr;
function oo_ts() { try {
    oo_cm().consoleTime();
}
catch (e) { } }
;
oo_ts;
function oo_te() { try {
    oo_cm().consoleTimeEnd();
}
catch (e) { } }
;
oo_te;
//# sourceMappingURL=devices.service.js.map