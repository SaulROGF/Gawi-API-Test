"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cardProviders = void 0;
const card_entity_1 = require("../card.entity");
exports.cardProviders = [
    {
        provide: 'CardRepository',
        useValue: card_entity_1.Card,
    },
];
//# sourceMappingURL=cards.providers.js.map