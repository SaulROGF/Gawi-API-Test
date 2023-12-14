"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DepartureOrdersModule = void 0;
const common_1 = require("@nestjs/common");
const departure_orders_controller_1 = require("./departure-orders.controller");
const departure_orders_service_1 = require("./departure-orders.service");
const passport_1 = require("@nestjs/passport");
const jwt_1 = require("@nestjs/jwt");
const organization_providers_1 = require("./../../../../models/repositoriesModels/organization.providers");
const device_providers_1 = require("./../../../../models/repositoriesModels/device.providers");
const departureOrders_providers_1 = require("./../../../../models/repositoriesModels/departureOrders.providers");
let DepartureOrdersModule = class DepartureOrdersModule {
};
DepartureOrdersModule = __decorate([
    common_1.Module({
        controllers: [departure_orders_controller_1.DepartureOrdersController],
        imports: [
            passport_1.PassportModule.register({ defaultStrategy: 'jwt', session: false }),
            jwt_1.JwtModule.register({
                secretOrPrivateKey: 'ingMultiKey',
                signOptions: {
                    expiresIn: 2 * 365 * 24 * 60 * 60
                }
            }),
        ],
        providers: [
            departure_orders_service_1.DepartureOrdersService,
            ...organization_providers_1.organizationProviders,
            ...device_providers_1.deviceProviders,
            ...departureOrders_providers_1.departureOrderProviders,
        ]
    })
], DepartureOrdersModule);
exports.DepartureOrdersModule = DepartureOrdersModule;
//# sourceMappingURL=departure-orders.module.js.map