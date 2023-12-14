import { Stations } from "../stations.entity";

export const stationsProviders = [
  {
    provide: 'StationsRepository',
    useValue: Stations,
  },
];
