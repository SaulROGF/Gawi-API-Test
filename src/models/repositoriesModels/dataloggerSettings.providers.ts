import { DataloggerSettings } from "../dataloggerSettings.entity";

export const dataloggerSettingsProviders = [
  {
    provide: 'DataloggerSettingsRepository',
    useValue: DataloggerSettings,
  },
];
