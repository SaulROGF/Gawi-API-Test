import { GasHistory } from '../gasHistory.entity';


export const gasHistoryProviders = [
  {
    provide: 'GasHistoryRepository',
    useValue: GasHistory,
  },
];
