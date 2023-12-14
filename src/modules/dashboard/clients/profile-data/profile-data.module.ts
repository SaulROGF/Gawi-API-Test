import { Module } from '@nestjs/common';
import { ProfileDataController } from './profile-data.controller';
import { ProfileDataService } from './profile-data.service';
import { DatabaseModule } from './../../../../database/database.module';
import { PassportModule } from '@nestjs/passport';
import { GlobalServicesModule } from '../../../global/global-services.module';
import { stateProviders } from './../../../../models/repositoriesModels/state.providers';
import { townProviders } from './../../../../models/repositoriesModels/town.providers';
import { userProviders } from '../../../../models/repositoriesModels/user.providers';
import { billingInformationProviders } from './../../../../models/repositoriesModels/billingInformation.providers';
import { cardProviders } from './../../../../models/repositoriesModels/cards.providers';
import { historyPaymentsProviders } from '../../../../models/repositoriesModels/historyPayments.providers';

@Module({
  imports: [
    DatabaseModule,
    GlobalServicesModule,
    PassportModule.register({
      defaultStrategy: 'jwt',
      session: false,
    }),
  ],
  exports: [ProfileDataService],
  controllers: [ProfileDataController],
  providers: [
    ProfileDataService,
    ...townProviders,
    ...stateProviders,
    ...userProviders,
    ...billingInformationProviders,
    ...historyPaymentsProviders,
    ...cardProviders,
  ],
})
export class ProfileDataClientModule {}
