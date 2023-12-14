"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.stateProviders = void 0;
const state_entity_1 = require("../state.entity");
exports.stateProviders = [
    {
        provide: 'StateRepository',
        useValue: state_entity_1.State,
    },
];
//# sourceMappingURL=state.providers.js.map