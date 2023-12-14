"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.stationsProviders = void 0;
const stations_entity_1 = require("../stations.entity");
exports.stationsProviders = [
    {
        provide: 'StationsRepository',
        useValue: stations_entity_1.Stations,
    },
];
//# sourceMappingURL=stations.providers.js.map