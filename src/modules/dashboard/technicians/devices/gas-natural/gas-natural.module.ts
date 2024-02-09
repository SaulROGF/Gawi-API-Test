import { Module } from '@nestjs/common';
import { GasNaturalController } from './gas-natural.controller';
import { GasNaturalService } from './gas-natural.service';
import { naturalGasSettingsProviders } from 'src/models/repositoriesModels/naturalGasSettings.providers';
import { naturalGasHistoryProviders } from 'src/models/repositoriesModels/naturalGasHistory.providers';
import { PassportModule } from '@nestjs/passport';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  imports: [
    DatabaseModule,
    PassportModule.register({
      defaultStrategy: 'jwt',
      session: false,
    }),
   
    
  ],
  controllers: [GasNaturalController],
  providers: [
    GasNaturalService,
    ...naturalGasSettingsProviders,
    ...naturalGasHistoryProviders
  ]
})
export class GasNaturalModule {}
