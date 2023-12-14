import { Injectable, Inject } from '@nestjs/common';
import { ServerMessage } from './../../../classes/ServerMessage.class';
import { GeoLocationByIp as GeoIp } from './../../../classes/geoLocationByIp.class';
import { Op } from 'sequelize';
import { Town } from './../../../models/town.entity';
import { State } from './../../../models/state.entity';

@Injectable()
export class GeoLocationService {
  constructor(
    @Inject('TownRepository') private readonly townRepository: typeof Town,
  ) {}

  /**
   *
   */
  async getLocationByIp(ip: string): Promise<any> {
    try {
      // instance GeoLocationByIp class and retrieve location by ip
      const geoIp = new GeoIp();
      let location = await geoIp.getLocationByIp(ip);
      // find town by location
      let town: Town = await this.townRepository.findOne<Town>(
        location.error
          ? {
              where: {
                name: 'Chihuahua',
              },
              include: [
                {
                  model: State,
                  as: 'state',
                  where: {
                    name: 'Chihuahua',
                  },
                },
              ],
            }
          : {
              where: {
                name: {
                  [Op.like]: '%' + location.town + '%',
                },
              },
              include: [
                {
                  model: State,
                  as: 'state',
                  where: {
                    name: {
                      [Op.like]: '%' + location.state + '%',
                    },
                  },
                },
              ],
            },
      );

      return new ServerMessage(false, '', {
        town: town.idTown,
        state: town.idState,
      });
    } catch (error) {
      return new ServerMessage(true, '', error);
    }
  }
}
