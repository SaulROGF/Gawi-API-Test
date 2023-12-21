"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.waterSettingsProviders = void 0;
const waterSettings_entity_1 = require("../waterSettings.entity");
exports.waterSettingsProviders = [
    {
        provide: 'WaterSettingsRepository',
        useValue: waterSettings_entity_1.WaterSettings,
    },
];
//# sourceMappingURL=waterSettings.providers.js.map