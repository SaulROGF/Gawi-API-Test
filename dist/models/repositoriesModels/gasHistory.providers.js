"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.gasHistoryProviders = void 0;
const gasHistory_entity_1 = require("../gasHistory.entity");
exports.gasHistoryProviders = [
    {
        provide: 'GasHistoryRepository',
        useValue: gasHistory_entity_1.GasHistory,
    },
];
//# sourceMappingURL=gasHistory.providers.js.map