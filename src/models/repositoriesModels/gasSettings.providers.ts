import { GasSettings } from '../gasSettings.entity';


export const gasSettingsProviders = [
  {
    provide: 'GasSettingsRepository',
    useValue: GasSettings,
  },
];
