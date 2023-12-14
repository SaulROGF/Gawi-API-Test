import { AuthModule } from './../auth/auth.module';
import { Module } from '@nestjs/common';
import { PublicController } from './public.controller';
import { PublicService } from './public.service';
import { DatabaseModule } from '../../../database/database.module';
import { GlobalServicesModule } from '../../global/global-services.module';
import { userProviders } from './../../../models/repositoriesModels/user.providers';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';

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
  ],
  controllers: [PublicController],
  providers: [
    PublicService,
    ...userProviders,
  ],
})
export class PublicModule {}
