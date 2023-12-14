import { deviceProviders } from './../../../../models/repositoriesModels/device.providers';
import { PaymentsService } from './payments.service';
import { Module } from '@nestjs/common';
import { PaymentsController } from './payments.controller';
import { PassportModule } from '@nestjs/passport';
import { DatabaseModule } from '../../../../database/database.module';
import { billingInformationProviders } from '../../../../models/repositoriesModels/billingInformation.providers';
import { cardProviders } from '../../../../models/repositoriesModels/cards.providers';
import { historyPaymentsProviders } from '../../../../models/repositoriesModels/historyPayments.providers';
import { stateProviders } from '../../../../models/repositoriesModels/state.providers';
import { townProviders } from '../../../../models/repositoriesModels/town.providers';
import { userProviders } from '../../../../models/repositoriesModels/user.providers';
import { GlobalServicesModule } from '../../../global/global-services.module';

@Module({
  imports: [
    DatabaseModule,
    GlobalServicesModule,
    PassportModule.register({
      defaultStrategy: 'jwt',
      session: false,
    }),
  ],
  exports: [PaymentsService],
  controllers: [PaymentsController],
  providers: [
    PaymentsService,
    ...townProviders,
    ...stateProviders,
    ...userProviders,
    ...billingInformationProviders,
    ...historyPaymentsProviders,
    ...cardProviders,
    ...deviceProviders,
  ],
})
export class PaymentsModule {}
