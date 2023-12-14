import { WaterHistory } from '../waterHistory.entity';


export const waterHistoryProviders = [
  {
    provide: 'WaterHistoryRepository',
    useValue: WaterHistory,
  },
];
