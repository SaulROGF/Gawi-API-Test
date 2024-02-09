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
exports.AdministratorService = void 0;
const dataloggerHistory_entity_1 = require("./../../../../models/dataloggerHistory.entity");
const role_entity_1 = require("./../../../../models/role.entity");
const town_entity_1 = require("./../../../../models/town.entity");
const user_entity_1 = require("./../../../../models/user.entity");
const common_1 = require("@nestjs/common");
const ServerMessage_class_1 = require("../../../../classes/ServerMessage.class");
const state_entity_1 = require("../../../../models/state.entity");
const sequelize_1 = require("sequelize");
const device_entity_1 = require("../../../../models/device.entity");
const organization_entity_1 = require("../../../../models/organization.entity");
const devices_service_1 = require("../../clients/devices/devices.service");
const waterHistory_entity_1 = require("../../../../models/waterHistory.entity");
const waterSettings_entity_1 = require("../../../../models/waterSettings.entity");
const billingInformation_entity_1 = require("../../../../models/billingInformation.entity");
const gasHistory_entity_1 = require("../../../../models/gasHistory.entity");
const apn_entity_1 = require("../../../../models/apn.entity");
const gasSettings_entity_1 = require("../../../../models/gasSettings.entity");
const factur_api_service_1 = require("../../../../modules/global/factur-api/factur-api.service");
const utilities_1 = require("./../../../../utils/utilities");
const dataloggerSettings_entity_1 = require("../../../../models/dataloggerSettings.entity");
const fs = require("fs");
const datalogger_adapter_1 = require("../../devices/devices/classes/datalogger.adapter");
const naturalGasHistory_entity_1 = require("../../../../models/naturalGasHistory.entity");
let AdministratorService = class AdministratorService {
    constructor(devicesService, facturapiService, userRepository, organizationRepository, gasHistoryRepository, stateRepository, deviceRepository, waterHistoryRepository, dataloggerHistoryRepository, naturalGasHistoryRepository, apnRepository, logger) {
        this.devicesService = devicesService;
        this.facturapiService = facturapiService;
        this.userRepository = userRepository;
        this.organizationRepository = organizationRepository;
        this.gasHistoryRepository = gasHistoryRepository;
        this.stateRepository = stateRepository;
        this.deviceRepository = deviceRepository;
        this.waterHistoryRepository = waterHistoryRepository;
        this.dataloggerHistoryRepository = dataloggerHistoryRepository;
        this.naturalGasHistoryRepository = naturalGasHistoryRepository;
        this.apnRepository = apnRepository;
        this.logger = logger;
    }
    async getHomeAdminData() {
        try {
            let totalDevices = await this.deviceRepository.count({});
            let totalGasDevices = await this.deviceRepository.count({
                where: {
                    type: 0
                }
            });
            let totalAssignedGasDevices = await this.deviceRepository.count({
                where: {
                    type: 0,
                },
                include: [{
                        model: user_entity_1.User,
                        as: 'user',
                        where: {
                            idRole: 7
                        }
                    }]
            });
            let totalWaterDevices = await this.deviceRepository.count({
                where: {
                    type: 1
                }
            });
            let totalAssignedWaterDevices = await this.deviceRepository.count({
                where: {
                    type: 1
                },
                include: [{
                        model: user_entity_1.User,
                        as: 'user',
                        where: {
                            idRole: 7
                        }
                    }]
            });
            let totalGasOrganizations = await this.organizationRepository.count({
                where: {
                    type: 1
                },
            });
            let totalWaterOrganizations = await this.organizationRepository.count({
                where: {
                    type: 2
                },
            });
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
            let totalUsers = await this.userRepository.count({
                where: {
                    deleted: false
                }
            });
            let totalAdminUsers = await this.userRepository.count({
                where: {
                    idRole: 1,
                    deleted: false
                }
            });
            let totalOrganizationAdminUsers = await this.userRepository.count({
                where: {
                    idRole: 2,
                    deleted: false
                }
            });
            let totalWarehouseUsers = await this.userRepository.count({
                where: {
                    idRole: 3,
                    deleted: false
                }
            });
            let totalContaUsers = await this.userRepository.count({
                where: {
                    idRole: 4,
                    deleted: false
                }
            });
            let totalDriverUsers = await this.userRepository.count({
                where: {
                    idRole: 5,
                    deleted: false
                }
            });
            let totalTechnicianUsers = await this.userRepository.count({
                where: {
                    idRole: 6,
                    deleted: false
                }
            });
            let totalClientUsers = await this.userRepository.count({
                where: {
                    idRole: 7,
                    deleted: false
                }
            });
            return new ServerMessage_class_1.ServerMessage(false, "Datos de la vista del home obtenida", {
                totalDevices: totalDevices,
                totalGasDevices: totalGasDevices,
                totalAssignedGasDevices: totalAssignedGasDevices,
                totalWaterDevices: totalWaterDevices,
                totalAssignedWaterDevices: totalAssignedWaterDevices,
                totalGasOrganizations: totalGasOrganizations,
                totalWaterOrganizations: totalWaterOrganizations,
                actualWeekProduction: {
                    barChartData: [{
                            label: 'Gas',
                            lineTension: 0.1,
                            data: valuesGas,
                        }, {
                            label: 'Agua',
                            lineTension: 0.1,
                            data: valuesWater,
                        }],
                    barChartLabels: datesLabels,
                },
                totalUsers: totalUsers,
                totalAdminUsers: totalAdminUsers,
                totalOrganizationAdminUsers: totalOrganizationAdminUsers,
                totalWarehouseUsers: totalWarehouseUsers,
                totalContaUsers: totalContaUsers,
                totalDriverUsers: totalDriverUsers,
                totalTechnicianUsers: totalTechnicianUsers,
                totalClientUsers: totalClientUsers
            });
        }
        catch (error) {
            this.logger.error(error);
            return new ServerMessage_class_1.ServerMessage(true, "A ocurrido un error", error);
        }
    }
    async getAllAccountUsersData() {
        try {
            let usersAccount = await this.userRepository.findAll({
                attributes: { exclude: ['idConektaAccount', 'password', 'passwordFacebook', 'passwordGoogle'] },
                include: [{
                        model: town_entity_1.Town,
                        as: 'town',
                        include: [{
                                model: state_entity_1.State,
                                as: 'state',
                            }]
                    }, {
                        attributes: ['idDevice', 'idUser'],
                        model: device_entity_1.Device,
                        as: 'devices',
                    }, {
                        attributes: { exclude: ['facturapiToken'] },
                        model: organization_entity_1.Organization,
                        as: 'organization'
                    }]
            });
            return new ServerMessage_class_1.ServerMessage(false, "Datos de la vista de clientes de la organizacion obtenida con éxito", {
                usersAccount: usersAccount,
            });
        }
        catch (error) {
            this.logger.error(JSON.stringify(error));
            return new ServerMessage_class_1.ServerMessage(true, "A ocurrido un error", error);
        }
    }
    async getOrganizationClientsAdminData(idOrganization) {
        try {
            if (idOrganization == null ||
                idOrganization == undefined) {
                return new ServerMessage_class_1.ServerMessage(true, "Campos inválidos", {});
            }
            let clientUsers = await this.userRepository.findAll({
                attributes: { exclude: ['idConektaAccount', 'password', 'passwordFacebook', 'passwordGoogle'] },
                where: {
                    idRole: 7,
                    deleted: false
                },
                include: [{
                        model: town_entity_1.Town,
                        as: 'town',
                        include: [{
                                model: state_entity_1.State,
                                as: 'state',
                            }]
                    }, {
                        attributes: ['idDevice', 'idUser'],
                        model: device_entity_1.Device,
                        as: 'devices',
                        required: true,
                        where: {
                            idOrganization: idOrganization,
                        }
                    }]
            }).map(async (userData) => {
                let userDevices = await this.deviceRepository.count({
                    where: {
                        idUser: userData.idUser,
                        idOrganization: idOrganization,
                    },
                });
                let userFix = userData.toJSON();
                userFix.devices = userDevices;
                return Object.assign(userFix);
            });
            ;
            return new ServerMessage_class_1.ServerMessage(false, "Datos de la vista de clientes de la organizacion obtenida con éxito", {
                clientUsers: clientUsers,
            });
        }
        catch (error) {
            this.logger.error(JSON.stringify(error));
            return new ServerMessage_class_1.ServerMessage(true, "A ocurrido un error", error);
        }
    }
    async getClientProfileData(idUser, organization, idRole) {
        try {
            if (idUser == null ||
                idUser == undefined ||
                idRole == null ||
                idRole == undefined) {
                return new ServerMessage_class_1.ServerMessage(true, "Campos inválidos", {});
            }
            let userClientData;
            if (idRole == 1) {
                userClientData = await this.userRepository.findOne({
                    attributes: { exclude: ['password', 'passwordFacebook', 'passwordGoogle'] },
                    where: {
                        idUser: idUser,
                        idRole: 7,
                        idOrganization: organization,
                    },
                    include: [{
                            attributes: { exclude: ['imei'] },
                            model: device_entity_1.Device,
                            as: 'devices',
                            include: [{
                                    model: town_entity_1.Town,
                                    as: 'town',
                                    include: [{
                                            model: state_entity_1.State,
                                            as: 'state',
                                        }]
                                }, {
                                    attributes: { exclude: ['facturapiToken'] },
                                    model: organization_entity_1.Organization,
                                    as: 'organization',
                                }, {
                                    model: user_entity_1.User,
                                    as: 'user',
                                    include: [{
                                            model: town_entity_1.Town,
                                            as: 'town',
                                            include: [{
                                                    model: state_entity_1.State,
                                                    as: 'state',
                                                }]
                                        }, {
                                            model: role_entity_1.Role,
                                            as: 'role',
                                        }]
                                },]
                        }, {
                            model: town_entity_1.Town,
                            as: 'town',
                            include: [{
                                    model: state_entity_1.State,
                                    as: 'state'
                                }]
                        }, {
                            model: billingInformation_entity_1.BillingInformation,
                            as: 'billingInformation'
                        }]
                });
                if (!userClientData) {
                    return new ServerMessage_class_1.ServerMessage(true, "Usuario no disponible", {});
                }
            }
            else {
                userClientData = await this.userRepository.findOne({
                    attributes: { exclude: ['password', 'passwordFacebook', 'passwordGoogle'] },
                    where: {
                        idUser: idUser,
                        idRole: 7,
                    },
                    include: [{
                            attributes: { exclude: ['imei'] },
                            model: device_entity_1.Device,
                            as: 'devices',
                            required: true,
                            where: {
                                idOrganization: organization,
                            },
                            include: [{
                                    model: town_entity_1.Town,
                                    as: 'town',
                                    include: [{
                                            model: state_entity_1.State,
                                            as: 'state',
                                        }]
                                }, {
                                    attributes: { exclude: ['facturapiToken'] },
                                    model: organization_entity_1.Organization,
                                    as: 'organization',
                                }, {
                                    model: user_entity_1.User,
                                    as: 'user',
                                    include: [{
                                            model: town_entity_1.Town,
                                            as: 'town',
                                            include: [{
                                                    model: state_entity_1.State,
                                                    as: 'state',
                                                }]
                                        }, {
                                            model: role_entity_1.Role,
                                            as: 'role',
                                        }]
                                },]
                        }, {
                            model: town_entity_1.Town,
                            as: 'town',
                            include: [{
                                    model: state_entity_1.State,
                                    as: 'state'
                                }]
                        }, {
                            model: billingInformation_entity_1.BillingInformation,
                            as: 'billingInformation'
                        }]
                });
                if (!userClientData) {
                    return new ServerMessage_class_1.ServerMessage(true, "Usuario no disponible", {});
                }
            }
            let userDataFixed = userClientData.toJSON();
            userDataFixed.devices = userClientData.devices.map((deviceData) => {
                return Object.assign({
                    idDevice: deviceData.idDevice,
                    serialNumber: deviceData.serialNumber,
                    type: deviceData.type,
                    version: deviceData.version,
                    boardVersion: deviceData.boardVersion,
                    firmwareVersion: deviceData.firmwareVersion,
                    batteryDate: deviceData.batteryDate,
                    createdAt: deviceData.createdAt,
                    fullLocation: deviceData.town.name + " ," + deviceData.town.state.name,
                    comercialName: deviceData.organization.comercialName,
                    logoUrl: deviceData.organization.logoUrl,
                    email: deviceData.user.email,
                    idUserRole: deviceData.user.idRole,
                    userRoleName: deviceData.user.role.name,
                });
            });
            return new ServerMessage_class_1.ServerMessage(false, "Datos del perfil del cliente obtenidos", {
                userClientData: userDataFixed,
            });
        }
        catch (error) {
            console.log(error);
            this.logger.error(JSON.stringify(error));
            return new ServerMessage_class_1.ServerMessage(true, "A ocurrido un error", error);
        }
    }
    async getOrganizationUsersAdminData(idOrganization, idRole) {
        try {
            if (idOrganization == null ||
                idOrganization == undefined ||
                idRole == null ||
                idRole == undefined) {
                return new ServerMessage_class_1.ServerMessage(true, "Campos inválidos", {});
            }
            let warehouseUsers = await this.userRepository.findAll({
                where: {
                    idRole: idRole,
                    idOrganization: idOrganization,
                    deleted: false
                },
                include: [{
                        model: town_entity_1.Town,
                        as: 'town',
                        include: [{
                                model: state_entity_1.State,
                                as: 'state',
                            }]
                    }]
            });
            let states = await this.stateRepository.findAll({
                include: [{
                        model: town_entity_1.Town,
                        as: 'towns',
                    }]
            });
            return new ServerMessage_class_1.ServerMessage(false, "Datos de la vista de usuarios del almacén obtenida con éxito", {
                warehouseUsers: warehouseUsers,
                states: states
            });
        }
        catch (error) {
            this.logger.error(error);
            return new ServerMessage_class_1.ServerMessage(true, "A ocurrido un error", error);
        }
    }
    async createUser(userAdminData, newUserData) {
        try {
            if (newUserData.idUser == null ||
                newUserData.idUser == undefined ||
                newUserData.idOrganization == null ||
                newUserData.idOrganization == undefined ||
                newUserData.idTown == null ||
                newUserData.idTown == undefined ||
                newUserData.idRole == null ||
                newUserData.idRole == undefined ||
                newUserData.firstName == null ||
                newUserData.firstName == undefined ||
                newUserData.lastName == null ||
                newUserData.lastName == undefined ||
                newUserData.mothersLastName == null ||
                newUserData.mothersLastName == undefined ||
                newUserData.phone == null ||
                newUserData.phone == undefined ||
                newUserData.email == null ||
                newUserData.email == undefined ||
                newUserData.password == null ||
                newUserData.password == undefined ||
                newUserData.active == null ||
                newUserData.active == undefined) {
                return new ServerMessage_class_1.ServerMessage(true, "Campos inválidos", {});
            }
            let alreadyUser = await this.userRepository.findOne({
                where: {
                    email: newUserData.email,
                    deleted: false,
                }
            });
            if (alreadyUser) {
                return new ServerMessage_class_1.ServerMessage(true, "Email actualmente registrado", {});
            }
            let newUser = await this.userRepository.create({
                idRole: newUserData.idRole,
                idTown: newUserData.idTown,
                idOrganization: userAdminData.idOrganization,
                email: newUserData.email,
                password: newUserData.password,
                firstName: newUserData.firstName,
                lastName: newUserData.lastName,
                mothersLastName: newUserData.mothersLastName,
                phone: newUserData.phone,
                passwordGoogle: newUserData.passwordGoogle,
                passwordFacebook: newUserData.passwordFacebook,
                idConektaAccount: newUserData.idConektaAccount,
                active: newUserData.active,
                deleted: false,
                lastLoginDate: newUserData.lastLoginDate,
            });
            let warehouseUsers = await this.userRepository.findAll({
                where: {
                    idRole: newUserData.idRole,
                    idOrganization: userAdminData.idOrganization,
                    deleted: false
                },
                include: [{
                        model: town_entity_1.Town,
                        as: 'town',
                        include: [{
                                model: state_entity_1.State,
                                as: 'state',
                            }]
                    }]
            });
            return new ServerMessage_class_1.ServerMessage(false, "Usuario añadido con éxito", {
                warehouseUsers: warehouseUsers
            });
        }
        catch (error) {
            this.logger.error(error);
            return new ServerMessage_class_1.ServerMessage(true, "A ocurrido un error creando el usuario", error);
        }
    }
    async updateUser(userAdminData, newUserData) {
        try {
            if (newUserData.idUser == null ||
                newUserData.idUser == undefined ||
                newUserData.idOrganization == null ||
                newUserData.idOrganization == undefined ||
                newUserData.idTown == null ||
                newUserData.idTown == undefined ||
                newUserData.idRole == null ||
                newUserData.idRole == undefined ||
                newUserData.firstName == null ||
                newUserData.firstName == undefined ||
                newUserData.lastName == null ||
                newUserData.lastName == undefined ||
                newUserData.mothersLastName == null ||
                newUserData.mothersLastName == undefined ||
                newUserData.phone == null ||
                newUserData.phone == undefined ||
                newUserData.email == null ||
                newUserData.email == undefined ||
                newUserData.active == null ||
                newUserData.active == undefined) {
                return new ServerMessage_class_1.ServerMessage(true, "Campos inválidos", {});
            }
            let alreadyUserEmail = await this.userRepository.findOne({
                where: {
                    idUser: {
                        [sequelize_1.Op.not]: newUserData.idUser,
                    },
                    email: newUserData.email,
                    deleted: false,
                }
            });
            if (alreadyUserEmail) {
                return new ServerMessage_class_1.ServerMessage(true, "Email actualmente registrado", {});
            }
            let userToUpdate = await this.userRepository.findOne({
                where: {
                    idUser: newUserData.idUser,
                    deleted: false,
                }
            });
            if (!userToUpdate) {
                return new ServerMessage_class_1.ServerMessage(true, "Usuario invalido", {});
            }
            userToUpdate.idTown = newUserData.idTown;
            userToUpdate.email = newUserData.email;
            userToUpdate.firstName = newUserData.firstName;
            userToUpdate.lastName = newUserData.lastName;
            userToUpdate.mothersLastName = newUserData.mothersLastName;
            userToUpdate.phone = newUserData.phone;
            userToUpdate.active = newUserData.active;
            await userToUpdate.save();
            let warehouseUsers = await this.userRepository.findAll({
                where: {
                    idRole: newUserData.idRole,
                    idOrganization: userAdminData.idOrganization,
                    deleted: false
                },
                include: [{
                        model: town_entity_1.Town,
                        as: 'town',
                        include: [{
                                model: state_entity_1.State,
                                as: 'state',
                            }]
                    }]
            });
            return new ServerMessage_class_1.ServerMessage(false, "Usuario actualizado con éxito", {
                warehouseUsers: warehouseUsers
            });
        }
        catch (error) {
            this.logger.error(error);
            return new ServerMessage_class_1.ServerMessage(true, "A ocurrido un error creando el usuario", error);
        }
    }
    async deleteUser(idOrganization, idUser) {
        try {
            if (idUser == null ||
                idUser == undefined ||
                idOrganization == null ||
                idOrganization == undefined) {
                return new ServerMessage_class_1.ServerMessage(true, "Campos inválidos", {});
            }
            let userForDelete = await this.userRepository.findOne({
                where: {
                    idUser: idUser,
                    idOrganization: idOrganization,
                }
            });
            if (!userForDelete) {
                return new ServerMessage_class_1.ServerMessage(true, "Usuario no disponible", {});
            }
            userForDelete.deleted = true;
            await userForDelete.save();
            let warehouseUsers = await this.userRepository.findAll({
                where: {
                    idRole: userForDelete.idRole,
                    idOrganization: idOrganization,
                    deleted: false
                },
                include: [{
                        model: town_entity_1.Town,
                        as: 'town',
                        include: [{
                                model: state_entity_1.State,
                                as: 'state',
                            }]
                    }]
            });
            return new ServerMessage_class_1.ServerMessage(false, "Usuario eliminado con éxito", {
                warehouseUsers: warehouseUsers
            });
        }
        catch (error) {
            this.logger.error(error);
            return new ServerMessage_class_1.ServerMessage(true, "A ocurrido un error creando el usuario", error);
        }
    }
    async getAllDevicesList(organization) {
        try {
            let devicesList = await this.deviceRepository.findAll({
                include: [{
                        model: town_entity_1.Town,
                        as: 'town',
                        include: [{
                                model: state_entity_1.State,
                                as: 'state',
                            }]
                    }, {
                        model: organization_entity_1.Organization,
                        as: 'organization',
                    }, {
                        model: user_entity_1.User,
                        as: 'user',
                        include: [{
                                model: town_entity_1.Town,
                                as: 'town',
                                include: [{
                                        model: state_entity_1.State,
                                        as: 'state',
                                    }]
                            }, {
                                model: role_entity_1.Role,
                                as: 'role',
                            }]
                    }, {
                        model: dataloggerHistory_entity_1.DataloggerHistory,
                        as: 'dataloggerHistory',
                        limit: 1,
                        order: [['dateTime', 'DESC']],
                    }, {
                        model: waterHistory_entity_1.WaterHistory,
                        as: 'waterHistory',
                        limit: 1,
                        order: [['dateTime', 'DESC']],
                    }, {
                        model: gasHistory_entity_1.GasHistory,
                        as: 'gasHistory',
                        limit: 1,
                        order: [['dateTime', 'DESC']],
                    }, {
                        model: naturalGasHistory_entity_1.NaturalGasHistory,
                        as: 'naturalGasHistory',
                        limit: 1,
                        order: [['dateTime', 'DESC']],
                    }],
                order: [['createdAt', 'DESC']]
            }).map((deviceData) => {
                let lastTransmition = new Date();
                let haveTransmission = false;
                if (deviceData.type == 0) {
                    if (deviceData.gasHistory.length > 0) {
                        lastTransmition = deviceData.gasHistory[0].dateTime;
                        haveTransmission = true;
                    }
                }
                else if (deviceData.type == 1) {
                    if (deviceData.waterHistory.length > 0) {
                        lastTransmition = deviceData.waterHistory[0].dateTime;
                        haveTransmission = true;
                    }
                }
                else if (deviceData.type == 2) {
                    if (deviceData.dataloggerHistory.length > 0) {
                        lastTransmition = deviceData.dataloggerHistory[0].dateTime;
                        haveTransmission = true;
                    }
                }
                else if (deviceData.type == 3) {
                    if (deviceData.naturalGasHistory.length > 0) {
                        lastTransmition = deviceData.naturalGasHistory[0].dateTime;
                        haveTransmission = true;
                    }
                }
                let transmisionError = false;
                let today = new Date();
                today.setHours(today.getHours() - 48);
                if (new Date(lastTransmition) < today) {
                    transmisionError = true;
                }
                return Object.assign({
                    idDevice: deviceData.idDevice,
                    name: deviceData.name,
                    serialNumber: deviceData.serialNumber,
                    type: deviceData.type,
                    version: deviceData.version,
                    boardVersion: deviceData.boardVersion,
                    firmwareVersion: deviceData.firmwareVersion,
                    batteryDate: deviceData.batteryDate,
                    createdAt: deviceData.createdAt,
                    lastTransmition: lastTransmition,
                    transmisionError: transmisionError,
                    haveTransmission: haveTransmission,
                    fullLocation: deviceData.town.name + " ," + deviceData.town.state.name,
                    comercialName: deviceData.organization.comercialName,
                    logoUrl: deviceData.organization.logoUrl,
                    email: deviceData.user.email,
                    idUserRole: deviceData.user.idRole,
                    userRoleName: deviceData.user.role.name,
                    isDeleted: deviceData.user.deleted,
                    isActive: deviceData.isActive,
                });
            });
            return new ServerMessage_class_1.ServerMessage(false, "Lista de todos los dispositivos obtenida con éxito.", {
                devicesList: devicesList,
            });
        }
        catch (error) {
            this.logger.error(error);
            console.log(error);
            return new ServerMessage_class_1.ServerMessage(true, "A ocurrido un error", error);
        }
    }
    async getAllOrganizationDevicesList(idOrganization) {
        try {
            if (idOrganization == null ||
                idOrganization == undefined) {
                return new ServerMessage_class_1.ServerMessage(true, "Campos inválidos", {});
            }
            const devicesList = await this.deviceRepository.findAll({
                where: {
                    idOrganization: idOrganization,
                },
                include: [{
                        model: town_entity_1.Town,
                        as: 'town',
                        include: [{
                                model: state_entity_1.State,
                                as: 'state',
                            }]
                    }, {
                        model: organization_entity_1.Organization,
                        as: 'organization',
                    }, {
                        model: user_entity_1.User,
                        as: 'user',
                        include: [{
                                model: town_entity_1.Town,
                                as: 'town',
                                include: [{
                                        model: state_entity_1.State,
                                        as: 'state',
                                    }]
                            }, {
                                model: role_entity_1.Role,
                                as: 'role',
                            }]
                    }, {
                        model: dataloggerHistory_entity_1.DataloggerHistory,
                        as: 'dataloggerHistory',
                        limit: 1,
                        order: [['dateTime', 'DESC']],
                    }, {
                        model: waterHistory_entity_1.WaterHistory,
                        as: 'waterHistory',
                        limit: 1,
                        order: [['dateTime', 'DESC']],
                    }, {
                        model: gasHistory_entity_1.GasHistory,
                        as: 'gasHistory',
                        limit: 1,
                        order: [['dateTime', 'DESC']],
                    }, {
                        model: naturalGasHistory_entity_1.NaturalGasHistory,
                        as: 'naturalGasHistory',
                        limit: 1,
                        order: [['dateTime', 'DESC']],
                    }],
                order: [['createdAt', 'DESC']]
            }).map((deviceData) => {
                let lastTransmition = new Date();
                let haveTransmission = false;
                if (deviceData.type == 0) {
                    if (deviceData.gasHistory.length > 0) {
                        lastTransmition = deviceData.gasHistory[0].dateTime;
                        haveTransmission = true;
                    }
                }
                else if (deviceData.type == 1) {
                    if (deviceData.waterHistory.length > 0) {
                        lastTransmition = deviceData.waterHistory[0].dateTime;
                        haveTransmission = true;
                    }
                }
                else if (deviceData.type == 2) {
                    if (deviceData.dataloggerHistory.length > 0) {
                        lastTransmition = deviceData.dataloggerHistory[0].dateTime;
                        haveTransmission = true;
                    }
                }
                else if (deviceData.type == 3) {
                    if (deviceData.naturalGasHistory.length > 0) {
                        lastTransmition = deviceData.naturalGasHistory[0].dateTime;
                        haveTransmission = true;
                    }
                }
                let transmisionError = false;
                const today = new Date();
                today.setHours(today.getHours() - 48);
                if (new Date(lastTransmition) < today) {
                    transmisionError = true;
                }
                return Object.assign({
                    idDevice: deviceData.idDevice,
                    name: deviceData.name,
                    serialNumber: deviceData.serialNumber,
                    type: deviceData.type,
                    version: deviceData.version,
                    boardVersion: deviceData.boardVersion,
                    firmwareVersion: deviceData.firmwareVersion,
                    batteryDate: deviceData.batteryDate,
                    createdAt: deviceData.createdAt,
                    lastTransmition: lastTransmition,
                    transmisionError: transmisionError,
                    haveTransmission: haveTransmission,
                    fullLocation: deviceData.town.name + " ," + deviceData.town.state.name,
                    comercialName: deviceData.organization.comercialName,
                    logoUrl: deviceData.organization.logoUrl,
                    email: deviceData.user.email,
                    idUserRole: deviceData.user.idRole,
                    userRoleName: deviceData.user.role.name,
                    isDeleted: deviceData.user.deleted,
                    isActive: deviceData.isActive,
                });
            });
            return new ServerMessage_class_1.ServerMessage(false, "Lista de todos los dispositivos obtenida con éxito.", {
                devicesList: devicesList,
            });
        }
        catch (error) {
            this.logger.error(error);
            return new ServerMessage_class_1.ServerMessage(true, "A ocurrido un error", error);
        }
    }
    async getAllHistoryNaturalGasDeviceData(query) {
        try {
            if (query.idDevice == null ||
                query.idDevice == undefined ||
                query.fromDate == null ||
                query.fromDate == undefined ||
                query.toDate == null ||
                query.toDate == undefined ||
                query.period == null ||
                query.period == undefined ||
                query.serialNumbersExtraDevices == null ||
                query.serialNumbersExtraDevices == undefined) {
                return new ServerMessage_class_1.ServerMessage(true, 'Petición incompleta', {});
            }
            query.fromDate = new Date(query.fromDate);
            query.toDate = new Date(query.toDate);
            query.fromDate = utilities_1.toLocalTime(query.fromDate);
            query.toDate = utilities_1.toLocalTime(query.toDate);
            let deviceData = await this.deviceRepository.findOne({
                attributes: { exclude: ['imei'] },
                where: {
                    idDevice: query.idDevice,
                    type: 3
                },
                include: [{
                        model: organization_entity_1.Organization,
                        as: 'organization',
                    }, {
                        model: user_entity_1.User,
                        as: 'user',
                        attributes: { exclude: ['password', 'passwordFacebook', 'passwordGoogle'] },
                        include: [{
                                model: role_entity_1.Role,
                                as: 'role',
                            }]
                    },],
            });
            if (!deviceData) {
                return new ServerMessage_class_1.ServerMessage(true, 'El dispositivo no esta disponible', {});
            }
            let responseClientView = await this.devicesService.getNaturalGasDeviceData({ idUser: deviceData.idUser }, query.idDevice, query.period);
            let responsePrincipalQueryHistoryView = await this.getQueryHistoryFromTONaturalGasDeviceData(query);
            let fullDevicesCompareData = [];
            let serialNumbersExtraDevices = [];
            let idDevicesNumbersExtraDevices = [];
            for (let index = 0; index < query.serialNumbersExtraDevices.length; index++) {
                const serialNumber = query.serialNumbersExtraDevices[index];
                let deviceData = await this.deviceRepository.findOne({
                    attributes: { exclude: ['imei'] },
                    where: {
                        serialNumber: serialNumber,
                        type: 1
                    },
                });
                if (deviceData) {
                    let responsePrincipalQueryHistoryView = await this.getQueryHistoryFromTONaturalGasDeviceData({
                        idDevice: deviceData.idDevice,
                        fromDate: query.fromDate,
                        toDate: query.toDate
                    });
                    if (responsePrincipalQueryHistoryView.error == false) {
                        fullDevicesCompareData.push(responsePrincipalQueryHistoryView.data);
                        serialNumbersExtraDevices.push(serialNumber);
                        idDevicesNumbersExtraDevices.push(deviceData.idDevice);
                    }
                }
            }
            let idDevicesNumbersExtraDevicesFixed = [deviceData.idDevice, ...idDevicesNumbersExtraDevices];
            let fullFromToLabels = await this.naturalGasHistoryRepository.findAll({
                attributes: [[sequelize_1.Sequelize.fn('DISTINCT', sequelize_1.Sequelize.col('dateTime')), 'dateTime']],
                where: {
                    idDevice: {
                        [sequelize_1.Op.or]: idDevicesNumbersExtraDevicesFixed,
                    },
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
                order: [['dateTime', 'ASC']],
            }).map((history) => {
                return Object.assign(this.devicesService.getDateTimepikerFormat(this.devicesService.convertDateToUTC(history.dateTime)));
            });
            let apnCatalog = await this.apnRepository.findAll({});
            return new ServerMessage_class_1.ServerMessage(false, 'Información obtenida correctamente', {
                fullIndividualDeviceData: {
                    clientData: deviceData.user,
                    organizationData: deviceData.organization,
                    responseClientView: responseClientView.data,
                    fromToHistorial: responsePrincipalQueryHistoryView.data.fromToHistorial,
                    actualFromToLabels: fullFromToLabels,
                    actualConsumptionFromToValues: responsePrincipalQueryHistoryView.data.actualConsumptionFromToValues,
                },
                fullDevicesCompareData: fullDevicesCompareData,
                serialNumbersExtraDevices: serialNumbersExtraDevices,
                apnCatalog: apnCatalog,
            });
        }
        catch (error) {
            this.logger.error(error);
            return new ServerMessage_class_1.ServerMessage(true, 'Ha ocurrido un error', error);
        }
    }
    async getQueryHistoryFromTONaturalGasDeviceData(query) {
        try {
            if (query.idDevice == null ||
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
                    type: 3
                },
            });
            if (!deviceData) {
                return new ServerMessage_class_1.ServerMessage(true, 'El dispositivo no esta disponible', {});
            }
            let fromToHistorial = await this.naturalGasHistoryRepository.findAll({
                attributes: [
                    'idNaturalGasHistory',
                    'idDevice',
                    'consumption',
                    'dateTime',
                    'createdAt',
                ],
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
                order: [['dateTime', 'ASC']],
            });
            let randomColor1 = (Math.random() * (150 - 50) + 50).toFixed(0);
            let randomColor2 = (Math.random() * (150 - 50) + 50).toFixed(0);
            let randomColor3 = (Math.random() * (150 - 50) + 50).toFixed(0);
            let setColor = 'rgba( ' + randomColor1 + ' ,' + randomColor2 + ' ,' + randomColor3 + ',0.4)';
            let actualFromToLabels = [];
            let actualConsumptionFromToValues = [];
            fromToHistorial.forEach(async (history) => {
                let dateTimeFixed = this.devicesService.getDateTimepikerFormat(this.devicesService.convertDateToUTC(history.dateTime));
                actualFromToLabels.push(dateTimeFixed);
                actualConsumptionFromToValues.push({
                    x: dateTimeFixed,
                    y: history.consumption,
                });
            });
            return new ServerMessage_class_1.ServerMessage(false, 'Información obtenida correctamente', {
                deviceData: deviceData,
                fromToHistorial: fromToHistorial,
                actualFromToLabels: actualFromToLabels,
                actualConsumptionFromToValues: {
                    label: 'Consumo',
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
                    data: actualConsumptionFromToValues,
                    spanGaps: false,
                },
            });
        }
        catch (error) {
            this.logger.error(error);
            return new ServerMessage_class_1.ServerMessage(true, 'Ha ocurrido un error', error);
        }
    }
    async getAllHistoryWaterDeviceData(query) {
        try {
            if (query.idDevice == null ||
                query.idDevice == undefined ||
                query.fromDate == null ||
                query.fromDate == undefined ||
                query.toDate == null ||
                query.toDate == undefined ||
                query.period == null ||
                query.period == undefined ||
                query.serialNumbersExtraDevices == null ||
                query.serialNumbersExtraDevices == undefined) {
                return new ServerMessage_class_1.ServerMessage(true, 'Petición incompleta', {});
            }
            query.fromDate = new Date(query.fromDate);
            query.toDate = new Date(query.toDate);
            query.fromDate = utilities_1.toLocalTime(query.fromDate);
            query.toDate = utilities_1.toLocalTime(query.toDate);
            let deviceData = await this.deviceRepository.findOne({
                attributes: { exclude: ['imei'] },
                where: {
                    idDevice: query.idDevice,
                    type: 1
                },
                include: [{
                        model: organization_entity_1.Organization,
                        as: 'organization',
                    }, {
                        model: user_entity_1.User,
                        as: 'user',
                        attributes: { exclude: ['password', 'passwordFacebook', 'passwordGoogle'] },
                        include: [{
                                model: role_entity_1.Role,
                                as: 'role',
                            }]
                    },],
            });
            if (!deviceData) {
                return new ServerMessage_class_1.ServerMessage(true, 'El dispositivo no esta disponible', {});
            }
            let responseClientView = await this.devicesService.getDeviceWaterData({ idUser: deviceData.idUser }, query.idDevice, query.period);
            let responsePrincipalQueryHistoryView = await this.getQueryHistoryFromTOWaterDeviceData(query);
            let fullDevicesCompareData = [];
            let serialNumbersExtraDevices = [];
            let idDevicesNumbersExtraDevices = [];
            for (let index = 0; index < query.serialNumbersExtraDevices.length; index++) {
                const serialNumber = query.serialNumbersExtraDevices[index];
                let deviceData = await this.deviceRepository.findOne({
                    attributes: { exclude: ['imei'] },
                    where: {
                        serialNumber: serialNumber,
                        type: 1
                    },
                });
                if (deviceData) {
                    let responsePrincipalQueryHistoryView = await this.getQueryHistoryFromTOWaterDeviceData({
                        idDevice: deviceData.idDevice,
                        fromDate: query.fromDate,
                        toDate: query.toDate
                    });
                    if (responsePrincipalQueryHistoryView.error == false) {
                        fullDevicesCompareData.push(responsePrincipalQueryHistoryView.data);
                        serialNumbersExtraDevices.push(serialNumber);
                        idDevicesNumbersExtraDevices.push(deviceData.idDevice);
                    }
                }
            }
            let idDevicesNumbersExtraDevicesFixed = [deviceData.idDevice, ...idDevicesNumbersExtraDevices];
            let fullFromToLabels = await this.waterHistoryRepository.findAll({
                attributes: [[sequelize_1.Sequelize.fn('DISTINCT', sequelize_1.Sequelize.col('dateTime')), 'dateTime']],
                where: {
                    idDevice: {
                        [sequelize_1.Op.or]: idDevicesNumbersExtraDevicesFixed,
                    },
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
                order: [['dateTime', 'ASC']],
            }).map((history) => {
                return Object.assign(this.devicesService.getDateTimepikerFormat(this.devicesService.convertDateToUTC(history.dateTime)));
            });
            let apnCatalog = await this.apnRepository.findAll({});
            return new ServerMessage_class_1.ServerMessage(false, 'Información obtenida correctamente', {
                fullIndividualDeviceData: {
                    clientData: deviceData.user,
                    organizationData: deviceData.organization,
                    responseClientView: responseClientView.data,
                    fromToHistorial: responsePrincipalQueryHistoryView.data.fromToHistorial,
                    actualFromToLabels: fullFromToLabels,
                    actualConsumptionFromToValues: responsePrincipalQueryHistoryView.data.actualConsumptionFromToValues,
                    spendingFromToValues: responsePrincipalQueryHistoryView.data.spendingFromToValues,
                    alarmsGraphData: responsePrincipalQueryHistoryView.data.alarmsGraphData,
                    bateryFromToValues: responsePrincipalQueryHistoryView.data.bateryFromToValues,
                    signalFromToValues: responsePrincipalQueryHistoryView.data.signalFromToValues,
                },
                fullDevicesCompareData: fullDevicesCompareData,
                serialNumbersExtraDevices: serialNumbersExtraDevices,
                apnCatalog: apnCatalog,
            });
        }
        catch (error) {
            this.logger.error(error);
            return new ServerMessage_class_1.ServerMessage(true, 'Ha ocurrido un error', error);
        }
    }
    async getQueryHistoryFromTOWaterDeviceData(query) {
        try {
            if (query.idDevice == null ||
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
                    type: 1
                },
            });
            if (!deviceData) {
                return new ServerMessage_class_1.ServerMessage(true, 'El dispositivo no esta disponible', {});
            }
            let fromToHistorial = await this.waterHistoryRepository.findAll({
                attributes: [
                    'idWaterHistory', 'consumption', 'flow',
                    'dripAlert', 'bateryLevel', 'signalQuality', 'manipulationAlert', 'emptyAlert', 'burstAlert', 'bubbleAlert', 'reversedFlowAlert',
                    'dateTime'
                ],
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
                order: [['dateTime', 'ASC']],
            });
            let randomColor1 = (Math.random() * (150 - 50) + 50).toFixed(0);
            let randomColor2 = (Math.random() * (150 - 50) + 50).toFixed(0);
            let randomColor3 = (Math.random() * (150 - 50) + 50).toFixed(0);
            let setColor = 'rgba( ' + randomColor1 + ' ,' + randomColor2 + ' ,' + randomColor3 + ',0.4)';
            let actualFromToLabels = [];
            let spendingFromToValues = [];
            let actualConsumptionFromToValues = [];
            let bateryFromToValues = [];
            let signalFromToValues = [];
            let alarmDripAlertFromToValues = [];
            let manipulationAlertAlertFromToValues = [];
            let emptyAlertAlertFromToValues = [];
            let leakAlertAlertFromToValues = [];
            let bubbleAlertAlertFromToValues = [];
            let invertedFlowAlertFromToValues = [];
            fromToHistorial.forEach(async (history) => {
                let dateTimeFixed = this.devicesService.getDateTimepikerFormat(this.devicesService.convertDateToUTC(history.dateTime));
                actualFromToLabels.push(dateTimeFixed);
                actualConsumptionFromToValues.push({
                    x: dateTimeFixed,
                    y: history.consumption,
                });
                spendingFromToValues.push({
                    x: dateTimeFixed,
                    y: history.flow,
                });
                bateryFromToValues.push({
                    x: dateTimeFixed,
                    y: history.bateryLevel,
                });
                signalFromToValues.push({
                    x: dateTimeFixed,
                    y: history.signalQuality,
                });
                alarmDripAlertFromToValues.push({
                    x: dateTimeFixed,
                    y: history.dripAlert ? 10 + 1 : 10,
                });
                manipulationAlertAlertFromToValues.push({
                    x: dateTimeFixed,
                    y: history.manipulationAlert ? 8 + 1 : 8,
                });
                emptyAlertAlertFromToValues.push({
                    x: dateTimeFixed,
                    y: history.emptyAlert ? 6 + 1 : 6,
                });
                leakAlertAlertFromToValues.push({
                    x: dateTimeFixed,
                    y: history.burstAlert ? 4 + 1 : 4,
                });
                bubbleAlertAlertFromToValues.push({
                    x: dateTimeFixed,
                    y: history.bubbleAlert ? 2 + 1 : 2,
                });
                invertedFlowAlertFromToValues.push({
                    x: dateTimeFixed,
                    y: history.reversedFlowAlert ? 0 + 1 : 0,
                });
            });
            let alarmsGraphData = [];
            for (let index = 0; index < 6; index++) {
                let randomColor1 = (Math.random() * (150 - 50) + 50).toFixed(0);
                let randomColor2 = (Math.random() * (150 - 50) + 50).toFixed(0);
                let randomColor3 = (Math.random() * (150 - 50) + 50).toFixed(0);
                let color = 'rgba( ' + randomColor1 + ' ,' + randomColor2 + ' ,' + randomColor3 + ',0.4)';
                let alarmTitle = "";
                let data = [];
                if (index == 0) {
                    alarmTitle = 'Goteo';
                    data = alarmDripAlertFromToValues;
                }
                else if (index == 1) {
                    alarmTitle = 'Manipulación';
                    data = manipulationAlertAlertFromToValues;
                }
                else if (index == 2) {
                    alarmTitle = 'Vacio';
                    data = emptyAlertAlertFromToValues;
                }
                else if (index == 3) {
                    alarmTitle = 'Fuga';
                    data = leakAlertAlertFromToValues;
                }
                else if (index == 4) {
                    alarmTitle = 'Burbujas';
                    data = bubbleAlertAlertFromToValues;
                }
                else if (index == 5) {
                    alarmTitle = 'F. Invertido';
                    data = invertedFlowAlertFromToValues;
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
            return new ServerMessage_class_1.ServerMessage(false, 'Información obtenida correctamente', {
                deviceData: deviceData,
                fromToHistorial: fromToHistorial,
                actualFromToLabels: actualFromToLabels,
                actualConsumptionFromToValues: {
                    label: 'Consumo',
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
                    data: actualConsumptionFromToValues,
                    spanGaps: false,
                },
                spendingFromToValues: {
                    label: 'Flujo',
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
                    data: spendingFromToValues,
                    spanGaps: false,
                },
                alarmsGraphData: alarmsGraphData,
                bateryFromToValues: {
                    label: 'Carga de la bateria',
                    fill: true,
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
                    data: bateryFromToValues,
                    spanGaps: false,
                },
                signalFromToValues: {
                    label: 'Intensidad señal',
                    fill: true,
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
                    data: signalFromToValues,
                    spanGaps: false,
                },
            });
        }
        catch (error) {
            this.logger.error(error);
            return new ServerMessage_class_1.ServerMessage(true, 'Ha ocurrido un error', error);
        }
    }
    async getQueryHistoryFromTOGasDeviceData(query) {
        try {
            if (query.idDevice == null ||
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
                    type: 0
                },
            });
            if (!deviceData) {
                return new ServerMessage_class_1.ServerMessage(true, 'El dispositivo no esta disponible', {});
            }
            let fromToHistorial = await this.gasHistoryRepository.findAll({
                where: {
                    idDevice: deviceData.idDevice,
                    [sequelize_1.Op.or]: [{
                            dateTime: {
                                [sequelize_1.Op.between]: [
                                    query.fromDate.toISOString(),
                                    query.toDate.toISOString(),
                                ],
                            },
                        }, {
                            dateTime: query.fromDate.toISOString(),
                        }, {
                            dateTime: query.toDate.toISOString(),
                        },],
                },
                order: [['dateTime', 'ASC']],
            });
            let randomColor1 = (Math.random() * (150 - 50) + 50).toFixed(0);
            let randomColor2 = (Math.random() * (150 - 50) + 50).toFixed(0);
            let randomColor3 = (Math.random() * (150 - 50) + 50).toFixed(0);
            let setColor = 'rgba( ' + randomColor1 + ' ,' + randomColor2 + ' ,' + randomColor3 + ',0.4)';
            let actualFromToLabels = [];
            let actualMeasureFromToValues = [];
            let meanConsumptionFromToValues = [];
            let accumulatedConsumptionFromToValues = [];
            let bateryFromToValues = [];
            let signalFromToValues = [];
            let temperatureFromToValues = [];
            let resetAlertFromToValues = [];
            let intervalAlertAlertFromToValues = [];
            let fillingAlertAlertFromToValues = [];
            fromToHistorial.forEach(async (history) => {
                let dateTimeFixed = this.devicesService.getDateTimepikerFormat(this.devicesService.convertDateToUTC(history.dateTime));
                actualFromToLabels.push(dateTimeFixed);
                actualMeasureFromToValues.push({
                    x: dateTimeFixed,
                    y: history.measure,
                });
                meanConsumptionFromToValues.push({
                    x: dateTimeFixed,
                    y: history.meanConsumption,
                });
                bateryFromToValues.push({
                    x: dateTimeFixed,
                    y: history.bateryLevel,
                });
                signalFromToValues.push({
                    x: dateTimeFixed,
                    y: history.signalQuality,
                });
                accumulatedConsumptionFromToValues.push({
                    x: dateTimeFixed,
                    y: history.accumulatedConsumption,
                });
                temperatureFromToValues.push({
                    x: dateTimeFixed,
                    y: history.temperature,
                });
                resetAlertFromToValues.push({
                    x: dateTimeFixed,
                    y: history.resetAlert ? 10 + 1 : 10,
                });
                intervalAlertAlertFromToValues.push({
                    x: dateTimeFixed,
                    y: history.intervalAlert ? 8 + 1 : 8,
                });
                fillingAlertAlertFromToValues.push({
                    x: dateTimeFixed,
                    y: history.fillingAlert ? 6 + 1 : 6,
                });
            });
            let alarmsGraphData = [];
            for (let index = 0; index < 3; index++) {
                let randomColor1 = (Math.random() * (150 - 50) + 50).toFixed(0);
                let randomColor2 = (Math.random() * (150 - 50) + 50).toFixed(0);
                let randomColor3 = (Math.random() * (150 - 50) + 50).toFixed(0);
                let color = 'rgba( ' + randomColor1 + ' ,' + randomColor2 + ' ,' + randomColor3 + ',0.4)';
                let alarmTitle = "";
                let data = [];
                if (index == 0) {
                    alarmTitle = 'Encendido';
                    data = resetAlertFromToValues;
                }
                else if (index == 1) {
                    alarmTitle = 'Intervalo';
                    data = intervalAlertAlertFromToValues;
                }
                else if (index == 2) {
                    alarmTitle = 'Llenado';
                    data = fillingAlertAlertFromToValues;
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
            return new ServerMessage_class_1.ServerMessage(false, 'Información obtenida correctamente', {
                deviceData: deviceData,
                fromToHistorial: fromToHistorial,
                actualFromToLabels: actualFromToLabels,
                alarmsGraphData: alarmsGraphData,
                actualMeasureFromToValues: {
                    label: 'Consumo',
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
                    data: actualMeasureFromToValues,
                    spanGaps: false,
                },
                meanConsumptionFromToValues: {
                    label: 'Promedio consumo',
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
                    data: meanConsumptionFromToValues,
                    spanGaps: false,
                },
                accumulatedConsumptionFromToValues: {
                    label: 'Consumo acumulado',
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
                    data: accumulatedConsumptionFromToValues,
                    spanGaps: false,
                },
                bateryFromToValues: {
                    label: 'Carga de la bateria',
                    fill: true,
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
                    data: bateryFromToValues,
                    spanGaps: false,
                },
                signalFromToValues: {
                    label: 'Intensidad señal',
                    fill: true,
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
                    data: signalFromToValues,
                    spanGaps: false,
                },
                temperatureFromToValues: {
                    label: 'Temperatura',
                    fill: true,
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
                    data: temperatureFromToValues,
                    spanGaps: false,
                },
            });
        }
        catch (error) {
            this.logger.error(error);
            return new ServerMessage_class_1.ServerMessage(true, 'Ha ocurrido un error', error);
        }
    }
    async getAllHistoryGasDeviceData(query) {
        try {
            if (query.idDevice == null ||
                query.idDevice == undefined ||
                query.fromDate == null ||
                query.fromDate == undefined ||
                query.toDate == null ||
                query.toDate == undefined ||
                query.period == null ||
                query.period == undefined) {
                return new ServerMessage_class_1.ServerMessage(true, 'Petición incompleta', {});
            }
            query.fromDate = new Date(query.fromDate);
            query.toDate = new Date(query.toDate);
            query.fromDate = utilities_1.toLocalTime(query.fromDate);
            query.toDate = utilities_1.toLocalTime(query.toDate);
            let deviceData = await this.deviceRepository.findOne({
                attributes: { exclude: ['imei'] },
                where: {
                    idDevice: query.idDevice,
                    type: 0,
                },
                include: [{
                        model: organization_entity_1.Organization,
                        as: 'organization',
                    }, {
                        model: user_entity_1.User,
                        as: 'user',
                        attributes: { exclude: ['password', 'passwordFacebook', 'passwordGoogle'] },
                        include: [{
                                model: role_entity_1.Role,
                                as: 'role',
                            }]
                    },],
            });
            if (!deviceData) {
                return new ServerMessage_class_1.ServerMessage(true, 'El dispositivo no esta disponible', {});
            }
            let responseClientView = await this.devicesService.getGasDeviceData(deviceData.user, query.idDevice, query.period);
            let responsePrincipalQueryHistoryView = await this.getQueryHistoryFromTOGasDeviceData(query);
            if (responsePrincipalQueryHistoryView.error == true) {
                return responsePrincipalQueryHistoryView;
            }
            let apnCatalog = await this.apnRepository.findAll({});
            return new ServerMessage_class_1.ServerMessage(false, 'Información obtenida correctamente', {
                fullIndividualDeviceData: {
                    clientData: deviceData.user,
                    organizationData: deviceData.organization,
                    responseClientView: responseClientView.data,
                    fromToHistorial: responsePrincipalQueryHistoryView.data.fromToHistorial,
                    actualFromToLabels: responsePrincipalQueryHistoryView.data.actualFromToLabels,
                    alarmsGraphData: responsePrincipalQueryHistoryView.data.alarmsGraphData,
                    actualMeasureFromToValues: responsePrincipalQueryHistoryView.data.actualMeasureFromToValues,
                    meanConsumptionFromToValues: responsePrincipalQueryHistoryView.data.meanConsumptionFromToValues,
                    accumulatedConsumptionFromToValues: responsePrincipalQueryHistoryView.data.accumulatedConsumptionFromToValues,
                    bateryFromToValues: responsePrincipalQueryHistoryView.data.bateryFromToValues,
                    signalFromToValues: responsePrincipalQueryHistoryView.data.signalFromToValues,
                    temperatureFromToValues: responsePrincipalQueryHistoryView.data.temperatureFromToValues,
                },
                apnCatalog: apnCatalog
            });
        }
        catch (error) {
            this.logger.error(error);
            return new ServerMessage_class_1.ServerMessage(true, 'Ha ocurrido un error', error);
        }
    }
    async getAllHistoryLoggerDeviceData(query) {
        try {
            if (query.idDevice == null ||
                query.idDevice == undefined ||
                query.fromDate == null ||
                query.fromDate == undefined ||
                query.toDate == null ||
                query.toDate == undefined) {
                return new ServerMessage_class_1.ServerMessage(true, 'Petición incompleta', {});
            }
            query.fromDate = new Date(query.fromDate);
            query.toDate = new Date(query.toDate);
            query.fromDate = utilities_1.toLocalTime(query.fromDate);
            query.toDate = utilities_1.toLocalTime(query.toDate);
            let deviceData = await this.deviceRepository.findOne({
                attributes: { exclude: ['imei'] },
                where: {
                    idDevice: query.idDevice,
                    type: 2
                },
                include: [{
                        model: organization_entity_1.Organization,
                        as: 'organization',
                    }, {
                        model: user_entity_1.User,
                        as: 'user',
                        attributes: { exclude: ['password', 'passwordFacebook', 'passwordGoogle'] },
                        include: [{
                                model: role_entity_1.Role,
                                as: 'role',
                            }]
                    }, {
                        model: apn_entity_1.Apn,
                        as: 'apn'
                    }, {
                        required: true,
                        model: dataloggerSettings_entity_1.DataloggerSettings,
                        as: 'dataloggerSettings'
                    }, {
                        model: town_entity_1.Town,
                        as: 'town',
                        include: [
                            {
                                model: state_entity_1.State,
                                as: 'state',
                            }
                        ]
                    }
                ],
            });
            if (!deviceData) {
                return new ServerMessage_class_1.ServerMessage(true, 'El dispositivo no esta disponible', {});
            }
            let responsePrincipalQueryHistoryView = await this.getQueryHistoryFromTOLoggerDeviceData(query);
            let apnCatalog = await this.apnRepository.findAll({});
            return new ServerMessage_class_1.ServerMessage(false, 'Información obtenida correctamente', {
                deviceData: deviceData,
                apnCatalog: apnCatalog,
                fromToHistorial: responsePrincipalQueryHistoryView.data.fromToHistorial,
                actualFromToLabels: responsePrincipalQueryHistoryView.data.actualFromToLabels,
                analog1FromToValues: responsePrincipalQueryHistoryView.data.analog1FromToValues,
                analog2FromToValues: responsePrincipalQueryHistoryView.data.analog2FromToValues,
                analog3FromToValues: responsePrincipalQueryHistoryView.data.analog3FromToValues,
                analog4FromToValues: responsePrincipalQueryHistoryView.data.analog4FromToValues,
                consumption1FromToValues: responsePrincipalQueryHistoryView.data.consumption1FromToValues,
                consumption2FromToValues: responsePrincipalQueryHistoryView.data.consumption2FromToValues,
                flow1FromToValues: responsePrincipalQueryHistoryView.data.flow1FromToValues,
                flow2FromToValues: responsePrincipalQueryHistoryView.data.flow2FromToValues,
                batteryLevelFromToValues: responsePrincipalQueryHistoryView.data.batteryLevelFromToValues,
                signalQualityFromToValues: responsePrincipalQueryHistoryView.data.signalQualityFromToValues,
                alarmsGraphData: responsePrincipalQueryHistoryView.data.alarmsGraphData,
                digitalInputsGraphData: responsePrincipalQueryHistoryView.data.digitalInputsGraphData,
            });
        }
        catch (error) {
            this.logger.error(error);
            return new ServerMessage_class_1.ServerMessage(true, 'Ha ocurrido un error', error);
        }
    }
    async getQueryHistoryFromTOLoggerDeviceData(query) {
        try {
            if (query.idDevice == null ||
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
                    type: 2
                },
                include: [{
                        model: dataloggerSettings_entity_1.DataloggerSettings,
                        as: 'dataloggerSettings'
                    }]
            });
            if (!deviceData) {
                return new ServerMessage_class_1.ServerMessage(true, 'El dispositivo no esta disponible', {});
            }
            let fromToHistorial = await this.dataloggerHistoryRepository.findAll({
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
                order: [['dateTime', 'ASC']],
            });
            let randomColor1 = (Math.random() * (150 - 50) + 50).toFixed(0);
            let randomColor2 = (Math.random() * (150 - 50) + 50).toFixed(0);
            let randomColor3 = (Math.random() * (150 - 50) + 50).toFixed(0);
            let setColor = 'rgba( ' + randomColor1 + ' ,' + randomColor2 + ' ,' + randomColor3 + ',0.4)';
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
            fromToHistorial.forEach(async (history) => {
                let dateTimeFixed = this.devicesService.getDateTimepikerFormat(this.devicesService.convertDateToUTC(history.dateTime));
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
                let original = new datalogger_adapter_1.DataloggerHistoryAdapter(history);
                original.formatAlerts(deviceData.dataloggerSettings);
                let fixedAlerts = original.alerts;
                let binAlerts = fixedAlerts.toString(2);
                while (binAlerts.length < 16) {
                    binAlerts = "0" + binAlerts;
                }
                binAlerts = binAlerts.split("");
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
                ;
                d4Alarms.push({
                    x: dateTimeFixed,
                    y: binAlerts[12] == '1' ? 6 + 1 : 6,
                });
                al1Alarms.push({
                    x: dateTimeFixed,
                    y: binAlerts[11] == '1' ? 8 + 1 : 8,
                });
                ;
                al2Alarms.push({
                    x: dateTimeFixed,
                    y: binAlerts[10] == '1' ? 10 + 1 : 10,
                });
                ;
                al3Alarms.push({
                    x: dateTimeFixed,
                    y: binAlerts[9] == '1' ? 12 + 1 : 12,
                });
                ;
                al4Alarms.push({
                    x: dateTimeFixed,
                    y: binAlerts[8] == '1' ? 14 + 1 : 14,
                });
                ;
                ah1Alarms.push({
                    x: dateTimeFixed,
                    y: binAlerts[7] == '1' ? 16 + 1 : 16,
                });
                ;
                ah2Alarms.push({
                    x: dateTimeFixed,
                    y: binAlerts[6] == '1' ? 18 + 1 : 18,
                });
                ;
                ah3Alarms.push({
                    x: dateTimeFixed,
                    y: binAlerts[5] == '1' ? 20 + 1 : 20,
                });
                ;
                ah4Alarms.push({
                    x: dateTimeFixed,
                    y: binAlerts[4] == '1' ? 22 + 1 : 22,
                });
                ql1Alarms.push({
                    x: dateTimeFixed,
                    y: binAlerts[3] == '1' ? 24 + 1 : 24,
                });
                ;
                ql2Alarms.push({
                    x: dateTimeFixed,
                    y: binAlerts[2] == '1' ? 26 + 1 : 26,
                });
                ;
                ql3Alarms.push({
                    x: dateTimeFixed,
                    y: binAlerts[1] == '1' ? 28 + 1 : 28,
                });
                ;
                ql4Alarms.push({
                    x: dateTimeFixed,
                    y: binAlerts[0] == '1' ? 30 + 1 : 30,
                });
                ;
            });
            let alarmsGraphData = [];
            for (let index = 0; index < 16; index++) {
                let randomColor1 = (Math.random() * (150 - 50) + 50).toFixed(0);
                let randomColor2 = (Math.random() * (150 - 50) + 50).toFixed(0);
                let randomColor3 = (Math.random() * (150 - 50) + 50).toFixed(0);
                let color = 'rgba( ' + randomColor1 + ' ,' + randomColor2 + ' ,' + randomColor3 + ',0.4)';
                let alarmTitle = "";
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
                else if (index == 15) {
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
                let color = 'rgba( ' + randomColor1 + ' ,' + randomColor2 + ' ,' + randomColor3 + ',0.4)';
                let alarmTitle = "";
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
            return new ServerMessage_class_1.ServerMessage(false, 'Información obtenida correctamente', {
                fromToHistorial: fromToHistorial,
                actualFromToLabels: actualFromToLabels,
                digitalInputsGraphData: digitalInputsGraphData,
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
                    data: analog2FromToValues,
                    spanGaps: false,
                },
                analog3FromToValues: {
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
                    data: analog3FromToValues,
                    spanGaps: false,
                },
                analog4FromToValues: {
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
    async updateApnDeviceData(updatedData) {
        try {
            let deviceToUpdate = await this.deviceRepository.findOne({
                where: {
                    idDevice: updatedData.idDevice
                },
                include: [{
                        model: waterSettings_entity_1.WaterSettings,
                        as: 'waterSettings',
                    }, {
                        model: gasSettings_entity_1.GasSettings,
                        as: 'gasSettings',
                    }]
            });
            deviceToUpdate.idApn = updatedData.idApn;
            await deviceToUpdate.save();
            if (deviceToUpdate.type == 0) {
                deviceToUpdate.gasSettings.wereApplied = false;
                await deviceToUpdate.gasSettings.save();
            }
            else if (deviceToUpdate.type == 1) {
                deviceToUpdate.waterSettings.wereApplied = false;
                deviceToUpdate.waterSettings.status = deviceToUpdate.waterSettings.calculateNewStatus(6, true);
                await deviceToUpdate.waterSettings.save();
            }
            return new ServerMessage_class_1.ServerMessage(false, "Apn actualizado con éxito.", {
                deviceToUpdate: deviceToUpdate,
            });
        }
        catch (error) {
            this.logger.error(error);
            return new ServerMessage_class_1.ServerMessage(true, "A ocurrido un error", error);
        }
    }
    async unlockDeviceToBeAssigned(updatedData) {
        try {
            if (updatedData.idDevice == null ||
                updatedData.idDevice == undefined) {
                return new ServerMessage_class_1.ServerMessage(true, 'Petición incompleta', {});
            }
            let deviceToUpdate = await this.deviceRepository.findOne({
                where: {
                    idDevice: updatedData.idDevice
                },
                include: [{
                        model: waterSettings_entity_1.WaterSettings,
                        as: 'waterSettings',
                    }, {
                        model: gasSettings_entity_1.GasSettings,
                        as: 'gasSettings',
                    }]
            });
            deviceToUpdate.isActive = true;
            await deviceToUpdate.save();
            return new ServerMessage_class_1.ServerMessage(false, "Dispositivo liberado con éxito.", {
                deviceToUpdate: deviceToUpdate,
            });
        }
        catch (error) {
            return new ServerMessage_class_1.ServerMessage(true, "A ocurrido un error", error);
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
                },
                include: [{
                        model: gasSettings_entity_1.GasSettings,
                        as: 'gasSettings'
                    },
                    {
                        model: town_entity_1.Town,
                        as: 'town',
                        include: [
                            {
                                model: state_entity_1.State,
                                as: 'state',
                            }
                        ]
                    }]
            });
            if (!deviceData) {
                return new ServerMessage_class_1.ServerMessage(true, 'Dispositivo no disponible', {});
            }
            let fillingHistories = await this.gasHistoryRepository.findAll({
                where: {
                    idDevice: idDevice,
                    dateTime: {
                        [sequelize_1.Op.lte]: utilities_1.toLocalTime(new Date()).toISOString(),
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
                    lastPeriodUpdate: "Sin registros"
                });
            }
            let today = period == 0
                ? utilities_1.toLocalTime(new Date())
                : fillingHistories[+period - 1].dateTime;
            let toDate = new Date();
            let fromDate = new Date();
            let periodHistories = [];
            if (fillingHistories.length - period == 0) {
                toDate = today;
                fromDate = today;
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
                toDate = today;
                fromDate = fillingHistories[period === 0 ? 0 : +period].dateTime;
                periodHistories = await this.gasHistoryRepository.findAll({
                    where: {
                        idDevice: idDevice,
                        [sequelize_1.Op.or]: [
                            {
                                dateTime: {
                                    [sequelize_1.Op.between]: [
                                        fromDate.toISOString(),
                                        toDate.toISOString()
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
                alertLabels: alertHistories.map((item) => { return this.getOnlyDate(item.dataValues.dateTime); }),
                alertValues: periodHistories.map((item) => { return item.dataValues.measure; }),
                lastAlertUpdate: alertHistories.length == 0
                    ? "Sin registros"
                    : this.getOnlyDate(new Date(alertHistories[alertHistories.length - 1].dataValues.dateTime)),
            });
        }
        catch (error) {
            this.logger.error(error);
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
                },
                include: [{
                        model: town_entity_1.Town,
                        as: 'town',
                        include: [{
                                model: state_entity_1.State,
                                as: 'state',
                            }]
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
            let actualPeriod = await this.waterHistoryRepository.findAll({
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
            this.logger.error("XXX", error);
            return new ServerMessage_class_1.ServerMessage(true, 'A ocurrido un error', error);
        }
    }
    async getOrganizationsListData() {
        try {
            let organizations = await this.organizationRepository.findAll({
                where: {
                    type: { [sequelize_1.Op.not]: 0 }
                }
            });
            let states = await this.stateRepository.findAll({
                include: [{
                        model: town_entity_1.Town,
                        as: 'towns',
                    }]
            });
            return new ServerMessage_class_1.ServerMessage(false, "Organizaciones obtenidas con éxito", {
                organizations: organizations,
                states: states
            });
        }
        catch (error) {
            this.logger.error(error);
            return new ServerMessage_class_1.ServerMessage(true, "A ocurrido un error", error);
        }
    }
    async getOrganizationsData() {
        try {
            let organizations = await this.organizationRepository.findAll({
                attributes: ['idOrganization', 'comercialName'],
            });
            return new ServerMessage_class_1.ServerMessage(false, "Organizaciones obtenidas con éxito", {
                organizations: organizations,
            });
        }
        catch (error) {
            this.logger.error(error);
            return new ServerMessage_class_1.ServerMessage(true, "A ocurrido un error", error);
        }
    }
    async deviceAssignments(data) {
        if (data == undefined ||
            data == null) {
            return new ServerMessage_class_1.ServerMessage(true, 'Peticion invalida', {});
        }
        if (data.length == 0) {
            return new ServerMessage_class_1.ServerMessage(true, 'Peticion invalida', {});
        }
        try {
            let errors = [];
            let activateSubscription = [];
            for (let index = 0; index < data.length; index++) {
                const element = data[index];
                if (element.serialNumber == undefined ||
                    element.serialNumber == null ||
                    element.type == undefined ||
                    element.type == null ||
                    element.idOrganization == undefined ||
                    element.idOrganization == null) {
                    errors.push(new ServerMessage_class_1.ServerMessage(true, 'Peticion invalida', element));
                }
                else {
                    let device = await this.deviceRepository.findOne({
                        where: {
                            serialNumber: element.serialNumber,
                            type: element.type,
                        },
                    });
                    let organization = await this.organizationRepository.findOne({
                        where: {
                            idOrganization: element.idOrganization,
                        },
                    });
                    if (organization) {
                        if (device) {
                            device.idOrganization = element.idOrganization;
                            await device.save();
                            activateSubscription.push(new ServerMessage_class_1.ServerMessage(false, 'Asignacion exitosa del dispositivo a ' + organization.comercialName, element));
                        }
                        else {
                            errors.push(new ServerMessage_class_1.ServerMessage(true, 'El numero de serie no existe', element));
                        }
                    }
                    else {
                        errors.push(new ServerMessage_class_1.ServerMessage(true, 'La organizacion no existe', element));
                    }
                }
            }
            return new ServerMessage_class_1.ServerMessage(false, 'Asignaciones realizadas con exito', {
                errors: errors,
                activateSubscription: activateSubscription
            });
        }
        catch (error) {
            this.logger.error(error);
            return new ServerMessage_class_1.ServerMessage(true, 'A ocurrido un error asignando los dispositivos', error);
        }
    }
    async getOrganizationAdmin(idOrganization) {
        try {
            let organization = await this.organizationRepository.findOne({
                where: {
                    idOrganization: idOrganization,
                }
            });
            let orgAdmins = await this.userRepository.findAll({
                attributes: { exclude: ["password", "idConektaAccount"] },
                where: {
                    idRole: 2,
                    idOrganization: organization.idOrganization,
                }
            });
            return new ServerMessage_class_1.ServerMessage(false, "Petición entregada correctamente", {
                orgAdmins: orgAdmins,
            });
        }
        catch (error) {
            this.logger.error(error);
            return new ServerMessage_class_1.ServerMessage(true, "A ocurrido un error", error);
        }
    }
    async getOrganizationAdminChoices(choice) {
        try {
            let mainOrganizationAdmin = await this.userRepository.findOne({
                attributes: { exclude: ["password", "idConektaAccount"] },
                where: {
                    idRole: 1,
                }
            });
            let mainOrganizationId = mainOrganizationAdmin.idOrganization;
            let orgAdmins = await this.userRepository.findAll({
                attributes: { exclude: ["password", "idConektaAccount"] },
                where: {
                    idRole: 7,
                    idOrganization: mainOrganizationId,
                    [sequelize_1.Op.or]: [
                        { firstName: { [sequelize_1.Op.like]: '%' + choice + '%' } },
                        { lastName: { [sequelize_1.Op.like]: '%' + choice + '%' } },
                        { email: { [sequelize_1.Op.like]: '%' + choice + '%' } }
                    ],
                },
                limit: 3
            });
            return new ServerMessage_class_1.ServerMessage(false, "Petición entregada correctamente", {
                orgAdmins: orgAdmins,
            });
        }
        catch (error) {
            this.logger.error(error);
            return new ServerMessage_class_1.ServerMessage(true, "A ocurrido un error", error);
        }
    }
    async createOrganization(logo, body) {
        try {
            let theme = JSON.parse(body.theme);
            let info = JSON.parse(body.info);
            let newAdmins = JSON.parse(body.admins);
            const constraints = [
                newAdmins == null,
                newAdmins == undefined,
                newAdmins.length == 0,
                theme.primaryColor == null,
                theme.secondaryColor == null,
                theme.primaryColor == undefined,
                theme.secondaryColor == undefined,
                info.comercialName == null,
                info.phone == null,
                info.email == null,
                info.city == null,
                info.state == null,
                info.street == null,
                info.rfc == null,
                info.fiscalName == null,
                info.fiscalAddress == null,
                info.addressNumber == null,
                info.suburb == null,
                info.zipCode == null,
                info.contactPhone == null,
                info.contactEmail == null,
                info.comercialName == undefined,
                info.phone == undefined,
                info.email == undefined,
                info.city == undefined,
                info.state == undefined,
                info.street == undefined,
                info.rfc == undefined,
                info.fiscalName == undefined,
                info.fiscalAddress == undefined,
                info.addressNumber == undefined,
                info.suburb == undefined,
                info.zipCode == undefined,
                info.contactPhone == undefined,
                info.contactEmail == undefined,
            ];
            if (constraints.some(val => val))
                return new ServerMessage_class_1.ServerMessage(true, "Campos requeridos", null);
            let facturapiInfo = await this.facturapiService.createOrganizationCustomer({
                businessName: info.fiscalName,
                email: info.email,
                rfc: info.rfc,
                phone: info.phone,
                city: info.city,
                state: info.state,
                street: info.street,
                addressNumber: info.addressNumber,
                suburb: info.suburb,
                zipCode: info.zipCode,
            });
            if (facturapiInfo.error)
                return new ServerMessage_class_1.ServerMessage(true, "Error al acceder al servicio de Facturaación", facturapiInfo);
            let newOrganization = await organization_entity_1.Organization.create({
                comercialName: info.comercialName,
                phone: info.phone,
                email: info.email,
                city: info.city,
                state: info.state,
                street: info.street,
                rfc: info.rfc,
                fiscalName: info.fiscalName,
                fiscalAddress: info.fiscalAddress,
                addressNumber: info.addressNumber,
                suburb: info.suburb,
                zipCode: info.zipCode,
                contactPhone: info.contactPhone,
                contactEmail: info.contactEmail,
                primaryColor: theme.primaryColor,
                secondaryColor: theme.secondaryColor,
                facturapiToken: facturapiInfo.data.id,
                type: 1,
                validUntil: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
                logoUrl: "",
            });
            let ext = logo.path;
            let index = ext.indexOf(".");
            ext = logo.path.substr(index, logo.path.length);
            let renameResult = await this.moveRequestFile(logo.path, newOrganization.idOrganization + ext, newOrganization.idOrganization);
            if (renameResult.error == false) {
                newOrganization.logoUrl = 'logo-images-uploads/logo-organization-image/' + newOrganization.idOrganization;
                await newOrganization.save();
            }
            else {
                this.logger.error(renameResult);
            }
            let newOrgAdmins = await this.userRepository.findAll({
                attributes: { exclude: ["password", "idConektaAccount"] },
                where: {
                    idUser: {
                        [sequelize_1.Op.in]: newAdmins
                    },
                }
            });
            newOrgAdmins.forEach(async (admin) => {
                admin.idRole = 2;
                admin.idOrganization = newOrganization.idOrganization;
                await admin.save();
            });
            return new ServerMessage_class_1.ServerMessage(false, "Organización creada correctamente", {});
        }
        catch (error) {
            this.logger.error(error);
            return new ServerMessage_class_1.ServerMessage(true, "Ha ocurrido un error", error);
        }
    }
    async moveRequestFile(actualPathName, newName, idOrganization) {
        return new Promise(async (resolve, reject) => {
            if (!fs.existsSync('./storage/logos/')) {
                fs.mkdirSync('./storage/logos/');
            }
            if (!fs.existsSync('./storage/logos/' + idOrganization + '/')) {
                fs.mkdirSync('./storage/logos/' + idOrganization + '/');
            }
            fs.rename(actualPathName, 'storage/logos/' + idOrganization + '/' + newName, async (error) => {
                if (error) {
                    this.logger.error("Error reading document: " + error);
                    resolve(new ServerMessage_class_1.ServerMessage(true, "Error renombrando el archivo del oficio", error));
                }
                else {
                    resolve(new ServerMessage_class_1.ServerMessage(false, 'Archivo renombrando con éxito', {}));
                }
                ;
            });
        });
    }
    async updateOrganizationData(logo, body) {
        try {
            let theme = JSON.parse(body.theme);
            let info = JSON.parse(body.info);
            let newAdmins = JSON.parse(body.admins);
            const constraints = [
                newAdmins == null,
                newAdmins == undefined,
                theme.primaryColor == null,
                theme.secondaryColor == null,
                theme.primaryColor == undefined,
                theme.secondaryColor == undefined,
                info.comercialName == null,
                info.phone == null,
                info.email == null,
                info.city == null,
                info.state == null,
                info.street == null,
                info.rfc == null,
                info.fiscalName == null,
                info.fiscalAddress == null,
                info.addressNumber == null,
                info.suburb == null,
                info.zipCode == null,
                info.contactPhone == null,
                info.contactEmail == null,
                info.comercialName == undefined,
                info.phone == undefined,
                info.email == undefined,
                info.city == undefined,
                info.state == undefined,
                info.street == undefined,
                info.rfc == undefined,
                info.fiscalName == undefined,
                info.fiscalAddress == undefined,
                info.addressNumber == undefined,
                info.suburb == undefined,
                info.zipCode == undefined,
                info.contactPhone == undefined,
                info.contactEmail == undefined,
            ];
            if (constraints.some(val => val))
                return new ServerMessage_class_1.ServerMessage(true, "Campos requeridos", null);
            let currentOrganization = await this.organizationRepository.findOne({
                where: {
                    idOrganization: body.id,
                }
            });
            let facturapiInfo = await this.facturapiService.updateOrganizationCustomer(currentOrganization.facturapiToken, {
                businessName: info.fiscalName,
                email: info.email,
                rfc: info.rfc,
                phone: info.phone,
                city: info.city,
                state: info.state,
                street: info.street,
                addressNumber: info.addressNumber,
                suburb: info.suburb,
                zipCode: info.zipCode,
            });
            if (facturapiInfo.error)
                return facturapiInfo;
            currentOrganization.comercialName = info.comercialName;
            currentOrganization.phone = info.phone;
            currentOrganization.email = info.email;
            currentOrganization.city = info.city;
            currentOrganization.state = info.state;
            currentOrganization.street = info.street;
            currentOrganization.rfc = info.rfc;
            currentOrganization.fiscalName = info.fiscalName;
            currentOrganization.fiscalAddress = info.fiscalAddress;
            currentOrganization.addressNumber = info.addressNumber;
            currentOrganization.suburb = info.suburb;
            currentOrganization.zipCode = info.zipCode;
            currentOrganization.contactPhone = info.contactPhone;
            currentOrganization.contactEmail = info.contactEmail;
            currentOrganization.primaryColor = theme.primaryColor;
            currentOrganization.secondaryColor = theme.secondaryColor;
            await currentOrganization.save();
            let currentOrgAdmins = await this.userRepository.findAll({
                attributes: { exclude: ["password", "idConektaAccount"] },
                where: {
                    idRole: {
                        [sequelize_1.Op.or]: [7, 2],
                    },
                    idOrganization: {
                        [sequelize_1.Op.or]: [1, currentOrganization.idOrganization],
                    },
                }
            });
            currentOrgAdmins.forEach(async (admin) => {
                if (admin.idRole == 7 && newAdmins.indexOf(admin.idUser) != -1) {
                    admin.idRole = 2;
                    if (admin.idOrganization == 1)
                        admin.idOrganization = currentOrganization.idOrganization;
                }
                else if (admin.idRole == 2 && newAdmins.indexOf(admin.idUser) == -1)
                    admin.idRole = 7;
                await admin.save();
            });
            return new ServerMessage_class_1.ServerMessage(false, "Organización actualizada correctamente", {});
        }
        catch (error) {
            this.logger.error(error);
            return new ServerMessage_class_1.ServerMessage(true, "Ha ocurrido un error", error);
        }
    }
    async deleteOrganization(idOrganization) {
        try {
            let superAdmin = await this.userRepository.findOne({
                attributes: { exclude: ["password", "idConektaAccount"] },
                where: {
                    idRole: 1,
                },
                include: [{
                        model: organization_entity_1.Organization,
                        as: 'organization'
                    }]
            });
            if (!superAdmin) {
                return new ServerMessage_class_1.ServerMessage(true, "Organizacion principal no encontrada", {});
            }
            let organization = await this.organizationRepository.findOne({
                where: {
                    idOrganization: idOrganization,
                },
                include: [{
                        model: device_entity_1.Device,
                        as: 'devices'
                    }, {
                        model: user_entity_1.User,
                        as: 'users'
                    },]
            });
            for (let user of organization.users) {
                user.idRole = 7;
                user.idOrganization = superAdmin.organization.idOrganization;
                await user.save();
            }
            for (let index = 0; index < organization.devices.length; index++) {
                organization.devices[index].idOrganization = superAdmin.organization.idOrganization;
                await organization.devices[index].save();
            }
            organization.deleted = true;
            await organization.save();
            return new ServerMessage_class_1.ServerMessage(false, "Organización eliminada correctamente", {});
        }
        catch (error) {
            this.logger.error(error);
            return new ServerMessage_class_1.ServerMessage(true, "A ocurrido un error", error);
        }
    }
    getOnlyDate(dateToFix) {
        let dateFixed = new Date(dateToFix);
        return (dateFixed.toLocaleDateString('es-MX', { year: 'numeric', timeZone: 'UTC' }) +
            '-' +
            dateFixed.toLocaleDateString('es-MX', { month: '2-digit', timeZone: 'UTC' }) +
            '-' +
            dateFixed.toLocaleDateString('es-MX', { day: '2-digit', timeZone: 'UTC' }));
    }
};
AdministratorService = __decorate([
    common_1.Injectable(),
    __param(2, common_1.Inject('UserRepository')),
    __param(3, common_1.Inject('OrganizationRepository')),
    __param(4, common_1.Inject('GasHistoryRepository')),
    __param(5, common_1.Inject('StateRepository')),
    __param(6, common_1.Inject('DeviceRepository')),
    __param(7, common_1.Inject('WaterHistoryRepository')),
    __param(8, common_1.Inject('DataloggerHistoryRepository')),
    __param(9, common_1.Inject('NaturalGasHistoryRepository')),
    __param(10, common_1.Inject('ApnRepository')),
    __param(11, common_1.Inject('winston')),
    __metadata("design:paramtypes", [devices_service_1.DevicesService,
        factur_api_service_1.FacturApiService, Object, Object, Object, Object, Object, Object, Object, Object, Object, Object])
], AdministratorService);
exports.AdministratorService = AdministratorService;
//# sourceMappingURL=administrator.service.js.map