"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.departureOrderProviders = void 0;
const departureOrders_entity_1 = require("../departureOrders.entity");
exports.departureOrderProviders = [
    {
        provide: 'DepartureOrderRepository',
        useValue: departureOrders_entity_1.DepartureOrder,
    },
];
//# sourceMappingURL=departureOrders.providers.js.map