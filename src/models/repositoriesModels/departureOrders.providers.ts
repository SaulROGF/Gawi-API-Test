import { DepartureOrder } from '../departureOrders.entity';

export const departureOrderProviders = [
  {
    provide: 'DepartureOrderRepository',
    useValue: DepartureOrder,
  },
];
