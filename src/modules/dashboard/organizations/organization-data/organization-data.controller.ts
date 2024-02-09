import { Controller, Get, Req, Post, Body, UseGuards, UsePipes, ValidationPipe, Patch, Delete, Param, Query } from '@nestjs/common';
import { OrganizationDataService } from './organization-data.service';
import { AuthGuard } from '@nestjs/passport';
import { ServerMessage } from './../../../../classes/ServerMessage.class';
import { RoleOrganizationAdminGuard } from './../../../../middlewares/roles.guard';
import { CreateOrganizationRegionDto } from './dto/createOrganization.dto';
import { EditOrganizationRegionDto } from './dto/editOrganizationRegion.dto';
import { CreateRegionZoneDto } from './dto/createRegionZone.dto';
import { EditZoneDto } from './dto/editZone.dto';
import { CreateStationDto, UpdateStationDto } from './dto/station.dtos';
import { createDeviceStationDto } from './dto/createDeviceStation.dto';

@Controller('organization/organization-data')
export class OrganizationDataController {
  constructor(
    private readonly organizationDataService: OrganizationDataService,
  ) {}


  @Get('get-organization-settings-data')
  @UseGuards(AuthGuard(),RoleOrganizationAdminGuard)
  async getAdminAccountData(@Req() req: any): Promise<ServerMessage> {
    return await this.organizationDataService.getOrganizationData(req.user);
  }

  
  //CRUD Regiones
  @Get('find-regions/:idOrganization')
  @UseGuards(AuthGuard(),RoleOrganizationAdminGuard)
  async findRegionsByOrganization(@Param('idOrganization') idOrganization: number){
    return await this.organizationDataService.findRegionsByOrganization(idOrganization);
  }
  @Post('create-region')
  @UseGuards(AuthGuard(),RoleOrganizationAdminGuard)
  @UsePipes(new ValidationPipe())
  async createOrganizationRegion(@Body() body: CreateOrganizationRegionDto): Promise<ServerMessage> {
    return await this.organizationDataService.createOrganizationRegion(body);
  }

  @Patch('edit-region/:idRegion')
  @UseGuards(AuthGuard(),RoleOrganizationAdminGuard)
  @UsePipes(new ValidationPipe())
  async editOrganizationRegion(@Param('idRegion') idRegion: number, @Body() editOrganizationRegionDto: EditOrganizationRegionDto): Promise<ServerMessage> {
    return await this.organizationDataService.updateOrganizationRegion(idRegion,editOrganizationRegionDto);
  }

  @Delete('delete-region/:idRegion')
  @UseGuards(AuthGuard(),RoleOrganizationAdminGuard)
  async deleteOrganizationRegion(@Param('idRegion') idRegion: number): Promise<ServerMessage> {    
    return await this.organizationDataService.deleteOrganizationRegion(idRegion);
  }
  

  // CRUD Zonas
  @Get('find-zones-region/:idRegion')
  @UseGuards(AuthGuard(),RoleOrganizationAdminGuard)
  async findZonesByRegion(@Param('idRegion') idRegion: number){
    return await this.organizationDataService.findZoneByRegion(idRegion)
  }
  
  @Get('find-zones-organization/:idOrganization')
  @UseGuards(AuthGuard(),RoleOrganizationAdminGuard)
  async findZoneByOrganization(@Param('idOrganization') idOrganization: number){
    return await this.organizationDataService.findZoneByOrganization(idOrganization)
  }

  @Post('create-zone')
  @UseGuards(AuthGuard(),RoleOrganizationAdminGuard)
  @UsePipes(new ValidationPipe())
  async createRegionZone(@Body() createZoneDto: CreateRegionZoneDto): Promise<ServerMessage>{
    return await this.organizationDataService.createRegionZone(createZoneDto);
  }

  @Patch('edit-zone/:idZone') 
  @UseGuards(AuthGuard(),RoleOrganizationAdminGuard)
  @UsePipes(new ValidationPipe())
  async editZone(@Param('idZone') idZone: number, @Body() editZoneDto: EditZoneDto): Promise<ServerMessage>{
    return await this.organizationDataService.updateZone(idZone, editZoneDto);
  }

  @Delete('delete-zone/:idZone')
  @UseGuards(AuthGuard()) 
  async deleteZone(@Param('idZone') idZone: number): Promise<ServerMessage> {
      return await this.organizationDataService.deleteZone(idZone);
  }


  // CRUD estaciones  
  @Get('find-stations-byOrganization/:idOrganization') 
  @UseGuards(AuthGuard(),RoleOrganizationAdminGuard) 
  @UsePipes(new ValidationPipe()) 
  async getStationsByOrganization(@Param('idOrganization') idOrganization: number): Promise<ServerMessage>{
    return await this.organizationDataService.getStationsByOrganization(idOrganization);
  }

  @Get('find-stations-byZone/:idZone') 
  @UseGuards(AuthGuard(),RoleOrganizationAdminGuard) 
  @UsePipes(new ValidationPipe()) 
  async getStationsByZone(@Param('idZone') idZone: number): Promise<ServerMessage>{
    return await this.organizationDataService.getStationsByZone(idZone);
  }

  @Post('create-station')
  @UseGuards(AuthGuard(),RoleOrganizationAdminGuard)
  @UsePipes(new ValidationPipe()) 
  async creationStation(@Body() createStationDto: CreateStationDto): Promise<ServerMessage>{
    return await this.organizationDataService.createStation(createStationDto);
  }

  @Patch('edit-station/:idStation')
  @UseGuards(AuthGuard(),RoleOrganizationAdminGuard) 
  @UsePipes(new ValidationPipe())
  async updateStation(@Param('idStation') idStation: number, @Body() updateStationDto: UpdateStationDto): Promise<ServerMessage>{
    return await this.organizationDataService.updateStation(idStation, updateStationDto);
  }

  @Delete('delete-station/:idStation')
  @UseGuards(AuthGuard(),RoleOrganizationAdminGuard) 
  @UsePipes(new ValidationPipe())
  async deleteStation(@Param('idStation') idStation: number): Promise<ServerMessage>{
    return await this.organizationDataService.deleteStation(idStation);
  }

  // Funcionalidades para los dispositivos
  //Buscar dispositivos por estacion
  @Get('find-devices-byStation/:idStation')
  @UseGuards(AuthGuard(),RoleOrganizationAdminGuard)
  @UsePipes(new ValidationPipe())
  async findDeviceByStation(@Param('idStation') idStation: number): Promise<ServerMessage>{
    return await this.organizationDataService.findDeviceByStation(idStation)
  }
  //Buscar dispositivos por estacion
  @Get('find-devices-byZone/:idZone')
  @UseGuards(AuthGuard(),RoleOrganizationAdminGuard)
  @UsePipes(new ValidationPipe())
  async findDeviceByZone(@Param('idZone') idZone: number): Promise<ServerMessage>{
    return await this.organizationDataService.findDeviceByZone(idZone)
  }

  //Buscar dispositivos por region
  @Get('find-devices-byRegion/:idRegion')
  @UseGuards(AuthGuard(),RoleOrganizationAdminGuard)
  @UsePipes(new ValidationPipe())
  async findDeviceByRegion(@Param('idRegion') idRegion: number): Promise<ServerMessage>{
    return await this.organizationDataService.findDeviceByRegion(idRegion)
  }

  //Buscar dispositivos por Organizacion
  
  @Get('find-devices-byOrganization/:idOrganization')
  @UseGuards(AuthGuard(),RoleOrganizationAdminGuard)
  @UsePipes(new ValidationPipe())
  async findAllDevicesByOrganization(@Param('idOrganization') idOrganization: number): Promise<ServerMessage>{
    return await this.organizationDataService.findAllDevicesByOrganization(idOrganization)
  }
  //Asignar un dispositivo a una estacion
  @Post('create-devices-InStation/:device')
  @UseGuards(AuthGuard(),RoleOrganizationAdminGuard)
  @UsePipes(new ValidationPipe())
  async createDeviceInStation(@Param('device') device: number,@Body() createDeviceStationDto: createDeviceStationDto): Promise<ServerMessage>{
    return await this.organizationDataService.createDeviceInStation(createDeviceStationDto,device)
  }

  //Eliminar un dispositivo a una estacion
  @Delete('delete-devices-InStation/:idDevice')
  @UseGuards(AuthGuard(),RoleOrganizationAdminGuard)
  @UsePipes(new ValidationPipe())
  async deleteDeviceInStation(@Param('idDevice') idDevice: number): Promise<ServerMessage>{
    return await this.organizationDataService.deleteDeviceInStation(idDevice)
  }

  @Get('find-supervisorList/:idOrganization')
  @UseGuards(AuthGuard(),RoleOrganizationAdminGuard)
  @UsePipes(new ValidationPipe())
  async findSupervisorList(@Param('idOrganization') idOrganization: number): Promise<ServerMessage>{
    return await this.organizationDataService.findSupervisorList(idOrganization)
  }

}