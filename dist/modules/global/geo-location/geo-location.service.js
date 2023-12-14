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
exports.GeoLocationService = void 0;
const common_1 = require("@nestjs/common");
const ServerMessage_class_1 = require("./../../../classes/ServerMessage.class");
const geoLocationByIp_class_1 = require("./../../../classes/geoLocationByIp.class");
const sequelize_1 = require("sequelize");
const state_entity_1 = require("./../../../models/state.entity");
let GeoLocationService = class GeoLocationService {
    constructor(townRepository) {
        this.townRepository = townRepository;
    }
    async getLocationByIp(ip) {
        try {
            const geoIp = new geoLocationByIp_class_1.GeoLocationByIp();
            let location = await geoIp.getLocationByIp(ip);
            let town = await this.townRepository.findOne(location.error
                ? {
                    where: {
                        name: 'Chihuahua',
                    },
                    include: [
                        {
                            model: state_entity_1.State,
                            as: 'state',
                            where: {
                                name: 'Chihuahua',
                            },
                        },
                    ],
                }
                : {
                    where: {
                        name: {
                            [sequelize_1.Op.like]: '%' + location.town + '%',
                        },
                    },
                    include: [
                        {
                            model: state_entity_1.State,
                            as: 'state',
                            where: {
                                name: {
                                    [sequelize_1.Op.like]: '%' + location.state + '%',
                                },
                            },
                        },
                    ],
                });
            return new ServerMessage_class_1.ServerMessage(false, '', {
                town: town.idTown,
                state: town.idState,
            });
        }
        catch (error) {
            return new ServerMessage_class_1.ServerMessage(true, '', error);
        }
    }
};
GeoLocationService = __decorate([
    common_1.Injectable(),
    __param(0, common_1.Inject('TownRepository')),
    __metadata("design:paramtypes", [Object])
], GeoLocationService);
exports.GeoLocationService = GeoLocationService;
//# sourceMappingURL=geo-location.service.js.map