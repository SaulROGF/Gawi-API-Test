import { NaturalGasHistory } from '../naturalGasHistory.entity';


export const naturalGasHistoryProviders = [
  {
    provide: 'NaturalGasHistoryRepository',
    useValue: NaturalGasHistory,
  },
];
