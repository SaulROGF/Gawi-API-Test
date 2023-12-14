"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notificationProviders = void 0;
const notifications_entity_1 = require("../notifications.entity");
exports.notificationProviders = [
    {
        provide: 'NotificationsRepository',
        useValue: notifications_entity_1.Notifications,
    },
];
//# sourceMappingURL=notifications.providers.js.map