"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.roleProviders = void 0;
const role_entity_1 = require("../role.entity");
exports.roleProviders = [
    {
        provide: 'RoleRepository',
        useValue: role_entity_1.Role,
    },
];
//# sourceMappingURL=role.providers.js.map