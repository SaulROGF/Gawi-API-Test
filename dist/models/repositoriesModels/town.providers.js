"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.townProviders = void 0;
const town_entity_1 = require("../town.entity");
exports.townProviders = [
    {
        provide: 'TownRepository',
        useValue: town_entity_1.Town,
    },
];
//# sourceMappingURL=town.providers.js.map