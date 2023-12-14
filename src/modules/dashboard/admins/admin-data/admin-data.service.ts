import { Apn } from './../../../../models/apn.entity';
import { Injectable, Inject } from '@nestjs/common';
import { User } from './../../../../models/user.entity';
import { ServerMessage } from './../../../../classes/ServerMessage.class';
import { Town } from './../../../../models/town.entity';
import { State } from '../../../../models/state.entity';
import { Op } from 'sequelize';
import { Device } from '../../../../models/device.entity';
import { GasSettings } from '../../../../models/gasSettings.entity';
import { WaterSettings } from '../../../../models/waterSettings.entity';
import { Logger } from 'winston';


@Injectable()
export class AdminDataService {
  constructor(
    @Inject('UserRepository') private readonly userRepository: typeof User,
    @Inject('StateRepository') private readonly stateRepository: typeof State,
    @Inject('ApnRepository') private readonly apnRepository: typeof Apn,
    @Inject('DeviceRepository') private readonly deviceRepository: typeof Device,
    @Inject('winston') private readonly logger: Logger,
    ) { }

  /**
   *
   */
  async getAdminAccountData(user: User): Promise<ServerMessage> {
    try {
      let adminUser: User = await this.userRepository.findOne<User>({
        where: {
          idUser: user.idUser,
          idRole: 1,
        },
        include: [
          {
            model: Town,
            as: 'town',
            include: [
              {
                model: State,
                as: 'state',
              },
            ],
          },
        ],
      });

      let states: State[] = await this.stateRepository.findAll<State>({
        include: [
          {
            model: Town,
            as: 'towns',
          },
        ],
      });

      return new ServerMessage(false, 'Datos enviados correctamente', {
        user: adminUser,
        states: states,
      });
    } catch (error) {
      // this.logger.error(error);
      return new ServerMessage(true, 'A ocurrido un error', error);
    }
  }

  /**
   *
   */
  async updateAdminAccountData(
    adminUser: User,
    adminUserData: User,
  ): Promise<ServerMessage> {
    try {
      if (
        adminUserData.firstName == null || adminUserData.firstName == undefined ||
        adminUserData.lastName == null || adminUserData.lastName == undefined ||
        adminUserData.mothersLastName == null || adminUserData.mothersLastName == undefined ||
        adminUserData.email == null || adminUserData.email == undefined ||
        adminUserData.phone == null || adminUserData.phone == undefined ||
        adminUserData.firstName == null || adminUserData.firstName == undefined ||
        adminUserData.idTown == null || adminUserData.idTown == undefined
      ) {
        return new ServerMessage(true, 'Petición incompleta', {});
      }

      let alreadyEmail: User = await this.userRepository.findOne<User>({
        where: {
          idUser: {
            [Op.not]: adminUser.idUser,
          },
          email: adminUserData.email,
          deleted: false,
        }
      });

      if (alreadyEmail) {
        return new ServerMessage(true, 'Email actualmente en uso', {});
      }

      adminUser.firstName = adminUserData.firstName;
      adminUser.lastName = adminUserData.lastName;
      adminUser.mothersLastName = adminUserData.mothersLastName;
      adminUser.email = adminUserData.email;
      adminUser.phone = adminUserData.phone;
      adminUser.idTown = adminUserData.idTown;
      await adminUser.save();
      return new ServerMessage(false, 'Actualizado con éxito', {});
    } catch (error) {
      // this.logger.error(error);
      return new ServerMessage(true, 'A ocurrido un error', error);
    }
  }

  /**
  *
  */
   async getApnList(organization: number) : Promise<ServerMessage> {
    try {
      let apnList : any[] = await this.apnRepository.findAll<Apn>({

      }).map(async (apn : Apn)=>{
        let apnFixed : any = apn.toJSON();

        apnFixed.noDevices = await this.deviceRepository.count({
          where: {
            idApn : apn.idApn,
          }
        });

        return apnFixed
      });

      return new ServerMessage(false, 'Apn obtenidos correctamente', {
        apnList: organization === 1 ? apnList : [],
       });
    } catch (error) {
      // this.logger.error(error);
      return new ServerMessage(true, 'A ocurrido un error', error);
    }
  }

  /**
  *
  */
  async createNewApn( data: Apn ) : Promise<ServerMessage> {
    try {
      if (
        data.idApn == null || data.idApn == undefined ||
        data.name == null || data.name == undefined || data.name == 'AT&T DEFAULT' ||
        data.companyName == null || data.companyName == undefined ||
        data.apn == null || data.apn == undefined ||
        data.user == null || data.user == undefined ||
        data.password == null || data.password == undefined
      ) {
        return new ServerMessage(true, 'Petición incompleta', {});
      }

      let newApn : Apn = await this.apnRepository.create<Apn>({
        //idApn : data.idApn,
        name : data.name.toUpperCase(),
        companyName : data.companyName.toUpperCase(),
        apn : data.apn.toLowerCase(),
        user : data.user,
        password : data.password,
      });

      let apnListResponse : ServerMessage = await this.getApnList(1);

      if( apnListResponse.error == true ){
        return apnListResponse;
      }

      return new ServerMessage(false, 'Apn guardado correctamente', {
        newApn : newApn,
        apnList : apnListResponse.data.apnList
      });
    } catch (error) {
      // this.logger.error(error);
      return new ServerMessage(true, 'A ocurrido un error', error);
    }
  }

  /**
  *
  */
  async updateAPNAdmin( data: Apn ) : Promise<ServerMessage> {
    try {
      if (
        data.idApn == null || data.idApn == undefined ||
        data.name == null || data.name == undefined ||
        data.companyName == null || data.companyName == undefined ||
        data.apn == null || data.apn == undefined ||
        data.user == null || data.user == undefined ||
        data.password == null || data.password == undefined
      ) {
        return new ServerMessage(true, 'Petición incompleta', {});
      }

      let apnToUpdate : Apn = await this.apnRepository.findOne<Apn>({
        where: {
          idApn : data.idApn,
          name : {
            [Op.not] : 'AT&T DEFAULT'
          }
        },
        include: [{
          model : Device,
          as : 'devices',
          include: [{
            model : WaterSettings,
            as : 'waterSettings',
          },{
            model : GasSettings,
            as : 'gasSettings',
          }]
        }]
        //name : data.name.toUpperCase(),
        //companyName : data.companyName.toUpperCase(),
        //apn : data.apn.toLowerCase(),
        //user : data.user,
        //password : data.password,
      });

      if(!apnToUpdate){
        return new ServerMessage(true, 'Apn no disponible', {});
      }

      apnToUpdate.name = data.name.toUpperCase();
      apnToUpdate.companyName = data.companyName.toUpperCase();
      apnToUpdate.apn = data.apn.toLowerCase();
      apnToUpdate.user = data.user;
      apnToUpdate.password = data.password;
      
      await apnToUpdate.save();

      for (let index = 0; index < apnToUpdate.devices.length; index++) {
        var device : Device = apnToUpdate.devices[index];
        if( device.type == 0 ){// 0 - gas
          device.gasSettings.wereApplied = false;
          await device.gasSettings.save();
        }else if( device.type == 1 ){// 1 - agua
          device.waterSettings.wereApplied = false;
          await device.waterSettings.save();
        }
      }

      let apnListResponse : ServerMessage = await this.getApnList(1);

      if( apnListResponse.error == true ){
        return apnListResponse;
      }

      return new ServerMessage(false, 'Apn guardado correctamente', {
        //newApn : newApn,
        apnList : apnListResponse.data.apnList,
        apnToUpdate : apnToUpdate
      });
    } catch (error) {
      // this.logger.error(error);
      return new ServerMessage(true, 'A ocurrido un error', error);
    }
  }

  /**
  *
  */
  async deleteAPNAdmin( data: {  apnDataToDelete: Apn ,  apnDataToSet: Apn } ) : Promise<ServerMessage> {
    try {
      if (
        data.apnDataToDelete.idApn == null || data.apnDataToDelete.idApn == undefined ||
        data.apnDataToSet.idApn == null || data.apnDataToSet.idApn == undefined 
        /* data.apnDataToDelete.name == null || data.apnDataToDelete.name == undefined ||
        data.apnDataToDelete.companyName == null || data.apnDataToDelete.companyName == undefined ||
        data.apnDataToDelete.apn == null || data.apnDataToDelete.apn == undefined ||
        data.apnDataToDelete.user == null || data.apnDataToDelete.user == undefined ||
        data.apnDataToDelete.password == null || data.apnDataToDelete.password == undefined */
      ) {
        return new ServerMessage(true, 'Petición incompleta', {});
      }

      let apnToDelete : Apn = await this.apnRepository.findOne<Apn>({
        where: {
          idApn : data.apnDataToDelete.idApn,
          name : {
            [Op.not] : 'AT&T DEFAULT'
          }
        },
        include: [{
          model : Device,
          as : 'devices',
          include: [{
            model : WaterSettings,
            as : 'waterSettings',
          },{
            model : GasSettings,
            as : 'gasSettings',
          }]
        }]
      });

      if(!apnToDelete){
        return new ServerMessage(true, 'Apn no disponible', {});
      }
      
      /* 

       */
      // Change everyone without a last name to "Doe"
      let updatedDevices = await this.deviceRepository.update({ idApn : data.apnDataToSet.idApn }, {
        where: {
          idApn : data.apnDataToDelete.idApn,
        }
      });

      await apnToDelete.destroy();

      for (let index = 0; index < apnToDelete.devices.length; index++) {
        var device : Device = apnToDelete.devices[index];
        if( device.type == 0 ){// 0 - gas
          device.gasSettings.wereApplied = false;
          await device.gasSettings.save();
        }else if( device.type == 1 ){// 1 - agua
          device.waterSettings.wereApplied = false;
          device.waterSettings.status = device.waterSettings.calculateNewStatus( 6 , true );
          await device.waterSettings.save();
        }
      }

      let apnListResponse : ServerMessage = await this.getApnList(1);

      if( apnListResponse.error == true ){
        return apnListResponse;
      }

      return new ServerMessage(false, 'Apn guardado correctamente', {
        //newApn : newApn,
        apnList : apnListResponse.data.apnList,
        apnToDelete : apnToDelete,
        updatedDevices : updatedDevices
      });
    } catch (error) {
      // this.logger.error(error);
      return new ServerMessage(true, 'A ocurrido un error', error);
    }
  }

}
