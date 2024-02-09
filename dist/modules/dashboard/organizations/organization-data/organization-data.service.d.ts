import { ServerMessage } from './../../../../classes/ServerMessage.class';
import { Organization } from './../../../../models/organization.entity';
import { User } from './../../../../models/user.entity';
import { Logger } from 'winston';
import { CreateRegionZoneDto } from './dto/createRegionZone.dto';
import { EditZoneDto } from './dto/editZone.dto';
import { CreateStationDto, UpdateStationDto } from './dto/station.dtos';
import { CreateOrganizationRegionDto } from './dto/createOrganization.dto';
import { EditOrganizationRegionDto } from './dto/editOrganizationRegion.dto';
import { DeviceStation } from 'src/models/deviceStation.entity';
import { Device } from 'src/models/device.entity';
import { createDeviceStationDto } from './dto/createDeviceStation.dto';
export declare class OrganizationDataService {
    private readonly organizationRepository;
    private readonly userRepository;
    private readonly logger;
    constructor(organizationRepository: typeof Organization, userRepository: typeof User, logger: Logger);
    getOrganizationData(user: User): Promise<ServerMessage>;
    findRegionsByOrganization(idOrganization: number): Promise<ServerMessage>;
    createOrganizationRegion(createRegion: CreateOrganizationRegionDto): Promise<ServerMessage>;
    updateOrganizationRegion(idRegion: number, editOrganizationRegionDto: EditOrganizationRegionDto): Promise<ServerMessage>;
    deleteOrganizationRegion(idRegion: number): Promise<ServerMessage>;
    findZoneByRegion(idRegion: number): Promise<ServerMessage>;
    findZoneByOrganization(idOrganization: number): Promise<ServerMessage>;
    createRegionZone(createZoneDto: CreateRegionZoneDto): Promise<ServerMessage>;
    updateZone(idZone: number, editZoneDto: EditZoneDto): Promise<ServerMessage>;
    deleteZone(idZone: number): Promise<ServerMessage>;
    createStation(createStationDto: CreateStationDto): Promise<ServerMessage>;
    getStationsByZone(idZone: number): Promise<ServerMessage>;
    getStationsByOrganization(idOrganization: number): Promise<ServerMessage>;
    updateStation(idStation: number, updateStationDto: UpdateStationDto): Promise<ServerMessage>;
    deleteStation(idStation: number): Promise<ServerMessage>;
    findDeviceByStation(idStation: number): Promise<ServerMessage>;
    findDeviceByZone(idZone: number): Promise<ServerMessage>;
    findDeviceByRegion(idRegion: number): Promise<{
        error: boolean;
        message: string;
        data: DeviceStation[];
    }>;
    findAllDevicesByOrganization(idOrganization: number): Promise<{
        error: boolean;
        message: string;
        data: DeviceStation[];
    }>;
    createDeviceInStation(createDeviceStationDto: createDeviceStationDto, device: any): Promise<ServerMessage>;
    validarNombreSerial(device: any): Promise<Device>;
    deleteDeviceInStation(idDevice: number): Promise<ServerMessage>;
    findSupervisorList(idOrganization: number): Promise<{
        error: boolean;
        message: string;
        data: User[];
    }>;
}
