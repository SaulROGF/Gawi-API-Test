"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deviceProviders = void 0;
const device_entity_1 = require("../device.entity");
exports.deviceProviders = [
    {
        provide: 'DeviceRepository',
        useValue: device_entity_1.Device,
    },
];
//# sourceMappingURL=device.providers.js.map