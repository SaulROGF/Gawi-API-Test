// generales
import { Controller, Get, Post, UseGuards, UseInterceptors, UploadedFiles, Param, Res, Req } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import * as path from 'path';
import * as multer from 'multer';
import * as fs from 'fs';
// DTO's y roles
import { RoleAdminGuard } from './../../../middlewares/roles.guard';
import { ServerMessage } from './../../../classes/ServerMessage.class';
import { AuthGuard } from '@nestjs/passport';
// servicios
import { LogoImagesUploadsService } from './logo-images-uploads.service';
import { RoleOrganizationAdminGuard } from './../../../middlewares/roles.guard';



class ImgUtils {
    /**
     * filtrar el tipo de archivo 
     */
    static pngFileFilter = (req: any, file: any, callback: any) => {
        let ext = path.extname(file.originalname);
        if (ext !== '.png')
        {
            req.fileValidationError = 'Invalid file type';
            return callback(new Error('Invalid file type'), false);
        }
        return callback(null, true);
    }

    /**
     * reasigna los valores para guardar la imagen, si no existe la carpeta la crea 
     */
    static storageLogos = multer.diskStorage({
        destination: function (req: any, file: any, cb: any)
        {
            let storagePath: string = "./storage/logos/";
            if  (!fs.existsSync('./storage/')) fs.mkdirSync('./storage/');
            if  (!fs.existsSync(storagePath)) fs.mkdirSync(storagePath);
            if ( !fs.existsSync(storagePath + req.user.dataValues.idOrganization + '/'))
                fs.mkdirSync(storagePath + req.user.dataValues.idOrganization + '/');
            cb  (null, storagePath + req.user.dataValues.idOrganization + '/');
        },
        filename: function (req: any, file: any, cb: any) {
            cb(null, file.originalname);
        }
    });
}



@Controller('logo-images-uploads')
export class LogoImagesUploadsController {
    constructor(
        private readonly logoImagesUploadsService: LogoImagesUploadsService
    ) { }

    /**
     * Crea y guarda la imagen de la marca y su directorio
     */
    @Post('add-logo-image-file')
    // @UseGuards(AuthGuard(), RoleAdminGuard)
    @UseGuards(AuthGuard(), RoleOrganizationAdminGuard)
    @UseInterceptors(FilesInterceptor("files[]", 1, { fileFilter: ImgUtils.pngFileFilter, storage: ImgUtils.storageLogos }))
    async addLogoImageFileUpload(
        @UploadedFiles() images: any,
        @Req() req: any
    ): Promise<ServerMessage> {
        return await this.logoImagesUploadsService.compressImageLogoFile(
            images[0].originalname,
            /* 'storage/logos/' + req.user.dataValues.idOrganization + '/' */
        );
    }

    /**
     * URL que proporciona las imágenes de los sliders del home 
     */
    @Get('logo-organization-image/:idOrganization')
    async serveLogoOrganizationImage(
        @Param('idOrganization') idOrganization: String,
        @Res() res: any
        ): Promise<any> {
            try {
            res.sendFile(idOrganization + '.png', {root: 'storage/logos/' + idOrganization + '/'},
                (err) => {
                    if (err) {
                        return new ServerMessage(true, "Imagen slider " + idOrganization + " no encontrada.", err);
                    } else {
                        return new ServerMessage(false, "Imagen slider " + idOrganization + " enviada.", {});
                    }
                }
            );
        } catch (error) {
            return new ServerMessage(true, "Imagen slider " + idOrganization + " no encontrada.", error);
        }
    }
}



// var logoasPath = './storage/logos/';

// const pngFileFilter = (req, file, callback) => {
//     let ext = path.extname(file.originalname);
//     if (ext !== '.png') {
//         req.fileValidationError = 'Invalid file type';
//         return callback(new Error('Invalid file type'), false);
//     }
//     return callback(null, true);
// }

// //Reasigna los valores para guardar la imagen (carpeta y si no existe la crea)
// var storageLogos = multer.diskStorage({
//     destination: function (req, file, cb) {
//         if (!fs.existsSync('./storage/') ){
//             fs.mkdirSync('./storage/');
//         }
//         if (!fs.existsSync(logoasPath) ){
//             fs.mkdirSync(logoasPath);
//         }
//         if (!fs.existsSync(logoasPath+req.user.dataValues.idOrganization+'/') ){
//             fs.mkdirSync(logoasPath+req.user.dataValues.idOrganization+'/');
//         }
//         cb(null, logoasPath+req.user.dataValues.idOrganization+'/')
//     },
//     filename: function (req, file, cb) {
//         cb( null, file.originalname );
//     }
// });

    //Elimina un banner por id
    /* @Get('delete-banner/:idAdsBanner')
    @UseGuards(AuthGuard())
    async deleteSliderById(@Param('idAdsBanner') idAdsBanner: string): Promise<any> {
        return await this.logoImagesUploadsService.deleteBannerById(idAdsBanner);
    } */
