
export const zonesProviders = [
    {
        provide: 'ZonesRepository', 
        useValue: Zones
    }
];

import { Regions } from "../regions.entity";
import { Zones } from "../zones.entity";


export const regionsProviders = [
  {
    provide: 'RegionsRepository',
    useValue: Regions,
  },
];
