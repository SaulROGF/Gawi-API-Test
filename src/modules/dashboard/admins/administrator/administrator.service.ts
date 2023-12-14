import { DataloggerHistory } from './../../../../models/dataloggerHistory.entity';
import { Role } from './../../../../models/role.entity';
import { Town } from './../../../../models/town.entity';
import { User } from './../../../../models/user.entity';
import { Injectable, Inject, } from '@nestjs/common';
import { ServerMessage } from '../../../../classes/ServerMessage.class';
import { State } from '../../../../models/state.entity';
import { Op, or, Sequelize, where } from 'sequelize';
import { Device } from '../../../../models/device.entity';
import { Organization } from '../../../../models/organization.entity';
import { DevicesService } from '../../clients/devices/devices.service';
import { WaterHistory } from '../../../../models/waterHistory.entity';
import { WaterSettings } from '../../../../models/waterSettings.entity';
import { BillingInformation } from '../../../../models/billingInformation.entity';
import { GasHistory } from '../../../../models/gasHistory.entity';
import { Apn } from '../../../../models/apn.entity';
import { GasSettings } from '../../../../models/gasSettings.entity';
import { Logger } from 'winston';
import { FacturApiService } from '../../../../modules/global/factur-api/factur-api.service';
import { toLocalTime } from './../../../../utils/utilities';
import { DataloggerSettings } from '../../../../models/dataloggerSettings.entity';

import * as fs from 'fs';
import { DataloggerHistoryAdapter } from '../../devices/devices/classes/datalogger.adapter';
import { NaturalGasHistory } from '../../../../models/naturalGasHistory.entity';
import { NaturalGasSettings } from '../../../../models/naturalGasSettings.entity';

@Injectable()
export class AdministratorService {

    constructor(
        private devicesService: DevicesService,
        private facturapiService: FacturApiService,
        // Es una manera de dar de alta el repositorio de la tabla de usuarios
        @Inject('UserRepository') private readonly userRepository: typeof User,
        @Inject('OrganizationRepository') private readonly organizationRepository: typeof Organization,
        @Inject('GasHistoryRepository') private readonly gasHistoryRepository: typeof GasHistory,
        @Inject('StateRepository') private readonly stateRepository: typeof State,
        @Inject('DeviceRepository') private readonly deviceRepository: typeof Device,
        @Inject('WaterHistoryRepository') private readonly waterHistoryRepository: typeof WaterHistory,
        @Inject('DataloggerHistoryRepository') private readonly dataloggerHistoryRepository: typeof DataloggerHistory,
        @Inject('NaturalGasHistoryRepository') private readonly naturalGasHistoryRepository: typeof NaturalGasHistory,
        @Inject('ApnRepository') private readonly apnRepository: typeof Apn,
        @Inject('winston') private readonly logger: Logger,
    ) { }

    async getHomeAdminData(): Promise<ServerMessage> {
        try {
            let totalDevices = await this.deviceRepository.count({
            });
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
                    model: User,
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
                    model: User,
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
            let dates: Date[] = [];
            let datesLabels: string[] = [];
            let valuesWater: any[] = [];
            let valuesGas: any[] = [];

            for (let index = 0; index < 7; index++) {
                todayDate = new Date();
                todayDate.setHours(0);
                todayDate.setMinutes(0);
                todayDate.setSeconds(0);
                dates.push(new Date(todayDate.setDate(todayDate.getDate() - index)));

                let montNum = new Date(dates[index]).getUTCMonth() + 1;
                let fixMont = montNum.toString().length == 1 ? "0" + montNum : montNum;
                datesLabels.push("" + new Date(dates[index]).getFullYear() + "-" + fixMont + "-" + new Date(dates[index]).getDate());

                let finaleOfDay: Date = new Date(dates[index]);
                finaleOfDay.setHours(23);
                finaleOfDay.setMinutes(59);

                let alreadyDevices: any[] = await this.deviceRepository.findAll<Device>({
                    attributes: [
                        'type',
                        [Sequelize.literal(`MONTH(createdAt)`), 'mont'],
                        [Sequelize.literal(`DAY(createdAt)`), 'day'],
                        'createdAt',
                        [Sequelize.literal(`COUNT(*)`), 'count']
                    ],
                    where: {
                        /* idUser : userWarehouse.idUser, */
                        createdAt: {
                            [Op.gte]: dates[index],
                            [Op.lte]: finaleOfDay,
                        }
                    },
                    group: [
                        'type'
                    ],
                });

                let fixedValues: any[] = [0, 0];//[gas,agua]

                alreadyDevices.forEach((deviceCountData: any/*  { type : number , month : number,day : number,  createdAt : string,count : number} */) => {
                    fixedValues[deviceCountData.dataValues.type] = deviceCountData.dataValues.count;
                });
                valuesGas.push(fixedValues[0]);
                valuesWater.push(fixedValues[1]);
            }

            //Users
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

            return new ServerMessage(false, "Datos de la vista del home obtenida", {
                //Dispositivos
                totalDevices: totalDevices,
                totalGasDevices: totalGasDevices,
                totalAssignedGasDevices: totalAssignedGasDevices,
                totalWaterDevices: totalWaterDevices,
                totalAssignedWaterDevices: totalAssignedWaterDevices,
                //Organizaciones 
                totalGasOrganizations: totalGasOrganizations,
                totalWaterOrganizations: totalWaterOrganizations,
                //last week production
                actualWeekProduction: {
                    barChartData: [{
                        label: 'Gas',
                        lineTension: 0.1,
                        data: valuesGas/* [{ x: '0',y: 1},{ x: '1',y: 1},{ x: '1',y: 2},{ x: '2',y: 3} ] */,
                    }, {
                        label: 'Agua',
                        lineTension: 0.1,
                        data: valuesWater/* [{ x: '0',y: 1},{ x: '1',y: 1},{ x: '1',y: 2},{ x: '2',y: 3} ] */,
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
        } catch (error) {
            this.logger.error(error);
            return new ServerMessage(true, "A ocurrido un error", error);
        }
    }


    async getAllAccountUsersData(): Promise<ServerMessage> {
        try {
            let usersAccount: User[] = await this.userRepository.findAll<User>({
                attributes: { exclude: ['idConektaAccount', 'password', 'passwordFacebook', 'passwordGoogle'] },
                include: [{
                    model: Town,
                    as: 'town',
                    include: [{
                        model: State,
                        as: 'state',
                    }]
                }, {
                    attributes: ['idDevice', 'idUser'],
                    model: Device,
                    as: 'devices',
                    //required : true,
                }, {
                    attributes: { exclude: ['facturapiToken'] },
                    model: Organization,
                    as: 'organization'
                }]
            })/* .map(async (userData: User) => {
                let userDevices = await this.deviceRepository.count({
                    where: {
                        idUser: userData.idUser,
                    },
                });

                let userFix: any = userData.toJSON();
                userFix.devices = userDevices;

                return Object.assign(userFix);
            }); */

            return new ServerMessage(false, "Datos de la vista de clientes de la organizacion obtenida con éxito", {
                usersAccount: usersAccount,
            });
        } catch (error) {
            this.logger.error(JSON.stringify(error));
            return new ServerMessage(true, "A ocurrido un error", error);
        }
    }


    async getOrganizationClientsAdminData(idOrganization: number): Promise<ServerMessage> {
        try {
            if (
                idOrganization == null ||
                idOrganization == undefined
            ) {
                return new ServerMessage(true, "Campos inválidos", {});
            }
            let clientUsers: User[] = await this.userRepository.findAll<User>({
                attributes: { exclude: ['idConektaAccount', 'password', 'passwordFacebook', 'passwordGoogle'] },
                where: {
                    idRole: 7,
                    deleted: false
                },
                include: [{
                    model: Town,
                    as: 'town',
                    include: [{
                        model: State,
                        as: 'state',
                    }]
                }, {
                    attributes: ['idDevice', 'idUser'],
                    model: Device,
                    as: 'devices',
                    required: true,
                    where: {
                        idOrganization: idOrganization,
                    }
                }]
            }).map(async (userData: User) => {
                let userDevices = await this.deviceRepository.count({
                    where: {
                        idUser: userData.idUser,
                        idOrganization: idOrganization,
                    },
                });

                let userFix: any = userData.toJSON();
                userFix.devices = userDevices;

                return Object.assign(userFix);
            });;

            return new ServerMessage(false, "Datos de la vista de clientes de la organizacion obtenida con éxito", {
                clientUsers: clientUsers,
            });
        } catch (error) {
            this.logger.error(JSON.stringify(error));
            return new ServerMessage(true, "A ocurrido un error", error);
        }
    }

    async getClientProfileData(idUser: number, organization: number, idRole: number): Promise<ServerMessage> {
        try {
            if (
                idUser == null ||
                idUser == undefined ||
                idRole == null ||
                idRole == undefined
            ) {
                return new ServerMessage(true, "Campos inválidos", {});
            }

            let userClientData;

            if (idRole == 1) {
                userClientData = await this.userRepository.findOne<User>({
                    attributes: { exclude: ['password', 'passwordFacebook', 'passwordGoogle'] },
                    where: {
                        idUser: idUser,
                        idRole: 7,
                        idOrganization: organization,
                    },
                    include: [{
                        attributes: { exclude: ['imei'] },
                        model: Device,
                        as: 'devices',
                        //required: true,
                        /* where: {
                            idOrganization: organization,
                        }, */
                        include: [{
                            model: Town,
                            as: 'town',
                            include: [{
                                model: State,
                                as: 'state',
                            }]
                        }, {
                            attributes: { exclude: ['facturapiToken'] },
                            model: Organization,
                            as: 'organization',
                        }, {
                            model: User,
                            as: 'user',
                            include: [{
                                model: Town,
                                as: 'town',
                                include: [{
                                    model: State,
                                    as: 'state',
                                }]
                            }, {
                                model: Role,
                                as: 'role',
                            }]
                        },]
                    }, {
                        model: Town,
                        as: 'town',
                        include: [{
                            model: State,
                            as: 'state'
                        }]
                    }, {
                        model: BillingInformation,
                        as: 'billingInformation'
                    }]
                });

                if (!userClientData) {
                    return new ServerMessage(true, "Usuario no disponible", {});
                }
            } else {
                userClientData = await this.userRepository.findOne<User>({
                    attributes: { exclude: ['password', 'passwordFacebook', 'passwordGoogle'] },
                    where: {
                        idUser: idUser,
                        idRole: 7,
                        //idOrganization: organization,
                    },
                    include: [{
                        attributes: { exclude: ['imei'] },
                        model: Device,
                        as: 'devices',
                        required: true,
                        where: {
                            idOrganization: organization,
                        },
                        include: [{
                            model: Town,
                            as: 'town',
                            include: [{
                                model: State,
                                as: 'state',
                            }]
                        }, {
                            attributes: { exclude: ['facturapiToken'] },
                            model: Organization,
                            as: 'organization',
                        }, {
                            model: User,
                            as: 'user',
                            include: [{
                                model: Town,
                                as: 'town',
                                include: [{
                                    model: State,
                                    as: 'state',
                                }]
                            }, {
                                model: Role,
                                as: 'role',
                            }]
                        },]
                    }, {
                        model: Town,
                        as: 'town',
                        include: [{
                            model: State,
                            as: 'state'
                        }]
                    }, {
                        model: BillingInformation,
                        as: 'billingInformation'
                    }]
                });

                if (!userClientData) {
                    return new ServerMessage(true, "Usuario no disponible", {});
                }
            }

            let userDataFixed: any = userClientData.toJSON();

            userDataFixed.devices = userClientData.devices.map((deviceData: Device) => {
                return Object.assign({
                    //Device data
                    idDevice: deviceData.idDevice,
                    serialNumber: deviceData.serialNumber,
                    type: deviceData.type,
                    version: deviceData.version,
                    boardVersion: deviceData.boardVersion,
                    firmwareVersion: deviceData.firmwareVersion,
                    batteryDate: deviceData.batteryDate,
                    createdAt: deviceData.createdAt,

                    fullLocation: deviceData.town.name + " ," + deviceData.town.state.name,
                    //Organization
                    comercialName: deviceData.organization.comercialName,
                    logoUrl: deviceData.organization.logoUrl,

                    //User 
                    email: deviceData.user.email,
                    idUserRole: deviceData.user.idRole,
                    userRoleName: deviceData.user.role.name,
                })
            });

            return new ServerMessage(false, "Datos del perfil del cliente obtenidos", {
                userClientData: userDataFixed,
            });
        } catch (error) {
            console.log(error);

            this.logger.error(JSON.stringify(error));
            return new ServerMessage(true, "A ocurrido un error", error);
        }
    }

    async getOrganizationUsersAdminData(idOrganization: number, idRole: number): Promise<ServerMessage> {
        try {
            if (
                idOrganization == null ||
                idOrganization == undefined ||
                idRole == null ||
                idRole == undefined
            ) {
                return new ServerMessage(true, "Campos inválidos", {});
            }

            let warehouseUsers: User[] = await this.userRepository.findAll<User>({
                where: {
                    idRole: idRole,
                    idOrganization: idOrganization,
                    deleted: false
                },
                include: [{
                    model: Town,
                    as: 'town',
                    include: [{
                        model: State,
                        as: 'state',
                    }]
                }]
            });

            let states: State[] = await this.stateRepository.findAll<State>({
                include: [{
                    model: Town,
                    as: 'towns',
                }]
            });

            return new ServerMessage(false, "Datos de la vista de usuarios del almacén obtenida con éxito", {
                warehouseUsers: warehouseUsers,
                states: states
            });
        } catch (error) {
            this.logger.error(error);
            return new ServerMessage(true, "A ocurrido un error", error);
        }
    }

    async createUser(userAdminData: User, newUserData: User): Promise<ServerMessage> {
        try {
            if (
                newUserData.idUser == null ||
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
                newUserData.active == undefined
            ) {
                return new ServerMessage(true, "Campos inválidos", {});
            }

            let alreadyUser: User = await this.userRepository.findOne<User>({
                where: {
                    email: newUserData.email,
                    deleted: false,
                }
            }) as User;

            if (alreadyUser) {
                return new ServerMessage(true, "Email actualmente registrado", {});
            }

            let newUser: User = await this.userRepository.create<User>({
                //idUser: newUserData.idUser,
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

            let warehouseUsers: User[] = await this.userRepository.findAll<User>({
                where: {
                    idRole: newUserData.idRole,
                    idOrganization: userAdminData.idOrganization,
                    deleted: false
                },
                include: [{
                    model: Town,
                    as: 'town',
                    include: [{
                        model: State,
                        as: 'state',
                    }]
                }]
            });

            return new ServerMessage(false, "Usuario añadido con éxito", {
                warehouseUsers: warehouseUsers
            });
        } catch (error) {
            this.logger.error(error);
            return new ServerMessage(true, "A ocurrido un error creando el usuario", error);
        }
    }

    async updateUser(userAdminData: User, newUserData: User): Promise<ServerMessage> {
        try {
            if (
                newUserData.idUser == null ||
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
                //newUserData.password == null ||
                //newUserData.password == undefined ||
                newUserData.active == null ||
                newUserData.active == undefined
            ) {
                return new ServerMessage(true, "Campos inválidos", {});
            }

            let alreadyUserEmail: User = await this.userRepository.findOne<User>({
                where: {
                    idUser: {
                        [Op.not]: newUserData.idUser,
                    },
                    email: newUserData.email,
                    deleted: false,
                }
            }) as User;

            if (alreadyUserEmail) {
                return new ServerMessage(true, "Email actualmente registrado", {});
            }

            let userToUpdate: User = await this.userRepository.findOne<User>({
                where: {
                    idUser: newUserData.idUser,
                    deleted: false,
                }
            }) as User;

            if (!userToUpdate) {
                return new ServerMessage(true, "Usuario invalido", {});
            }

            //idUser: newUserData.idUser;
            //userToUpdate.idRole = newUserData.idRole;
            userToUpdate.idTown = newUserData.idTown;
            //userToUpdate.idOrganization = userAdminData.idOrganization;
            userToUpdate.email = newUserData.email;
            //userToUpdate.password = newUserData.password;
            userToUpdate.firstName = newUserData.firstName;
            userToUpdate.lastName = newUserData.lastName;
            userToUpdate.mothersLastName = newUserData.mothersLastName;
            userToUpdate.phone = newUserData.phone;
            //userToUpdate.passwordGoogle = newUserData.passwordGoogle;
            //userToUpdate.passwordFacebook = newUserData.passwordFacebook;
            //userToUpdate.idConektaAccount = newUserData.idConektaAccount;
            userToUpdate.active = newUserData.active;
            //userToUpdate.deleted = false;
            //userToUpdate.lastLoginDate = newUserData.lastLoginDate;

            await userToUpdate.save();

            let warehouseUsers: User[] = await this.userRepository.findAll<User>({
                where: {
                    idRole: newUserData.idRole,
                    idOrganization: userAdminData.idOrganization,
                    deleted: false
                },
                include: [{
                    model: Town,
                    as: 'town',
                    include: [{
                        model: State,
                        as: 'state',
                    }]
                }]
            });

            return new ServerMessage(false, "Usuario actualizado con éxito", {
                warehouseUsers: warehouseUsers
            });
        } catch (error) {
            this.logger.error(error);
            return new ServerMessage(true, "A ocurrido un error creando el usuario", error);
        }
    }

    async deleteUser(idOrganization: number, idUser: number): Promise<ServerMessage> {
        try {
            if (
                idUser == null ||
                idUser == undefined ||
                idOrganization == null ||
                idOrganization == undefined
            ) {
                return new ServerMessage(true, "Campos inválidos", {});
            }

            let userForDelete: User = await this.userRepository.findOne<User>({
                where: {
                    idUser: idUser,
                    idOrganization: idOrganization,
                }
            }) as User;

            if (!userForDelete) {
                return new ServerMessage(true, "Usuario no disponible", {});
            }

            userForDelete.deleted = true;
            await userForDelete.save();

            let warehouseUsers: User[] = await this.userRepository.findAll<User>({
                where: {
                    idRole: userForDelete.idRole,
                    idOrganization: idOrganization,
                    deleted: false
                },
                include: [{
                    model: Town,
                    as: 'town',
                    include: [{
                        model: State,
                        as: 'state',
                    }]
                }]
            });

            return new ServerMessage(false, "Usuario eliminado con éxito", {
                warehouseUsers: warehouseUsers
            });
        } catch (error) {
            this.logger.error(error);
            return new ServerMessage(true, "A ocurrido un error creando el usuario", error);
        }
    }

    async getAllDevicesList(organization: number): Promise<ServerMessage> {
        try {
            let devicesList: Device[] = await this.deviceRepository.findAll<Device>({
                include: [{
                    model: Town,
                    as: 'town',
                    include: [{
                        model: State,
                        as: 'state',
                    }]
                }, {
                    model: Organization,
                    as: 'organization',
                }, {
                    model: User,
                    as: 'user',
                    include: [{
                        model: Town,
                        as: 'town',
                        include: [{
                            model: State,
                            as: 'state',
                        }]
                    }, {
                        model: Role,
                        as: 'role',
                    }]
                }, {
                    model: DataloggerHistory,
                    as: 'dataloggerHistory',
                    limit: 1,
                    order: [['dateTime', 'DESC']],
                }, {
                    model: WaterHistory,
                    as: 'waterHistory',
                    limit: 1,
                    order: [['dateTime', 'DESC']],
                }, {
                    model: GasHistory,
                    as: 'gasHistory',
                    limit: 1,
                    order: [['dateTime', 'DESC']],
                }, {
                    model: NaturalGasHistory,
                    as: 'naturalGasHistory',
                    limit: 1,
                    order: [['dateTime', 'DESC']],
                }],
                order: [['createdAt', 'DESC']]
            }).map((deviceData: Device) => {
                let lastTransmition: Date = new Date();
                let haveTransmission: boolean = false;

                //'0 - gas, 1 - agua, 2 - datalogger, 3 - gas natural'
                if (deviceData.type == 0) {
                    if (deviceData.gasHistory.length > 0) {
                        lastTransmition = deviceData.gasHistory[0].dateTime;
                        haveTransmission = true;
                    }
                } else if (deviceData.type == 1) {
                    if (deviceData.waterHistory.length > 0) {
                        lastTransmition = deviceData.waterHistory[0].dateTime;
                        haveTransmission = true;
                    }
                } else if (deviceData.type == 2) {
                    if (deviceData.dataloggerHistory.length > 0) {
                        lastTransmition = deviceData.dataloggerHistory[0].dateTime;
                        haveTransmission = true;
                    }
                } else if (deviceData.type == 3) {
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
                    //Device data
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
                    //Organization
                    comercialName: deviceData.organization.comercialName,
                    logoUrl: deviceData.organization.logoUrl,

                    //User 
                    email: deviceData.user.email,
                    idUserRole: deviceData.user.idRole,
                    userRoleName: deviceData.user.role.name,
                    isDeleted: deviceData.user.deleted,
                    isActive: deviceData.isActive,
                })
            });

            return new ServerMessage(false, "Lista de todos los dispositivos obtenida con éxito.", {
                devicesList: devicesList,
            });
        } catch (error) {
            this.logger.error(error);
            return new ServerMessage(true, "A ocurrido un error", error);
        }
    }

    async getAllOrganizationDevicesList(idOrganization: number): Promise<ServerMessage> {
        try {
            if (
                idOrganization == null ||
                idOrganization == undefined
            ) {
                return new ServerMessage(true, "Campos inválidos", {});
            }

            let devicesList: Device[] = await this.deviceRepository.findAll<Device>({
                where: {
                    idOrganization: idOrganization,
                },
                include: [{
                    model: Town,
                    as: 'town',
                    include: [{
                        model: State,
                        as: 'state',
                    }]
                }, {
                    model: Organization,
                    as: 'organization',
                }, {
                    model: User,
                    as: 'user',
                    include: [{
                        model: Town,
                        as: 'town',
                        include: [{
                            model: State,
                            as: 'state',
                        }]
                    }, {
                        model: Role,
                        as: 'role',
                    }]
                },{
                    model: DataloggerHistory,
                    as: 'dataloggerHistory',
                    limit: 1,
                    order: [['dateTime', 'DESC']],
                }, {
                    model: WaterHistory,
                    as: 'waterHistory',
                    limit: 1,
                    order: [['dateTime', 'DESC']],
                }, {
                    model: GasHistory,
                    as: 'gasHistory',
                    order: [['dateTime', 'DESC']],
                }, {
                    model: NaturalGasHistory,
                    as: 'naturalGasHistory',
                    limit: 1,
                    order: [['dateTime', 'DESC']],
                }],
                order: [['createdAt', 'DESC']]
            }).map((deviceData: Device) => {
                let lastTransmition: Date = new Date();
                let haveTransmission: boolean = false;

                //'0 - gas, 1 - agua, 2 - datalogger', 3 - gas natural'
                if (deviceData.type == 0) {
                    if (deviceData.gasHistory.length > 0) {
                        lastTransmition = deviceData.gasHistory[0].dateTime;
                        haveTransmission = true;
                    }
                } else if (deviceData.type == 1) {
                    if (deviceData.waterHistory.length > 0) {
                        lastTransmition = deviceData.waterHistory[0].dateTime;
                        haveTransmission = true;
                    }
                } else if (deviceData.type == 2) {
                    if (deviceData.dataloggerHistory.length > 0) {
                        lastTransmition = deviceData.dataloggerHistory[0].dateTime;
                        haveTransmission = true;
                    }
                } else if (deviceData.type == 3) {
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
                    //Device data
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
                    gasHistory: deviceData.gasHistory,
                 

                    fullLocation: deviceData.town.name + ", " + deviceData.town.state.name,
                    //Organizationn
                    comercialName: deviceData.organization.comercialName,
                    logoUrl: deviceData.organization.logoUrl,

                    //User 
                    email: deviceData.user.email,
                    idUserRole: deviceData.user.idRole,
                    userRoleName: deviceData.user.role.name,
                    isDeleted: deviceData.user.deleted,
                    isActive: deviceData.isActive,
                })
            });

            return new ServerMessage(false, "Lista de todos los dispositivos obtenida con éxito.", {
                devicesList: devicesList,
            });
        } catch (error) {
            this.logger.error(error);
            return new ServerMessage(true, "A ocurrido un error", error);
        }
    }

    /**
     *
     */
    async getAllHistoryNaturalGasDeviceData(
        query: {
            idDevice: number, fromDate: Date, toDate: Date, period: number,
            serialNumbersExtraDevices: string[]
        }
    ): Promise<ServerMessage> {
        try {
            if (
                query.idDevice == null ||
                query.idDevice == undefined ||
                query.fromDate == null ||
                query.fromDate == undefined ||
                query.toDate == null ||
                query.toDate == undefined ||
                query.period == null ||
                query.period == undefined ||
                query.serialNumbersExtraDevices == null ||
                query.serialNumbersExtraDevices == undefined
            ) {
                return new ServerMessage(true, 'Petición incompleta', {});
            }
            query.fromDate = new Date(query.fromDate);
            query.toDate = new Date(query.toDate);

            query.fromDate = toLocalTime(query.fromDate);
            query.toDate = toLocalTime(query.toDate);

            //Validation device exist
            let deviceData: Device | null = await this.deviceRepository.findOne<Device>({
                attributes: { exclude: ['imei'] },
                where: {
                    idDevice: query.idDevice,
                    type: 3
                },
                include: [{
                    model: Organization,
                    as: 'organization',
                }, {
                    model: User,
                    as: 'user',
                    attributes: { exclude: ['password', 'passwordFacebook', 'passwordGoogle'] },
                    include: [{
                        model: Role,
                        as: 'role',
                    }]
                },],
            });

            if (!deviceData) {
                return new ServerMessage(true, 'El dispositivo no esta disponible', {});
            }

            let responseClientView: ServerMessage = await this.devicesService.getNaturalGasDeviceData(
                { idUser: deviceData.idUser },
                query.idDevice,
                query.period,
            );

            let responsePrincipalQueryHistoryView: ServerMessage = await this.getQueryHistoryFromTONaturalGasDeviceData(
                query
            );

            let fullDevicesCompareData: any[] = [];
            let serialNumbersExtraDevices: string[] = [];
            let idDevicesNumbersExtraDevices: number[] = [];

            for (let index = 0; index < query.serialNumbersExtraDevices.length; index++) {
                const serialNumber = query.serialNumbersExtraDevices[index];

                let deviceData: Device | null = await this.deviceRepository.findOne<Device>({
                    attributes: { exclude: ['imei'] },
                    where: {
                        serialNumber: serialNumber,
                        type: 1
                    },
                });

                if (deviceData) {
                    let responsePrincipalQueryHistoryView: ServerMessage = await this.getQueryHistoryFromTONaturalGasDeviceData({
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

            let fullFromToLabels: NaturalGasHistory[] = await this.naturalGasHistoryRepository.findAll<NaturalGasHistory>({
                attributes: [[Sequelize.fn('DISTINCT', Sequelize.col('dateTime')), 'dateTime']],
                where: {
                    idDevice: {
                        [Op.or]: idDevicesNumbersExtraDevicesFixed,
                    },
                    [Op.or]: [
                        {
                            dateTime: {
                                [Op.between]: [
                                    (query.fromDate.toISOString() as unknown as number),
                                    (query.toDate.toISOString() as unknown as number),
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
            },
            ).map((history: NaturalGasHistory) => {
                return Object.assign((this.devicesService.getDateTimepikerFormat(
                    this.devicesService.convertDateToUTC(history.dateTime)
                ) as any))
            });

            let apnCatalog: Apn[] = await this.apnRepository.findAll({});

            // retornar el periodo solicitado
            return new ServerMessage(false, 'Información obtenida correctamente', {
                //fullFromToLabels : fullFromToLabels,
                fullIndividualDeviceData: {
                    clientData: deviceData.user,
                    organizationData: deviceData.organization,

                    responseClientView: responseClientView.data,
                    /*  */
                    fromToHistorial: responsePrincipalQueryHistoryView.data.fromToHistorial,//
                    actualFromToLabels: fullFromToLabels/* responsePrincipalQueryHistoryView.data.actualFromToLabels */,//

                    actualConsumptionFromToValues: responsePrincipalQueryHistoryView.data.actualConsumptionFromToValues,//
                },
                fullDevicesCompareData: fullDevicesCompareData,
                serialNumbersExtraDevices: serialNumbersExtraDevices,
                apnCatalog: apnCatalog,
            });
        } catch (error) {
            this.logger.error(error);
            return new ServerMessage(true, 'Ha ocurrido un error', error);
        }
    }

    /**
     *
     */
    async getQueryHistoryFromTONaturalGasDeviceData(
        query: { idDevice: number, fromDate: Date, toDate: Date }
    ): Promise<ServerMessage> {
        try {
            if (
                query.idDevice == null ||
                query.idDevice == undefined ||
                query.fromDate == null ||
                query.fromDate == undefined ||
                query.toDate == null ||
                query.toDate == undefined
            ) {
                return new ServerMessage(true, 'Petición incompleta', {});
            }
            query.fromDate = new Date(query.fromDate);
            query.toDate = new Date(query.toDate);

            //Validation device exist
            let deviceData  : Device | null = await this.deviceRepository.findOne<Device>({
                attributes: { exclude: ['imei'] },
                where: {
                    idDevice: query.idDevice,
                    type: 3
                },
            });

            if (!deviceData) {
                return new ServerMessage(true, 'El dispositivo no esta disponible', {});
            }

            let fromToHistorial: NaturalGasHistory[] = await this.naturalGasHistoryRepository.findAll<NaturalGasHistory>(
                {
                    attributes: [
                        'idHistory',
                        'idDevice',
                        'consumption',
                        'dateTime',
                        'createdAt',
                    ],
                    where: {
                        idDevice: deviceData.idDevice,
                        [Op.or]: [
                            {
                                dateTime: {
                                    [Op.between]: [
                                        (query.fromDate.toISOString() as unknown as number),
                                        (query.toDate.toISOString() as unknown as number),
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
                    //limit: 1,
                    order: [['dateTime', 'ASC']],
                },
            );

            /* Genera el color para nuestra grafica */
            let randomColor1 = (Math.random() * (150 - 50) + 50).toFixed(0);
            let randomColor2 = (Math.random() * (150 - 50) + 50).toFixed(0);
            let randomColor3 = (Math.random() * (150 - 50) + 50).toFixed(0);
            let setColor = 'rgba( ' + randomColor1 + ' ,' + randomColor2 + ' ,' + randomColor3 + ',0.4)';

            let actualFromToLabels: any[] = [];

            let actualConsumptionFromToValues: any[] = [];

            fromToHistorial.forEach(async (history: NaturalGasHistory) => {
                let dateTimeFixed = this.devicesService.getDateTimepikerFormat(
                    this.devicesService.convertDateToUTC(history.dateTime)
                );
                actualFromToLabels.push(dateTimeFixed);

                actualConsumptionFromToValues.push({
                    x: dateTimeFixed,
                    y: history.consumption,
                });
            });

            // retornar el periodo solicitado
            return new ServerMessage(false, 'Información obtenida correctamente', {
                deviceData: deviceData,

                /*  */
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
        } catch (error) {
            this.logger.error(error);
            return new ServerMessage(true, 'Ha ocurrido un error', error);
        }
    }

    /**
     *
     */
    async getAllHistoryWaterDeviceData(
        query: {
            idDevice: number, fromDate: Date, toDate: Date, period: number,
            serialNumbersExtraDevices: string[]
        }
    ): Promise<ServerMessage> {
        try {
            if (
                query.idDevice == null ||
                query.idDevice == undefined ||
                query.fromDate == null ||
                query.fromDate == undefined ||
                query.toDate == null ||
                query.toDate == undefined ||
                query.period == null ||
                query.period == undefined ||
                query.serialNumbersExtraDevices == null ||
                query.serialNumbersExtraDevices == undefined
            ) {
                return new ServerMessage(true, 'Petición incompleta', {});
            }
            query.fromDate = new Date(query.fromDate);
            query.toDate = new Date(query.toDate);

            query.fromDate = toLocalTime(query.fromDate);
            query.toDate = toLocalTime(query.toDate);

            //Validation device exist
            let deviceData: Device | null = await this.deviceRepository.findOne<Device>({
                attributes: { exclude: ['imei'] },
                where: {
                    idDevice: query.idDevice,
                    type: 1
                },
                include: [{
                    model: Organization,
                    as: 'organization',
                }, {
                    model: User,
                    as: 'user',
                    attributes: { exclude: ['password', 'passwordFacebook', 'passwordGoogle'] },
                    include: [{
                        model: Role,
                        as: 'role',
                    }]
                },],
            });

            if (!deviceData) {
                return new ServerMessage(true, 'El dispositivo no esta disponible', {});
            }

            let responseClientView: ServerMessage = await this.devicesService.getDeviceWaterData(
                { idUser: deviceData.idUser },
                query.idDevice,
                query.period,
            );

            let responsePrincipalQueryHistoryView: ServerMessage = await this.getQueryHistoryFromTOWaterDeviceData(
                query
            );

            let fullDevicesCompareData: any[] = [];
            let serialNumbersExtraDevices: string[] = [];
            let idDevicesNumbersExtraDevices: number[] = [];

            for (let index = 0; index < query.serialNumbersExtraDevices.length; index++) {
                const serialNumber = query.serialNumbersExtraDevices[index];

                let deviceData: Device | null = await this.deviceRepository.findOne<Device>({
                    attributes: { exclude: ['imei'] },
                    where: {
                        serialNumber: serialNumber,
                        type: 1
                    },
                });

                if (deviceData) {
                    let responsePrincipalQueryHistoryView: ServerMessage = await this.getQueryHistoryFromTOWaterDeviceData({
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

            let fullFromToLabels: WaterHistory[] = await this.waterHistoryRepository.findAll({
                attributes: [[Sequelize.fn('DISTINCT', Sequelize.col('dateTime')), 'dateTime']],
                where: {
                    idDevice: {
                        [Op.or]: idDevicesNumbersExtraDevicesFixed,
                    },
                    [Op.or]: [
                        {
                            dateTime: {
                                [Op.between]: [
                                    (query.fromDate.toISOString() as unknown as number),
                                    (query.toDate.toISOString() as unknown as number),
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
            },
            ).map((history: WaterHistory) => {
                return Object.assign((this.devicesService.getDateTimepikerFormat(
                    this.devicesService.convertDateToUTC(history.dateTime)
                ) as any))
            });

            let apnCatalog: Apn[] = await this.apnRepository.findAll({});

            // retornar el periodo solicitado
            return new ServerMessage(false, 'Información obtenida correctamente', {
                //fullFromToLabels : fullFromToLabels,
                fullIndividualDeviceData: {
                    clientData: deviceData.user,
                    organizationData: deviceData.organization,

                    responseClientView: responseClientView.data,

                    /*  */
                    fromToHistorial: responsePrincipalQueryHistoryView.data.fromToHistorial,
                    actualFromToLabels: fullFromToLabels/* responsePrincipalQueryHistoryView.data.actualFromToLabels */,

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
        } catch (error) {
            this.logger.error(error);
            return new ServerMessage(true, 'Ha ocurrido un error', error);
        }
    }

    /**
     *
     */
    async getQueryHistoryFromTOWaterDeviceData(
        query: { idDevice: number, fromDate: Date, toDate: Date }
    ): Promise<ServerMessage> {
        try {
            if (
                query.idDevice == null ||
                query.idDevice == undefined ||
                query.fromDate == null ||
                query.fromDate == undefined ||
                query.toDate == null ||
                query.toDate == undefined
            ) {
                return new ServerMessage(true, 'Petición incompleta', {});
            }
            query.fromDate = new Date(query.fromDate);
            query.toDate = new Date(query.toDate);

            //Validation device exist
            let deviceData  : Device | null = await this.deviceRepository.findOne<Device>({
                attributes: { exclude: ['imei'] },
                where: {
                    idDevice: query.idDevice,
                    type: 1
                },
            });

            if (!deviceData) {
                return new ServerMessage(true, 'El dispositivo no esta disponible', {});
            }

            let fromToHistorial: WaterHistory[] = await this.waterHistoryRepository.findAll(
                {
                    attributes: [
                        'idWaterHistory', 'consumption', 'flow',
                        'dripAlert', 'bateryLevel', 'signalQuality', 'manipulationAlert', 'emptyAlert', 'burstAlert', 'bubbleAlert', 'reversedFlowAlert',
                        'dateTime'],
                    where: {
                        idDevice: deviceData.idDevice,
                        [Op.or]: [
                            {
                                dateTime: {
                                    [Op.between]: [
                                        (query.fromDate.toISOString() as unknown as number),
                                        (query.toDate.toISOString() as unknown as number),
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
                    //limit: 1,
                    order: [['dateTime', 'ASC']],
                },
            );

            /* Genera el color para nuestra grafica */
            let randomColor1 = (Math.random() * (150 - 50) + 50).toFixed(0);
            let randomColor2 = (Math.random() * (150 - 50) + 50).toFixed(0);
            let randomColor3 = (Math.random() * (150 - 50) + 50).toFixed(0);
            let setColor = 'rgba( ' + randomColor1 + ' ,' + randomColor2 + ' ,' + randomColor3 + ',0.4)';

            let actualFromToLabels: any[] = [];

            let spendingFromToValues: any[] = [];
            let actualConsumptionFromToValues: any[] = [];
            /* Batery */
            let bateryFromToValues: any[] = [];
            /* Signal */
            let signalFromToValues: any[] = [];
            /* Alerts */
            let alarmDripAlertFromToValues: any[] = [];
            let manipulationAlertAlertFromToValues: any[] = [];
            let emptyAlertAlertFromToValues: any[] = [];
            let leakAlertAlertFromToValues: any[] = [];
            let bubbleAlertAlertFromToValues: any[] = [];
            let invertedFlowAlertFromToValues: any[] = [];

            fromToHistorial.forEach(async (history: WaterHistory) => {
                let dateTimeFixed = this.devicesService.getDateTimepikerFormat(
                    this.devicesService.convertDateToUTC(history.dateTime)
                );
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

            /* Genera la data de las graficas de las alarmas en un array */
            let alarmsGraphData: any[] = [];

            for (let index = 0; index < 6; index++) {
                // Retorna un número aleatorio entre min (incluido) y max (excluido)
                let randomColor1 = (Math.random() * (150 - 50) + 50).toFixed(0);
                let randomColor2 = (Math.random() * (150 - 50) + 50).toFixed(0);
                let randomColor3 = (Math.random() * (150 - 50) + 50).toFixed(0);
                let color = 'rgba( ' + randomColor1 + ' ,' + randomColor2 + ' ,' + randomColor3 + ',0.4)';
                let alarmTitle = "";
                let data: any[] = [];

                if (index == 0) {
                    alarmTitle = 'Goteo';
                    data = alarmDripAlertFromToValues;
                } else if (index == 1) {
                    alarmTitle = 'Manipulación';
                    data = manipulationAlertAlertFromToValues;
                } else if (index == 2) {
                    alarmTitle = 'Vacio';
                    data = emptyAlertAlertFromToValues;
                } else if (index == 3) {
                    alarmTitle = 'Fuga';
                    data = leakAlertAlertFromToValues;
                } else if (index == 4) {
                    alarmTitle = 'Burbujas';
                    data = bubbleAlertAlertFromToValues;
                } else if (index == 5) {
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

            // retornar el periodo solicitado
            return new ServerMessage(false, 'Información obtenida correctamente', {
                deviceData: deviceData,

                /*  */
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
        } catch (error) {
            this.logger.error(error);
            return new ServerMessage(true, 'Ha ocurrido un error', error);
        }
    }

    /**
     *
     */
    async getQueryHistoryFromTOGasDeviceData(
        query: { idDevice: number, fromDate: Date, toDate: Date }
    ): Promise<ServerMessage> {
        try {
            if (
                query.idDevice == null ||
                query.idDevice == undefined ||
                query.fromDate == null ||
                query.fromDate == undefined ||
                query.toDate == null ||
                query.toDate == undefined
            ) {
                return new ServerMessage(true, 'Petición incompleta', {});
            }
            query.fromDate = new Date(query.fromDate);
            query.toDate = new Date(query.toDate);

            //Validation device exist
            let deviceData: Device | null = await this.deviceRepository.findOne<Device>({
                attributes: { exclude: ['imei'] },
                where: {
                    idDevice: query.idDevice,
                    type: 0
                },
            });

            if (!deviceData) {
                return new ServerMessage(true, 'El dispositivo no esta disponible', {});
            }

            let fromToHistorial: GasHistory[] = await this.gasHistoryRepository.findAll<GasHistory>(
                {
                    /* attributes: [
                        'idGasHistory','measure', 'bateryLevel', 'meanConsumption', 'signalQuality',
                        'accumulatedConsumption', 'temperature', 'resetAlert', 'intervalAlert', 'fillingAlert',
                        , 'dateTime'], */
                    where: {
                        idDevice: deviceData.idDevice,
                        [Op.or]: [{
                            dateTime: {
                                [Op.between]: [
                                    (query.fromDate.toISOString() as unknown as number),
                                    (query.toDate.toISOString() as unknown as number),
                                ],
                            },
                        }, {
                            dateTime: query.fromDate.toISOString(),
                        }, {
                            dateTime: query.toDate.toISOString(),
                        },],
                    },
                    //limit: 1,
                    order: [['dateTime', 'ASC']],
                },
            );

            /* Genera el color para nuestra grafica */
            let randomColor1 = (Math.random() * (150 - 50) + 50).toFixed(0);
            let randomColor2 = (Math.random() * (150 - 50) + 50).toFixed(0);
            let randomColor3 = (Math.random() * (150 - 50) + 50).toFixed(0);
            let setColor = 'rgba( ' + randomColor1 + ' ,' + randomColor2 + ' ,' + randomColor3 + ',0.4)';

            let actualFromToLabels: any[] = [];

            let actualMeasureFromToValues: any[] = [];
            let meanConsumptionFromToValues: any[] = [];
            let accumulatedConsumptionFromToValues: any[] = [];
            /* Batery */
            let bateryFromToValues: any[] = [];
            /* Signal */
            let signalFromToValues: any[] = [];
            /* Temperature */
            let temperatureFromToValues: any[] = [];
            /* Alerts */
            let resetAlertFromToValues: any[] = [];
            let intervalAlertAlertFromToValues: any[] = [];
            let fillingAlertAlertFromToValues: any[] = [];

            fromToHistorial.forEach(async (history: GasHistory) => {
                /* ALARMAS */
                let dateTimeFixed = this.devicesService.getDateTimepikerFormat(
                    this.devicesService.convertDateToUTC(history.dateTime)
                );
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
                /* ALARMAS */
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

            /* Genera la data de las graficas de las alarmas en un array */
            let alarmsGraphData: any[] = [];

            for (let index = 0; index < 3; index++) {
                // Retorna un número aleatorio entre min (incluido) y max (excluido)
                let randomColor1 = (Math.random() * (150 - 50) + 50).toFixed(0);
                let randomColor2 = (Math.random() * (150 - 50) + 50).toFixed(0);
                let randomColor3 = (Math.random() * (150 - 50) + 50).toFixed(0);
                let color = 'rgba( ' + randomColor1 + ' ,' + randomColor2 + ' ,' + randomColor3 + ',0.4)';
                let alarmTitle = "";
                let data: any[] = [];

                if (index == 0) {
                    alarmTitle = 'Encendido';
                    data = resetAlertFromToValues;
                } else if (index == 1) {
                    alarmTitle = 'Intervalo';
                    data = intervalAlertAlertFromToValues;
                } else if (index == 2) {
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

            // retornar el periodo solicitado
            return new ServerMessage(false, 'Información obtenida correctamente', {
                deviceData: deviceData,

                /*  */
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
        } catch (error) {
            this.logger.error(error);
            return new ServerMessage(true, 'Ha ocurrido un error', error);
        }
    }

    /**
     *
     */
    async getAllHistoryGasDeviceData(
        query: {
            idDevice: number, fromDate: Date, toDate: Date, period: number,
        }
    ): Promise<ServerMessage> {
        try {
            if (
                query.idDevice == null ||
                query.idDevice == undefined ||
                query.fromDate == null ||
                query.fromDate == undefined ||
                query.toDate == null ||
                query.toDate == undefined ||
                query.period == null ||
                query.period == undefined
            ) {
                return new ServerMessage(true, 'Petición incompleta', {});
            }
            query.fromDate = new Date(query.fromDate);
            query.toDate = new Date(query.toDate);

            query.fromDate = toLocalTime(query.fromDate);
            query.toDate = toLocalTime(query.toDate);

            //Validation device exist
            let deviceData: Device | null = await this.deviceRepository.findOne<Device>({
                attributes: { exclude: ['imei'] },
                where: {
                    idDevice: query.idDevice,
                    type: 0,
                },
                include: [{
                    model: Organization,
                    as: 'organization',
                }, {
                    model: User,
                    as: 'user',
                    attributes: { exclude: ['password', 'passwordFacebook', 'passwordGoogle'] },
                    include: [{
                        model: Role,
                        as: 'role',
                    }]
                },],
            });

            if (!deviceData) {
                return new ServerMessage(true, 'El dispositivo no esta disponible', {});
            }

            let responseClientView: ServerMessage = await this.devicesService.getGasDeviceData(
                deviceData.user,
                query.idDevice,
                query.period,
            );

            let responsePrincipalQueryHistoryView: ServerMessage = await this.getQueryHistoryFromTOGasDeviceData(
                query
            );

            if (responsePrincipalQueryHistoryView.error == true) {
                return responsePrincipalQueryHistoryView;
            }


            let apnCatalog: Apn[] = await this.apnRepository.findAll({});

            // retornar el periodo solicitado
            return new ServerMessage(false, 'Información obtenida correctamente', {
                //fullFromToLabels : fullFromToLabels,
                fullIndividualDeviceData: {
                    //deviceData: deviceData,
                    clientData: deviceData.user,
                    organizationData: deviceData.organization,

                    responseClientView: responseClientView.data,

                    /*  */
                    fromToHistorial: responsePrincipalQueryHistoryView.data.fromToHistorial,
                    actualFromToLabels: /* fullFromToLabels */responsePrincipalQueryHistoryView.data.actualFromToLabels,
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
        } catch (error) {
            this.logger.error(error);
            return new ServerMessage(true, 'Ha ocurrido un error', error);
        }
    }

    /**
     *
     */
    async getAllHistoryLoggerDeviceData(
        query: {
            idDevice: number, fromDate: Date, toDate: Date,
        }
    ): Promise<ServerMessage> {
        try {
            if (
                query.idDevice == null ||
                query.idDevice == undefined ||
                query.fromDate == null ||
                query.fromDate == undefined ||
                query.toDate == null ||
                query.toDate == undefined
            ) {
                return new ServerMessage(true, 'Petición incompleta', {});
            }
            query.fromDate = new Date(query.fromDate);
            query.toDate = new Date(query.toDate);

            query.fromDate = toLocalTime(query.fromDate);
            query.toDate = toLocalTime(query.toDate);

            //Validation device exist
            let deviceData: Device | null = await this.deviceRepository.findOne<Device>({
                attributes: { exclude: ['imei'] },
                where: {
                    idDevice: query.idDevice,
                    type: 2
                },
                include: [{
                    model: Organization,
                    as: 'organization',
                }, {
                    model: User,
                    as: 'user',
                    attributes: { exclude: ['password', 'passwordFacebook', 'passwordGoogle'] },
                    include: [{
                        model: Role,
                        as: 'role',
                    }]
                }, {
                    model: Apn,
                    as: 'apn'
                }, {
                    required: true,
                    model: DataloggerSettings,
                    as: 'dataloggerSettings'
                }, {
                    model: Town,
                    as: 'town',
                    include: [
                        {
                            model: State,
                            as: 'state',
                        }
                    ]
                }
                ],
            });

            if (!deviceData) {
                return new ServerMessage(true, 'El dispositivo no esta disponible', {});
            }

            let responsePrincipalQueryHistoryView: ServerMessage = await this.getQueryHistoryFromTOLoggerDeviceData(
                query
            );

            let apnCatalog: Apn[] = await this.apnRepository.findAll({});

            // retornar el periodo solicitado
            return new ServerMessage(false, 'Información obtenida correctamente', {
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
        } catch (error) {
            this.logger.error(error);
            return new ServerMessage(true, 'Ha ocurrido un error', error);
        }
    }
    /**
     *
     */
    async getQueryHistoryFromTOLoggerDeviceData(
        query: { idDevice: number, fromDate: Date, toDate: Date }
    ): Promise<ServerMessage> {
        try {
            if (
                query.idDevice == null ||
                query.idDevice == undefined ||
                query.fromDate == null ||
                query.fromDate == undefined ||
                query.toDate == null ||
                query.toDate == undefined
            ) {
                return new ServerMessage(true, 'Petición incompleta', {});
            }
            query.fromDate = new Date(query.fromDate);
            query.toDate = new Date(query.toDate);

            //Validation device exist
            let deviceData: Device | null = await this.deviceRepository.findOne<Device>({
                attributes: { exclude: ['imei'] },
                where: {
                    idDevice: query.idDevice,
                    type: 2
                },
                include: [{
                    model : DataloggerSettings,
                    as: 'dataloggerSettings'
                }]
            });

            if (!deviceData) {
                return new ServerMessage(true, 'El dispositivo no esta disponible', {});
            }

            let fromToHistorial: DataloggerHistory[] = await this.dataloggerHistoryRepository.findAll<DataloggerHistory>(
                {
                    /* attributes: [], */
                    where: {
                        idDevice: deviceData.idDevice,
                        [Op.or]: [
                            {
                                dateTime: {
                                    [Op.between]: [
                                        (query.fromDate.toISOString() as unknown as number),
                                        (query.toDate.toISOString() as unknown as number),
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
                    //limit: 1,
                    order: [['dateTime', 'ASC']],
                },
            );

            /* Genera el color para nuestra grafica */
            let randomColor1 = (Math.random() * (150 - 50) + 50).toFixed(0);
            let randomColor2 = (Math.random() * (150 - 50) + 50).toFixed(0);
            let randomColor3 = (Math.random() * (150 - 50) + 50).toFixed(0);
            let setColor = 'rgba( ' + randomColor1 + ' ,' + randomColor2 + ' ,' + randomColor3 + ',0.4)';

            let actualFromToLabels: any[] = [];

            let analog1FromToValues: any[] = [];
            let analog2FromToValues: any[] = [];
            let analog3FromToValues: any[] = [];
            let analog4FromToValues: any[] = [];

            let consumption1FromToValues: any[] = [];
            let consumption2FromToValues: any[] = [];

            let flow1FromToValues: any[] = [];
            let flow2FromToValues: any[] = [];

            let batteryLevelFromToValues: any[] = [];
            let signalQualityFromToValues: any[] = [];

            const decodeDigitalInputs = (input: number): Array<number> => {
                const PARAMS: number = 4;
                let ans: Array<number> = [];
                for (let idx: number = 0; idx < PARAMS; ++idx) {
                    ans.push((input >>> idx) & 0x01)
                }
                return ans;
            };

            let d1Inputs : any[] = [];
            let d2Inputs : any[] = [];
            let d3Inputs : any[] = [];
            let d4Inputs : any[] = [];

            let d1Alarms : any[] = [];
            let d2Alarms : any[] = [];
            let d3Alarms : any[] = [];
            let d4Alarms : any[] = [];

            let al1Alarms : any[] = [];
            let al2Alarms : any[] = [];
            let al3Alarms : any[] = [];
            let al4Alarms : any[] = [];

            let ah1Alarms : any[] = [];
            let ah2Alarms : any[] = [];
            let ah3Alarms : any[] = [];
            let ah4Alarms : any[] = [];

            let ql1Alarms : any[] = [];
            let ql2Alarms : any[] = [];
            let ql3Alarms : any[] = [];
            let ql4Alarms : any[] = [];

            fromToHistorial.forEach(async (history: DataloggerHistory) => {
                let dateTimeFixed = this.devicesService.getDateTimepikerFormat(
                    this.devicesService.convertDateToUTC(history.dateTime)
                );
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

                let original : DataloggerHistoryAdapter = new DataloggerHistoryAdapter(history);

                original.formatAlerts(deviceData!.dataloggerSettings);
                let fixedAlerts = original.alerts;
                let binAlerts : any = fixedAlerts.toString(2);

                while( binAlerts.length < 16){
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
                });;
                d4Alarms.push({
                    x: dateTimeFixed,
                    y: binAlerts[12] == '1' ? 6 + 1 : 6,
                });

                al1Alarms.push({
                    x: dateTimeFixed,
                    y: binAlerts[11] == '1' ? 8 + 1 : 8,
                });;
                al2Alarms.push({
                    x: dateTimeFixed,
                    y: binAlerts[10] == '1' ? 10 + 1 : 10,
                });;
                al3Alarms.push({
                    x: dateTimeFixed,
                    y: binAlerts[9] == '1' ? 12 + 1 : 12,
                });;
                al4Alarms.push({
                    x: dateTimeFixed,
                    y: binAlerts[8] == '1' ? 14 + 1 : 14,
                });;

                ah1Alarms.push({
                    x: dateTimeFixed,
                    y: binAlerts[7] == '1' ? 16 + 1 : 16,
                });;
                ah2Alarms.push({
                    x: dateTimeFixed,
                    y: binAlerts[6] == '1' ? 18 + 1 : 18,
                });;
                ah3Alarms.push({
                    x: dateTimeFixed,
                    y: binAlerts[5] == '1' ? 20 + 1 : 20,
                });;
                ah4Alarms.push({
                    x: dateTimeFixed,
                    y: binAlerts[4] == '1' ? 22 + 1 : 22,
                });

                ql1Alarms.push({
                    x: dateTimeFixed,
                    y: binAlerts[3] == '1' ? 24 + 1 : 24,
                });;
                ql2Alarms.push({
                    x: dateTimeFixed,
                    y: binAlerts[2] == '1' ? 26 + 1 : 26,
                });;
                ql3Alarms.push({
                    x: dateTimeFixed,
                    y: binAlerts[1] == '1' ? 28 + 1 : 28,
                });;
                ql4Alarms.push({
                    x: dateTimeFixed,
                    y: binAlerts[0] == '1' ? 30 + 1 : 30,
                });;
            });

            /* Genera la data de las graficas de las alarmas en un array */
            let alarmsGraphData: any[] = [];

            for (let index = 0; index < 16; index++) {
                // Retorna un número aleatorio entre min (incluido) y max (excluido)
                let randomColor1 = (Math.random() * (150 - 50) + 50).toFixed(0);
                let randomColor2 = (Math.random() * (150 - 50) + 50).toFixed(0);
                let randomColor3 = (Math.random() * (150 - 50) + 50).toFixed(0);
                let color = 'rgba( ' + randomColor1 + ' ,' + randomColor2 + ' ,' + randomColor3 + ',0.4)';
                let alarmTitle = "";
                let data: any[] = [];

                if (index == 0) {
                    alarmTitle = 'Cambio de estado en la entrada digital 1';
                    data = d1Alarms;
                } else if (index == 1) {
                    alarmTitle = 'Cambio de estado en la entrada digital 2';
                    data = d2Alarms;
                } else if (index == 2) {
                    alarmTitle = 'Cambio de estado en la entrada digital 3';
                    data = d3Alarms;
                } else if (index == 3) {
                    alarmTitle = 'Cambio de estado en la entrada digital 4';
                    data = d4Alarms;
                } else if (index == 4) {
                    alarmTitle = 'Valor por debajo del umbral en analógico 1';
                    data = al1Alarms;
                } else if (index == 5) {
                    alarmTitle = 'Valor por debajo del umbral en analógico 2';
                    data = al2Alarms;
                } else if (index == 6) {
                    alarmTitle = 'Valor por debajo del umbral en analógico 3';
                    data = al3Alarms;
                } else if (index == 7) {
                    alarmTitle = 'Valor por debajo del umbral en analógico 4';
                    data = al4Alarms;
                } else if (index == 8) {
                    alarmTitle = 'Valor por encima del umbral en analógico 1';
                    data = ah1Alarms;
                } else if (index == 9) {
                    alarmTitle = 'Valor por encima del umbral en analógico 2';
                    data = ah2Alarms;
                } else if (index == 10) {
                    alarmTitle = 'Valor por encima del umbral en analógico 3';
                    data = ah3Alarms;
                } else if (index == 11) {
                    alarmTitle = 'Valor por encima del umbral en analógico 4';
                    data = ah4Alarms;
                } else if (index == 12) {
                    alarmTitle = 'Flujo 1 por debajo del umbral';
                    data = ql1Alarms;
                } else if (index == 13) {
                    alarmTitle = 'Flujo 2 por debajo del umbral';
                    data = ql2Alarms;
                } else if (index == 14) {
                    alarmTitle = 'Flujo 1 por encima del umbral';
                    data = ql3Alarms;
                } else if (index == 15) {
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
            /* Genera la data de las graficas de las alarmas en un array */
            let digitalInputsGraphData: any[] = [];

            for (let index = 0; index < 4; index++) {
                // Retorna un número aleatorio entre min (incluido) y max (excluido)
                let randomColor1 = (Math.random() * (150 - 50) + 50).toFixed(0);
                let randomColor2 = (Math.random() * (150 - 50) + 50).toFixed(0);
                let randomColor3 = (Math.random() * (150 - 50) + 50).toFixed(0);
                let color = 'rgba( ' + randomColor1 + ' ,' + randomColor2 + ' ,' + randomColor3 + ',0.4)';
                let alarmTitle = "";
                let data: any[] = [];

                if (index == 0) {
                    alarmTitle = 'Entrada digital 1';
                    data = d1Inputs;
                } else if (index == 1) {
                    alarmTitle = 'Entrada digital 2';
                    data = d2Inputs;
                } else if (index == 2) {
                    alarmTitle = 'Entrada digital 3';
                    data = d3Inputs;
                } else if (index == 3) {
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

            // retornar el periodo solicitado
            return new ServerMessage(false, 'Información obtenida correctamente', {
                /*  */
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
        } catch (error) {
            this.logger.error(error);
            return new ServerMessage(true, 'Ha ocurrido un error', error);
        }
    }

    async updateApnDeviceData(updatedData: { idDevice: number, idApn: number }): Promise<ServerMessage> {
        try {
            let deviceToUpdate: Device = (await this.deviceRepository.findOne<Device>({
                where: {
                    idDevice: updatedData.idDevice
                },
                include: [{
                    model: WaterSettings,
                    as: 'waterSettings',
                }, {
                    model: GasSettings,
                    as: 'gasSettings',
                }]
            })as Device);

            deviceToUpdate.idApn = updatedData.idApn;
            await deviceToUpdate.save();

            if (deviceToUpdate.type == 0) { // Gas
                deviceToUpdate.gasSettings.wereApplied = false;
                await deviceToUpdate.gasSettings.save();
            } else if (deviceToUpdate.type == 1) { // Watter
                deviceToUpdate.waterSettings.wereApplied = false;
                deviceToUpdate.waterSettings.status = deviceToUpdate.waterSettings.calculateNewStatus(6, true);
                await deviceToUpdate.waterSettings.save();
            }


            return new ServerMessage(false, "Apn actualizado con éxito.", {
                deviceToUpdate: deviceToUpdate,
            });
        } catch (error) {
            this.logger.error(error);
            return new ServerMessage(true, "A ocurrido un error", error);
        }
    }

    async unlockDeviceToBeAssigned(updatedData: { idDevice: number }): Promise<ServerMessage> {
        try {
            if (
                updatedData.idDevice == null ||
                updatedData.idDevice == undefined
            ) {
                return new ServerMessage(true, 'Petición incompleta', {});
            }

            let deviceToUpdate: Device = await this.deviceRepository.findOne<Device>({
                where: {
                    idDevice: updatedData.idDevice
                },
                include: [{
                    model: WaterSettings,
                    as: 'waterSettings',
                }, {
                    model: GasSettings,
                    as: 'gasSettings',
                }]
            }) as Device;

            deviceToUpdate.isActive = true;
            await deviceToUpdate.save();

            return new ServerMessage(false, "Dispositivo liberado con éxito.", {
                deviceToUpdate: deviceToUpdate,
            });
        } catch (error) {
            return new ServerMessage(true, "A ocurrido un error", error);
        }
    }

    /**
     * 
     */
    async getGasDeviceAlerts(
        client: User,
        idDevice: number,
        period: number,
    ): Promise<ServerMessage> {
        try {
            if (
                client == null ||
                client == undefined ||
                idDevice == null ||
                idDevice == undefined ||
                period == null ||
                period == undefined
            ) {
                return new ServerMessage(true, 'Petición incompleta', {});
            }

            let deviceData: Device = await this.deviceRepository.findOne({
                attributes: { exclude: ['imei'] },
                where: {
                    idDevice: idDevice,
                    type: 0,
                    //   idUser : client.idUser,
                },
                include: [{
                    model: GasSettings,
                    as: 'gasSettings'
                },
                {
                    model: Town,
                    as: 'town',
                    include: [
                        {
                            model: State,
                            as: 'state',
                        }
                    ]
                }]
            }) as Device;

            if (!deviceData) {
                return new ServerMessage(true, 'Dispositivo no disponible', {});
            }
            // extrayendo los historiales en donde se efectuó
            // un llenado del tanque, desde el inicio de los
            // registros hasta el día de hoy
            let fillingHistories: GasHistory[] = await this.gasHistoryRepository.findAll<GasHistory>({
                where: {
                    idDevice: idDevice,
                    dateTime: {
                        [Op.lte]: toLocalTime(new Date()).toISOString(),
                    },
                    fillingAlert: 1,
                },
                order: [['dateTime', 'DESC']],
            });
            // el periodo solicitado excede el numero de
            // periodos almacenados
            if (+period > fillingHistories.length) {
                return new ServerMessage(false, 'Información obtenida correctamente', {
                    deviceData: deviceData,
                    toDate: new Date(),
                    fromDate: new Date(),
                    periodHistories: [],
                    periodLabels: [],
                    periodValues: [],
                    lastPeriodUpdate: "Sin registros"
                });
            }
            // calculando las fechas desde (fromDate) hasta (toDate)
            // para determinar el periodo de consumo
            let today: Date =
                period == 0
                    ? toLocalTime(new Date())
                    : fillingHistories[+period - 1].dateTime;

            let toDate = new Date();
            let fromDate = new Date();
            let periodHistories: GasHistory[] = [];

            if (fillingHistories.length - period == 0) {
                // si no hay fechas de llenado en los historiales, tomamos toda
                // la información hasta la fecha de hoy
                toDate = today;
                fromDate = today;
                periodHistories = await this.gasHistoryRepository.findAll<GasHistory>({
                    where: {
                        idDevice: idDevice,
                        dateTime: {
                            [Op.lt]: toDate.toISOString(),
                        },
                    },
                    order: [['dateTime', 'ASC']],
                });
            } else {
                // en cambio, si hay fechas de llenado en los historiales, tomamos toda
                // la información desde la primer fecha de llenado hasta la fecha de hoy
                toDate = today;
                fromDate = fillingHistories[period === 0 ? 0 : +period].dateTime;

                periodHistories = await this.gasHistoryRepository.findAll<GasHistory>({
                    where: {
                        idDevice: idDevice,
                        [Op.or]: [
                            {
                                dateTime: {
                                    [Op.between]: [
                                        (fromDate.toISOString() as unknown as number),
                                        (toDate.toISOString() as unknown as number)
                                    ],
                                },
                            },
                        ],
                        dateTime: {
                            [Op.not]: toDate.toISOString(),
                        },
                    },
                    order: [['dateTime', 'ASC']],
                });
            }

            let alertHistories = periodHistories.filter(item => item.fillingAlert || item.resetAlert || item.intervalAlert);

            // retornar el periodo solicitado
            return new ServerMessage(false, 'Información obtenida correctamente', {
                deviceData: deviceData,
                updated: deviceData.gasSettings.wereApplied,
                toDate: toDate,
                fromDate: fromDate,
                alertHistory: alertHistories,
                alertLabels: alertHistories.map((item: any) => { return this.getOnlyDate(item.dataValues.dateTime); }),
                alertValues: periodHistories.map((item: any) => { return item.dataValues.measure; }),

                lastAlertUpdate:
                    alertHistories.length == 0
                        ? "Sin registros"
                        : this.getOnlyDate(new Date((alertHistories[alertHistories.length - 1] as any).dataValues.dateTime)),
            });

        } catch (error) {
            this.logger.error(error);
            return new ServerMessage(true, 'Ha ocurrido un error', error);
        }
    }

    /**
     *  
     */
    async getWaterDeviceAlerts(
        clientData: any,
        idDevice: number,
        period: number,
    ): Promise<ServerMessage> {
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
                return new ServerMessage(true, 'Petición incompleta', {});
            }

            //Validation device exist
            let deviceData: Device = await this.deviceRepository.findOne<Device>({
                attributes: { exclude: ['imei'] },
                where: {
                    idDevice: idDevice,
                    // idUser: (clientData as User).idUser,
                },
                include: [{
                    model: Town,
                    as: 'town',
                    include: [{
                        model: State,
                        as: 'state',
                    }]
                },
                {
                    model: Organization,
                    as: 'organization',
                    attributes: [
                        'logoUrl',
                        'comercialName',
                        'primaryColor',
                        'secondaryColor',
                    ],
                },
                {
                    model: GasHistory,
                    as: 'gasHistory',
                    limit: 1,
                    order: [['createdAt', 'DESC']],
                },
                {
                    model: WaterHistory,
                    as: 'waterHistory',
                    limit: 1,
                    order: [['dateTime', 'DESC']],
                },
                {
                    model: WaterSettings,
                    as: 'waterSettings',
                },
                {
                    model: GasSettings,
                    as: 'gasSettings',
                },
                ],
            }) as Device;

            if (!deviceData.waterSettings) {
                return new ServerMessage(true, 'El dispositivo no esta disponible', {});
            }
            let todayDay = toLocalTime(new Date());

            if (period > 0) {
                if (deviceData.waterSettings.serviceOutageDay < todayDay.getDate()) {
                    todayDay = toLocalTime(
                        new Date(
                            todayDay.getFullYear(),
                            todayDay.getMonth() - (period - 1),
                            deviceData.waterSettings.serviceOutageDay,
                            0,
                            0,
                            1,
                        ),
                    );
                } else {
                    todayDay = toLocalTime(
                        new Date(
                            todayDay.getFullYear(),
                            todayDay.getMonth() - period,
                            deviceData.waterSettings.serviceOutageDay,
                            0,
                            0,
                            1,
                        ),
                    );
                }
            }

            let fromDate = new Date(
                todayDay.getFullYear(),
                todayDay.getMonth(),
                deviceData.waterSettings.serviceOutageDay,
                0,
                0,
                1,
            );

            if (deviceData.waterSettings.serviceOutageDay > todayDay.getDate()) {
                fromDate = new Date(
                    todayDay.getFullYear(),
                    todayDay.getMonth() - 1,
                    deviceData.waterSettings.serviceOutageDay,
                    0,
                    0,
                    1,
                );
            }
            fromDate = toLocalTime(fromDate);

            let actualPeriod: WaterHistory[] = await this.waterHistoryRepository.findAll(
                {
                    where: {
                        idDevice: deviceData.idDevice,
                        [Op.or]: [
                            {
                                dateTime: {
                                    [Op.between]: [
                                        (fromDate.toISOString() as unknown as number),
                                        (todayDay.toISOString() as unknown as number),
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
                    //limit: 1,
                    order: [['dateTime', 'DESC']],
                },
            );

            let lastPeriodHistory: WaterHistory[] = await this.waterHistoryRepository.findAll<
                WaterHistory
            >({
                attributes: ['idWaterHistory', 'consumption', 'dateTime'],
                where: {
                    idDevice: deviceData.idDevice,
                    dateTime: {
                        [Op.lte]: fromDate.toISOString(),
                    },
                },
                limit: 1,
                order: [['dateTime', 'DESC']],
            });

            let litersConsumedThisMonth: number = 0;
            let actualPeriodMetry: number = 0;
            let lastPeriodMetry: number = 0;

            if (actualPeriod.length == 0 && lastPeriodHistory.length == 0) {
                litersConsumedThisMonth = 0;
            } else if (actualPeriod.length > 0 && lastPeriodHistory.length == 0) {
                litersConsumedThisMonth = actualPeriod[0].consumption;
                actualPeriodMetry = actualPeriod[0].consumption;
            } else if (actualPeriod.length == 0 && lastPeriodHistory.length == 1) {
                litersConsumedThisMonth = 0;
            } else if (actualPeriod.length > 0 && lastPeriodHistory.length == 1) {
                //Falta el quinto if
                if (actualPeriod[0].consumption < lastPeriodHistory[0].consumption) {
                    let maximumNumberLiters: number = 999999999999;
                    if (deviceData.version == 1) {
                        //For industry version
                        //Si es de tipo industrial o alguna otra version hay que poner el numero de dígitos máximos
                        //escribiendo el mayor numero posible para desplegar
                    }
                    litersConsumedThisMonth =
                        actualPeriod[0].consumption +
                        (maximumNumberLiters - lastPeriodHistory[0].consumption);
                } else {
                    litersConsumedThisMonth =
                        actualPeriod[0].consumption - lastPeriodHistory[0].consumption;
                }
                actualPeriodMetry = actualPeriod[0].consumption;
                lastPeriodMetry = lastPeriodHistory[0].consumption;
            }

            let actualLabels: any[] = [];
            let limitValueLine: any[] = [];
            let actualPeriodValues: any[] = [];

            let alertHistories = actualPeriod.filter(
                item => item.dripAlert ||
                    item.manipulationAlert ||
                    item.emptyAlert ||
                    item.burstAlert ||
                    item.bubbleAlert ||
                    item.reversedFlowAlert
            );

            alertHistories.forEach(async (history: WaterHistory) => {
                actualLabels = [this.getOnlyDate(history.dateTime), ...actualLabels];
                limitValueLine.push(deviceData.waterSettings.monthMaxConsumption);
                actualPeriodValues = [
                    new Number(((history.consumption - lastPeriodMetry) / 1000).toFixed(2)),
                    ...actualPeriodValues,
                ];
            });



            return new ServerMessage(false, 'Información obtenida correctamente', {
                periodHistorial: alertHistories,
                actualLabels: actualLabels,
                actualPeriodValues: actualPeriodValues,
            });
        } catch (error) {

            this.logger.error("XXX", error);
            return new ServerMessage(true, 'A ocurrido un error', error);
        }
    }

    /**
     * 
     */
    async getOrganizationsListData(/* organization: number */): Promise<ServerMessage> {
        try {
            let organizations: Organization[] = await this.organizationRepository.findAll<Organization>({
                where: {
                    type: { [Op.not]: 0 }
                }
            });

            let states: State[] = await this.stateRepository.findAll<State>({
                include: [{
                    model: Town,
                    as: 'towns',
                }]
            });

            return new ServerMessage(false, "Organizaciones obtenidas con éxito", {
                organizations: organizations,// organization === 1 ? organizations : [], //
                states: states
            });
        } catch (error) {
            this.logger.error(error);
            return new ServerMessage(true, "A ocurrido un error", error);
        }
    }

    /**
     * 
     */
    async getOrganizationsData(): Promise<ServerMessage> {
        try {
            let organizations: Organization[] = await this.organizationRepository.findAll<Organization>({
                attributes: ['idOrganization', 'comercialName'],
            });

            return new ServerMessage(false, "Organizaciones obtenidas con éxito", {
                organizations: organizations,
            });
        } catch (error) {
            this.logger.error(error);
            return new ServerMessage(true, "A ocurrido un error", error);
        }
    }

    /**
     *
    */
    async deviceAssignments(data: {
        serialNumber: string,
        type: number,
        idOrganization: number,
    }[]): Promise<ServerMessage> {

        if (data == undefined ||
            data == null) {

            return new ServerMessage(true, 'Peticion invalida', {});
        }
        if (data.length == 0) {
            return new ServerMessage(true, 'Peticion invalida', {});
        }
        try {
            let errors: ServerMessage[] = [];
            let activateSubscription: ServerMessage[] = [];

            for (let index = 0; index < data.length; index++) {
                const element = data[index];

                if (element.serialNumber == undefined ||
                    element.serialNumber == null ||
                    element.type == undefined ||
                    element.type == null ||
                    element.idOrganization == undefined ||
                    element.idOrganization == null
                ) {
                    errors.push(new ServerMessage(true, 'Peticion invalida', element))
                } else {
                    let device: Device = await this.deviceRepository.findOne<Device>({
                        where: {
                            serialNumber: element.serialNumber,
                            type: element.type,
                        },
                    }) as Device;

                    let organization: Organization = await this.organizationRepository.findOne<Organization>({
                        where: {
                            idOrganization: element.idOrganization,
                        },
                    }) as Organization;

                    if (organization) {
                        if (device) {
                            device.idOrganization = element.idOrganization;
                            await device.save();

                            activateSubscription.push(new ServerMessage(false, 'Asignacion exitosa del dispositivo a ' + organization.comercialName, element))
                        } else {
                            errors.push(new ServerMessage(true, 'El numero de serie no existe', element))
                        }
                    } else {
                        errors.push(new ServerMessage(true, 'La organizacion no existe', element))
                    }
                }
            }

            return new ServerMessage(false, 'Asignaciones realizadas con exito', {
                errors: errors,
                activateSubscription: activateSubscription
            });
        } catch (error) {
            this.logger.error(error);
            return new ServerMessage(true, 'A ocurrido un error asignando los dispositivos', error);
        }
    }

    /**
     * 
     */
    async getOrganizationAdmin(idOrganization: number): Promise<ServerMessage> {
        try {
            //
            // check instances
            //
            let organization: Organization = await this.organizationRepository.findOne<Organization>({
                where: {
                    idOrganization: idOrganization,
                }
            }) as Organization;

            let orgAdmins: User[] = await this.userRepository.findAll<User>({
                attributes: { exclude: ["password", "idConektaAccount"] },
                where: {
                    idRole: 2,
                    idOrganization: organization.idOrganization,
                }
            });

            //
            // Business logic
            //
            return new ServerMessage(false, "Petición entregada correctamente", {
                orgAdmins: orgAdmins,
            });
        } catch (error) {
            this.logger.error(error);
            return new ServerMessage(true, "A ocurrido un error", error);
        }
    }

    /**
     * 
     */
    async getOrganizationAdminChoices(choice: string): Promise<ServerMessage> {
        try {
            //
            // check instances
            //
            let mainOrganizationAdmin: User = await this.userRepository.findOne({
                attributes: { exclude: ["password", "idConektaAccount"] },
                where: {
                    idRole: 1,
                }
            }) as User;
            let mainOrganizationId: number = mainOrganizationAdmin.idOrganization;
            let orgAdmins: User[] = await this.userRepository.findAll<User>({
                attributes: { exclude: ["password", "idConektaAccount"] },
                where: {
                    idRole: 7,
                    idOrganization: mainOrganizationId,
                    [Op.or]: [
                        { firstName: { [Op.like]: '%' + choice + '%' } },
                        { lastName: { [Op.like]: '%' + choice + '%' } },
                        { email: { [Op.like]: '%' + choice + '%' } }
                    ],
                },
                limit: 3
            });

            //
            // Business logic
            //
            return new ServerMessage(false, "Petición entregada correctamente", {
                orgAdmins: orgAdmins,
            });
        } catch (error) {
            this.logger.error(error);
            return new ServerMessage(true, "A ocurrido un error", error);
        }
    }

    /**
     * 
     */
    async createOrganization(logo: any, body: any): Promise<ServerMessage> {
        try {
            let theme: any = JSON.parse(body.theme);
            let info: any = JSON.parse(body.info);
            let newAdmins: any = JSON.parse(body.admins);
            //
            // Check constrants
            //
            // data constraints
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
            // check if exists constraints
            if (constraints.some(val => val)) return new ServerMessage(true, "Campos requeridos", null);
            //
            // Business logic
            //
            // creating facturapi customer with organization info

            let facturapiInfo: ServerMessage = await this.facturapiService.createOrganizationCustomer({
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
            if (facturapiInfo.error) return new ServerMessage(true, "Error al acceder al servicio de Facturaación", facturapiInfo);

            // creating new organization
            let newOrganization: Organization = await Organization.create<Organization>({
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

            let ext: string = logo.path as string;
            let index = ext.indexOf(".");
            //ext = ext.indexOf(".");
            ext = logo.path.substr(index, logo.path.length);

            let renameResult = await this.moveRequestFile(
                logo.path,
                newOrganization.idOrganization + ext,
                newOrganization.idOrganization,
            );

            if (renameResult.error == false) {
                newOrganization.logoUrl = 'logo-images-uploads/logo-organization-image/' + newOrganization.idOrganization;
                await newOrganization.save();
            } else {
                this.logger.error(renameResult);
            }


            let newOrgAdmins: User[] = await this.userRepository.findAll<User>({
                attributes: { exclude: ["password", "idConektaAccount"] },
                where: {
                    idUser: {
                        [Op.in]: newAdmins
                    },
                }
            });

            newOrgAdmins.forEach(async (admin: User) => {
                admin.idRole = 2;
                admin.idOrganization = newOrganization.idOrganization;
                await admin.save();
            });

            return new ServerMessage(false, "Organización creada correctamente", {});
        } catch (error) {
            this.logger.error(error);
            return new ServerMessage(true, "Ha ocurrido un error", error);
        }
    }

    /**
     * 
     */
    async moveRequestFile(actualPathName: string, newName: string, idOrganization: number): Promise<ServerMessage> {
        return new Promise(async (resolve, reject) => {
            //Si no existe el directorio de la solicitud se crea
            if (!fs.existsSync('./storage/logos/')) {
                fs.mkdirSync('./storage/logos/');
            }
            if (!fs.existsSync('./storage/logos/' + idOrganization + '/')) {
                fs.mkdirSync('./storage/logos/' + idOrganization + '/');
            }

            fs.rename(
                actualPathName,
                'storage/logos/' + idOrganization + '/' + newName, async (error) => {
                    if (error) {
                        this.logger.error("Error reading document: " + error);
                        resolve(new ServerMessage(true, "Error renombrando el archivo del oficio", error));
                    } else {
                        resolve(new ServerMessage(false, 'Archivo renombrando con éxito', {}));
                    };
                });
        });
    }

    /**
     * 
     */
    async updateOrganizationData(logo: any, body: any): Promise<ServerMessage> {
        try {
            let theme: any = JSON.parse(body.theme);
            let info: any = JSON.parse(body.info);
            let newAdmins: any = JSON.parse(body.admins);
            //
            // Check constrants
            //
            // data constraints
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
            // check if exists constraints
            if (constraints.some(val => val)) return new ServerMessage(true, "Campos requeridos", null);

            let currentOrganization: Organization = await this.organizationRepository.findOne<Organization>({
                where: {
                    idOrganization: body.id,
                }
            })as Organization;

            let facturapiInfo: ServerMessage = await this.facturapiService.updateOrganizationCustomer(
                currentOrganization.facturapiToken, {
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
            }
            );

            if (facturapiInfo.error) return facturapiInfo;

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

            let currentOrgAdmins: User[] = await this.userRepository.findAll<User>({
                attributes: { exclude: ["password", "idConektaAccount"] },
                where: {
                    idRole: {
                        [Op.or]: [7, 2],
                    },
                    idOrganization: {
                        [Op.or]: [1, currentOrganization.idOrganization],
                    },
                }
            });

            currentOrgAdmins.forEach(async (admin: User) => {
                if (admin.idRole == 7 && newAdmins.indexOf(admin.idUser) != -1) {
                    admin.idRole = 2;
                    if (admin.idOrganization == 1)
                        admin.idOrganization = currentOrganization.idOrganization;
                }
                else if (admin.idRole == 2 && newAdmins.indexOf(admin.idUser) == -1)
                    admin.idRole = 7;
                await admin.save();
            });
            return new ServerMessage(false, "Organización actualizada correctamente", {});
        } catch (error) {
            this.logger.error(error);
            return new ServerMessage(true, "Ha ocurrido un error", error);
        }
    }

    /**
     * 
     */
    async deleteOrganization(idOrganization: number): Promise<ServerMessage> {
        try {
            let superAdmin: User = await this.userRepository.findOne<User>({
                attributes: { exclude: ["password", "idConektaAccount"] },
                where: {
                    idRole : 1,
                },
                include: [{
                    model: Organization,
                    as: 'organization'
                }]
            }) as User;

            if(!superAdmin){
                return new ServerMessage(true, "Organizacion principal no encontrada", {});
            }

            //
            // check instances
            //
            let organization: Organization = await this.organizationRepository.findOne<Organization>({
                where: {
                    idOrganization: idOrganization,
                },
                include: [{
                    model : Device,
                    as : 'devices'
                },{
                    model : User,
                    as : 'users'
                },]
            }) as Organization;

            //
            // Business logic
            // Set all users to final users and move to super organization
            //
            for (let user of organization.users ) {
                user.idRole = 7;
                user.idOrganization = superAdmin.organization.idOrganization;
                await user.save();
            }
            // Set all the devices to super admin organization
            for (let index = 0; index < organization.devices.length; index++) {
                organization.devices[index].idOrganization = superAdmin.organization.idOrganization;
                await organization.devices[index].save();
            }

            organization.deleted = true;
            await organization.save();
            return new ServerMessage(false, "Organización eliminada correctamente", {});
        } catch (error) {
            this.logger.error(error);
            return new ServerMessage(true, "A ocurrido un error", error);
        }
    }

    /**
     *
     */
    getOnlyDate(dateToFix: Date): string {
        let dateFixed: Date = new Date(dateToFix);
        return (
            dateFixed.toLocaleDateString('es-MX', { year: 'numeric', timeZone: 'UTC' }) +
            '-' +
            dateFixed.toLocaleDateString('es-MX', { month: '2-digit', timeZone: 'UTC' }) +
            '-' +
            dateFixed.toLocaleDateString('es-MX', { day: '2-digit', timeZone: 'UTC' })
        );
    }
}
