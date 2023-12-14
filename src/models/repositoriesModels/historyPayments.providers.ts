import { HistoryPayment } from '../historyPayments.entity';


export const historyPaymentsProviders = [
  {
    provide: 'HistoryPaymentsRepository',
    useValue: HistoryPayment,
  },
];
