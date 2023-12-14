"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.waterHistoryProviders = void 0;
const waterHistory_entity_1 = require("../waterHistory.entity");
exports.waterHistoryProviders = [
    {
        provide: 'WaterHistoryRepository',
        useValue: waterHistory_entity_1.WaterHistory,
    },
];
//# sourceMappingURL=waterHistory.providers.js.map