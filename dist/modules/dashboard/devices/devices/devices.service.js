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
const gas_adapter_1 = require("./classes/gas.adapter");
const datalogger_utils_1 = require("./classes/datalogger.utils");
const sequelize_1 = require("sequelize");
const choosenSerialnumbers = (serialNumber) => {
    return [
        serialNumber === '32303045',
        serialNumber === '02220030',
        serialNumber === '02220054',
        serialNumber === '02220036',
        serialNumber === '02220037',
        serialNumber === '02220046',
        serialNumber === '02220026',
        serialNumber === '02220025',
        serialNumber === '02220042',
        serialNumber === '02220039',
        serialNumber === '02220069',
        serialNumber === '02220033',
        serialNumber === '02220048',
        serialNumber === '33313045',
        serialNumber === '02220035',
    ];
};
let DevicesService = class DevicesService {
    constructor(jwtService, pushNotificationService, logger, deviceRepository, apnRepository, waterHistoryRepository, waterSettingsRepository, gasHistoryRepository, gasSettingsRepository, dataloggerHistoryRepository, dataloggerSettingsRepository, naturalGasHistoryRepository) {
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
                if (loginData.serialNumber == null || loginData.serialNumber == undefined) {
                    console.log("serialNumber es null o undefined");
                }
                if (loginData.imei == null || loginData.imei == undefined) {
                    console.log("imei es null o undefined");
                }
                if (loginData.serialNumber && loginData.serialNumber.length != 8) {
                    console.log(loginData.serialNumber);
                    console.log(loginData.serialNumber.length);
                    console.log("La longitud de serialNumber no es 8");
                }
                if (loginData.imei && loginData.imei.length != 15) {
                    console.log(loginData.imei);
                    console.log(loginData.imei.length);
                    console.log("La longitud de imei no es 15");
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
    async saveGasMeasures(body) {
        try {
            const history = new gas_adapter_1.GasHistoryAdapter(body);
            if (history.check()) {
                this.logger.error('D->[692] datos proporcionados son invalidos (BODY)');
                return new deviceMessage_class_1.DeviceMessage(692, '');
            }
            if (history.checkDatetime()) {
                this.logger.error('D->[695] fecha proporcionada por el dispositivo es inválida');
                return new deviceMessage_class_1.DeviceMessage(695, '');
            }
            const payload = this.jwtService.decode(history.token);
            const device = await this.validateDeviceByJwt(payload);
            const instance = await this.naturalGasHistoryRepository.create({
                idDevice: device.idDevice,
                consumption: history.consumption,
                dateTime: utilities_1.createDateAsUTC(history.datetime),
            });
            return new deviceMessage_class_1.DeviceMessage(615, '');
        }
        catch (error) {
            this.logger.error(error);
            return error.response.statusCode == 401 ? new deviceMessage_class_1.DeviceMessage(401, '') : new deviceMessage_class_1.DeviceMessage(690, '');
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
                let timeFix = settings.repeatNotificationTime.split(":");
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
                console.log(dataloggerRegisters.length);
                let reverseString = (str) => {
                    if (str === "")
                        return "";
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
                        binAlerts = "0" + binAlerts;
                    }
                    alerts.push(reverseString(binAlerts));
                    console.log(reverseString(binAlerts));
                }
                alerts.pop();
                let binOriginalAlerts = dataloggerHistory.alerts.toString(2);
                while (binOriginalAlerts.length < 16) {
                    binOriginalAlerts = "0" + binOriginalAlerts;
                }
                let fixedOrigianlAlerts = reverseString(binOriginalAlerts);
                let newAlerts = [];
                for (let idx = 0; idx < dataloggerHistory.ALERTS_LEN; idx++) {
                    if (((dataloggerHistory.alerts >>> idx) & ALERT_MASK)) {
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
                            let indexAlert = newAlerts.findIndex((newAlert) => {
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
        return (settings.closingHour + ',' +
            this.fixLenWithZero(Number(settings.consumptionUnits), 4) + ',' +
            this.fixLenWithZero(settings.minsBetweenMeasurements, 4) + ',' +
            this.fixLenWithZero(Number(settings.consumptionPeriod), 3) + ',' +
            this.fixLenWithZero(settings.minFillingPercentage, 2) + ',' +
            this.fixLenWithZero(settings.interval, 2) + ',' +
            (settings.travelMode ? '1' : '0') + ',' +
            this.fixLenWithZero(settings.offset, 3) + ',' +
            settings.offsetTime + ',' +
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
        let settingsCmd = new waterSettings_dto_1.WaterSettingsDto(settings, apn);
        let commands = settingsCmd.getCommands();
        let stream = '';
        for (let [pos, cmd] of commands.entries()) {
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
        console.log(`Alert value: ${alerts}, Binary: ${binaryString}`);
        console.log(`Drip Alert: ${(alerts >>> 0) & 0x01}`);
        console.log(`Empty Alert: ${(alerts >>> 1) & 0x01}`);
        console.log(`Inverted Flow Alert: ${(alerts >>> 2) & 0x01}`);
        console.log(`Leak Alert: ${(alerts >>> 3) & 0x01}`);
        console.log(`Bubble Alert: ${(alerts >>> 4) & 0x01}`);
        console.log(`Manipulation Alert: ${(alerts >>> 5) & 0x01}`);
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
    __metadata("design:paramtypes", [jwt_1.JwtService,
        push_notifications_service_1.PushNotificationsService, Object, Object, Object, Object, Object, Object, Object, Object, Object, Object])
], DevicesService);
exports.DevicesService = DevicesService;
//# sourceMappingURL=devices.service.js.map