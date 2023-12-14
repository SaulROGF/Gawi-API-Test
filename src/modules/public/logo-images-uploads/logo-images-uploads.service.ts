import { State } from './../../../models/state.entity';
import { Injectable, Inject } from '@nestjs/common';
// import * as fs from 'fs';
// import * as compress_images from 'compress-images';
import { Sequelize } from 'sequelize';
import { ServerMessage } from '../../../classes/ServerMessage.class';
import { Town } from '../../../models/town.entity';
import { Organization } from '../../../models/organization.entity';

@Injectable()
export class LogoImagesUploadsService {

    constructor(
        // private mailCenterService: EmailCenterService,
        // Es una manera de dar de alta el repositorio de la tabla de usuarios
        @Inject('OrganizationRepository') private readonly organizationRepository: typeof Organization,
    ) { }


    async downloadLogoFromOrganization(idOrganization: string): Promise<ServerMessage> {
        try {
            let organization: Organization = await this.organizationRepository.findOne<Organization>({
                where: {
                    idOrganization: idOrganization,
                }
            });

            return new ServerMessage(false, "datos obtenidos correctamente", {
                filename: organization.logoUrl.replace("storage/logos/orgs/", ""),
                path: organization.logoUrl,
            });
        } catch(error) {
            return new ServerMessage(true, "ha ocurrido un error", error);
        }

    }

    async compressImageLogoFile(logoFileName: string/* , INPUT_path_to_your_images: string */): Promise<ServerMessage> {
        return new Promise(async (resolve, reject) => {
            if (
                logoFileName == undefined ||
                logoFileName == null
            ) {
                resolve(new ServerMessage(true, "Campos inválidos", {}));
            }

            try {
                // Con esto se borran imágenes 
                // fs.unlink(statistic.input, (err) => {
                //     if (err) {
                //         console.log(err);
                        
                //         return new ServerMessage(true, "Error eliminando", {});
                //     }else{
    
                //         console.log('successfully compressed and deleted ' + statistic.input);
                //         return new ServerMessage(false, "Slider comprimido con éxito", {});
                //     }
                // });
                
                let indexPoint: number = logoFileName.indexOf(".");
                let idOrganization = logoFileName.substr(0,indexPoint);
                
                let organizationForUpdate: Organization = await this.organizationRepository.findOne<Organization>({
                    where: {
                        idOrganization: idOrganization
                    }
                });

                if (!organizationForUpdate) {
                    resolve(new ServerMessage(true, "Organizacion no disponible", {}));
                }
                
                organizationForUpdate.logoUrl = 'logo-images-uploads/logo-organization-image/' + idOrganization;
                await organizationForUpdate.save();
                resolve(new ServerMessage(false, "Logo actualizado", {}));

            } catch (error) {
                resolve(new ServerMessage(true, "Error comprimiendo imagen", error));
            }
        });
    }

    async deleteBannerById(idAdsBanner: string) : Promise<any> {
        return new Promise(async (resolve,reject)=>{
            // let bannerForDelete : AdsBanner =  await this.adsBannerRepository.findOne<AdsBanner>({
            //     where: {
            //         idAdsBanner: idAdsBanner
            //     }
            // });

            // if(bannerForDelete == null){
            //     resolve( new ServerMessage(true , "El banner no esta disponible",{}) );
            // }
            
            // fs.unlink('storage/banners/'+bannerForDelete.idAdsBanner+'.jpg' , async (error) => {
            //     if (error) {
            //         resolve( new ServerMessage(true,"El sticker no existe.",{}) );
            //     }else{
            //         try {
            //             bannerForDelete.route = "";
            //             await bannerForDelete.save();

                        
            
            //             resolve( new ServerMessage(false , "Se elimino correctamente el banner "+ bannerForDelete.idAdsBanner,bannerForDelete) );
            //         } catch (error) {
            //             resolve( new ServerMessage(true , "Error eliminando el banner",error) );
            //         }
            //     };
            // });
        });
    }
}