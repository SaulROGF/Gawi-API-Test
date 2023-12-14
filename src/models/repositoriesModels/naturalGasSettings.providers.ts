import { NaturalGasSettings } from './../naturalGasSettings.entity';


export const naturalGasSettingsProviders = [
  {
    provide: 'NaturalGasSettingsRepository',
    useValue: NaturalGasSettings,
  },
];
