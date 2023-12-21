"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.gasSettingsProviders = void 0;
const gasSettings_entity_1 = require("../gasSettings.entity");
exports.gasSettingsProviders = [
    {
        provide: 'GasSettingsRepository',
        useValue: gasSettings_entity_1.GasSettings,
    },
];
//# sourceMappingURL=gasSettings.providers.js.map