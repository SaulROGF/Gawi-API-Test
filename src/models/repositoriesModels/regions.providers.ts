import { Regions } from "../regions.entity";


export const regionsProviders = [
  {
    provide: 'RegionsRepository',
    useValue: Regions,
  },
];
