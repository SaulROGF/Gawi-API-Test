import { DataloggerHistory } from './../../../../models/dataloggerHistory.entity';
import { User } from './../../../../models/user.entity';
import { ServerMessage } from '../../../../classes/ServerMessage.class';
import { State } from '../../../../models/state.entity';
import { Device } from '../../../../models/device.entity';
import { Organization } from '../../../../models/organization.entity';
import { DevicesService } from '../../clients/devices/devices.service';
import { WaterHistory } from '../../../../models/waterHistory.entity';
import { GasHistory } from '../../../../models/gasHistory.entity';
import { Apn } from '../../../../models/apn.entity';
import { Logger } from 'winston';
import { FacturApiService } from '../../../../modules/global/factur-api/factur-api.service';
import { NaturalGasHistory } from '../../../../models/naturalGasHistory.entity';
export declare class AdministratorService {
    private devicesService;
    private facturapiService;
    private readonly userRepository;
    private readonly organizationRepository;
    private readonly gasHistoryRepository;
    private readonly stateRepository;
    private readonly deviceRepository;
    private readonly waterHistoryRepository;
    private readonly dataloggerHistoryRepository;
    private readonly naturalGasHistoryRepository;
    private readonly apnRepository;
    private readonly logger;
    constructor(devicesService: DevicesService, facturapiService: FacturApiService, userRepository: typeof User, organizationRepository: typeof Organization, gasHistoryRepository: typeof GasHistory, stateRepository: typeof State, deviceRepository: typeof Device, waterHistoryRepository: typeof WaterHistory, dataloggerHistoryRepository: typeof DataloggerHistory, naturalGasHistoryRepository: typeof NaturalGasHistory, apnRepository: typeof Apn, logger: Logger);
    getHomeAdminData(): Promise<ServerMessage>;
    getAllAccountUsersData(): Promise<ServerMessage>;
    getOrganizationClientsAdminData(idOrganization: number): Promise<ServerMessage>;
    getClientProfileData(idUser: number, organization: number, idRole: number): Promise<ServerMessage>;
    getOrganizationUsersAdminData(idOrganization: number, idRole: number): Promise<ServerMessage>;
    createUser(userAdminData: User, newUserData: User): Promise<ServerMessage>;
    updateUser(userAdminData: User, newUserData: User): Promise<ServerMessage>;
    deleteUser(idOrganization: number, idUser: number): Promise<ServerMessage>;
    getAllDevicesList(organization: number): Promise<ServerMessage>;
    getAllOrganizationDevicesList(idOrganization: number): Promise<ServerMessage>;
    getAllHistoryNaturalGasDeviceData(query: {
        idDevice: number;
        fromDate: Date;
        toDate: Date;
        period: number;
        serialNumbersExtraDevices: string[];
    }): Promise<ServerMessage>;
    getQueryHistoryFromTONaturalGasDeviceData(query: {
        idDevice: number;
        fromDate: Date;
        toDate: Date;
    }): Promise<ServerMessage>;
    getAllHistoryWaterDeviceData(query: {
        idDevice: number;
        fromDate: Date;
        toDate: Date;
        period: number;
        serialNumbersExtraDevices: string[];
    }): Promise<ServerMessage>;
    getQueryHistoryFromTOWaterDeviceData(query: {
        idDevice: number;
        fromDate: Date;
        toDate: Date;
    }): Promise<ServerMessage>;
    getQueryHistoryFromTOGasDeviceData(query: {
        idDevice: number;
        fromDate: Date;
        toDate: Date;
    }): Promise<ServerMessage>;
    getAllHistoryGasDeviceData(query: {
        idDevice: number;
        fromDate: Date;
        toDate: Date;
        period: number;
    }): Promise<ServerMessage>;
    getAllHistoryLoggerDeviceData(query: {
        idDevice: number;
        fromDate: Date;
        toDate: Date;
    }): Promise<ServerMessage>;
    getQueryHistoryFromTOLoggerDeviceData(query: {
        idDevice: number;
        fromDate: Date;
        toDate: Date;
    }): Promise<ServerMessage>;
    updateApnDeviceData(updatedData: {
        idDevice: number;
        idApn: number;
    }): Promise<ServerMessage>;
    unlockDeviceToBeAssigned(updatedData: {
        idDevice: number;
    }): Promise<ServerMessage>;
    getGasDeviceAlerts(client: User, idDevice: number, period: number): Promise<ServerMessage>;
    getWaterDeviceAlerts(clientData: any, idDevice: number, period: number): Promise<ServerMessage>;
    getOrganizationsListData(): Promise<ServerMessage>;
    getOrganizationsData(): Promise<ServerMessage>;
    deviceAssignments(data: {
        serialNumber: string;
        type: number;
        idOrganization: number;
    }[]): Promise<ServerMessage>;
    getOrganizationAdmin(idOrganization: number): Promise<ServerMessage>;
    getOrganizationAdminChoices(choice: string): Promise<ServerMessage>;
    createOrganization(logo: any, body: any): Promise<ServerMessage>;
    moveRequestFile(actualPathName: string, newName: string, idOrganization: number): Promise<ServerMessage>;
    updateOrganizationData(logo: any, body: any): Promise<ServerMessage>;
    deleteOrganization(idOrganization: number): Promise<ServerMessage>;
    getOnlyDate(dateToFix: Date): string;
}
