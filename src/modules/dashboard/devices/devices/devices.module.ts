import { Module } from '@nestjs/common';
import { DevicesController } from './devices.controller';
import { DevicesService } from './devices.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { deviceProviders } from './../../../../models/repositoriesModels/device.providers';
import { waterHistoryProviders } from './../../../../models/repositoriesModels/waterHistory.providers';
import { waterSettingsProviders } from './../../../../models/repositoriesModels/waterSettings.providers';
import { gasHistoryProviders } from './../../../../models/repositoriesModels/gasHistory.providers';
import { gasSettingsProviders } from './../../../../models/repositoriesModels/gasSettings.providers';
import { dataloggerHistoryProviders } from 'src/models/repositoriesModels/dataloggerHistory.providers';
import { dataloggerSettingsProviders } from 'src/models/repositoriesModels/dataloggerSettings.providers';
import { naturalGasHistoryProviders } from 'src/models/repositoriesModels/naturalGasHistory.providers';
import { townProviders } from './../../../../models/repositoriesModels/town.providers';
import { GlobalServicesModule } from './../../../../modules/global/global-services.module';
import { notificationProviders } from 'src/models/notifications.entity';
import { apnProviders } from '../../../../models/apn.entity';
import { PushNotificationsService } from 'src/modules/global/push-notifications/push-notifications.service';


@Module({
  imports: [
    GlobalServicesModule,
    PassportModule.register({ defaultStrategy: 'jwt', session: false }),
    JwtModule.register({
      secretOrPrivateKey: 'ingMultiKey',
      signOptions: {
        expiresIn: 2 * 365 * 24 * 60 * 60
      }
    }),
  ],
  controllers: [DevicesController],
  providers: [
    DevicesService,
    PushNotificationsService,
    ...deviceProviders,
    ...waterHistoryProviders,
    ...waterSettingsProviders,
    ...gasHistoryProviders,
    ...gasSettingsProviders,
    ...dataloggerHistoryProviders,
    ...dataloggerSettingsProviders,
    ...naturalGasHistoryProviders,
    ...townProviders,
    ...apnProviders,
    ...notificationProviders,
  ],
  exports: [
    DevicesService,
  ]
})
export class DevicesModule {}
