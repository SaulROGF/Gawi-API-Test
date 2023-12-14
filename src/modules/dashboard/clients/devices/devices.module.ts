import { dataloggerHistoryProviders } from './../../../../models/repositoriesModels/dataloggerHistory.providers';
import { waterHistoryProviders } from './../../../../models/repositoriesModels/waterHistory.providers';
import { waterSettingsProviders } from './../../../../models/repositoriesModels/waterSettings.providers';
import { gasHistoryProviders } from './../../../../models/repositoriesModels/gasHistory.providers';
import { gasSettingsProviders } from './../../../../models/repositoriesModels/gasSettings.providers';
import { deviceProviders } from './../../../../models/repositoriesModels/device.providers';
import { userProviders } from './../../../../models/repositoriesModels/user.providers';
import { stateProviders } from './../../../../models/repositoriesModels/state.providers';
import { townProviders } from './../../../../models/repositoriesModels/town.providers';
import { Module } from '@nestjs/common';
import { DevicesController } from './devices.controller';
import { DevicesService } from './devices.service';
import { DatabaseModule } from '../../../../database/database.module';
import { PassportModule } from '@nestjs/passport';
import { dataloggerSettingsProviders } from '../../../../models/repositoriesModels/dataloggerSettings.providers';
import { naturalGasSettingsProviders } from '../../../../models/repositoriesModels/naturalGasSettings.providers';
import { naturalGasHistoryProviders } from '../../../../models/repositoriesModels/naturalGasHistory.providers';

@Module({
  imports: [
    DatabaseModule,
    PassportModule.register({
      defaultStrategy: 'jwt',
      session: false,
    }),
    
  ],
  exports: [DevicesService],
  controllers: [DevicesController],
  providers: [
    DevicesService,
    ...townProviders,
    ...stateProviders,
    ...userProviders,
    ...deviceProviders,
    ...waterSettingsProviders,
    ...gasSettingsProviders,
    ...waterHistoryProviders,
    ...gasHistoryProviders,
    ...stateProviders,
    ...dataloggerHistoryProviders,
    ...dataloggerSettingsProviders,
    ...naturalGasSettingsProviders,
    ...naturalGasHistoryProviders,
  ],
})
export class DevicesModule {}
