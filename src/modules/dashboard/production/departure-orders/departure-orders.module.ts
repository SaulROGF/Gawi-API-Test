// generales
import { Module } from '@nestjs/common';
import { DepartureOrdersController } from './departure-orders.controller';
import { DepartureOrdersService } from './departure-orders.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
// repositorios
import { organizationProviders } from './../../../../models/repositoriesModels/organization.providers';
import { deviceProviders } from './../../../../models/repositoriesModels/device.providers';
import { departureOrderProviders } from './../../../../models/repositoriesModels/departureOrders.providers';


@Module({
  controllers: [DepartureOrdersController],
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt', session: false }),
    JwtModule.register({
      secretOrPrivateKey: 'ingMultiKey',
      signOptions: {
        expiresIn: 2 * 365 * 24 * 60 * 60
      }
    }),
  ],
  providers: [
    DepartureOrdersService,
    ...organizationProviders,
    ...deviceProviders,
    ...departureOrderProviders,
  ]
})
export class DepartureOrdersModule {}
