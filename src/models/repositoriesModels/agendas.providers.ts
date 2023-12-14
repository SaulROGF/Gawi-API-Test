import { Agenda } from '../agenda.entity';


export const agendaProviders = [
  {
    provide: 'AgendaRepository',
    useValue: Agenda,
  },
];
