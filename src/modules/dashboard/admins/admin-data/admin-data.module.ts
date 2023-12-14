import { Module } from '@nestjs/common';
import { AdminDataController } from './admin-data.controller';
import { AdminDataService } from './admin-data.service';
import { DatabaseModule } from './../../../../database/database.module';
import { PassportModule } from '@nestjs/passport';
import { userProviders }  from './../../../../models/repositoriesModels/user.providers';
import { stateProviders } from './../../../../models/repositoriesModels/state.providers';
import { apnProviders } from '../../../../models/apn.entity';
import { deviceProviders } from '../../../../models/repositoriesModels/device.providers';

@Module({
  imports: [
    DatabaseModule,
    PassportModule.register({
      defaultStrategy: 'jwt',
      session: false
    }),
  ], 
  controllers: [AdminDataController],
  providers: [
    AdminDataService,
    ...userProviders,
    ...stateProviders,
    ...apnProviders,
    ...deviceProviders,
  ],
})
export class AdminDataModule {}
