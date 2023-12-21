"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.naturalGasHistoryProviders = void 0;
const naturalGasHistory_entity_1 = require("../naturalGasHistory.entity");
exports.naturalGasHistoryProviders = [
    {
        provide: 'NaturalGasHistoryRepository',
        useValue: naturalGasHistory_entity_1.NaturalGasHistory,
    },
];
//# sourceMappingURL=naturalGasHistory.providers.js.map