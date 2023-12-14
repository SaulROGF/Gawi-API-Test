import { GlobalServicesModule } from './../../global/global-services.module';
import { DatabaseModule } from './../../../database/database.module';
import { userProviders } from './../../../models/repositoriesModels/user.providers';
import { Module } from '@nestjs/common';
import { LogoImagesUploadsController } from './logo-images-uploads.controller';
import { LogoImagesUploadsService } from './logo-images-uploads.service';
import { PassportModule } from '@nestjs/passport';
import { organizationProviders } from '../../../models/repositoriesModels/organization.providers';

@Module({
  imports: [
    DatabaseModule,
    PassportModule.register({ defaultStrategy: 'jwt', session: false }),
    GlobalServicesModule,
  ],
  exports: [ LogoImagesUploadsService ],
  controllers: [ LogoImagesUploadsController ],
  providers: [
    LogoImagesUploadsService, 
    ...userProviders,
    ...organizationProviders,
    //...bandProviders,
  ],
})
export class LogoImagesUploadsModule {}
