import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { DatabaseModule } from './../../../../database/database.module';
import { ServiceCenterController } from './service-center.controller';
import { ServiceCenterService } from './service-center.service';
import { userProviders } from '../../../../models/repositoriesModels/user.providers';
import { deviceProviders } from './../../../../models/repositoriesModels/device.providers';
import { organizationProviders } from './../../../../models/repositoriesModels/organization.providers';

@Module({
  imports: [
    DatabaseModule,
    PassportModule.register({
      defaultStrategy: 'jwt',
      session: false,
    }),
  ],
  exports: [ServiceCenterService],
  controllers: [ServiceCenterController],
  providers: [
    ServiceCenterService,
    ...userProviders,
    ...deviceProviders,
    ...organizationProviders,
  ]
})
export class ServiceCenterModule {}
