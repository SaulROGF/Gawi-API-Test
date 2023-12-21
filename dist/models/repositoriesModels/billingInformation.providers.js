"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.billingInformationProviders = void 0;
const billingInformation_entity_1 = require("../billingInformation.entity");
exports.billingInformationProviders = [
    {
        provide: 'BillingInformationRepository',
        useValue: billingInformation_entity_1.BillingInformation,
    },
];
//# sourceMappingURL=billingInformation.providers.js.map