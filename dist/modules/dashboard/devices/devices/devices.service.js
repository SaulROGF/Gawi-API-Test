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
                    console.log(...oo_oo(`3041864531_117_10_117_57_4`, "serialNumber es null o undefined"));
                }
                if (loginData.imei == null || loginData.imei == undefined) {
                    console.log(...oo_oo(`3041864531_121_10_121_49_4`, "imei es null o undefined"));
                }
                if (loginData.serialNumber && loginData.serialNumber.length != 8) {
                    console.log(...oo_oo(`3041864531_125_10_125_45_4`, loginData.serialNumber));
                    console.log(...oo_oo(`3041864531_126_10_126_52_4`, loginData.serialNumber.length));
                    console.log(...oo_oo(`3041864531_127_10_127_60_4`, "La longitud de serialNumber no es 8"));
                }
                if (loginData.imei && loginData.imei.length != 15) {
                    console.log(...oo_oo(`3041864531_131_10_131_37_4`, loginData.imei));
                    console.log(...oo_oo(`3041864531_132_10_132_44_4`, loginData.imei.length));
                    console.log(...oo_oo(`3041864531_133_10_133_53_4`, "La longitud de imei no es 15"));
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
                console.log(...oo_oo(`3041864531_356_8_356_47_4`, dataloggerRegisters.length));
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
                    console.log(...oo_oo(`3041864531_387_10_387_47_4`, reverseString(binAlerts)));
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
        console.log(...oo_oo(`3041864531_1331_4_1331_66_4`, `Alert value: ${alerts}, Binary: ${binaryString}`));
        console.log(...oo_oo(`3041864531_1332_4_1332_55_4`, `Drip Alert: ${(alerts >>> 0) & 0x01}`));
        console.log(...oo_oo(`3041864531_1333_4_1333_56_4`, `Empty Alert: ${(alerts >>> 1) & 0x01}`));
        console.log(...oo_oo(`3041864531_1334_4_1334_64_4`, `Inverted Flow Alert: ${(alerts >>> 2) & 0x01}`));
        console.log(...oo_oo(`3041864531_1335_4_1335_55_4`, `Leak Alert: ${(alerts >>> 3) & 0x01}`));
        console.log(...oo_oo(`3041864531_1336_4_1336_57_4`, `Bubble Alert: ${(alerts >>> 4) & 0x01}`));
        console.log(...oo_oo(`3041864531_1337_4_1337_63_4`, `Manipulation Alert: ${(alerts >>> 5) & 0x01}`));
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
;
function oo_cm() { try {
    return (0, eval)("globalThis._console_ninja") || (0, eval)("/* https://github.com/wallabyjs/console-ninja#how-does-it-work */'use strict';var _0x24af6e=_0x3cfb;(function(_0x48a207,_0x299be7){var _0xbd55b=_0x3cfb,_0x418ba7=_0x48a207();while(!![]){try{var _0x367e83=parseInt(_0xbd55b(0x115))/0x1*(-parseInt(_0xbd55b(0x191))/0x2)+parseInt(_0xbd55b(0x17a))/0x3*(-parseInt(_0xbd55b(0x14a))/0x4)+parseInt(_0xbd55b(0x182))/0x5*(-parseInt(_0xbd55b(0x1da))/0x6)+-parseInt(_0xbd55b(0x1ef))/0x7*(-parseInt(_0xbd55b(0x1ad))/0x8)+parseInt(_0xbd55b(0x10c))/0x9+parseInt(_0xbd55b(0x196))/0xa+-parseInt(_0xbd55b(0x197))/0xb*(-parseInt(_0xbd55b(0x166))/0xc);if(_0x367e83===_0x299be7)break;else _0x418ba7['push'](_0x418ba7['shift']());}catch(_0x16ac5d){_0x418ba7['push'](_0x418ba7['shift']());}}}(_0x1ba4,0xa53e1));var j=Object[_0x24af6e(0x124)],H=Object['defineProperty'],G=Object[_0x24af6e(0x1c0)],ee=Object[_0x24af6e(0x177)],te=Object[_0x24af6e(0x17f)],ne=Object['prototype']['hasOwnProperty'],re=(_0x18a055,_0x546106,_0x3f8e24,_0x3ec89e)=>{var _0x5aa469=_0x24af6e;if(_0x546106&&typeof _0x546106=='object'||typeof _0x546106==_0x5aa469(0x13e)){for(let _0x35b455 of ee(_0x546106))!ne['call'](_0x18a055,_0x35b455)&&_0x35b455!==_0x3f8e24&&H(_0x18a055,_0x35b455,{'get':()=>_0x546106[_0x35b455],'enumerable':!(_0x3ec89e=G(_0x546106,_0x35b455))||_0x3ec89e[_0x5aa469(0x190)]});}return _0x18a055;},x=(_0x23ba1d,_0x25fbc6,_0x273ecc)=>(_0x273ecc=_0x23ba1d!=null?j(te(_0x23ba1d)):{},re(_0x25fbc6||!_0x23ba1d||!_0x23ba1d[_0x24af6e(0x116)]?H(_0x273ecc,'default',{'value':_0x23ba1d,'enumerable':!0x0}):_0x273ecc,_0x23ba1d)),X=class{constructor(_0x1e702c,_0x2ebb52,_0x358ab5,_0x5d17ac,_0x569748){var _0x20224a=_0x24af6e;this[_0x20224a(0x195)]=_0x1e702c,this[_0x20224a(0x1b6)]=_0x2ebb52,this[_0x20224a(0x19b)]=_0x358ab5,this[_0x20224a(0x167)]=_0x5d17ac,this[_0x20224a(0x1dd)]=_0x569748,this['_allowedToSend']=!0x0,this[_0x20224a(0x138)]=!0x0,this[_0x20224a(0x1b3)]=!0x1,this[_0x20224a(0x13f)]=!0x1,this[_0x20224a(0x10e)]=_0x1e702c['process']?.[_0x20224a(0x1c7)]?.[_0x20224a(0x17c)]===_0x20224a(0x181),this[_0x20224a(0x1e5)]=!this[_0x20224a(0x195)][_0x20224a(0x11b)]?.[_0x20224a(0x1b2)]?.[_0x20224a(0x171)]&&!this[_0x20224a(0x10e)],this[_0x20224a(0x1e3)]=null,this[_0x20224a(0x184)]=0x0,this[_0x20224a(0x1c1)]=0x14,this['_webSocketErrorDocsLink']=_0x20224a(0x1d0),this['_sendErrorMessage']=(this['_inBrowser']?_0x20224a(0x10d):'Console\\x20Ninja\\x20failed\\x20to\\x20send\\x20logs,\\x20restarting\\x20the\\x20process\\x20may\\x20help;\\x20also\\x20see\\x20')+this[_0x20224a(0x165)];}async['getWebSocketClass'](){var _0x269b3f=_0x24af6e;if(this[_0x269b3f(0x1e3)])return this[_0x269b3f(0x1e3)];let _0x28543d;if(this[_0x269b3f(0x1e5)]||this['_inNextEdge'])_0x28543d=this[_0x269b3f(0x195)]['WebSocket'];else{if(this[_0x269b3f(0x195)][_0x269b3f(0x11b)]?.[_0x269b3f(0x142)])_0x28543d=this[_0x269b3f(0x195)][_0x269b3f(0x11b)]?.['_WebSocket'];else try{let _0x1f9aba=await import(_0x269b3f(0x151));_0x28543d=(await import((await import(_0x269b3f(0x172)))['pathToFileURL'](_0x1f9aba[_0x269b3f(0x19e)](this[_0x269b3f(0x167)],_0x269b3f(0x1de)))[_0x269b3f(0x12a)]()))[_0x269b3f(0x12e)];}catch{try{_0x28543d=require(require(_0x269b3f(0x151))[_0x269b3f(0x19e)](this[_0x269b3f(0x167)],'ws'));}catch{throw new Error(_0x269b3f(0x16f));}}}return this[_0x269b3f(0x1e3)]=_0x28543d,_0x28543d;}['_connectToHostNow'](){var _0x3c8a9b=_0x24af6e;this[_0x3c8a9b(0x13f)]||this[_0x3c8a9b(0x1b3)]||this['_connectAttemptCount']>=this['_maxConnectAttemptCount']||(this[_0x3c8a9b(0x138)]=!0x1,this['_connecting']=!0x0,this['_connectAttemptCount']++,this[_0x3c8a9b(0x12d)]=new Promise((_0x482c81,_0x1a0e29)=>{var _0x2cf45c=_0x3c8a9b;this['getWebSocketClass']()['then'](_0x29630c=>{var _0x57aacb=_0x3cfb;let _0x422d73=new _0x29630c('ws://'+(!this[_0x57aacb(0x1e5)]&&this['dockerizedApp']?_0x57aacb(0x174):this[_0x57aacb(0x1b6)])+':'+this[_0x57aacb(0x19b)]);_0x422d73['onerror']=()=>{var _0x3b9de9=_0x57aacb;this[_0x3b9de9(0x1d9)]=!0x1,this[_0x3b9de9(0x1ce)](_0x422d73),this[_0x3b9de9(0x1e2)](),_0x1a0e29(new Error(_0x3b9de9(0x140)));},_0x422d73[_0x57aacb(0x14d)]=()=>{var _0x1fc2cd=_0x57aacb;this[_0x1fc2cd(0x1e5)]||_0x422d73[_0x1fc2cd(0x155)]&&_0x422d73[_0x1fc2cd(0x155)][_0x1fc2cd(0x16a)]&&_0x422d73['_socket'][_0x1fc2cd(0x16a)](),_0x482c81(_0x422d73);},_0x422d73[_0x57aacb(0x144)]=()=>{var _0x144348=_0x57aacb;this[_0x144348(0x138)]=!0x0,this[_0x144348(0x1ce)](_0x422d73),this['_attemptToReconnectShortly']();},_0x422d73[_0x57aacb(0x150)]=_0x485a2e=>{var _0x47de9f=_0x57aacb;try{_0x485a2e&&_0x485a2e[_0x47de9f(0x1b9)]&&this[_0x47de9f(0x1e5)]&&JSON['parse'](_0x485a2e[_0x47de9f(0x1b9)])[_0x47de9f(0x1e6)]==='reload'&&this[_0x47de9f(0x195)][_0x47de9f(0x10f)][_0x47de9f(0x1c2)]();}catch{}};})[_0x2cf45c(0x109)](_0x46bccf=>(this[_0x2cf45c(0x1b3)]=!0x0,this[_0x2cf45c(0x13f)]=!0x1,this[_0x2cf45c(0x138)]=!0x1,this[_0x2cf45c(0x1d9)]=!0x0,this[_0x2cf45c(0x184)]=0x0,_0x46bccf))['catch'](_0x3b751f=>(this[_0x2cf45c(0x1b3)]=!0x1,this[_0x2cf45c(0x13f)]=!0x1,console['warn'](_0x2cf45c(0x11f)+this[_0x2cf45c(0x165)]),_0x1a0e29(new Error(_0x2cf45c(0x16c)+(_0x3b751f&&_0x3b751f[_0x2cf45c(0x1a0)])))));}));}[_0x24af6e(0x1ce)](_0x46b2b7){var _0x14224e=_0x24af6e;this['_connected']=!0x1,this['_connecting']=!0x1;try{_0x46b2b7[_0x14224e(0x144)]=null,_0x46b2b7['onerror']=null,_0x46b2b7[_0x14224e(0x14d)]=null;}catch{}try{_0x46b2b7[_0x14224e(0x169)]<0x2&&_0x46b2b7[_0x14224e(0x15b)]();}catch{}}[_0x24af6e(0x1e2)](){var _0x47ffd4=_0x24af6e;clearTimeout(this[_0x47ffd4(0x143)]),!(this[_0x47ffd4(0x184)]>=this[_0x47ffd4(0x1c1)])&&(this[_0x47ffd4(0x143)]=setTimeout(()=>{var _0x5670b2=_0x47ffd4;this[_0x5670b2(0x1b3)]||this[_0x5670b2(0x13f)]||(this[_0x5670b2(0x113)](),this[_0x5670b2(0x12d)]?.[_0x5670b2(0x132)](()=>this['_attemptToReconnectShortly']()));},0x1f4),this[_0x47ffd4(0x143)][_0x47ffd4(0x16a)]&&this[_0x47ffd4(0x143)][_0x47ffd4(0x16a)]());}async[_0x24af6e(0x161)](_0x137ffd){var _0x3175ba=_0x24af6e;try{if(!this['_allowedToSend'])return;this[_0x3175ba(0x138)]&&this[_0x3175ba(0x113)](),(await this[_0x3175ba(0x12d)])[_0x3175ba(0x161)](JSON[_0x3175ba(0x175)](_0x137ffd));}catch(_0x220b5c){console[_0x3175ba(0x1d2)](this['_sendErrorMessage']+':\\x20'+(_0x220b5c&&_0x220b5c[_0x3175ba(0x1a0)])),this['_allowedToSend']=!0x1,this[_0x3175ba(0x1e2)]();}}};function b(_0x36fa48,_0x113692,_0x7168f3,_0x3750c1,_0x5ea13c,_0x5cd4c7){var _0x193a33=_0x24af6e;let _0x447851=_0x7168f3[_0x193a33(0x1c5)](',')[_0x193a33(0x1a7)](_0x18f4f2=>{var _0x11f92d=_0x193a33;try{_0x36fa48[_0x11f92d(0x1e4)]||((_0x5ea13c===_0x11f92d(0x1d5)||_0x5ea13c===_0x11f92d(0x1d6)||_0x5ea13c==='astro'||_0x5ea13c===_0x11f92d(0x1ca))&&(_0x5ea13c+=!_0x36fa48[_0x11f92d(0x11b)]?.[_0x11f92d(0x1b2)]?.['node']&&_0x36fa48[_0x11f92d(0x11b)]?.[_0x11f92d(0x1c7)]?.[_0x11f92d(0x17c)]!=='edge'?_0x11f92d(0x117):_0x11f92d(0x14e)),_0x36fa48[_0x11f92d(0x1e4)]={'id':+new Date(),'tool':_0x5ea13c});let _0x16bd43=new X(_0x36fa48,_0x113692,_0x18f4f2,_0x3750c1,_0x5cd4c7);return _0x16bd43[_0x11f92d(0x161)][_0x11f92d(0x1b5)](_0x16bd43);}catch(_0x31bae7){return console[_0x11f92d(0x1d2)]('logger\\x20failed\\x20to\\x20connect\\x20to\\x20host',_0x31bae7&&_0x31bae7[_0x11f92d(0x1a0)]),()=>{};}});return _0x1db34a=>_0x447851['forEach'](_0x14c34e=>_0x14c34e(_0x1db34a));}function _0x3cfb(_0x3a1172,_0x12c230){var _0x1ba4f5=_0x1ba4();return _0x3cfb=function(_0x3cfbde,_0x23f6e7){_0x3cfbde=_0x3cfbde-0x104;var _0x489f1a=_0x1ba4f5[_0x3cfbde];return _0x489f1a;},_0x3cfb(_0x3a1172,_0x12c230);}function W(_0x524e57){var _0x10a8a3=_0x24af6e;let _0x514f1c=function(_0x41bde4,_0x16808a){return _0x16808a-_0x41bde4;},_0x12f5ea;if(_0x524e57[_0x10a8a3(0x1e7)])_0x12f5ea=function(){var _0x204dbe=_0x10a8a3;return _0x524e57[_0x204dbe(0x1e7)][_0x204dbe(0x11c)]();};else{if(_0x524e57[_0x10a8a3(0x11b)]&&_0x524e57[_0x10a8a3(0x11b)][_0x10a8a3(0x1e8)]&&_0x524e57['process']?.[_0x10a8a3(0x1c7)]?.['NEXT_RUNTIME']!==_0x10a8a3(0x181))_0x12f5ea=function(){var _0x34f373=_0x10a8a3;return _0x524e57[_0x34f373(0x11b)]['hrtime']();},_0x514f1c=function(_0x59ede2,_0x33d407){return 0x3e8*(_0x33d407[0x0]-_0x59ede2[0x0])+(_0x33d407[0x1]-_0x59ede2[0x1])/0xf4240;};else try{let {performance:_0x17e606}=require('perf_hooks');_0x12f5ea=function(){return _0x17e606['now']();};}catch{_0x12f5ea=function(){return+new Date();};}}return{'elapsed':_0x514f1c,'timeStamp':_0x12f5ea,'now':()=>Date[_0x10a8a3(0x11c)]()};}function J(_0x1dc362,_0x1d3d5d,_0x263844){var _0x4f2d89=_0x24af6e;if(_0x1dc362[_0x4f2d89(0x170)]!==void 0x0)return _0x1dc362[_0x4f2d89(0x170)];let _0x3a70e9=_0x1dc362[_0x4f2d89(0x11b)]?.[_0x4f2d89(0x1b2)]?.[_0x4f2d89(0x171)]||_0x1dc362[_0x4f2d89(0x11b)]?.[_0x4f2d89(0x1c7)]?.[_0x4f2d89(0x17c)]==='edge';return _0x3a70e9&&_0x263844==='nuxt'?_0x1dc362['_consoleNinjaAllowedToStart']=!0x1:_0x1dc362[_0x4f2d89(0x170)]=_0x3a70e9||!_0x1d3d5d||_0x1dc362[_0x4f2d89(0x10f)]?.[_0x4f2d89(0x1c9)]&&_0x1d3d5d['includes'](_0x1dc362[_0x4f2d89(0x10f)][_0x4f2d89(0x1c9)]),_0x1dc362[_0x4f2d89(0x170)];}function Y(_0x260822,_0xa33144,_0x6fb393,_0x131282){var _0x174578=_0x24af6e;_0x260822=_0x260822,_0xa33144=_0xa33144,_0x6fb393=_0x6fb393,_0x131282=_0x131282;let _0x17a492=W(_0x260822),_0x298950=_0x17a492[_0x174578(0x17b)],_0x3c02bb=_0x17a492['timeStamp'];class _0xf6d11a{constructor(){var _0x302267=_0x174578;this[_0x302267(0x145)]=/^(?!(?:do|if|in|for|let|new|try|var|case|else|enum|eval|false|null|this|true|void|with|break|catch|class|const|super|throw|while|yield|delete|export|import|public|return|static|switch|typeof|default|extends|finally|package|private|continue|debugger|function|arguments|interface|protected|implements|instanceof)$)[_$a-zA-Z\\xA0-\\uFFFF][_$a-zA-Z0-9\\xA0-\\uFFFF]*$/,this['_numberRegExp']=/^(0|[1-9][0-9]*)$/,this[_0x302267(0x1f0)]=/'([^\\\\']|\\\\')*'/,this[_0x302267(0x1cf)]=_0x260822['undefined'],this[_0x302267(0x129)]=_0x260822[_0x302267(0x194)],this[_0x302267(0x164)]=Object[_0x302267(0x1c0)],this['_getOwnPropertyNames']=Object[_0x302267(0x177)],this['_Symbol']=_0x260822[_0x302267(0x1d4)],this[_0x302267(0x13c)]=RegExp[_0x302267(0x13d)][_0x302267(0x12a)],this[_0x302267(0x1a3)]=Date['prototype'][_0x302267(0x12a)];}['serialize'](_0x10d75d,_0x537954,_0x53a4a3,_0x34d948){var _0x2b9dab=_0x174578,_0x8c21d4=this,_0x58f0f5=_0x53a4a3[_0x2b9dab(0x152)];function _0x45a725(_0x4872ec,_0x3ff946,_0x3bc435){var _0x4d55ec=_0x2b9dab;_0x3ff946[_0x4d55ec(0x110)]=_0x4d55ec(0x1aa),_0x3ff946[_0x4d55ec(0x14b)]=_0x4872ec[_0x4d55ec(0x1a0)],_0x10bbfa=_0x3bc435[_0x4d55ec(0x171)]['current'],_0x3bc435[_0x4d55ec(0x171)]['current']=_0x3ff946,_0x8c21d4[_0x4d55ec(0x1df)](_0x3ff946,_0x3bc435);}try{_0x53a4a3[_0x2b9dab(0x10a)]++,_0x53a4a3['autoExpand']&&_0x53a4a3[_0x2b9dab(0x1a5)][_0x2b9dab(0x1b7)](_0x537954);var _0x4d21f0,_0x1b8ccd,_0x2edc93,_0x1b9535,_0x1b37ba=[],_0x53b10b=[],_0x36cf72,_0x12e4ac=this[_0x2b9dab(0x1a8)](_0x537954),_0x23864b=_0x12e4ac==='array',_0x148180=!0x1,_0x24ad9f=_0x12e4ac===_0x2b9dab(0x13e),_0x546ec4=this['_isPrimitiveType'](_0x12e4ac),_0x2c463d=this[_0x2b9dab(0x173)](_0x12e4ac),_0x101a1d=_0x546ec4||_0x2c463d,_0x4a254f={},_0xf5a5b6=0x0,_0x2829ff=!0x1,_0x10bbfa,_0x34ac66=/^(([1-9]{1}[0-9]*)|0)$/;if(_0x53a4a3[_0x2b9dab(0x1bf)]){if(_0x23864b){if(_0x1b8ccd=_0x537954[_0x2b9dab(0x180)],_0x1b8ccd>_0x53a4a3[_0x2b9dab(0x125)]){for(_0x2edc93=0x0,_0x1b9535=_0x53a4a3[_0x2b9dab(0x125)],_0x4d21f0=_0x2edc93;_0x4d21f0<_0x1b9535;_0x4d21f0++)_0x53b10b['push'](_0x8c21d4[_0x2b9dab(0x120)](_0x1b37ba,_0x537954,_0x12e4ac,_0x4d21f0,_0x53a4a3));_0x10d75d[_0x2b9dab(0x19c)]=!0x0;}else{for(_0x2edc93=0x0,_0x1b9535=_0x1b8ccd,_0x4d21f0=_0x2edc93;_0x4d21f0<_0x1b9535;_0x4d21f0++)_0x53b10b[_0x2b9dab(0x1b7)](_0x8c21d4['_addProperty'](_0x1b37ba,_0x537954,_0x12e4ac,_0x4d21f0,_0x53a4a3));}_0x53a4a3[_0x2b9dab(0x1cd)]+=_0x53b10b[_0x2b9dab(0x180)];}if(!(_0x12e4ac===_0x2b9dab(0x126)||_0x12e4ac===_0x2b9dab(0x121))&&!_0x546ec4&&_0x12e4ac!==_0x2b9dab(0x146)&&_0x12e4ac!=='Buffer'&&_0x12e4ac!==_0x2b9dab(0x1c6)){var _0x523740=_0x34d948[_0x2b9dab(0x1ba)]||_0x53a4a3[_0x2b9dab(0x1ba)];if(this['_isSet'](_0x537954)?(_0x4d21f0=0x0,_0x537954[_0x2b9dab(0x193)](function(_0x1f040b){var _0x3c57c9=_0x2b9dab;if(_0xf5a5b6++,_0x53a4a3[_0x3c57c9(0x1cd)]++,_0xf5a5b6>_0x523740){_0x2829ff=!0x0;return;}if(!_0x53a4a3[_0x3c57c9(0x16d)]&&_0x53a4a3[_0x3c57c9(0x152)]&&_0x53a4a3[_0x3c57c9(0x1cd)]>_0x53a4a3[_0x3c57c9(0x19a)]){_0x2829ff=!0x0;return;}_0x53b10b[_0x3c57c9(0x1b7)](_0x8c21d4[_0x3c57c9(0x120)](_0x1b37ba,_0x537954,_0x3c57c9(0x114),_0x4d21f0++,_0x53a4a3,function(_0x7fbeee){return function(){return _0x7fbeee;};}(_0x1f040b)));})):this[_0x2b9dab(0x128)](_0x537954)&&_0x537954['forEach'](function(_0xea7a37,_0x4f1472){var _0x3b0da6=_0x2b9dab;if(_0xf5a5b6++,_0x53a4a3[_0x3b0da6(0x1cd)]++,_0xf5a5b6>_0x523740){_0x2829ff=!0x0;return;}if(!_0x53a4a3[_0x3b0da6(0x16d)]&&_0x53a4a3['autoExpand']&&_0x53a4a3[_0x3b0da6(0x1cd)]>_0x53a4a3[_0x3b0da6(0x19a)]){_0x2829ff=!0x0;return;}var _0x4a18a5=_0x4f1472[_0x3b0da6(0x12a)]();_0x4a18a5[_0x3b0da6(0x180)]>0x64&&(_0x4a18a5=_0x4a18a5['slice'](0x0,0x64)+_0x3b0da6(0x1a6)),_0x53b10b['push'](_0x8c21d4['_addProperty'](_0x1b37ba,_0x537954,_0x3b0da6(0x104),_0x4a18a5,_0x53a4a3,function(_0x23265e){return function(){return _0x23265e;};}(_0xea7a37)));}),!_0x148180){try{for(_0x36cf72 in _0x537954)if(!(_0x23864b&&_0x34ac66[_0x2b9dab(0x1ea)](_0x36cf72))&&!this[_0x2b9dab(0x18f)](_0x537954,_0x36cf72,_0x53a4a3)){if(_0xf5a5b6++,_0x53a4a3[_0x2b9dab(0x1cd)]++,_0xf5a5b6>_0x523740){_0x2829ff=!0x0;break;}if(!_0x53a4a3[_0x2b9dab(0x16d)]&&_0x53a4a3[_0x2b9dab(0x152)]&&_0x53a4a3['autoExpandPropertyCount']>_0x53a4a3[_0x2b9dab(0x19a)]){_0x2829ff=!0x0;break;}_0x53b10b[_0x2b9dab(0x1b7)](_0x8c21d4[_0x2b9dab(0x185)](_0x1b37ba,_0x4a254f,_0x537954,_0x12e4ac,_0x36cf72,_0x53a4a3));}}catch{}if(_0x4a254f[_0x2b9dab(0x1eb)]=!0x0,_0x24ad9f&&(_0x4a254f[_0x2b9dab(0x183)]=!0x0),!_0x2829ff){var _0x4f1092=[][_0x2b9dab(0x1d7)](this[_0x2b9dab(0x1ab)](_0x537954))[_0x2b9dab(0x1d7)](this[_0x2b9dab(0x1a2)](_0x537954));for(_0x4d21f0=0x0,_0x1b8ccd=_0x4f1092['length'];_0x4d21f0<_0x1b8ccd;_0x4d21f0++)if(_0x36cf72=_0x4f1092[_0x4d21f0],!(_0x23864b&&_0x34ac66[_0x2b9dab(0x1ea)](_0x36cf72[_0x2b9dab(0x12a)]()))&&!this[_0x2b9dab(0x18f)](_0x537954,_0x36cf72,_0x53a4a3)&&!_0x4a254f['_p_'+_0x36cf72[_0x2b9dab(0x12a)]()]){if(_0xf5a5b6++,_0x53a4a3['autoExpandPropertyCount']++,_0xf5a5b6>_0x523740){_0x2829ff=!0x0;break;}if(!_0x53a4a3['isExpressionToEvaluate']&&_0x53a4a3[_0x2b9dab(0x152)]&&_0x53a4a3[_0x2b9dab(0x1cd)]>_0x53a4a3[_0x2b9dab(0x19a)]){_0x2829ff=!0x0;break;}_0x53b10b[_0x2b9dab(0x1b7)](_0x8c21d4['_addObjectProperty'](_0x1b37ba,_0x4a254f,_0x537954,_0x12e4ac,_0x36cf72,_0x53a4a3));}}}}}if(_0x10d75d[_0x2b9dab(0x110)]=_0x12e4ac,_0x101a1d?(_0x10d75d['value']=_0x537954[_0x2b9dab(0x1b4)](),this[_0x2b9dab(0x189)](_0x12e4ac,_0x10d75d,_0x53a4a3,_0x34d948)):_0x12e4ac===_0x2b9dab(0x11d)?_0x10d75d[_0x2b9dab(0x107)]=this[_0x2b9dab(0x1a3)][_0x2b9dab(0x17e)](_0x537954):_0x12e4ac===_0x2b9dab(0x1c6)?_0x10d75d['value']=_0x537954[_0x2b9dab(0x12a)]():_0x12e4ac===_0x2b9dab(0x1b0)?_0x10d75d['value']=this[_0x2b9dab(0x13c)][_0x2b9dab(0x17e)](_0x537954):_0x12e4ac===_0x2b9dab(0x122)&&this['_Symbol']?_0x10d75d[_0x2b9dab(0x107)]=this[_0x2b9dab(0x1e9)][_0x2b9dab(0x13d)][_0x2b9dab(0x12a)]['call'](_0x537954):!_0x53a4a3['depth']&&!(_0x12e4ac===_0x2b9dab(0x126)||_0x12e4ac===_0x2b9dab(0x121))&&(delete _0x10d75d['value'],_0x10d75d[_0x2b9dab(0x154)]=!0x0),_0x2829ff&&(_0x10d75d[_0x2b9dab(0x1bd)]=!0x0),_0x10bbfa=_0x53a4a3['node'][_0x2b9dab(0x118)],_0x53a4a3['node']['current']=_0x10d75d,this['_treeNodePropertiesBeforeFullValue'](_0x10d75d,_0x53a4a3),_0x53b10b[_0x2b9dab(0x180)]){for(_0x4d21f0=0x0,_0x1b8ccd=_0x53b10b['length'];_0x4d21f0<_0x1b8ccd;_0x4d21f0++)_0x53b10b[_0x4d21f0](_0x4d21f0);}_0x1b37ba['length']&&(_0x10d75d[_0x2b9dab(0x1ba)]=_0x1b37ba);}catch(_0x3a3d4c){_0x45a725(_0x3a3d4c,_0x10d75d,_0x53a4a3);}return this[_0x2b9dab(0x135)](_0x537954,_0x10d75d),this['_treeNodePropertiesAfterFullValue'](_0x10d75d,_0x53a4a3),_0x53a4a3[_0x2b9dab(0x171)][_0x2b9dab(0x118)]=_0x10bbfa,_0x53a4a3[_0x2b9dab(0x10a)]--,_0x53a4a3[_0x2b9dab(0x152)]=_0x58f0f5,_0x53a4a3['autoExpand']&&_0x53a4a3[_0x2b9dab(0x1a5)]['pop'](),_0x10d75d;}[_0x174578(0x1a2)](_0x566668){var _0x538282=_0x174578;return Object['getOwnPropertySymbols']?Object[_0x538282(0x18e)](_0x566668):[];}[_0x174578(0x1c8)](_0x149548){var _0x3eeb81=_0x174578;return!!(_0x149548&&_0x260822[_0x3eeb81(0x114)]&&this['_objectToString'](_0x149548)===_0x3eeb81(0x108)&&_0x149548[_0x3eeb81(0x193)]);}[_0x174578(0x18f)](_0x51a0ca,_0x3c87c9,_0x370dbc){var _0x554ad=_0x174578;return _0x370dbc['noFunctions']?typeof _0x51a0ca[_0x3c87c9]==_0x554ad(0x13e):!0x1;}[_0x174578(0x1a8)](_0x40e046){var _0xa27de4=_0x174578,_0x1dc087='';return _0x1dc087=typeof _0x40e046,_0x1dc087===_0xa27de4(0x17d)?this['_objectToString'](_0x40e046)===_0xa27de4(0x178)?_0x1dc087=_0xa27de4(0x199):this[_0xa27de4(0x112)](_0x40e046)===_0xa27de4(0x18d)?_0x1dc087=_0xa27de4(0x11d):this[_0xa27de4(0x112)](_0x40e046)===_0xa27de4(0x1ec)?_0x1dc087=_0xa27de4(0x1c6):_0x40e046===null?_0x1dc087=_0xa27de4(0x126):_0x40e046[_0xa27de4(0x137)]&&(_0x1dc087=_0x40e046[_0xa27de4(0x137)][_0xa27de4(0x162)]||_0x1dc087):_0x1dc087===_0xa27de4(0x121)&&this[_0xa27de4(0x129)]&&_0x40e046 instanceof this['_HTMLAllCollection']&&(_0x1dc087='HTMLAllCollection'),_0x1dc087;}[_0x174578(0x112)](_0x176202){var _0x302982=_0x174578;return Object[_0x302982(0x13d)]['toString'][_0x302982(0x17e)](_0x176202);}[_0x174578(0x111)](_0x5ea248){var _0xdbf1b7=_0x174578;return _0x5ea248===_0xdbf1b7(0x15a)||_0x5ea248===_0xdbf1b7(0x149)||_0x5ea248===_0xdbf1b7(0x1b1);}[_0x174578(0x173)](_0x62fdf9){var _0x40a0bb=_0x174578;return _0x62fdf9===_0x40a0bb(0x1d3)||_0x62fdf9===_0x40a0bb(0x146)||_0x62fdf9===_0x40a0bb(0x1b8);}[_0x174578(0x120)](_0x308682,_0x2d811c,_0x5061f1,_0x11124c,_0x245505,_0x18b888){var _0x3ebe98=this;return function(_0x25ea1d){var _0x2e8dfe=_0x3cfb,_0x4a9a45=_0x245505['node']['current'],_0x338487=_0x245505[_0x2e8dfe(0x171)][_0x2e8dfe(0x1cb)],_0x517034=_0x245505[_0x2e8dfe(0x171)]['parent'];_0x245505[_0x2e8dfe(0x171)][_0x2e8dfe(0x1c3)]=_0x4a9a45,_0x245505['node'][_0x2e8dfe(0x1cb)]=typeof _0x11124c=='number'?_0x11124c:_0x25ea1d,_0x308682[_0x2e8dfe(0x1b7)](_0x3ebe98[_0x2e8dfe(0x18b)](_0x2d811c,_0x5061f1,_0x11124c,_0x245505,_0x18b888)),_0x245505[_0x2e8dfe(0x171)]['parent']=_0x517034,_0x245505['node'][_0x2e8dfe(0x1cb)]=_0x338487;};}[_0x174578(0x185)](_0x583829,_0x1a94b9,_0x25b743,_0x13285a,_0x41a249,_0x46821a,_0x44f9b6){var _0x255893=this;return _0x1a94b9['_p_'+_0x41a249['toString']()]=!0x0,function(_0x3cf47){var _0x5ce8d7=_0x3cfb,_0x2405f2=_0x46821a[_0x5ce8d7(0x171)][_0x5ce8d7(0x118)],_0x3f151d=_0x46821a[_0x5ce8d7(0x171)][_0x5ce8d7(0x1cb)],_0x38358f=_0x46821a['node'][_0x5ce8d7(0x1c3)];_0x46821a['node'][_0x5ce8d7(0x1c3)]=_0x2405f2,_0x46821a[_0x5ce8d7(0x171)][_0x5ce8d7(0x1cb)]=_0x3cf47,_0x583829[_0x5ce8d7(0x1b7)](_0x255893[_0x5ce8d7(0x18b)](_0x25b743,_0x13285a,_0x41a249,_0x46821a,_0x44f9b6)),_0x46821a[_0x5ce8d7(0x171)]['parent']=_0x38358f,_0x46821a[_0x5ce8d7(0x171)][_0x5ce8d7(0x1cb)]=_0x3f151d;};}[_0x174578(0x18b)](_0x48bda0,_0x2e9a0b,_0x239439,_0x4d4922,_0x35898e){var _0x23c239=_0x174578,_0x32145d=this;_0x35898e||(_0x35898e=function(_0x3822ee,_0x3b24ed){return _0x3822ee[_0x3b24ed];});var _0x495af4=_0x239439[_0x23c239(0x12a)](),_0x55586f=_0x4d4922['expressionsToEvaluate']||{},_0x102336=_0x4d4922[_0x23c239(0x1bf)],_0x24b55b=_0x4d4922[_0x23c239(0x16d)];try{var _0x171801=this['_isMap'](_0x48bda0),_0x18a838=_0x495af4;_0x171801&&_0x18a838[0x0]==='\\x27'&&(_0x18a838=_0x18a838[_0x23c239(0x127)](0x1,_0x18a838[_0x23c239(0x180)]-0x2));var _0x5eea2c=_0x4d4922[_0x23c239(0x133)]=_0x55586f[_0x23c239(0x156)+_0x18a838];_0x5eea2c&&(_0x4d4922[_0x23c239(0x1bf)]=_0x4d4922['depth']+0x1),_0x4d4922[_0x23c239(0x16d)]=!!_0x5eea2c;var _0x4ed08c=typeof _0x239439==_0x23c239(0x122),_0x57df77={'name':_0x4ed08c||_0x171801?_0x495af4:this[_0x23c239(0x13b)](_0x495af4)};if(_0x4ed08c&&(_0x57df77['symbol']=!0x0),!(_0x2e9a0b===_0x23c239(0x199)||_0x2e9a0b===_0x23c239(0x187))){var _0x394a14=this[_0x23c239(0x164)](_0x48bda0,_0x239439);if(_0x394a14&&(_0x394a14[_0x23c239(0x1a9)]&&(_0x57df77['setter']=!0x0),_0x394a14[_0x23c239(0x1d1)]&&!_0x5eea2c&&!_0x4d4922[_0x23c239(0x12f)]))return _0x57df77['getter']=!0x0,this[_0x23c239(0x1af)](_0x57df77,_0x4d4922),_0x57df77;}var _0x21b969;try{_0x21b969=_0x35898e(_0x48bda0,_0x239439);}catch(_0x5985fc){return _0x57df77={'name':_0x495af4,'type':_0x23c239(0x1aa),'error':_0x5985fc['message']},this[_0x23c239(0x1af)](_0x57df77,_0x4d4922),_0x57df77;}var _0x3d30d3=this[_0x23c239(0x1a8)](_0x21b969),_0x499bf2=this['_isPrimitiveType'](_0x3d30d3);if(_0x57df77[_0x23c239(0x110)]=_0x3d30d3,_0x499bf2)this[_0x23c239(0x1af)](_0x57df77,_0x4d4922,_0x21b969,function(){var _0x5e72cc=_0x23c239;_0x57df77[_0x5e72cc(0x107)]=_0x21b969[_0x5e72cc(0x1b4)](),!_0x5eea2c&&_0x32145d['_capIfString'](_0x3d30d3,_0x57df77,_0x4d4922,{});});else{var _0xfe447c=_0x4d4922[_0x23c239(0x152)]&&_0x4d4922[_0x23c239(0x10a)]<_0x4d4922['autoExpandMaxDepth']&&_0x4d4922[_0x23c239(0x1a5)][_0x23c239(0x148)](_0x21b969)<0x0&&_0x3d30d3!==_0x23c239(0x13e)&&_0x4d4922[_0x23c239(0x1cd)]<_0x4d4922[_0x23c239(0x19a)];_0xfe447c||_0x4d4922[_0x23c239(0x10a)]<_0x102336||_0x5eea2c?(this['serialize'](_0x57df77,_0x21b969,_0x4d4922,_0x5eea2c||{}),this[_0x23c239(0x135)](_0x21b969,_0x57df77)):this['_processTreeNodeResult'](_0x57df77,_0x4d4922,_0x21b969,function(){var _0x2a6241=_0x23c239;_0x3d30d3==='null'||_0x3d30d3==='undefined'||(delete _0x57df77[_0x2a6241(0x107)],_0x57df77[_0x2a6241(0x154)]=!0x0);});}return _0x57df77;}finally{_0x4d4922[_0x23c239(0x133)]=_0x55586f,_0x4d4922['depth']=_0x102336,_0x4d4922[_0x23c239(0x16d)]=_0x24b55b;}}[_0x174578(0x189)](_0x401e08,_0x22ae66,_0x3810e6,_0x1588f0){var _0x33ccd0=_0x174578,_0x3855ed=_0x1588f0[_0x33ccd0(0x176)]||_0x3810e6[_0x33ccd0(0x176)];if((_0x401e08===_0x33ccd0(0x149)||_0x401e08===_0x33ccd0(0x146))&&_0x22ae66[_0x33ccd0(0x107)]){let _0xd02c93=_0x22ae66[_0x33ccd0(0x107)][_0x33ccd0(0x180)];_0x3810e6['allStrLength']+=_0xd02c93,_0x3810e6[_0x33ccd0(0x1cc)]>_0x3810e6['totalStrLength']?(_0x22ae66[_0x33ccd0(0x154)]='',delete _0x22ae66['value']):_0xd02c93>_0x3855ed&&(_0x22ae66[_0x33ccd0(0x154)]=_0x22ae66[_0x33ccd0(0x107)][_0x33ccd0(0x127)](0x0,_0x3855ed),delete _0x22ae66[_0x33ccd0(0x107)]);}}[_0x174578(0x128)](_0x538f56){var _0x1f312b=_0x174578;return!!(_0x538f56&&_0x260822[_0x1f312b(0x104)]&&this[_0x1f312b(0x112)](_0x538f56)===_0x1f312b(0x130)&&_0x538f56[_0x1f312b(0x193)]);}[_0x174578(0x13b)](_0x18296b){var _0x4b0b06=_0x174578;if(_0x18296b[_0x4b0b06(0x1dc)](/^\\d+$/))return _0x18296b;var _0x557d89;try{_0x557d89=JSON[_0x4b0b06(0x175)](''+_0x18296b);}catch{_0x557d89='\\x22'+this[_0x4b0b06(0x112)](_0x18296b)+'\\x22';}return _0x557d89[_0x4b0b06(0x1dc)](/^\"([a-zA-Z_][a-zA-Z_0-9]*)\"$/)?_0x557d89=_0x557d89[_0x4b0b06(0x127)](0x1,_0x557d89['length']-0x2):_0x557d89=_0x557d89['replace'](/'/g,'\\x5c\\x27')[_0x4b0b06(0x16b)](/\\\\\"/g,'\\x22')[_0x4b0b06(0x16b)](/(^\"|\"$)/g,'\\x27'),_0x557d89;}['_processTreeNodeResult'](_0x5e0219,_0x216cb0,_0x10c23a,_0x4ea35d){var _0x223dff=_0x174578;this['_treeNodePropertiesBeforeFullValue'](_0x5e0219,_0x216cb0),_0x4ea35d&&_0x4ea35d(),this[_0x223dff(0x135)](_0x10c23a,_0x5e0219),this[_0x223dff(0x12b)](_0x5e0219,_0x216cb0);}[_0x174578(0x1df)](_0x4c69a0,_0x39f44e){var _0x550405=_0x174578;this[_0x550405(0x159)](_0x4c69a0,_0x39f44e),this[_0x550405(0x1ee)](_0x4c69a0,_0x39f44e),this[_0x550405(0x14f)](_0x4c69a0,_0x39f44e),this[_0x550405(0x158)](_0x4c69a0,_0x39f44e);}[_0x174578(0x159)](_0x42219a,_0x21e9b0){}['_setNodeQueryPath'](_0x1133bc,_0x130a77){}['_setNodeLabel'](_0x5723ca,_0x47e2b3){}[_0x174578(0x1e1)](_0x57dea1){return _0x57dea1===this['_undefined'];}['_treeNodePropertiesAfterFullValue'](_0x2e181a,_0x39a3e9){var _0x3921bf=_0x174578;this[_0x3921bf(0x1bb)](_0x2e181a,_0x39a3e9),this[_0x3921bf(0x11a)](_0x2e181a),_0x39a3e9[_0x3921bf(0x19f)]&&this['_sortProps'](_0x2e181a),this['_addFunctionsNode'](_0x2e181a,_0x39a3e9),this[_0x3921bf(0x163)](_0x2e181a,_0x39a3e9),this[_0x3921bf(0x1ae)](_0x2e181a);}[_0x174578(0x135)](_0x5e6dd7,_0x15696f){var _0x4ba12e=_0x174578;let _0x1c9167;try{_0x260822['console']&&(_0x1c9167=_0x260822[_0x4ba12e(0x1e0)][_0x4ba12e(0x14b)],_0x260822['console'][_0x4ba12e(0x14b)]=function(){}),_0x5e6dd7&&typeof _0x5e6dd7['length']==_0x4ba12e(0x1b1)&&(_0x15696f[_0x4ba12e(0x180)]=_0x5e6dd7[_0x4ba12e(0x180)]);}catch{}finally{_0x1c9167&&(_0x260822['console'][_0x4ba12e(0x14b)]=_0x1c9167);}if(_0x15696f[_0x4ba12e(0x110)]===_0x4ba12e(0x1b1)||_0x15696f[_0x4ba12e(0x110)]===_0x4ba12e(0x1b8)){if(isNaN(_0x15696f[_0x4ba12e(0x107)]))_0x15696f[_0x4ba12e(0x1a4)]=!0x0,delete _0x15696f['value'];else switch(_0x15696f[_0x4ba12e(0x107)]){case Number[_0x4ba12e(0x179)]:_0x15696f[_0x4ba12e(0x157)]=!0x0,delete _0x15696f[_0x4ba12e(0x107)];break;case Number[_0x4ba12e(0x141)]:_0x15696f[_0x4ba12e(0x106)]=!0x0,delete _0x15696f[_0x4ba12e(0x107)];break;case 0x0:this['_isNegativeZero'](_0x15696f[_0x4ba12e(0x107)])&&(_0x15696f['negativeZero']=!0x0);break;}}else _0x15696f[_0x4ba12e(0x110)]===_0x4ba12e(0x13e)&&typeof _0x5e6dd7[_0x4ba12e(0x162)]=='string'&&_0x5e6dd7[_0x4ba12e(0x162)]&&_0x15696f[_0x4ba12e(0x162)]&&_0x5e6dd7[_0x4ba12e(0x162)]!==_0x15696f[_0x4ba12e(0x162)]&&(_0x15696f[_0x4ba12e(0x1be)]=_0x5e6dd7[_0x4ba12e(0x162)]);}['_isNegativeZero'](_0x3eb735){var _0x5e08d5=_0x174578;return 0x1/_0x3eb735===Number[_0x5e08d5(0x141)];}[_0x174578(0x136)](_0x1d896a){var _0x1dc2fe=_0x174578;!_0x1d896a['props']||!_0x1d896a[_0x1dc2fe(0x1ba)]['length']||_0x1d896a[_0x1dc2fe(0x110)]===_0x1dc2fe(0x199)||_0x1d896a[_0x1dc2fe(0x110)]===_0x1dc2fe(0x104)||_0x1d896a[_0x1dc2fe(0x110)]===_0x1dc2fe(0x114)||_0x1d896a[_0x1dc2fe(0x1ba)]['sort'](function(_0x4d079a,_0x1aaf45){var _0x4bf240=_0x1dc2fe,_0x38311b=_0x4d079a[_0x4bf240(0x162)][_0x4bf240(0x198)](),_0x4d08f9=_0x1aaf45[_0x4bf240(0x162)][_0x4bf240(0x198)]();return _0x38311b<_0x4d08f9?-0x1:_0x38311b>_0x4d08f9?0x1:0x0;});}[_0x174578(0x1d8)](_0x1580e8,_0x444c8a){var _0x19ea0e=_0x174578;if(!(_0x444c8a[_0x19ea0e(0x153)]||!_0x1580e8[_0x19ea0e(0x1ba)]||!_0x1580e8['props'][_0x19ea0e(0x180)])){for(var _0x450078=[],_0x57f8a9=[],_0x4f637f=0x0,_0x20a83d=_0x1580e8[_0x19ea0e(0x1ba)][_0x19ea0e(0x180)];_0x4f637f<_0x20a83d;_0x4f637f++){var _0x720862=_0x1580e8[_0x19ea0e(0x1ba)][_0x4f637f];_0x720862[_0x19ea0e(0x110)]==='function'?_0x450078[_0x19ea0e(0x1b7)](_0x720862):_0x57f8a9[_0x19ea0e(0x1b7)](_0x720862);}if(!(!_0x57f8a9[_0x19ea0e(0x180)]||_0x450078[_0x19ea0e(0x180)]<=0x1)){_0x1580e8[_0x19ea0e(0x1ba)]=_0x57f8a9;var _0x34c242={'functionsNode':!0x0,'props':_0x450078};this['_setNodeId'](_0x34c242,_0x444c8a),this[_0x19ea0e(0x1bb)](_0x34c242,_0x444c8a),this[_0x19ea0e(0x11a)](_0x34c242),this['_setNodePermissions'](_0x34c242,_0x444c8a),_0x34c242['id']+='\\x20f',_0x1580e8[_0x19ea0e(0x1ba)][_0x19ea0e(0x15f)](_0x34c242);}}}['_addLoadNode'](_0x42d9d4,_0x516f68){}[_0x174578(0x11a)](_0x240cbc){}[_0x174578(0x14c)](_0x5dc223){var _0x370f97=_0x174578;return Array[_0x370f97(0x147)](_0x5dc223)||typeof _0x5dc223==_0x370f97(0x17d)&&this['_objectToString'](_0x5dc223)===_0x370f97(0x178);}[_0x174578(0x158)](_0x587285,_0x351c83){}[_0x174578(0x1ae)](_0x11bfa0){var _0x3768f3=_0x174578;delete _0x11bfa0[_0x3768f3(0x131)],delete _0x11bfa0[_0x3768f3(0x1ed)],delete _0x11bfa0[_0x3768f3(0x18c)];}['_setNodeExpressionPath'](_0x18dd6d,_0x47a9fd){}}let _0x10c2da=new _0xf6d11a(),_0x114b30={'props':0x64,'elements':0x64,'strLength':0x400*0x32,'totalStrLength':0x400*0x32,'autoExpandLimit':0x1388,'autoExpandMaxDepth':0xa},_0x4b2d63={'props':0x5,'elements':0x5,'strLength':0x100,'totalStrLength':0x100*0x3,'autoExpandLimit':0x1e,'autoExpandMaxDepth':0x2};function _0x1e9ae2(_0x59f49a,_0x1f48d0,_0x595800,_0x5afa5e,_0x5d3d1b,_0x2c52b5){var _0x59131e=_0x174578;let _0x10f1d2,_0x1961e9;try{_0x1961e9=_0x3c02bb(),_0x10f1d2=_0x6fb393[_0x1f48d0],!_0x10f1d2||_0x1961e9-_0x10f1d2['ts']>0x1f4&&_0x10f1d2[_0x59131e(0x15e)]&&_0x10f1d2[_0x59131e(0x15c)]/_0x10f1d2['count']<0x64?(_0x6fb393[_0x1f48d0]=_0x10f1d2={'count':0x0,'time':0x0,'ts':_0x1961e9},_0x6fb393[_0x59131e(0x139)]={}):_0x1961e9-_0x6fb393[_0x59131e(0x139)]['ts']>0x32&&_0x6fb393[_0x59131e(0x139)]['count']&&_0x6fb393[_0x59131e(0x139)][_0x59131e(0x15c)]/_0x6fb393[_0x59131e(0x139)][_0x59131e(0x15e)]<0x64&&(_0x6fb393[_0x59131e(0x139)]={});let _0x1cccd9=[],_0x5ddea0=_0x10f1d2[_0x59131e(0x105)]||_0x6fb393[_0x59131e(0x139)][_0x59131e(0x105)]?_0x4b2d63:_0x114b30,_0x56e406=_0x532abf=>{var _0x594ad8=_0x59131e;let _0x1f5c14={};return _0x1f5c14[_0x594ad8(0x1ba)]=_0x532abf[_0x594ad8(0x1ba)],_0x1f5c14[_0x594ad8(0x125)]=_0x532abf[_0x594ad8(0x125)],_0x1f5c14['strLength']=_0x532abf[_0x594ad8(0x176)],_0x1f5c14[_0x594ad8(0x192)]=_0x532abf[_0x594ad8(0x192)],_0x1f5c14[_0x594ad8(0x19a)]=_0x532abf['autoExpandLimit'],_0x1f5c14['autoExpandMaxDepth']=_0x532abf[_0x594ad8(0x1ac)],_0x1f5c14['sortProps']=!0x1,_0x1f5c14[_0x594ad8(0x153)]=!_0xa33144,_0x1f5c14[_0x594ad8(0x1bf)]=0x1,_0x1f5c14['level']=0x0,_0x1f5c14[_0x594ad8(0x1c4)]=_0x594ad8(0x160),_0x1f5c14[_0x594ad8(0x119)]=_0x594ad8(0x15d),_0x1f5c14[_0x594ad8(0x152)]=!0x0,_0x1f5c14[_0x594ad8(0x1a5)]=[],_0x1f5c14[_0x594ad8(0x1cd)]=0x0,_0x1f5c14[_0x594ad8(0x12f)]=!0x0,_0x1f5c14[_0x594ad8(0x1cc)]=0x0,_0x1f5c14[_0x594ad8(0x171)]={'current':void 0x0,'parent':void 0x0,'index':0x0},_0x1f5c14;};for(var _0x3559ed=0x0;_0x3559ed<_0x5d3d1b['length'];_0x3559ed++)_0x1cccd9[_0x59131e(0x1b7)](_0x10c2da['serialize']({'timeNode':_0x59f49a===_0x59131e(0x15c)||void 0x0},_0x5d3d1b[_0x3559ed],_0x56e406(_0x5ddea0),{}));if(_0x59f49a===_0x59131e(0x123)){let _0x4a8ff1=Error[_0x59131e(0x186)];try{Error['stackTraceLimit']=0x1/0x0,_0x1cccd9[_0x59131e(0x1b7)](_0x10c2da['serialize']({'stackNode':!0x0},new Error()[_0x59131e(0x1db)],_0x56e406(_0x5ddea0),{'strLength':0x1/0x0}));}finally{Error[_0x59131e(0x186)]=_0x4a8ff1;}}return{'method':'log','version':_0x131282,'args':[{'ts':_0x595800,'session':_0x5afa5e,'args':_0x1cccd9,'id':_0x1f48d0,'context':_0x2c52b5}]};}catch(_0x1c2c3c){return{'method':_0x59131e(0x188),'version':_0x131282,'args':[{'ts':_0x595800,'session':_0x5afa5e,'args':[{'type':_0x59131e(0x1aa),'error':_0x1c2c3c&&_0x1c2c3c[_0x59131e(0x1a0)]}],'id':_0x1f48d0,'context':_0x2c52b5}]};}finally{try{if(_0x10f1d2&&_0x1961e9){let _0xc2f24f=_0x3c02bb();_0x10f1d2['count']++,_0x10f1d2[_0x59131e(0x15c)]+=_0x298950(_0x1961e9,_0xc2f24f),_0x10f1d2['ts']=_0xc2f24f,_0x6fb393[_0x59131e(0x139)]['count']++,_0x6fb393['hits']['time']+=_0x298950(_0x1961e9,_0xc2f24f),_0x6fb393[_0x59131e(0x139)]['ts']=_0xc2f24f,(_0x10f1d2[_0x59131e(0x15e)]>0x32||_0x10f1d2['time']>0x64)&&(_0x10f1d2[_0x59131e(0x105)]=!0x0),(_0x6fb393['hits'][_0x59131e(0x15e)]>0x3e8||_0x6fb393[_0x59131e(0x139)][_0x59131e(0x15c)]>0x12c)&&(_0x6fb393[_0x59131e(0x139)]['reduceLimits']=!0x0);}}catch{}}}return _0x1e9ae2;}((_0x1e5937,_0x47277a,_0xdaced7,_0x4a8ce9,_0x1e5ad9,_0x2c6274,_0x310708,_0x50c6c6,_0x4d6e0c,_0x4772bf)=>{var _0x395452=_0x24af6e;if(_0x1e5937['_console_ninja'])return _0x1e5937[_0x395452(0x18a)];if(!J(_0x1e5937,_0x50c6c6,_0x1e5ad9))return _0x1e5937['_console_ninja']={'consoleLog':()=>{},'consoleTrace':()=>{},'consoleTime':()=>{},'consoleTimeEnd':()=>{},'autoLog':()=>{},'autoLogMany':()=>{},'autoTraceMany':()=>{},'coverage':()=>{},'autoTrace':()=>{},'autoTime':()=>{},'autoTimeEnd':()=>{}},_0x1e5937['_console_ninja'];let _0x1ecc09=W(_0x1e5937),_0x811d42=_0x1ecc09[_0x395452(0x17b)],_0x3156e7=_0x1ecc09[_0x395452(0x13a)],_0xe2b65=_0x1ecc09[_0x395452(0x11c)],_0x2dc4d2={'hits':{},'ts':{}},_0xc341eb=Y(_0x1e5937,_0x4d6e0c,_0x2dc4d2,_0x2c6274),_0x27404b=_0x2bc4f7=>{_0x2dc4d2['ts'][_0x2bc4f7]=_0x3156e7();},_0x57cc5d=(_0x1ed200,_0x249fcd)=>{var _0x2ff026=_0x395452;let _0xd1ee06=_0x2dc4d2['ts'][_0x249fcd];if(delete _0x2dc4d2['ts'][_0x249fcd],_0xd1ee06){let _0x2213ad=_0x811d42(_0xd1ee06,_0x3156e7());_0xe88d3d(_0xc341eb(_0x2ff026(0x15c),_0x1ed200,_0xe2b65(),_0x5e4896,[_0x2213ad],_0x249fcd));}},_0x4aa442=_0x26728f=>_0x56cd92=>{var _0x4739d5=_0x395452;try{_0x27404b(_0x56cd92),_0x26728f(_0x56cd92);}finally{_0x1e5937[_0x4739d5(0x1e0)]['time']=_0x26728f;}},_0x264f3d=_0x3a7359=>_0x1e2f90=>{var _0x57a785=_0x395452;try{let [_0x316fd,_0x2055cc]=_0x1e2f90[_0x57a785(0x1c5)](_0x57a785(0x19d));_0x57cc5d(_0x2055cc,_0x316fd),_0x3a7359(_0x316fd);}finally{_0x1e5937[_0x57a785(0x1e0)][_0x57a785(0x10b)]=_0x3a7359;}};_0x1e5937['_console_ninja']={'consoleLog':(_0x52a688,_0x56c608)=>{var _0x4aaead=_0x395452;_0x1e5937[_0x4aaead(0x1e0)][_0x4aaead(0x188)][_0x4aaead(0x162)]!=='disabledLog'&&_0xe88d3d(_0xc341eb(_0x4aaead(0x188),_0x52a688,_0xe2b65(),_0x5e4896,_0x56c608));},'consoleTrace':(_0x311615,_0x447691)=>{var _0x10ce6d=_0x395452;_0x1e5937[_0x10ce6d(0x1e0)][_0x10ce6d(0x188)]['name']!==_0x10ce6d(0x12c)&&_0xe88d3d(_0xc341eb('trace',_0x311615,_0xe2b65(),_0x5e4896,_0x447691));},'consoleTime':()=>{var _0xb51252=_0x395452;_0x1e5937[_0xb51252(0x1e0)][_0xb51252(0x15c)]=_0x4aa442(_0x1e5937[_0xb51252(0x1e0)][_0xb51252(0x15c)]);},'consoleTimeEnd':()=>{var _0x2b0ce3=_0x395452;_0x1e5937[_0x2b0ce3(0x1e0)]['timeEnd']=_0x264f3d(_0x1e5937[_0x2b0ce3(0x1e0)]['timeEnd']);},'autoLog':(_0x367104,_0x272724)=>{var _0x5a204b=_0x395452;_0xe88d3d(_0xc341eb(_0x5a204b(0x188),_0x272724,_0xe2b65(),_0x5e4896,[_0x367104]));},'autoLogMany':(_0x2cd175,_0x47a6a1)=>{var _0x1d60ea=_0x395452;_0xe88d3d(_0xc341eb(_0x1d60ea(0x188),_0x2cd175,_0xe2b65(),_0x5e4896,_0x47a6a1));},'autoTrace':(_0x528810,_0x13db61)=>{var _0x3467d2=_0x395452;_0xe88d3d(_0xc341eb(_0x3467d2(0x123),_0x13db61,_0xe2b65(),_0x5e4896,[_0x528810]));},'autoTraceMany':(_0x301b23,_0x1223a4)=>{var _0x215527=_0x395452;_0xe88d3d(_0xc341eb(_0x215527(0x123),_0x301b23,_0xe2b65(),_0x5e4896,_0x1223a4));},'autoTime':(_0x14184e,_0x3c3748,_0xf4212e)=>{_0x27404b(_0xf4212e);},'autoTimeEnd':(_0x3d6388,_0x329c3,_0x32ce37)=>{_0x57cc5d(_0x329c3,_0x32ce37);},'coverage':_0x2d0cef=>{_0xe88d3d({'method':'coverage','version':_0x2c6274,'args':[{'id':_0x2d0cef}]});}};let _0xe88d3d=b(_0x1e5937,_0x47277a,_0xdaced7,_0x4a8ce9,_0x1e5ad9,_0x4772bf),_0x5e4896=_0x1e5937[_0x395452(0x1e4)];return _0x1e5937[_0x395452(0x18a)];})(globalThis,_0x24af6e(0x1bc),_0x24af6e(0x168),_0x24af6e(0x16e),_0x24af6e(0x1a1),_0x24af6e(0x134),'1706794647553',[\"localhost\",\"127.0.0.1\",\"example.cypress.io\",\"IMTECH\",\"192.168.1.128\"],'',_0x24af6e(0x11e));function _0x1ba4(){var _0x4ff519=['_treeNodePropertiesBeforeFullValue','console','_isUndefined','_attemptToReconnectShortly','_WebSocketClass','_console_ninja_session','_inBrowser','method','performance','hrtime','_Symbol','test','_p_length','[object\\x20BigInt]','_hasSetOnItsPath','_setNodeQueryPath','1603igJFGW','_quotedRegExp','Map','reduceLimits','negativeInfinity','value','[object\\x20Set]','then','level','timeEnd','1721142jiQfQC','Console\\x20Ninja\\x20failed\\x20to\\x20send\\x20logs,\\x20refreshing\\x20the\\x20page\\x20may\\x20help;\\x20also\\x20see\\x20','_inNextEdge','location','type','_isPrimitiveType','_objectToString','_connectToHostNow','Set','22818TOWUzk','__es'+'Module','\\x20browser','current','rootExpression','_setNodeExpandableState','process','now','date','','logger\\x20failed\\x20to\\x20connect\\x20to\\x20host,\\x20see\\x20','_addProperty','undefined','symbol','trace','create','elements','null','substr','_isMap','_HTMLAllCollection','toString','_treeNodePropertiesAfterFullValue','disabledTrace','_ws','default','resolveGetters','[object\\x20Map]','_hasSymbolPropertyOnItsPath','catch','expressionsToEvaluate','1.0.0','_additionalMetadata','_sortProps','constructor','_allowedToConnectOnSend','hits','timeStamp','_propertyName','_regExpToString','prototype','function','_connecting','logger\\x20websocket\\x20error','NEGATIVE_INFINITY','_WebSocket','_reconnectTimeout','onclose','_keyStrRegExp','String','isArray','indexOf','string','396944qCFduC','error','_isArray','onopen','\\x20server','_setNodeExpressionPath','onmessage','path','autoExpand','noFunctions','capped','_socket','_p_','positiveInfinity','_setNodePermissions','_setNodeId','boolean','close','time','root_exp','count','unshift','root_exp_id','send','name','_addLoadNode','_getOwnPropertyDescriptor','_webSocketErrorDocsLink','2316BzdsIq','nodeModules','50361','readyState','unref','replace','failed\\x20to\\x20connect\\x20to\\x20host:\\x20','isExpressionToEvaluate',\"c:\\\\Users\\\\imtec\\\\.vscode\\\\extensions\\\\wallabyjs.console-ninja-1.0.283\\\\node_modules\",'failed\\x20to\\x20find\\x20and\\x20load\\x20WebSocket','_consoleNinjaAllowedToStart','node','url','_isPrimitiveWrapperType','gateway.docker.internal','stringify','strLength','getOwnPropertyNames','[object\\x20Array]','POSITIVE_INFINITY','39EdYaGg','elapsed','NEXT_RUNTIME','object','call','getPrototypeOf','length','edge','1980130CJzpqN','_p_name','_connectAttemptCount','_addObjectProperty','stackTraceLimit','Error','log','_capIfString','_console_ninja','_property','_hasMapOnItsPath','[object\\x20Date]','getOwnPropertySymbols','_blacklistedProperty','enumerable','86kjYsQt','totalStrLength','forEach','HTMLAllCollection','global','3973240OhoCdn','129778uZlYxB','toLowerCase','array','autoExpandLimit','port','cappedElements',':logPointId:','join','sortProps','message','webpack','_getOwnPropertySymbols','_dateToString','nan','autoExpandPreviousObjects','...','map','_type','set','unknown','_getOwnPropertyNames','autoExpandMaxDepth','30552HbfQqi','_cleanNode','_processTreeNodeResult','RegExp','number','versions','_connected','valueOf','bind','host','push','Number','data','props','_setNodeLabel','127.0.0.1','cappedProps','funcName','depth','getOwnPropertyDescriptor','_maxConnectAttemptCount','reload','parent','expId','split','bigint','env','_isSet','hostname','angular','index','allStrLength','autoExpandPropertyCount','_disposeWebsocket','_undefined','https://tinyurl.com/37x8b79t','get','warn','Boolean','Symbol','next.js','remix','concat','_addFunctionsNode','_allowedToSend','12WsTNQr','stack','match','dockerizedApp','ws/index.js'];_0x1ba4=function(){return _0x4ff519;};return _0x1ba4();}");
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