import { Injectable, Inject } from '@nestjs/common';
import { ServerMessage } from '../../../../classes/ServerMessage.class';
import { Organization } from './../../../../models/organization.entity';
import { Device } from './../../../../models/device.entity';
import { User } from './../../../../models/user.entity';
import { Op } from 'sequelize';
import { Logger } from 'winston';


@Injectable()
export class ServiceCenterService {
  constructor(
    @Inject('UserRepository') private readonly userRepository: typeof User,
    @Inject('OrganizationRepository')
    private readonly organizationRepository: typeof Organization,
    @Inject('DeviceRepository')
    private readonly deviceRepository: typeof Device,
    @Inject('winston') private readonly logger: Logger,
  ) {}

  /**
   *
   */
  async retrieveContacts(client: User): Promise<ServerMessage> {
    try {
      if (client == null || client == undefined) {
        return new ServerMessage(true, 'Petición incompleta', {});
      }

      let adminUser : User = await this.userRepository.findOne({
        where: {
          idRole: 1
        },
        include: [{
          model : Organization,
          as : 'organization'
        }]
      });

      let devices : Device[] = await this.deviceRepository.findAll<Device>({
        where: {
          idUser: client.idUser,
          idOrganization: {
            [Op.not] : adminUser.organization.idOrganization
          }
        },
        include: [
          {
            model: Organization,
            as: 'organization',
          },
        ],
        group: ['Device.idOrganization'],
      });

      return new ServerMessage(false, 'La petición se ha hecho correctamente', {
        organizationsData : devices.map((device : Device)=>{
          return Object.assign(device.organization)
        }),
        mainOrganizationData : adminUser.organization
      });
    } catch (error) {
      this.logger.error(error);
      return new ServerMessage(true, 'A ocurrido un error', error);
    }
  }
}
