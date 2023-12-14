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
const town_entity_1 = require("./../../../../models/town.entity");
const user_entity_1 = require("../../../../models/user.entity");
const ServerMessage_class_1 = require("../../../../classes/ServerMessage.class");
const state_entity_1 = require("./../../../../models/state.entity");
const device_entity_1 = require("../../../../models/device.entity");
const organization_entity_1 = require("../../../../models/organization.entity");
const waterSettings_entity_1 = require("../../../../models/waterSettings.entity");
const gasSettings_entity_1 = require("../../../../models/gasSettings.entity");
const apn_entity_1 = require("../../../../models/apn.entity");
let DevicesService = class DevicesService {
    constructor(deviceRepository, waterHistoryRepository, gasHistoryRepository, waterSettingsRepository, gasSettingsRepository, userRepository, stateRepository, townRepository, apnRepository, logger) {
        this.deviceRepository = deviceRepository;
        this.waterHistoryRepository = waterHistoryRepository;
        this.gasHistoryRepository = gasHistoryRepository;
        this.waterSettingsRepository = waterSettingsRepository;
        this.gasSettingsRepository = gasSettingsRepository;
        this.userRepository = userRepository;
        this.stateRepository = stateRepository;
        this.townRepository = townRepository;
        this.apnRepository = apnRepository;
        this.logger = logger;
    }
    async getApnCatalog() {
        try {
            let apnCatalog = await this.apnRepository.findAll({});
            return new ServerMessage_class_1.ServerMessage(false, 'Catalogo de apns obtenido con éxito', {
                apnCatalog: apnCatalog,
            });
        }
        catch (error) {
            return new ServerMessage_class_1.ServerMessage(true, 'Ha ocurrido un error', error);
        }
    }
    async getCheckDeviceExist(technician, body) {
        try {
            if (technician == null ||
                technician == undefined ||
                body.serialNumber == null ||
                body.serialNumber == undefined ||
                body.type == null ||
                body.type == undefined) {
                return new ServerMessage_class_1.ServerMessage(true, 'Petición incompleta', {});
            }
            let deviceData = await this.deviceRepository.findOne({
                where: {
                    serialNumber: body.serialNumber,
                    idOrganization: technician.idOrganization,
                    type: parseInt(body.type),
                },
            });
            if (!deviceData) {
                return new ServerMessage_class_1.ServerMessage(true, 'Dispositivo no disponible', {
                    serialNumber: body.serialNumber,
                    idOrganization: technician.idOrganization,
                    type: parseInt(body.type),
                });
            }
            return new ServerMessage_class_1.ServerMessage(false, 'Dispositivo obtenido con éxito', {
                idDevice: deviceData.idDevice,
            });
        }
        catch (error) {
            this.logger.error(error);
            return new ServerMessage_class_1.ServerMessage(true, 'Ha ocurrido un error', error);
        }
    }
    async getWaterDeviceSettings(technician, idDevice) {
        try {
            if (technician == null ||
                technician == undefined ||
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
                        attributes: { exclude: ['imei'] },
                        model: device_entity_1.Device,
                        as: 'device',
                        where: {
                            idOrganization: technician.idOrganization,
                            type: 1,
                        },
                    },
                ],
            });
            if (!waterSettings) {
                return new ServerMessage_class_1.ServerMessage(true, 'Dispositivo no disponible', {});
            }
            let deviceData = await this.deviceRepository.findOne({
                attributes: { exclude: ['imei'] },
                where: {
                    idDevice: idDevice,
                    idOrganization: technician.idOrganization,
                    type: 1,
                },
                include: [
                    {
                        model: apn_entity_1.Apn,
                        as: 'apn',
                    },
                    {
                        model: organization_entity_1.Organization,
                        as: 'organization',
                        required: true,
                        include: [
                            {
                                model: user_entity_1.User,
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
                waterSettings: waterSettings,
                actualTown: deviceData.town,
                actualApn: deviceData.apn,
            });
        }
        catch (error) {
            this.logger.error(error);
            return new ServerMessage_class_1.ServerMessage(true, 'Ha ocurrido un error', error);
        }
    }
    async syncWaterSettingsNewData(technician, body, isNfc) {
        try {
            if (technician == null ||
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
                isNfc == undefined) {
                return new ServerMessage_class_1.ServerMessage(true, 'Petición incompleta', {});
            }
            let deviceData = await this.deviceRepository.findOne({
                where: {
                    serialNumber: body.serialNumber,
                    idOrganization: technician.idOrganization,
                    type: body.type,
                },
                include: [
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
            if (!deviceData) {
                return new ServerMessage_class_1.ServerMessage(true, 'Dispositivo no disponible', {});
            }
            if (body.type == 0) {
            }
            else if (body.type == 1 &&
                body.newWatterSettings != null &&
                body.newWatterSettings != undefined) {
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
                    return new ServerMessage_class_1.ServerMessage(false, 'Ajustes sincronizados con éxito', {});
                }
                else {
                    return new ServerMessage_class_1.ServerMessage(false, 'Ajustes guardados con éxito', {});
                }
            }
            else {
                return new ServerMessage_class_1.ServerMessage(true, 'Ajustes inválidos', {});
            }
        }
        catch (error) {
            this.logger.error(error);
            return new ServerMessage_class_1.ServerMessage(true, 'Ha ocurrido un error', error);
        }
    }
    async getDeviceTechnicianAddressSettings(technician, idDevice) {
        try {
            if (technician == null ||
                technician == undefined ||
                idDevice == null ||
                idDevice == undefined) {
                return new ServerMessage_class_1.ServerMessage(true, 'Petición incompleta', {});
            }
            let deviceData = await this.deviceRepository.findOne({
                attributes: { exclude: ['imei'] },
                where: {
                    idDevice: idDevice,
                    idOrganization: technician.idOrganization,
                },
                include: [
                    {
                        model: user_entity_1.User,
                        as: 'user',
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
            this.logger.error(error);
            return new ServerMessage_class_1.ServerMessage(true, 'Ha ocurrido un error', error);
        }
    }
    async updateDeviceTechnicianAddressSettings(technician, device) {
        try {
            if (technician == null ||
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
                device.zipCode == undefined) {
                return new ServerMessage_class_1.ServerMessage(true, 'Petición incompleta', {});
            }
            else if (device.latitude == 0 || device.longitude == 0) {
                return new ServerMessage_class_1.ServerMessage(true, 'Coordenadas incorrectas', {});
            }
            let deviceData = await this.deviceRepository.findOne({
                where: {
                    idDevice: device.idDevice,
                    idOrganization: technician.idOrganization,
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
            this.logger.error(error);
            return new ServerMessage_class_1.ServerMessage(true, 'Ha ocurrido un error', error);
        }
    }
    async updateDeviceOnOffSettingsNFC(user, body) {
        try {
            if (body.type === undefined ||
                body.type === null ||
                body.isOn === undefined ||
                body.isOn === null ||
                body.serialNumber === undefined ||
                body.serialNumber === null) {
                return new ServerMessage_class_1.ServerMessage(true, 'Petición incompleta', {});
            }
            let device = await this.deviceRepository.findOne({
                where: {
                    type: body.type,
                    serialNumber: body.serialNumber,
                },
                include: [
                    {
                        model: waterSettings_entity_1.WaterSettings,
                        as: 'waterSettings',
                    },
                ],
            });
            device.waterSettings.isOn = body.isOn;
            await device.waterSettings.save();
            return new ServerMessage_class_1.ServerMessage(false, 'Operación realizada con éxito', {});
        }
        catch (error) {
            this.logger.error(error);
            return new ServerMessage_class_1.ServerMessage(true, 'Ha ocurrido un error', error);
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
    __param(5, common_1.Inject('UserRepository')),
    __param(6, common_1.Inject('StateRepository')),
    __param(7, common_1.Inject('TownRepository')),
    __param(8, common_1.Inject('ApnRepository')),
    __param(9, common_1.Inject('winston')),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object, Object, Object, Object, Object, Object])
], DevicesService);
exports.DevicesService = DevicesService;
//# sourceMappingURL=devices.service.js.map