import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../database/database.module';
import { FacturApiService } from './factur-api/factur-api.service';
import { GeoLocationService } from './geo-location/geo-location.service';
import { ConektaService } from './conekta-service/conekta-service.service';
import { EmailsService } from './emails/emails.service';
import { userProviders } from '../../models/repositoriesModels/user.providers';
import { townProviders } from '../../models/repositoriesModels/town.providers';
import { billingInformationProviders } from '../../models/repositoriesModels/billingInformation.providers';
import { DashboardCalibrationGateway } from './live-data/dashboard-calibration.gateway';
import { PushNotificationsService } from './push-notifications/push-notifications.service';
import { notificationProviders } from './../../models/notifications.entity';

@Module({
  imports: [DatabaseModule],
  exports: [
    GeoLocationService,
    ConektaService,
    FacturApiService,
    EmailsService,
    DashboardCalibrationGateway,
  ],
  controllers: [],
  providers: [
    ConektaService,
    FacturApiService,
    GeoLocationService,
    EmailsService,
    DashboardCalibrationGateway,
    PushNotificationsService,
    ...userProviders,
    ...townProviders,
    ...billingInformationProviders,
    ...notificationProviders,
  ],
})
export class GlobalServicesModule {}
