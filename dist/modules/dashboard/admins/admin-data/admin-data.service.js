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
exports.AdminDataService = void 0;
const common_1 = require("@nestjs/common");
const ServerMessage_class_1 = require("./../../../../classes/ServerMessage.class");
const town_entity_1 = require("./../../../../models/town.entity");
const state_entity_1 = require("../../../../models/state.entity");
const sequelize_1 = require("sequelize");
const device_entity_1 = require("../../../../models/device.entity");
const gasSettings_entity_1 = require("../../../../models/gasSettings.entity");
const waterSettings_entity_1 = require("../../../../models/waterSettings.entity");
let AdminDataService = class AdminDataService {
    constructor(userRepository, stateRepository, apnRepository, deviceRepository, logger) {
        this.userRepository = userRepository;
        this.stateRepository = stateRepository;
        this.apnRepository = apnRepository;
        this.deviceRepository = deviceRepository;
        this.logger = logger;
    }
    async getAdminAccountData(user) {
        try {
            let adminUser = await this.userRepository.findOne({
                where: {
                    idUser: user.idUser,
                    idRole: 1,
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
            return new ServerMessage_class_1.ServerMessage(false, 'Datos enviados correctamente', {
                user: adminUser,
                states: states,
            });
        }
        catch (error) {
            return new ServerMessage_class_1.ServerMessage(true, 'A ocurrido un error', error);
        }
    }
    async updateAdminAccountData(adminUser, adminUserData) {
        try {
            if (adminUserData.firstName == null || adminUserData.firstName == undefined ||
                adminUserData.lastName == null || adminUserData.lastName == undefined ||
                adminUserData.mothersLastName == null || adminUserData.mothersLastName == undefined ||
                adminUserData.email == null || adminUserData.email == undefined ||
                adminUserData.phone == null || adminUserData.phone == undefined ||
                adminUserData.firstName == null || adminUserData.firstName == undefined ||
                adminUserData.idTown == null || adminUserData.idTown == undefined) {
                return new ServerMessage_class_1.ServerMessage(true, 'Petición incompleta', {});
            }
            let alreadyEmail = await this.userRepository.findOne({
                where: {
                    idUser: {
                        [sequelize_1.Op.not]: adminUser.idUser,
                    },
                    email: adminUserData.email,
                    deleted: false,
                }
            });
            if (alreadyEmail) {
                return new ServerMessage_class_1.ServerMessage(true, 'Email actualmente en uso', {});
            }
            adminUser.firstName = adminUserData.firstName;
            adminUser.lastName = adminUserData.lastName;
            adminUser.mothersLastName = adminUserData.mothersLastName;
            adminUser.email = adminUserData.email;
            adminUser.phone = adminUserData.phone;
            adminUser.idTown = adminUserData.idTown;
            await adminUser.save();
            return new ServerMessage_class_1.ServerMessage(false, 'Actualizado con éxito', {});
        }
        catch (error) {
            return new ServerMessage_class_1.ServerMessage(true, 'A ocurrido un error', error);
        }
    }
    async getApnList(organization) {
        try {
            let apnList = await this.apnRepository.findAll({}).map(async (apn) => {
                let apnFixed = apn.toJSON();
                apnFixed.noDevices = await this.deviceRepository.count({
                    where: {
                        idApn: apn.idApn,
                    }
                });
                return apnFixed;
            });
            return new ServerMessage_class_1.ServerMessage(false, 'Apn obtenidos correctamente', {
                apnList: organization === 1 ? apnList : [],
            });
        }
        catch (error) {
            return new ServerMessage_class_1.ServerMessage(true, 'A ocurrido un error', error);
        }
    }
    async createNewApn(data) {
        try {
            if (data.idApn == null || data.idApn == undefined ||
                data.name == null || data.name == undefined || data.name == 'AT&T DEFAULT' ||
                data.companyName == null || data.companyName == undefined ||
                data.apn == null || data.apn == undefined ||
                data.user == null || data.user == undefined ||
                data.password == null || data.password == undefined) {
                return new ServerMessage_class_1.ServerMessage(true, 'Petición incompleta', {});
            }
            let newApn = await this.apnRepository.create({
                name: data.name.toUpperCase(),
                companyName: data.companyName.toUpperCase(),
                apn: data.apn.toLowerCase(),
                user: data.user,
                password: data.password,
            });
            let apnListResponse = await this.getApnList(1);
            if (apnListResponse.error == true) {
                return apnListResponse;
            }
            return new ServerMessage_class_1.ServerMessage(false, 'Apn guardado correctamente', {
                newApn: newApn,
                apnList: apnListResponse.data.apnList
            });
        }
        catch (error) {
            return new ServerMessage_class_1.ServerMessage(true, 'A ocurrido un error', error);
        }
    }
    async updateAPNAdmin(data) {
        try {
            if (data.idApn == null || data.idApn == undefined ||
                data.name == null || data.name == undefined ||
                data.companyName == null || data.companyName == undefined ||
                data.apn == null || data.apn == undefined ||
                data.user == null || data.user == undefined ||
                data.password == null || data.password == undefined) {
                return new ServerMessage_class_1.ServerMessage(true, 'Petición incompleta', {});
            }
            let apnToUpdate = await this.apnRepository.findOne({
                where: {
                    idApn: data.idApn,
                    name: {
                        [sequelize_1.Op.not]: 'AT&T DEFAULT'
                    }
                },
                include: [{
                        model: device_entity_1.Device,
                        as: 'devices',
                        include: [{
                                model: waterSettings_entity_1.WaterSettings,
                                as: 'waterSettings',
                            }, {
                                model: gasSettings_entity_1.GasSettings,
                                as: 'gasSettings',
                            }]
                    }]
            });
            if (!apnToUpdate) {
                return new ServerMessage_class_1.ServerMessage(true, 'Apn no disponible', {});
            }
            apnToUpdate.name = data.name.toUpperCase();
            apnToUpdate.companyName = data.companyName.toUpperCase();
            apnToUpdate.apn = data.apn.toLowerCase();
            apnToUpdate.user = data.user;
            apnToUpdate.password = data.password;
            await apnToUpdate.save();
            for (let index = 0; index < apnToUpdate.devices.length; index++) {
                var device = apnToUpdate.devices[index];
                if (device.type == 0) {
                    device.gasSettings.wereApplied = false;
                    await device.gasSettings.save();
                }
                else if (device.type == 1) {
                    device.waterSettings.wereApplied = false;
                    await device.waterSettings.save();
                }
            }
            let apnListResponse = await this.getApnList(1);
            if (apnListResponse.error == true) {
                return apnListResponse;
            }
            return new ServerMessage_class_1.ServerMessage(false, 'Apn guardado correctamente', {
                apnList: apnListResponse.data.apnList,
                apnToUpdate: apnToUpdate
            });
        }
        catch (error) {
            return new ServerMessage_class_1.ServerMessage(true, 'A ocurrido un error', error);
        }
    }
    async deleteAPNAdmin(data) {
        try {
            if (data.apnDataToDelete.idApn == null || data.apnDataToDelete.idApn == undefined ||
                data.apnDataToSet.idApn == null || data.apnDataToSet.idApn == undefined) {
                return new ServerMessage_class_1.ServerMessage(true, 'Petición incompleta', {});
            }
            let apnToDelete = await this.apnRepository.findOne({
                where: {
                    idApn: data.apnDataToDelete.idApn,
                    name: {
                        [sequelize_1.Op.not]: 'AT&T DEFAULT'
                    }
                },
                include: [{
                        model: device_entity_1.Device,
                        as: 'devices',
                        include: [{
                                model: waterSettings_entity_1.WaterSettings,
                                as: 'waterSettings',
                            }, {
                                model: gasSettings_entity_1.GasSettings,
                                as: 'gasSettings',
                            }]
                    }]
            });
            if (!apnToDelete) {
                return new ServerMessage_class_1.ServerMessage(true, 'Apn no disponible', {});
            }
            let updatedDevices = await this.deviceRepository.update({ idApn: data.apnDataToSet.idApn }, {
                where: {
                    idApn: data.apnDataToDelete.idApn,
                }
            });
            await apnToDelete.destroy();
            for (let index = 0; index < apnToDelete.devices.length; index++) {
                var device = apnToDelete.devices[index];
                if (device.type == 0) {
                    device.gasSettings.wereApplied = false;
                    await device.gasSettings.save();
                }
                else if (device.type == 1) {
                    device.waterSettings.wereApplied = false;
                    device.waterSettings.status = device.waterSettings.calculateNewStatus(6, true);
                    await device.waterSettings.save();
                }
            }
            let apnListResponse = await this.getApnList(1);
            if (apnListResponse.error == true) {
                return apnListResponse;
            }
            return new ServerMessage_class_1.ServerMessage(false, 'Apn guardado correctamente', {
                apnList: apnListResponse.data.apnList,
                apnToDelete: apnToDelete,
                updatedDevices: updatedDevices
            });
        }
        catch (error) {
            return new ServerMessage_class_1.ServerMessage(true, 'A ocurrido un error', error);
        }
    }
};
AdminDataService = __decorate([
    common_1.Injectable(),
    __param(0, common_1.Inject('UserRepository')),
    __param(1, common_1.Inject('StateRepository')),
    __param(2, common_1.Inject('ApnRepository')),
    __param(3, common_1.Inject('DeviceRepository')),
    __param(4, common_1.Inject('winston')),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object])
], AdminDataService);
exports.AdminDataService = AdminDataService;
//# sourceMappingURL=admin-data.service.js.map