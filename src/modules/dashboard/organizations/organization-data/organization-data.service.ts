import { Injectable, Inject } from '@nestjs/common';
import { ServerMessage } from './../../../../classes/ServerMessage.class';
import { Organization } from './../../../../models/organization.entity';
import { User } from './../../../../models/user.entity';
import { Logger } from 'winston';
import { Regions } from 'src/models/regions.entity';
import { CreateRegionZoneDto } from './dto/createRegionZone.dto';
import { Zones } from 'src/models/zones.entity';
import { EditZoneDto } from './dto/editZone.dto';
import { Buffer } from 'buffer';
import { CreateStationDto, UpdateStationDto } from './dto/station.dtos';
import { Stations } from 'src/models/stations.entity';
import { Op } from 'sequelize';
import { CreateOrganizationRegionDto } from './dto/createOrganization.dto';
import { EditOrganizationRegionDto } from './dto/editOrganizationRegion.dto';
import { DeviceStation } from 'src/models/deviceStation.entity';
import { Device } from 'src/models/device.entity';
import { createDeviceStationDto } from './dto/createDeviceStation.dto';
import { GasHistory } from 'src/models/gasHistory.entity';


@Injectable()
export class OrganizationDataService {
  constructor(
    @Inject('OrganizationRepository')
    private readonly organizationRepository: typeof Organization,
    @Inject('UserRepository')
    private readonly userRepository: typeof User,
    @Inject('winston') private readonly logger: Logger,
  ) { }

  // async getOrganizationData(user: User): Promise<ServerMessage> {
  //   try {
  //     console.log(user);

  //     let userWithOrganization: User = await this.userRepository.findOne<User>({
  //       where: {
  //         idUser: user.idUser,
  //       },
  //       include: [
  //         {
  //           model: Organization,
  //           as: 'organization',
  //           include: [
  //             {
  //               model: Regions,
  //               as: 'regions',
  //             },
  //           ],
  //         },
  //       ],
  //     });

  //     if (userWithOrganization.organization.type === 0) {
  //       console.log('Organizacion tipo 0 - root');

  //       return new ServerMessage(false, 'Datos enviados correctamente', {
  //         organization: userWithOrganization.organization,
  //       });
  //     }
  //     if (userWithOrganization.organization.type === 1) {
  //       console.log('Organizacion tipo 1 - gas');

  //       return new ServerMessage(false, 'Datos enviados correctamente', {
  //         organization: userWithOrganization.organization,
  //       });
  //     }

  //     return new ServerMessage(false, 'Datos enviados correctamente', {
  //       organization: userWithOrganization.organization,
  //     });
  //   } catch (error) {
  //     this.logger.error(error);
  //     return new ServerMessage(true, 'A ocurrido un error', error);
  //   }
  // }

  async getOrganizationData(user: User): Promise<ServerMessage> {
    
    try {
      
      // Primero, obtén la organización asociada al usuario
      const organization = await this.organizationRepository.findOne({
        where: {
          idOrganization: user.idOrganization,
        },
      });

      // Si no se encontró la organización, maneja el error como lo consideres necesario
      if (!organization) {
        throw new Error('Organización no encontrada');
      }

      // Estructura base para la inclusión
      const includeStructure = [
        {
          model: Organization,
          as: 'organization',
          include: []
        }
      ];

      // Si el tipo de organización es 1, agregamos las relaciones adicionales
      if (organization.type === 1) {
        console.log('se agrego lo de gas');
        
        includeStructure[0].include.push(
          {
            model: Regions,
            as: 'regions',
            include: [
              {
                model: Zones,
                as: 'zones',
                include: [
                  {
                    model: Stations,
                    as: 'stations'
                  }
                ]
              }
            ]
          },
          // Relación directa de Organization a Stations
          {
            model: Stations,
            as: 'stations'
          }
        );
      }
      
      const userWithOrganization: User = await this.userRepository.findOne<User>({
        where: {
          idUser: user.idUser,
        },
        include: includeStructure
      });

      
      if (organization.type === 0) {
        console.log('Organizacion tipo 0 - root');
        return new ServerMessage(false, 'Datos enviados correctamente', {
          organization: userWithOrganization.organization,
        });
      }
      if (organization.type === 1) {
        console.log('Organizacion tipo 1 - gas');
        return new ServerMessage(false, 'Datos enviados correctamente', {
          organization: userWithOrganization.organization,
        });
      }
      
      return new ServerMessage(false, 'Datos enviados correctamente', {
        organization: userWithOrganization.organization,
      });
    } catch (error) {
      this.logger.error(error);
      return new ServerMessage(true, 'A ocurrido un error', error);
    }
  }




  // Regions
  // Funcion para obtener las regiones de una organizacion 
  async findRegionsByOrganization(idOrganization: number ){
    try{
      const regions = await Regions.findAll({
        where: {
          idOrganization: idOrganization
        }
      });
      return new ServerMessage(false, 'Regiones obtenida exitosamente', regions);
    } catch (error){
      this.logger.error(error);
      return new ServerMessage(true, 'A ocurrido un error', error);
    }
  }

  // Funcion para crear una region dentro de una organizacion
  async createOrganizationRegion(createRegion: CreateOrganizationRegionDto) {
    try {
      //console.log(createRegion);
      const region = await Regions.create({
        idOrganization: createRegion.idOrganization,
        name: createRegion.name,
      });
      return new ServerMessage(false, 'Región creada exitosamente', region);
    } catch (error) {
      this.logger.error(error);
      return new ServerMessage(true, 'A ocurrido un error', error);
    }
  }

  // Funcion para editar una region dentro de una organizacion
  async updateOrganizationRegion(
    idRegion: number,
    editOrganizationRegionDto: EditOrganizationRegionDto,
  ): Promise<ServerMessage> {
    try {
      const region = await Regions.findByPk(idRegion);

      if (!region) {
        return new ServerMessage(true, 'Región no encontrada', null);
      }

      region.name = editOrganizationRegionDto.name;
      await region.save();

      return new ServerMessage(
        false,
        'Región actualizada exitosamente',
        region,
      );
    } catch (error) {
      this.logger.error(error);
      return new ServerMessage(true, 'A ocurrido un error', error);
    }
  }

  // Funcion para borrar una region dentro de una organizacion
  async deleteOrganizationRegion(idRegion: number): Promise<ServerMessage> {
    try {
      const region = await Regions.findByPk(idRegion);
      if (!region) {
        return new ServerMessage(true, 'Región no encontrada', null);
      }
      await region.destroy();
      return new ServerMessage(false, 'Región eliminada exitosamente', null);
    } catch (error) {
      this.logger.error(error);
      return new ServerMessage(true, 'A ocurrido un error', error);
    }
  }



  //Zones 
  // Funcion para buscar zonas por region
  async findZoneByRegion(idRegion: number){
    try{
      const zones =  await Zones.findAll({
        where: {
          idRegion: idRegion
        }
      });
      return new ServerMessage(false,'Zonas obtenida correctamente',zones);
    }catch (error){
      this.logger.error(error);
      return new ServerMessage(true, 'A ocurrido un error', error);
    }
  }

  // Funcion para buscar zonas por organizacion
  async findZoneByOrganization(idOrganization: number){
    try{
      const zones = await Zones.findAll({
        where: {
          idOrganization: idOrganization
        }
      })
      return new ServerMessage(false,'Zonas obtenida correctamente',zones);
    } catch (error){
      this.logger.error(error);
      return new ServerMessage(true, 'A ocurrido un error', error);
    }
  }

  // Funcion para crear una zona dentro de una region
  async createRegionZone(createZoneDto: CreateRegionZoneDto): Promise<ServerMessage> {
    try {
      //console.log(createZoneDto);
      const zone = await Zones.create({
        idRegion: createZoneDto.idRegion,
        name: createZoneDto.name,
        idOrganization: createZoneDto.idOrganization
      })
      return new ServerMessage(false, 'Zona creada exitosamente', zone);
    } catch (error) {
      this.logger.error(error);
      if(error.parent.code == "ER_NO_REFERENCED_ROW_2"){
        return { error: true, message: 'Error al crear la estación', data: "No existe la region o la organizacion" };
      }else{
        return { error: true, message: 'Error al crear la estación', data: error };

      }
    }
  }

  // Funcion para editar una zona dentro de una region
  async updateZone(idZone: number, editZoneDto: EditZoneDto): Promise<ServerMessage> {
    try {
      const zone = await Zones.findByPk(idZone);
      if (!zone) {
        return new ServerMessage(false, 'Zona no encontrada', idZone)
      }
      /*
      if (editZoneDto.idRegion) {
        const newRegion = await Regions.findByPk(editZoneDto.idRegion);
        if (!newRegion) {
          return new ServerMessage(false, 'No existe region con ese id', editZoneDto.idRegion);
        }
        const currentRegion = await Regions.findByPk(zone.idRegion);
        if (newRegion.idOrganization !== currentRegion.idOrganization) {
          return new ServerMessage(false, 'La nueva región no pertenece a la misma organización', currentRegion.idOrganization);
        }
        zone.idRegion = editZoneDto.idRegion;
      }

      if (editZoneDto.name) {
        zone.name = editZoneDto.name;
      }
      await zone.save();
      */
      await Zones.update({
        idRegion: editZoneDto.idRegion,
        name: editZoneDto.name,
      }, {
        where: {
          idZone :idZone
        }
      });
      return new ServerMessage(false, 'Se actualizo correctamente la zona', "Todo ok");
    } catch (error) {
      this.logger.error(error);
      if(error.parent.code == "ER_NO_REFERENCED_ROW_2"){
        return { error: true, message: 'Error al crear la estación', data: "No existe la region" };
      }else{
        return { error: true, message: 'Error al crear la estación', data: error };

      }
    }
  }

  // Funcion paara borrar una zona de una region
  async deleteZone(idZone: number): Promise<ServerMessage> {
    try {
      
      const zone = await Zones.findByPk(idZone);
      if (!zone) {
        return new ServerMessage(false, 'Zona no encontrada', idZone);
      }
      await zone.destroy();
      
      return new ServerMessage(false, 'Zona eliminada correctamente', idZone);
    } catch (error) {
      this.logger.error(error);
      return new ServerMessage(true, 'Error interno al eliminar la zona', idZone);
    }
  }



  //Estaciones
  // Funcion para crear una estacion 
  async createStation(createStationDto: CreateStationDto): Promise<ServerMessage> {
    try {
      /*
      // Validar que la organización exista
      const organization = await Organization.findByPk(createStationDto.idOrganization);
      if (!organization) {
        return { error: true, message: 'La organización especificada no existe.', data: null };
      }
      */

      /*
      // Si se proporciona idZone, validar que la zona exista y pertenezca a la organización correcta
      if (createStationDto.idZone) {
        const zone = await Zones.findByPk(createStationDto.idZone, { include: [Regions] });
        if (!zone) {
          return { error: true, message: 'La zona especificada no existe.', data: null };
        }
        if (zone.region.idOrganization !== createStationDto.idOrganization) {
          return { error: true, message: 'La zona especificada no pertenece a la organización dada.', data: null };
        }
      }
      */
      /*
      // Si se proporciona supervisorId, validar que el supervisor exista
      if (createStationDto.supervisorId) {
        const supervisor = await User.findByPk(createStationDto.supervisorId); // Asumiendo que tienes un modelo User
        if (!supervisor) {
          return { error: true, message: 'El supervisor especificado no existe.', data: null };
        }
      }
      */
      /*
      // Verificar si ya existe una estación con el mismo nombre, misma organización y misma zona (si se proporciona)
      const existingStation = await Stations.findOne({
        where: {
          name: createStationDto.name,
          idOrganization: createStationDto.idOrganization,
          idZone: createStationDto.idZone || null
        }
      });
      
      if (existingStation) {
        return { error: true, message: 'Ya existe una estación con ese nombre en la organización (y zona, si se especificó).', data: null };
      }
      */

      const station = await Stations.create(createStationDto);
      return { error: false, message: 'Estación creada exitosamente', data: station };
    } catch (error) {
      this.logger.error(error);
      if(error.parent.code == "ER_NO_REFERENCED_ROW_2"){
        return { error: true, message: 'Error al crear la estación', data: "La organizacion, la zona o el supervisor no son validos" };
      }else{
        return { error: true, message: 'Error al crear la estación', data: error };

      }
    }
  }

  // Funcion para buscar estaciones por zona
  async getStationsByZone(idZone: number): Promise<ServerMessage> {
    try {
      const stations = await Stations.findAll({
        where: { idZone: idZone },
        include: [Zones]
      });
      return { error: false, message: 'Estaciones obtenidas exitosamente', data: stations };
    } catch (error) {
      this.logger.error(error);
      return { error: true, message: 'Error al obtener las estaciones', data: null };
    }
  }

  // Funcion para buscar estaciones por organizacion
  async getStationsByOrganization(idOrganization: number): Promise<ServerMessage> {
    try {
      const stations = await Stations.findAll({
        where: { idOrganization: idOrganization }
      });
      return { error: false, message: 'Estaciones obtenidas exitosamente', data: stations };
    } catch (error) {
      this.logger.error(error);
      return { error: true, message: 'Error al obtener las estaciones', data: null };
    }
  }

  // Funcion para editar una estacion
  async updateStation(idStation: number, updateStationDto: UpdateStationDto): Promise<ServerMessage> {
    try {
        const station = await Stations.findByPk(idStation);
        if (!station) {
            return { error: true, message: 'Estación no encontrada', data: null };
        }
        /*
        // Si se proporciona idZone, validar que la zona exista y pertenezca a la organización correcta
        if (updateStationDto.idZone && updateStationDto.idZone !== station.idZone) {
            const zone = await Zones.findByPk(updateStationDto.idZone, { include: [Regions] });
            if (!zone) {
                return { error: true, message: 'La zona especificada no existe.', data: null };
            }
            if (zone.region.idOrganization !== updateStationDto.idOrganization) {
                return { error: true, message: 'La zona especificada no pertenece a la organización dada.', data: null };
            }
        }

        // Si se proporciona supervisorId, validar que el supervisor exista
        if (updateStationDto.supervisorId && updateStationDto.supervisorId !== station.supervisorId) {
            const supervisor = await User.findByPk(updateStationDto.supervisorId); // Asumiendo que tienes un modelo User
            if (!supervisor) {
                return { error: true, message: 'El supervisor especificado no existe.', data: null };
            }
        }
        // Verificar si ya existe una estación con el mismo nombre, misma organización y misma zona (si se proporciona)
        const existingStation = await Stations.findOne({
          where: {
            idStation: { [Op.ne]: idStation }, // Excluir la estación actual
            name: updateStationDto.name,
            idOrganization: updateStationDto.idOrganization,
            idZone: updateStationDto.idZone || null
          }
        });
        
        if (existingStation) {
          return { error: true, message: 'Ya existe una estación con ese nombre en la organización (y zona, si se especificó).', data: null };
        }
        */

        await station.update(updateStationDto);
        return { error: false, message: 'Estación actualizada exitosamente', data: station };
    } catch (error) {
        this.logger.error(error);
        if(error.parent.code == "ER_NO_REFERENCED_ROW_2"){
          return { error: true, message: 'Error al crear la estación', data: "La organizacion, la zona o el supervisor no son validos" };
        }else{
          return { error: true, message: 'Error al crear la estación', data: error };
  
        }
    }
  }

  // Funcion para borrar una estacion
  async deleteStation(idStation: number): Promise<ServerMessage> {
    try {
      const station = await Stations.findByPk(idStation);
      if (!station) {
        return { error: true, message: 'Estación no encontrada', data: null };
      }

      await station.destroy();
      return { error: false, message: 'Estación eliminada exitosamente', data: null };
    } catch (error) {
      this.logger.error(error);
      return { error: true, message: 'Error al eliminar la estación', data: null };
    }
  }

  //Funcion para buscar todos los dispositivos por Estacion
  async findDeviceByStation(idStation: number): Promise<ServerMessage>{
    try {
      
      const devices = await DeviceStation.findAll({
        
        where: {
          idStation: idStation
        },
        include: [
        {
          model: Device,
          include: [GasHistory]
        }
        ,Stations
        ]
      
        
      })
      
      return { error: false, message: 'Dispositivos obtenidos exitosamente', data: devices };
      /*
        const device = await Device.findAll()
        return { error: false, message: 'Dispositivos obtenidos exitosamente', data: device };
      */

      } catch (error) {
        this.logger.error(error);
        return { error: true, message: 'Error al buscar los dispositivos de la estación', data: null};
      }
  }

  //Funcion para buscar todos los dispositivos por Zona
  async findDeviceByZone(idZone: number): Promise<ServerMessage>{
    try {
      
      const devices = await DeviceStation.findAll({
        
        where: {
          '$stations.idZone$': idZone
        },
        include: [
        {
          model: Device,
          include: [GasHistory]
        }
        ,Stations
        ]
      
        
      })
      
      return { error: false, message: 'Dispositivos obtenidos exitosamente', data: devices };
      /*
        const device = await Device.findAll()
        return { error: false, message: 'Dispositivos obtenidos exitosamente', data: device };
      */

      } catch (error) {
        this.logger.error(error);
        return { error: true, message: 'Error al buscar los dispositivos de la estación', data: null};
      }
  }

  // Funcion para buscar todos los dispositivos por region
  async findDeviceByRegion(idRegion: number){
    try {
      
      const devices = await DeviceStation.findAll({
        where: { idDevice: { [Op.ne]: null } }, //Elimina mostrar las zonas o estaciones que ni tienen ningun dispositivo
        include: [
        {
          model: Device,
          include: [GasHistory],
          right: true // Esto sirve para crear un right Join
        },{
          model: Stations,
          right: true,  // Esto surve para crear un right Join
          include: [{
            model: Zones,
            right: true, // Esto sirve para crear un right Join
            include: [{
              model: Regions,
              where: { idRegion: idRegion}, // Buscamos dispositivos con el id de la region
            }]
          }]
        },
      ]
      });
      return { error: false, message: 'Dispositivos obtenidos exitosamente', data: devices };
    } catch (error) {
      this.logger.error(error);
      return { error: true, message: 'Error al buscar los dispositivos de la estación', data: null};
    }
  }

  // Funcion para buscar todos los dispositivos por organizacion

  async findAllDevicesByOrganization(idOrganization: number){
    try {
      const devices = await DeviceStation.findAll({
        where: { idDevice: { [Op.ne]: null } }, //Elimina mostrar las zonas o estaciones que ni tienen ningun dispositivo
        include: [
        {
          model: Device,
          include: [GasHistory],
          right: true // Esto sirve para crear un right Join
        },{
          model: Stations,
          right: true,  // Esto surve para crear un right Join
          include: [{
            model: Zones,
            right: true, // Esto sirve para crear un right Join
            include: [{
              model: Regions,
              where: { idOrganization: idOrganization}, // Buscamos dispositivos con el id de la region
            }]
          }]
        },
      ]
      });
      return { error: false, message: 'Dispositivo asignado correctamente', data: devices };
    } catch (error) {
      this.logger.error(error);
      return { error: true, message: 'Error al buscar los dispositivos de la estación', data: null};
    }
  }

  // Funcion para asignar un dispositivo a una estacion
  async createDeviceInStation(createDeviceStationDto: createDeviceStationDto, device: any): Promise<ServerMessage>{
    
    try {
      
      //console.log(device) 
      //createDeviceStationDto.idDevice = 60

      
   


      const validarZona = await Stations.findOne({
        where: {
          idStation: createDeviceStationDto.idStation
        }
      })

      const deviceInfo = await this.validarNombreSerial(device);
      if(deviceInfo == null){
        return { error: true, message: 'El dispositivo no existe', data: null };
      }
      //console.log(validarZona)
      //console.log(deviceInfo["idOrganization"])
      
      if(deviceInfo["idOrganization"] != validarZona.idOrganization){
        return { error: true, message: 'El dispositivo no pertenece a la organizacion', data: null };
      }
     
      createDeviceStationDto.idDevice = deviceInfo["idDevice"]

      //console.log(validarDevice.idDevice)
      //console.log(createDeviceStationDto)
      const deviceStation = await DeviceStation.create(createDeviceStationDto);
      return { error: false, message: 'Dispositivo asignado correctamente', data: deviceStation };
    } catch (error) {
      this.logger.error(error);
      return { error: true, message: 'Error al asignar el dispositivos en la estacion', data: null};
    }

    
  }

  async validarNombreSerial(device: any){
    const validarSerial = await Device.findOne({
      where:{
        serialNumber: device
      }
    })
    
    if(validarSerial == null){
    
      const validarNombre = await Device.findOne({
        where:{
          name: device
        }
      })

      //console.log(validarNombre.idDevice)
      if(validarNombre == null){
        return null;
      }
      return validarNombre;

    }
    return validarSerial;
  }

  // Funcion para eliminar un dispositivo a una estacion
  async deleteDeviceInStation(idDevice: number): Promise<ServerMessage>{
    try {
      const station = await DeviceStation.findOne({
        where: {
          idDevice: idDevice,
       
        }
      });

      await station.destroy();
      return { error: false, message: 'Dispositivo eliminado de la estacion correctamente', data: null };
    } catch (error) {
      this.logger.error(error);
      return { error: true, message: 'Error al eliminar el dispositivos en la estacion', data: null};
    }
  }


  async  findSupervisorList(idOrganization: number){
    try {
      const supervisorList = await User.findAll({
        where:{
          idOrganization: idOrganization
        }
      });
      return  { error: false, message: 'Supervisores encontrados correctamente', data: supervisorList };
    } catch (error) {
      this.logger.error(error);
      return { error: true, message: 'Error al asignar el dispositivos en la estacion', data: null};
    }
  }
}