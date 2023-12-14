"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userProviders = void 0;
const user_entity_1 = require("../user.entity");
exports.userProviders = [
    {
        provide: 'UserRepository',
        useValue: user_entity_1.User,
    },
];
//# sourceMappingURL=user.providers.js.map