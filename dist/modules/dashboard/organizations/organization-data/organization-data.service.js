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
exports.OrganizationDataService = void 0;
const common_1 = require("@nestjs/common");
const ServerMessage_class_1 = require("./../../../../classes/ServerMessage.class");
const organization_entity_1 = require("./../../../../models/organization.entity");
const user_entity_1 = require("./../../../../models/user.entity");
const regions_entity_1 = require("../../../../models/regions.entity");
const zones_entity_1 = require("../../../../models/zones.entity");
const stations_entity_1 = require("../../../../models/stations.entity");
const sequelize_1 = require("sequelize");
const deviceStation_entity_1 = require("../../../../models/deviceStation.entity");
const device_entity_1 = require("../../../../models/device.entity");
const gasHistory_entity_1 = require("../../../../models/gasHistory.entity");
let OrganizationDataService = class OrganizationDataService {
    constructor(organizationRepository, userRepository, logger) {
        this.organizationRepository = organizationRepository;
        this.userRepository = userRepository;
        this.logger = logger;
    }
    async getOrganizationData(user) {
        try {
            const organization = await this.organizationRepository.findOne({
                where: {
                    idOrganization: user.idOrganization,
                },
            });
            if (!organization) {
                throw new Error('Organización no encontrada');
            }
            const includeStructure = [
                {
                    model: organization_entity_1.Organization,
                    as: 'organization',
                    include: []
                }
            ];
            if (organization.type === 1) {
                console.log('se agrego lo de gas');
                includeStructure[0].include.push({
                    model: regions_entity_1.Regions,
                    as: 'regions',
                    include: [
                        {
                            model: zones_entity_1.Zones,
                            as: 'zones',
                            include: [
                                {
                                    model: stations_entity_1.Stations,
                                    as: 'stations'
                                }
                            ]
                        }
                    ]
                }, {
                    model: stations_entity_1.Stations,
                    as: 'stations'
                });
            }
            const userWithOrganization = await this.userRepository.findOne({
                where: {
                    idUser: user.idUser,
                },
                include: includeStructure
            });
            if (organization.type === 0) {
                console.log('Organizacion tipo 0 - root');
                return new ServerMessage_class_1.ServerMessage(false, 'Datos enviados correctamente', {
                    organization: userWithOrganization.organization,
                });
            }
            if (organization.type === 1) {
                console.log('Organizacion tipo 1 - gas');
                return new ServerMessage_class_1.ServerMessage(false, 'Datos enviados correctamente', {
                    organization: userWithOrganization.organization,
                });
            }
            return new ServerMessage_class_1.ServerMessage(false, 'Datos enviados correctamente', {
                organization: userWithOrganization.organization,
            });
        }
        catch (error) {
            this.logger.error(error);
            return new ServerMessage_class_1.ServerMessage(true, 'A ocurrido un error', error);
        }
    }
    async findRegionsByOrganization(idOrganization) {
        try {
            const regions = await regions_entity_1.Regions.findAll({
                where: {
                    idOrganization: idOrganization
                }
            });
            return new ServerMessage_class_1.ServerMessage(false, 'Regiones obtenida exitosamente', regions);
        }
        catch (error) {
            this.logger.error(error);
            return new ServerMessage_class_1.ServerMessage(true, 'A ocurrido un error', error);
        }
    }
    async createOrganizationRegion(createRegion) {
        try {
            const region = await regions_entity_1.Regions.create({
                idOrganization: createRegion.idOrganization,
                name: createRegion.name,
            });
            return new ServerMessage_class_1.ServerMessage(false, 'Región creada exitosamente', region);
        }
        catch (error) {
            this.logger.error(error);
            return new ServerMessage_class_1.ServerMessage(true, 'A ocurrido un error', error);
        }
    }
    async updateOrganizationRegion(idRegion, editOrganizationRegionDto) {
        try {
            const region = await regions_entity_1.Regions.findByPk(idRegion);
            if (!region) {
                return new ServerMessage_class_1.ServerMessage(true, 'Región no encontrada', null);
            }
            region.name = editOrganizationRegionDto.name;
            await region.save();
            return new ServerMessage_class_1.ServerMessage(false, 'Región actualizada exitosamente', region);
        }
        catch (error) {
            this.logger.error(error);
            return new ServerMessage_class_1.ServerMessage(true, 'A ocurrido un error', error);
        }
    }
    async deleteOrganizationRegion(idRegion) {
        try {
            const region = await regions_entity_1.Regions.findByPk(idRegion);
            if (!region) {
                return new ServerMessage_class_1.ServerMessage(true, 'Región no encontrada', null);
            }
            await region.destroy();
            return new ServerMessage_class_1.ServerMessage(false, 'Región eliminada exitosamente', null);
        }
        catch (error) {
            this.logger.error(error);
            return new ServerMessage_class_1.ServerMessage(true, 'A ocurrido un error', error);
        }
    }
    async findZoneByRegion(idRegion) {
        try {
            const zones = await zones_entity_1.Zones.findAll({
                where: {
                    idRegion: idRegion
                }
            });
            return new ServerMessage_class_1.ServerMessage(false, 'Zonas obtenida correctamente', zones);
        }
        catch (error) {
            this.logger.error(error);
            return new ServerMessage_class_1.ServerMessage(true, 'A ocurrido un error', error);
        }
    }
    async findZoneByOrganization(idOrganization) {
        try {
            const zones = await zones_entity_1.Zones.findAll({
                where: {
                    idOrganization: idOrganization
                }
            });
            return new ServerMessage_class_1.ServerMessage(false, 'Zonas obtenida correctamente', zones);
        }
        catch (error) {
            this.logger.error(error);
            return new ServerMessage_class_1.ServerMessage(true, 'A ocurrido un error', error);
        }
    }
    async createRegionZone(createZoneDto) {
        try {
            const zone = await zones_entity_1.Zones.create({
                idRegion: createZoneDto.idRegion,
                name: createZoneDto.name,
                idOrganization: createZoneDto.idOrganization
            });
            return new ServerMessage_class_1.ServerMessage(false, 'Zona creada exitosamente', zone);
        }
        catch (error) {
            this.logger.error(error);
            if (error.parent.code == "ER_NO_REFERENCED_ROW_2") {
                return { error: true, message: 'Error al crear la estación', data: "No existe la region o la organizacion" };
            }
            else {
                return { error: true, message: 'Error al crear la estación', data: error };
            }
        }
    }
    async updateZone(idZone, editZoneDto) {
        try {
            const zone = await zones_entity_1.Zones.findByPk(idZone);
            if (!zone) {
                return new ServerMessage_class_1.ServerMessage(false, 'Zona no encontrada', idZone);
            }
            await zones_entity_1.Zones.update({
                idRegion: editZoneDto.idRegion,
                name: editZoneDto.name,
            }, {
                where: {
                    idZone: idZone
                }
            });
            return new ServerMessage_class_1.ServerMessage(false, 'Se actualizo correctamente la zona', "Todo ok");
        }
        catch (error) {
            this.logger.error(error);
            if (error.parent.code == "ER_NO_REFERENCED_ROW_2") {
                return { error: true, message: 'Error al crear la estación', data: "No existe la region" };
            }
            else {
                return { error: true, message: 'Error al crear la estación', data: error };
            }
        }
    }
    async deleteZone(idZone) {
        try {
            const zone = await zones_entity_1.Zones.findByPk(idZone);
            if (!zone) {
                return new ServerMessage_class_1.ServerMessage(false, 'Zona no encontrada', idZone);
            }
            await zone.destroy();
            return new ServerMessage_class_1.ServerMessage(false, 'Zona eliminada correctamente', idZone);
        }
        catch (error) {
            this.logger.error(error);
            return new ServerMessage_class_1.ServerMessage(true, 'Error interno al eliminar la zona', idZone);
        }
    }
    async createStation(createStationDto) {
        try {
            const station = await stations_entity_1.Stations.create(createStationDto);
            return { error: false, message: 'Estación creada exitosamente', data: station };
        }
        catch (error) {
            this.logger.error(error);
            if (error.parent.code == "ER_NO_REFERENCED_ROW_2") {
                return { error: true, message: 'Error al crear la estación', data: "La organizacion, la zona o el supervisor no son validos" };
            }
            else {
                return { error: true, message: 'Error al crear la estación', data: error };
            }
        }
    }
    async getStationsByZone(idZone) {
        try {
            const stations = await stations_entity_1.Stations.findAll({
                where: { idZone: idZone },
                include: [zones_entity_1.Zones]
            });
            return { error: false, message: 'Estaciones obtenidas exitosamente', data: stations };
        }
        catch (error) {
            this.logger.error(error);
            return { error: true, message: 'Error al obtener las estaciones', data: null };
        }
    }
    async getStationsByOrganization(idOrganization) {
        try {
            const stations = await stations_entity_1.Stations.findAll({
                where: { idOrganization: idOrganization }
            });
            return { error: false, message: 'Estaciones obtenidas exitosamente', data: stations };
        }
        catch (error) {
            this.logger.error(error);
            return { error: true, message: 'Error al obtener las estaciones', data: null };
        }
    }
    async updateStation(idStation, updateStationDto) {
        try {
            const station = await stations_entity_1.Stations.findByPk(idStation);
            if (!station) {
                return { error: true, message: 'Estación no encontrada', data: null };
            }
            await station.update(updateStationDto);
            return { error: false, message: 'Estación actualizada exitosamente', data: station };
        }
        catch (error) {
            this.logger.error(error);
            if (error.parent.code == "ER_NO_REFERENCED_ROW_2") {
                return { error: true, message: 'Error al crear la estación', data: "La organizacion, la zona o el supervisor no son validos" };
            }
            else {
                return { error: true, message: 'Error al crear la estación', data: error };
            }
        }
    }
    async deleteStation(idStation) {
        try {
            const station = await stations_entity_1.Stations.findByPk(idStation);
            if (!station) {
                return { error: true, message: 'Estación no encontrada', data: null };
            }
            await station.destroy();
            return { error: false, message: 'Estación eliminada exitosamente', data: null };
        }
        catch (error) {
            this.logger.error(error);
            return { error: true, message: 'Error al eliminar la estación', data: null };
        }
    }
    async findDeviceByStation(idStation) {
        try {
            const devices = await deviceStation_entity_1.DeviceStation.findAll({
                where: {
                    idStation: idStation
                },
                include: [
                    {
                        model: device_entity_1.Device,
                        include: [gasHistory_entity_1.GasHistory]
                    },
                    stations_entity_1.Stations
                ]
            });
            return { error: false, message: 'Dispositivos obtenidos exitosamente', data: devices };
        }
        catch (error) {
            this.logger.error(error);
            return { error: true, message: 'Error al buscar los dispositivos de la estación', data: null };
        }
    }
    async findDeviceByZone(idZone) {
        try {
            const devices = await deviceStation_entity_1.DeviceStation.findAll({
                where: {
                    '$stations.idZone$': idZone
                },
                include: [
                    {
                        model: device_entity_1.Device,
                        include: [gasHistory_entity_1.GasHistory]
                    },
                    stations_entity_1.Stations
                ]
            });
            return { error: false, message: 'Dispositivos obtenidos exitosamente', data: devices };
        }
        catch (error) {
            this.logger.error(error);
            return { error: true, message: 'Error al buscar los dispositivos de la estación', data: null };
        }
    }
    async findDeviceByRegion(idRegion) {
        try {
            const devices = await deviceStation_entity_1.DeviceStation.findAll({
                where: { idDevice: { [sequelize_1.Op.ne]: null } },
                include: [
                    {
                        model: device_entity_1.Device,
                        include: [gasHistory_entity_1.GasHistory],
                        right: true
                    }, {
                        model: stations_entity_1.Stations,
                        right: true,
                        include: [{
                                model: zones_entity_1.Zones,
                                right: true,
                                include: [{
                                        model: regions_entity_1.Regions,
                                        where: { idRegion: idRegion },
                                    }]
                            }]
                    },
                ]
            });
            return { error: false, message: 'Dispositivos obtenidos exitosamente', data: devices };
        }
        catch (error) {
            this.logger.error(error);
            return { error: true, message: 'Error al buscar los dispositivos de la estación', data: null };
        }
    }
    async findAllDevicesByOrganization(idOrganization) {
        try {
            const devices = await deviceStation_entity_1.DeviceStation.findAll({
                where: { idDevice: { [sequelize_1.Op.ne]: null } },
                include: [
                    {
                        model: device_entity_1.Device,
                        include: [gasHistory_entity_1.GasHistory],
                        right: true
                    }, {
                        model: stations_entity_1.Stations,
                        right: true,
                        include: [{
                                model: zones_entity_1.Zones,
                                right: true,
                                include: [{
                                        model: regions_entity_1.Regions,
                                        where: { idOrganization: idOrganization },
                                    }]
                            }]
                    },
                ]
            });
            return { error: false, message: 'Dispositivo asignado correctamente', data: devices };
        }
        catch (error) {
            this.logger.error(error);
            return { error: true, message: 'Error al buscar los dispositivos de la estación', data: null };
        }
    }
    async createDeviceInStation(createDeviceStationDto, device) {
        try {
            const validarZona = await stations_entity_1.Stations.findOne({
                where: {
                    idStation: createDeviceStationDto.idStation
                }
            });
            const deviceInfo = await this.validarNombreSerial(device);
            if (deviceInfo == null) {
                return { error: true, message: 'El dispositivo no existe', data: null };
            }
            if (deviceInfo["idOrganization"] != validarZona.idOrganization) {
                return { error: true, message: 'El dispositivo no pertenece a la organizacion', data: null };
            }
            createDeviceStationDto.idDevice = deviceInfo["idDevice"];
            const deviceStation = await deviceStation_entity_1.DeviceStation.create(createDeviceStationDto);
            return { error: false, message: 'Dispositivo asignado correctamente', data: deviceStation };
        }
        catch (error) {
            this.logger.error(error);
            return { error: true, message: 'Error al asignar el dispositivos en la estacion', data: null };
        }
    }
    async validarNombreSerial(device) {
        const validarSerial = await device_entity_1.Device.findOne({
            where: {
                serialNumber: device
            }
        });
        if (validarSerial == null) {
            const validarNombre = await device_entity_1.Device.findOne({
                where: {
                    name: device
                }
            });
            if (validarNombre == null) {
                return null;
            }
            return validarNombre;
        }
        return validarSerial;
    }
    async deleteDeviceInStation(idDevice) {
        try {
            const station = await deviceStation_entity_1.DeviceStation.findOne({
                where: {
                    idDevice: idDevice,
                }
            });
            await station.destroy();
            return { error: false, message: 'Dispositivo eliminado de la estacion correctamente', data: null };
        }
        catch (error) {
            this.logger.error(error);
            return { error: true, message: 'Error al eliminar el dispositivos en la estacion', data: null };
        }
    }
    async findSupervisorList(idOrganization) {
        try {
            const supervisorList = await user_entity_1.User.findAll({
                where: {
                    idOrganization: idOrganization
                }
            });
            return { error: false, message: 'Supervisores encontrados correctamente', data: supervisorList };
        }
        catch (error) {
            this.logger.error(error);
            return { error: true, message: 'Error al asignar el dispositivos en la estacion', data: null };
        }
    }
};
OrganizationDataService = __decorate([
    common_1.Injectable(),
    __param(0, common_1.Inject('OrganizationRepository')),
    __param(1, common_1.Inject('UserRepository')),
    __param(2, common_1.Inject('winston')),
    __metadata("design:paramtypes", [Object, Object, Object])
], OrganizationDataService);
exports.OrganizationDataService = OrganizationDataService;
//# sourceMappingURL=organization-data.service.js.map