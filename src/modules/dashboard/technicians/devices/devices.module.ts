import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { DatabaseModule } from '../../../../database/database.module';
import { apnProviders } from '../../../../models/apn.entity';
import { deviceProviders } from '../../../../models/repositoriesModels/device.providers';
import { gasHistoryProviders } from '../../../../models/repositoriesModels/gasHistory.providers';
import { gasSettingsProviders } from '../../../../models/repositoriesModels/gasSettings.providers';
import { stateProviders } from '../../../../models/repositoriesModels/state.providers';
import { townProviders } from '../../../../models/repositoriesModels/town.providers';
import { userProviders } from '../../../../models/repositoriesModels/user.providers';
import { waterHistoryProviders } from '../../../../models/repositoriesModels/waterHistory.providers';
import { waterSettingsProviders } from '../../../../models/repositoriesModels/waterSettings.providers';
import { DevicesController } from './devices.controller';
import { DevicesService } from './devices.service';
import { GasNaturalModule } from './gas-natural/gas-natural.module';

@Module({
    imports: [
        DatabaseModule,
        PassportModule.register({
          defaultStrategy: 'jwt',
          session: false,
        }),
        GasNaturalModule,
        
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
        ...apnProviders,
      ],

})
export class DevicesModule { }
