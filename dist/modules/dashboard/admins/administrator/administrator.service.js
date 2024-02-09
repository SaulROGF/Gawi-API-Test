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
            console.log(...oo_oo(`489891777_492_12_492_30_4`, error));
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
            console.log(...oo_oo(`489891777_895_12_895_30_4`, error));
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
//# sourceMappingURL=administrator.service.js.map