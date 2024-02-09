import { deviceProviders } from './../../../../models/repositoriesModels/device.providers';
import { Module } from '@nestjs/common';
import { DevicesController } from './devices.controller';
import { DevicesService } from './devices.service';
import { DatabaseModule } from '../../../../database/database.module';
import { PassportModule } from '@nestjs/passport';
import { waterSettingsProviders } from '../../../../models/repositoriesModels/waterSettings.providers';
import { gasSettingsProviders } from '../../../../models/repositoriesModels/gasSettings.providers';
import { apnProviders } from '../../../../models/apn.entity';
import { dataloggerSettingsProviders } from '../../../../models/repositoriesModels/dataloggerSettings.providers';
import { naturalGasSettingsProviders } from '../../../../models/repositoriesModels/naturalGasSettings.providers';

@Module({
  imports: [
    DatabaseModule,
    PassportModule.register({ defaultStrategy: 'jwt', session: false })
  ],
  exports: [DevicesService],
  controllers: [DevicesController],
  providers: [
    DevicesService, 
      ...deviceProviders,
      ...waterSettingsProviders,
      ...gasSettingsProviders,
      ...apnProviders,
      ...dataloggerSettingsProviders,
      ...naturalGasSettingsProviders,
  ]
})
export class DevicesModule {}
