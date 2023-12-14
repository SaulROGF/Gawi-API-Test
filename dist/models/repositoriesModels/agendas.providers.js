"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.agendaProviders = void 0;
const agenda_entity_1 = require("../agenda.entity");
exports.agendaProviders = [
    {
        provide: 'AgendaRepository',
        useValue: agenda_entity_1.Agenda,
    },
];
//# sourceMappingURL=agendas.providers.js.map