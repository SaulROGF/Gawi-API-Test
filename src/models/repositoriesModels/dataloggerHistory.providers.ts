import { DataloggerHistory } from '../dataloggerHistory.entity';

export const dataloggerHistoryProviders = [
  {
    provide: 'DataloggerHistoryRepository',
    useValue: DataloggerHistory,
  },
];
