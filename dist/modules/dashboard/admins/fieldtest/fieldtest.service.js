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
exports.FieldtestService = void 0;
const common_1 = require("@nestjs/common");
const device_entity_1 = require("../../../../models/device.entity");
const fieldDevice_entity_1 = require("../../../../models/fieldDevice.entity");
const ServerMessage_class_1 = require("../../../../classes/ServerMessage.class");
const waterHistory_entity_1 = require("../../../../models/waterHistory.entity");
let FieldtestService = class FieldtestService {
    constructor(fieldDeviceRepository, deviceRepository, waterHistoryRepository) {
        this.fieldDeviceRepository = fieldDeviceRepository;
        this.deviceRepository = deviceRepository;
        this.waterHistoryRepository = waterHistoryRepository;
    }
    async getDevicesInField() {
        const fieldDevices = await this.fieldDeviceRepository.findAll();
        let devices = [];
        for (const field of fieldDevices) {
            const device = await this.deviceRepository.findOne({
                where: {
                    idDevice: field.idDevice
                }
            });
            devices.push(device);
        }
        const lastHistoryMap = new Map();
        for (const fieldDevice of fieldDevices) {
            const history = await this.waterHistoryRepository.findOne({
                where: {
                    idDevice: fieldDevice.idDevice,
                },
                order: [['dateTime', 'DESC']],
                limit: 1,
            });
            if (history) {
                lastHistoryMap.set(fieldDevice.idDevice, history);
            }
        }
        const lasTwoReason2HistoryMap = new Map();
        for (const fieldDevice of fieldDevices) {
            const history = await this.waterHistoryRepository.findAll(({
                where: {
                    idDevice: fieldDevice.idDevice,
                    reason: 2,
                },
                order: [['dateTime', 'DESC']],
                limit: 2,
            }));
            lasTwoReason2HistoryMap.set(fieldDevice.idDevice, history);
        }
        const response = [];
        for (const device of devices) {
            const deviceData = {
                serialNumber: device.serialNumber,
                name: device.name,
                boardVersion: device.boardVersion,
                firmwareVersion: device.firmwareVersion,
                lastTransmissionDate: null,
                activeAlarms: {},
                consumptionDifference: null,
                signalQualityAverage: null,
                transmittedLast24Hours: false,
            };
            const lastHistory = lastHistoryMap.get(device.idDevice);
            if (lastHistory) {
                deviceData.lastTransmissionDate = lastHistory.dateTime;
                deviceData.activeAlarms = {
                    bubbleAlert: lastHistory.bubbleAlert,
                    burstAlert: lastHistory.burstAlert,
                    dripAlert: lastHistory.dripAlert,
                    emptyAlert: lastHistory.emptyAlert,
                    manipulationAlert: lastHistory.manipulationAlert,
                    reversedFlowAlert: lastHistory.reversedFlowAlert,
                };
            }
            const lastTwoReason2History = lasTwoReason2HistoryMap.get(device.idDevice);
            if (lastTwoReason2History && lastTwoReason2History.length === 2) {
                const consumptionDifference = lastTwoReason2History[1].consumption - lastTwoReason2History[0].consumption;
                deviceData.consumptionDifference = consumptionDifference;
                const signalQualitySum = lastTwoReason2History[0].signalQuality + lastTwoReason2History[1].signalQuality;
                const signalQualityAverage = signalQualitySum / 2;
                deviceData.signalQualityAverage = signalQualityAverage;
            }
            const lastTransmissionDate = deviceData.lastTransmissionDate;
            if (lastTransmissionDate) {
                const currentDate = new Date();
                const diffInHours = (currentDate.getTime() - lastTransmissionDate.getTime()) / (1000 * 60 * 60);
                if (diffInHours <= 24) {
                    deviceData.transmittedLast24Hours = true;
                }
            }
            response.push(deviceData);
        }
        return response;
    }
    async saveDeviceInField(fieldDeviceDto) {
        if (fieldDeviceDto.serialNumbers.length === 0) {
            throw new common_1.BadRequestException('La lista de números de serie está vacía');
        }
        const invalidSerialNumbers = [];
        const devicesToInsert = [];
        for (const serialNumber of fieldDeviceDto.serialNumbers) {
            try {
                const deviceExist = await this.findDeviceBySerialNumber(serialNumber);
                if (!deviceExist) {
                    invalidSerialNumbers.push(serialNumber);
                }
                else {
                    const deviceExistInField = await this.findFieldDeviceByDeviceId(deviceExist.idDevice);
                    if (!deviceExistInField) {
                        devicesToInsert.push(deviceExist);
                    }
                    else {
                        invalidSerialNumbers.push(serialNumber);
                    }
                }
            }
            catch (error) {
                this.handleDBExceptions(error);
            }
        }
        if (devicesToInsert.length > 0) {
            try {
                for (const device of devicesToInsert) {
                    const fieldDevice = new fieldDevice_entity_1.FieldDevice();
                    fieldDevice.idDevice = device.idDevice;
                    await fieldDevice.save();
                }
            }
            catch (error) {
                this.handleDBExceptions(error);
            }
        }
        if (invalidSerialNumbers.length > 0) {
            return new ServerMessage_class_1.ServerMessage(true, `Algunos números de serie ya existen o no fueron encontrados: ${invalidSerialNumbers.join(', ')}, validos: ${devicesToInsert.join(', ')}`, 201);
        }
        else {
            return new ServerMessage_class_1.ServerMessage(false, 'Se registraron todos los dispositivos correctamente', 201);
        }
    }
    async deleteDeviceFromField(serialNumbers) {
        const serialNumbersArray = serialNumbers.split(',').map(serial => serial.trim());
        const deletedMessages = [];
        for (const serialNumber of serialNumbersArray) {
            try {
                const deviceExist = await this.findDeviceBySerialNumber(serialNumber);
                const fieldDevice = await this.findFieldDeviceByDeviceId(deviceExist.idDevice);
                await fieldDevice.destroy();
                deletedMessages.push(new ServerMessage_class_1.ServerMessage(true, `El dispositivo con número de serie ${serialNumber} ha sido eliminado de la tabla field_devices`, 200));
            }
            catch (error) {
                deletedMessages.push(new ServerMessage_class_1.ServerMessage(false, `Error al eliminar el dispositivo con número de serie ${serialNumber}`, 400));
            }
        }
        return deletedMessages;
    }
    async findDeviceBySerialNumber(serialNumber) {
        const deviceExist = await this.deviceRepository.findOne({
            where: { serialNumber: serialNumber },
        });
        return deviceExist;
    }
    async findFieldDeviceByDeviceId(deviceId) {
        const fieldDevice = await this.fieldDeviceRepository.findOne({
            where: { idDevice: deviceId },
        });
        return fieldDevice;
    }
    handleDBExceptions(error) {
        if (error.code === 19) {
            throw new common_1.HttpException(error.code, common_1.HttpStatus.BAD_REQUEST);
        }
        if (error.name === 'SequelizeUniqueConstraintError') {
            throw new common_1.HttpException(error.message, common_1.HttpStatus.BAD_REQUEST);
        }
        if (error.status === 404) {
            throw new common_1.HttpException(error.message, common_1.HttpStatus.FORBIDDEN);
        }
        if (error.status === 400) {
            throw new common_1.HttpException(error.message, error.status);
        }
        throw new common_1.HttpException('Unexpected error, check server logs', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
    }
};
FieldtestService = __decorate([
    common_1.Injectable(),
    __param(0, common_1.Inject('FieldDeviceRepository')),
    __param(1, common_1.Inject('DeviceRepository')),
    __param(2, common_1.Inject('WaterHistoryRepository')),
    __metadata("design:paramtypes", [Object, Object, Object])
], FieldtestService);
exports.FieldtestService = FieldtestService;
//# sourceMappingURL=fieldtest.service.js.map