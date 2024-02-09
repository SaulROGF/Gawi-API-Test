import { Controller, Request, Get, Post, Body, UseGuards, Param, Req, UseInterceptors, UploadedFiles } from '@nestjs/common';
import { AdministratorService } from './administrator.service';
import { AuthGuard } from '@nestjs/passport';
import { ServerMessage } from '../../../../classes/ServerMessage.class';
import { RoleAdminGuard } from '../../../../middlewares/roles.guard';
import { FilesInterceptor } from '@nestjs/platform-express';
import { RoleOrganizationAdminGuard } from '../../../../middlewares/roles.guard';

/**
 * dependencias para el almacenamiento de los logos de las organizaciones
 */
import * as path from "path";
import * as multer from "multer";
import * as fs from "fs";


class ImgUtils {
    /**
     * filtrar el tipo de archivo 
     */
    static pngFileFilter = (req: any, file: any, callback: any) => {
        let ext = path.extname(file.originalname);
        if (ext !== '.png') {
            req.fileValidationError = 'Invalid file type';
            return callback(new Error('Invalid file type'), false);
        }
        return callback(null, true);
    }

    /**
     * reasigna los valores para guardar la imagen, si no existe la carpeta la crea 
     */
    static storageNewLogos = multer.diskStorage({
        destination: function (req: any, file: any, cb: any) {
            let storagePath: string = "./storage/logos/temp/";
            if (!fs.existsSync('./storage/')) fs.mkdirSync('./storage/');
            if (!fs.existsSync(storagePath)) fs.mkdirSync(storagePath);
            cb(null, storagePath);
        },
        filename: function (req: any, file: any, cb: any) {
            cb(null, file.originalname);
        }
    });

    /**
     * reasigna los valores para guardar la imagen, si no existe la carpeta la crea 
     */
    static storageUpdateLogos = multer.diskStorage({
        destination: function (req: any, file: any, cb: any) {
            let indexDot = ( file.originalname as string ).indexOf(".");
            let idOrganization = ( file.originalname as string ).substr(0,indexDot)
            let storagePath: string = "./storage/logos/"+idOrganization+"/";
            if (!fs.existsSync('./storage/')) fs.mkdirSync('./storage/');

            if (!fs.existsSync(storagePath)) fs.mkdirSync(storagePath);
            cb(null, storagePath);
        },
        filename: function (req: any, file: any, cb: any) {
            cb(null, file.originalname);
        }
    });
}


@Controller('administrator')
export class AdministratorController {

    constructor(
        private readonly administratorService: AdministratorService
    ) { }

    /**
     * 
     */
    @Get('get-home-admin')
    @UseGuards(AuthGuard(), RoleAdminGuard)
    getHomeAdminData(@Request() req: any): Promise<ServerMessage> {
        return this.administratorService.getHomeAdminData();//7
    }

    /**
     * 
     */
    @Get('get-all-account-users-data')
    // @UseGuards(AuthGuard(),RoleAdminGuard)
    @UseGuards(AuthGuard(), RoleOrganizationAdminGuard)
    getAllAccountUsersData(@Request() req: any): Promise<ServerMessage> {
        return this.administratorService.getAllAccountUsersData();//All    
    }

    /**
     * 
     */
    @Get('get-clients-users-data')
    // @UseGuards(AuthGuard(),RoleAdminGuard)
    @UseGuards(AuthGuard(), RoleOrganizationAdminGuard)
    getOrganizationClientsAdminData(@Request() req: any): Promise<ServerMessage> {
        return this.administratorService.getOrganizationClientsAdminData(req.user.idOrganization);//7
    }

    /**
     * 
     */
    @Get('get-client-profile-data/:idUser')
    @UseGuards(AuthGuard(), RoleOrganizationAdminGuard)
    getClientProfileData(@Request() req: any, @Param('idUser') idUser: number): Promise<ServerMessage> {
        return this.administratorService.getClientProfileData(idUser, req.user.idOrganization,req.user.idRole);
    }

    /**
     * 
     */
    @Get('get-technician-users-data')
    @UseGuards(AuthGuard(), RoleAdminGuard)
    getOrganizationTechnicianAdminData(@Request() req: any): Promise<ServerMessage> {
        return this.administratorService.getOrganizationUsersAdminData(req.user.idOrganization, 6);
    }

    /**
     * 
     */
    @Get('get-counters-users-data')
    @UseGuards(AuthGuard(), RoleAdminGuard)
    getOrganizationCountersAdminData(@Request() req: any): Promise<ServerMessage> {
        return this.administratorService.getOrganizationUsersAdminData(req.user.idOrganization, 4);
    }

    /**
     * 
     */
    @Get('get-warehouse-users-data')
    @UseGuards(AuthGuard(), RoleAdminGuard)
    getOrganizationWarehousesAdminData(@Request() req: any): Promise<ServerMessage> {
        return this.administratorService.getOrganizationUsersAdminData(req.user.idOrganization, 3);
    }

    /**
     * 
     */
    @Post('create-user')
    @UseGuards(AuthGuard(), RoleAdminGuard,)
    createUser(@Request() req, @Body() body) {
        return this.administratorService.createUser(req.user, body);
    }

    /**
     * 
     */
    @Post('update-user')
    @UseGuards(AuthGuard(), RoleAdminGuard,)
    updateUser(@Request() req, @Body() body) {
        return this.administratorService.updateUser(req.user, body);
    }

    /**
     * 
     */
    @Get('delete-user/:idUser')
    @UseGuards(AuthGuard(), RoleAdminGuard)
    deleteUser(@Request() req: any, @Param('idUser') idUser: number): Promise<ServerMessage> {
        return this.administratorService.deleteUser(req.user.idOrganization, idUser);
    }

    /**
     * 
     */
    @Get('get-all-devices-list')
    @UseGuards(AuthGuard(), RoleAdminGuard)
    getAllDevicesList(@Request() req: any): Promise<ServerMessage> {
        return this.administratorService.getAllDevicesList(req.user.idOrganization);
    }

    /**
     * 
     */
    @Get('get-all-organization-devices-list/:idOrganization')
    // @UseGuards(AuthGuard(),RoleAdminGuard)
    @UseGuards(AuthGuard(), RoleOrganizationAdminGuard) // RoleAdminGuard
    getAllOrganizationDevicesList(/* @Request() req: any, */@Param('idOrganization') idOrganization: number): Promise<ServerMessage> {
        return this.administratorService.getAllOrganizationDevicesList(idOrganization);
    }

    /**
     * 
     */
    @Post('get-all-history-natural-gas-device')
    @UseGuards(AuthGuard(), RoleAdminGuard)
    getAllHistoryNaturalGasDeviceData(/* @Request() req: any, */@Body() body: any): Promise<ServerMessage> {
        return this.administratorService.getAllHistoryNaturalGasDeviceData(body);
    }

    /**
     * 
     */
    @Post('get-all-history-water-device')
    @UseGuards(AuthGuard(), RoleAdminGuard)
    getAllHistoryWaterDeviceData(/* @Request() req: any, */@Body() body: any): Promise<ServerMessage> {
        return this.administratorService.getAllHistoryWaterDeviceData(body);
    }

    /**
     * 
     */
    @Post('get-all-history-gas-device')
    @UseGuards(AuthGuard(), RoleOrganizationAdminGuard)
    getAllHistoryGasDeviceData(/* @Request() req: any, */@Body() body: any): Promise<ServerMessage> {
        return this.administratorService.getAllHistoryGasDeviceData(body);
    }

    /**
     * 
     */
    @Post('get-all-history-logger-device')
    // @UseGuards(AuthGuard(),RoleAdminGuard)
    @UseGuards(AuthGuard(), RoleOrganizationAdminGuard)
    getAllHistoryLoggerDeviceData(/* @Request() req: any, */@Body() body: any): Promise<ServerMessage> {
        return this.administratorService.getAllHistoryLoggerDeviceData(body);
    }

    /**
     * 
     */
    @Post('update-device-apn')
    @UseGuards(AuthGuard(), RoleAdminGuard)
    updateApnDeviceData(/* @Request() req: any , */ @Body() body: any): Promise<ServerMessage> {
        return this.administratorService.updateApnDeviceData(body);
    }

    @Post('unlock-assigned-device')
    @UseGuards(AuthGuard(), RoleAdminGuard)
    unlockDeviceToBeAssigned(/* @Request() req: any , */ @Body() body: any): Promise<ServerMessage> {
        return this.administratorService.unlockDeviceToBeAssigned(body);
    }
    /**
     *
     */
    @Get('get-gas-device-alerts/:idDevice/:period')
    @UseGuards(AuthGuard(), RoleAdminGuard)
    async getGasDeviceAlertsEndpoint(
        @Param('idDevice') idDevice: number,
        @Param('period') period: number,
        @Req() req: any,
    ): Promise<ServerMessage> {
        return await this.administratorService.getGasDeviceAlerts(req.user, idDevice, period);
    }

    /**
     *
     */
    @Get('get-water-device-alerts/:idDevice/:period')
    @UseGuards(AuthGuard(), RoleAdminGuard)
    async getWaterDeviceAlertsEndpoint(
        @Param('idDevice') idDevice: number,
        @Param('period') period: number,
        @Req() req: any,
    ): Promise<ServerMessage> {
        return await this.administratorService.getWaterDeviceAlerts(req.user, idDevice, period);
    }

    /**
     * 
     */
    @Get('get-organizations-list-data/')
    @UseGuards(AuthGuard(), RoleAdminGuard)
    getOrganizationDataEndpoint(@Request() req: any): Promise<ServerMessage> {
        return this.administratorService.getOrganizationsListData(/* req.user.idOrganization */);
    }

    /**
     * 
     */
    @Get('get-organizations-data/')
    @UseGuards(AuthGuard(), RoleAdminGuard)
    getOrganizationsData(@Request() req: any): Promise<ServerMessage> {
        return this.administratorService.getOrganizationsData();
    }

    /**
     *
     */
    @Post("manual-assignments")
    @UseGuards(AuthGuard(), RoleAdminGuard)
    async deviceAssignments(
        @Body() body: any,
    ): Promise<ServerMessage> {
        return await this.administratorService.deviceAssignments(body);
    }

    /**
     *
     */
    @Get('get-organization-admin/:idOrganization')
    @UseGuards(AuthGuard(), RoleAdminGuard)
    async getOrganizationAdminEndpoint(
        @Param('idOrganization') idOrganization: number,
    ): Promise<ServerMessage> {
        return await this.administratorService.getOrganizationAdmin(idOrganization);
    }

    /**
     * 
     */
    @Get('get-organization-admin-choices/:choice')
    @UseGuards(AuthGuard(), RoleAdminGuard)
    getOrganizationAdminChoicesEndpoint(
        @Param('choice') choice: string,
    ): Promise<ServerMessage> {
        return this.administratorService.getOrganizationAdminChoices(choice);
    }



    /**
     * @TODO cambiar al controlador de admin/organization
     */
    @Post('create-organization/')
    @UseGuards(AuthGuard(), RoleAdminGuard)
    @UseInterceptors(FilesInterceptor("logo", 1, { fileFilter: ImgUtils.pngFileFilter, storage: ImgUtils.storageNewLogos }))
    async createOrganizationEndpoint(
        @UploadedFiles() logos: any,
        @Body() body: any
    ): Promise<ServerMessage> {


        return await this.administratorService.createOrganization(logos[0], body);
    }

    /**
     * @TODO cambiar al controlador de admin/organization
     */
    @Post('update-organization-data/')
    @UseGuards(AuthGuard(), RoleAdminGuard)
    @UseInterceptors(FilesInterceptor("logo", 1, { fileFilter: ImgUtils.pngFileFilter, storage: ImgUtils.storageUpdateLogos }))
    async updateOrganizationDataEndpoint(
        @UploadedFiles() logos: any,
        @Body() body: any
    ): Promise<ServerMessage> {
        return await this.administratorService.updateOrganizationData(logos[0], body);
    }

    /**
     * @TODO cambiar al controlador de admin/organization
     */
    @Get('delete-organization/:idOrganization')
    @UseGuards(AuthGuard(), RoleAdminGuard)
    async deleteOrganizationEndpoint(
        @Param('idOrganization') idOrganization: number,
    ): Promise<ServerMessage> {
        return await this.administratorService.deleteOrganization(idOrganization);
    }
}
