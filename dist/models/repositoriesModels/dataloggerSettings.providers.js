"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dataloggerSettingsProviders = void 0;
const dataloggerSettings_entity_1 = require("../dataloggerSettings.entity");
exports.dataloggerSettingsProviders = [
    {
        provide: 'DataloggerSettingsRepository',
        useValue: dataloggerSettings_entity_1.DataloggerSettings,
    },
];
//# sourceMappingURL=dataloggerSettings.providers.js.map