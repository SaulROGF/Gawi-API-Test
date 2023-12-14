import { Module } from '@nestjs/common';
import { OrganizationDataController } from './organization-data.controller';
import { OrganizationDataService } from './organization-data.service';
import { DatabaseModule } from './../../../../database/database.module';
import { PassportModule } from '@nestjs/passport';
import { organizationProviders } from './../../../../models/repositoriesModels/organization.providers';
import { userProviders } from './../../../../models/repositoriesModels/user.providers';

@Module({
  imports: [
    DatabaseModule,
    PassportModule.register({
      defaultStrategy: 'jwt',
      session: false,
    }),
  ],
  controllers: [OrganizationDataController],
  providers: [
    OrganizationDataService,
    ...organizationProviders,
    ...userProviders,
  ],
})
export class OrganizationDataModule {}
