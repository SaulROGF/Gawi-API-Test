"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.regionsProviders = exports.zonesProviders = void 0;
exports.zonesProviders = [
    {
        provide: 'ZonesRepository',
        useValue: zones_entity_1.Zones
    }
];
const regions_entity_1 = require("../regions.entity");
const zones_entity_1 = require("../zones.entity");
exports.regionsProviders = [
    {
        provide: 'RegionsRepository',
        useValue: regions_entity_1.Regions,
    },
];
//# sourceMappingURL=zones.providers.js.map