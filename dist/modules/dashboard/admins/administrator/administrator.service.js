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
            console.log(...oo_oo(`4035073588_492_12_492_30_4`, error));
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
                    'idHistory',
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
//# sourceMappingURL=administrator.service.js.map