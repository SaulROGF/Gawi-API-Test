import { Module } from '@nestjs/common';
import { FieldtestController } from './fieldtest.controller';
import { FieldtestService } from './fieldtest.service';
import { PassportModule } from '@nestjs/passport';
import { deviceProviders } from 'src/models/repositoriesModels/device.providers';
import { waterHistoryProviders } from 'src/models/repositoriesModels/waterHistory.providers';
import { waterSettingsProviders } from 'src/models/repositoriesModels/waterSettings.providers';
import { DatabaseModule } from 'src/database/database.module';
import { fieldDeviceProvider } from 'src/models/repositoriesModels/fieldDevice.providers';

@Module({
    imports: [
        PassportModule.register(
            {
                defaultStrategy: 'jwt', 
                session: false
            }
        ), 
        DatabaseModule
    ],
    controllers: [FieldtestController], 
    providers: [
        FieldtestService,
        ...deviceProviders,
        ...waterHistoryProviders,
        ...waterSettingsProviders,
        ...fieldDeviceProvider
    ]
})
export class FieldtestModule {
}
