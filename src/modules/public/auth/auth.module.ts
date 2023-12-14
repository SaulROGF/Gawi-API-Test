import { organizationProviders } from './../../../models/repositoriesModels/organization.providers';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './strategies/jwt.strategy';
import { UserModule } from '../user/user.module';
import { PassportModule } from '@nestjs/passport';
import { DevicesModule } from './../../../modules/dashboard/devices/devices/devices.module';
import { notificationProviders } from '../../../models/notifications.entity';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt', session: false }),
    JwtModule.register({
      secretOrPrivateKey: 'ingMultiKey',
      signOptions: {
        expiresIn: 365 * 24 * 60 * 60,
      },
    }),
    UserModule,
    DevicesModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, ...organizationProviders, ...notificationProviders],
  exports: [AuthService],
})
export class AuthModule {}
