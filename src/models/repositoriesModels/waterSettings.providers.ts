import { WaterSettings } from '../waterSettings.entity';


export const waterSettingsProviders = [
  {
    provide: 'WaterSettingsRepository',
    useValue: WaterSettings,
  },
];
