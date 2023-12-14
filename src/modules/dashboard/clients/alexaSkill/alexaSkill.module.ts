import { AuthModule } from './../../../public/auth/auth.module';
import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../../../database/database.module';
import { GlobalServicesModule } from '../../../global/global-services.module';
import { userProviders } from './../../../../models/repositoriesModels/user.providers';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { AlexaSkillService } from './alexaSkill.service';
import { AlexaSkillController } from './alexaSkill.controller';
import { DevicesModule as ClientDevicesModule } from './../../technicians/devices/devices.module';
import { DevicesModule } from '../devices/devices.module';
import { UserModule } from '../../../public/user/user.module';

@Module({
  imports: [
    DatabaseModule,
    GlobalServicesModule,
    AuthModule,
    PassportModule.register({ defaultStrategy: 'jwt', session: false }),
    JwtModule.register({
      secretOrPrivateKey: 'ingMultiKey',
      signOptions: {
        expiresIn: 15 * 60 // 15 mins
      }
    }),
    DevicesModule,
    UserModule,
  ],
  controllers: [AlexaSkillController],
  providers: [
    AlexaSkillService,
    ...userProviders,
  ],
})
export class AlexaSkillModule {}
