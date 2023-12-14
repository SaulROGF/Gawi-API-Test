import { Town } from '../town.entity';


export const townProviders = [
  {
    provide: 'TownRepository',
    useValue: Town,
  },
];
