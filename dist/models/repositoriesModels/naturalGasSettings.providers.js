"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.naturalGasSettingsProviders = void 0;
const naturalGasSettings_entity_1 = require("./../naturalGasSettings.entity");
exports.naturalGasSettingsProviders = [
    {
        provide: 'NaturalGasSettingsRepository',
        useValue: naturalGasSettings_entity_1.NaturalGasSettings,
    },
];
//# sourceMappingURL=naturalGasSettings.providers.js.map