"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.organizationProviders = void 0;
const organization_entity_1 = require("../organization.entity");
exports.organizationProviders = [
    {
        provide: 'OrganizationRepository',
        useValue: organization_entity_1.Organization,
    },
];
//# sourceMappingURL=organization.providers.js.map