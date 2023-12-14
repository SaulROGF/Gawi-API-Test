"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.regionsProviders = void 0;
const regions_entity_1 = require("../regions.entity");
exports.regionsProviders = [
    {
        provide: 'RegionsRepository',
        useValue: regions_entity_1.Regions,
    },
];
//# sourceMappingURL=regions.providers.js.map