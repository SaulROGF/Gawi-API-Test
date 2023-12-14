"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fieldDeviceProvider = void 0;
const fieldDevice_entity_1 = require("../fieldDevice.entity");
exports.fieldDeviceProvider = [
    {
        provide: 'FieldDeviceRepository',
        useValue: fieldDevice_entity_1.FieldDevice,
    },
];
//# sourceMappingURL=fieldDevice.providers.js.map