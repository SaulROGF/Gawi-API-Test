"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dataloggerHistoryProviders = void 0;
const dataloggerHistory_entity_1 = require("../dataloggerHistory.entity");
exports.dataloggerHistoryProviders = [
    {
        provide: 'DataloggerHistoryRepository',
        useValue: dataloggerHistory_entity_1.DataloggerHistory,
    },
];
//# sourceMappingURL=dataloggerHistory.providers.js.map