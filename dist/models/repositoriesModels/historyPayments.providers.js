"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.historyPaymentsProviders = void 0;
const historyPayments_entity_1 = require("../historyPayments.entity");
exports.historyPaymentsProviders = [
    {
        provide: 'HistoryPaymentsRepository',
        useValue: historyPayments_entity_1.HistoryPayment,
    },
];
//# sourceMappingURL=historyPayments.providers.js.map