import { organizationProviders } from './../../../../models/repositoriesModels/organization.providers';
import { DevicesModule } from './../../clients/devices/devices.module';
import { stateProviders } from './../../../../models/repositoriesModels/state.providers';
import { userProviders } from './../../../../models/repositoriesModels/user.providers';
import { PassportModule } from '@nestjs/passport';
import { DatabaseModule } from './../../../../database/database.module';
import { Module } from '@nestjs/common';
import { AdministratorService } from './administrator.service';
import { AdministratorController } from './administrator.controller';
import { deviceProviders } from '../../../../models/repositoriesModels/device.providers';
import { waterHistoryProviders } from '../../../../models/repositoriesModels/waterHistory.providers';
import { gasHistoryProviders } from '../../../../models/repositoriesModels/gasHistory.providers';
import { apnProviders } from '../../../../models/apn.entity';
import { GlobalServicesModule } from '../../../..//modules/global/global-services.module';
import { dataloggerHistoryProviders } from '../../../../models/repositoriesModels/dataloggerHistory.providers';
import { naturalGasHistoryProviders } from '../../../../models/repositoriesModels/naturalGasHistory.providers';


@Module({
  imports: [
    DatabaseModule,
    PassportModule.register({
      defaultStrategy: 'jwt',
      session: false
    }),
    DevicesModule,
    GlobalServicesModule,
  ],
  exports: [AdministratorService],
  controllers: [AdministratorController],
  providers: [
    AdministratorService,
    ...userProviders,
    ...organizationProviders,
    ...stateProviders,
    ...deviceProviders,
    ...waterHistoryProviders,
    ...gasHistoryProviders,
    ...apnProviders,
    ...dataloggerHistoryProviders,
    ...naturalGasHistoryProviders,
  ]
})
export class AdministratorModule { }
