import { Controller, Get, Req, Post, Body, UseGuards } from '@nestjs/common';
import { AdminDataService } from './admin-data.service';
import { AuthGuard } from '@nestjs/passport';
import { ServerMessage } from './../../../../classes/ServerMessage.class';
import { RoleAdminGuard } from './../../../../middlewares/roles.guard';

@Controller('administrator/admin-data')
export class AdminDataController {
  constructor(
    private readonly adminDataService: AdminDataService,
  ) {}

  /**
   *
   */
   @Get('get-admin-settings-data')
   @UseGuards(AuthGuard(), RoleAdminGuard)
   async getAdminAccountData(@Req() req: any) : Promise<ServerMessage> {
     return await this.adminDataService.getAdminAccountData(req.user);
   }

  /**
   *
   */
  @Post('update-admin-profile-data')
  @UseGuards(AuthGuard(), RoleAdminGuard)
  async updateAdminAccountData(@Req() req: any, @Body() body: any) : Promise<ServerMessage> {
    return await this.adminDataService.updateAdminAccountData( req.user, body );
  }

  /* APN CATALOG */

  /**
   *
   */
   @Get('get-apn-list')
   @UseGuards(AuthGuard(), RoleAdminGuard)
   async getApnList(@Req() req: any) : Promise<ServerMessage> {
     return await this.adminDataService.getApnList(req.user.idOrganization);
   }

   /**
    *
    */
    @Post('create-new-apn')
    @UseGuards(AuthGuard(), RoleAdminGuard)
    async createNewApn(@Req() req: any, @Body() body: any) : Promise<ServerMessage> {
      return await this.adminDataService.createNewApn( body );
    }

    /**
     *
     */
     @Post('update-apn')
     @UseGuards(AuthGuard(), RoleAdminGuard)
     async updateAPNAdmin(@Req() req: any, @Body() body: any) : Promise<ServerMessage> {
       return await this.adminDataService.updateAPNAdmin( body );
     }

     /**
      *
      */
      @Post('delete-apn')
      @UseGuards(AuthGuard(), RoleAdminGuard)
      async deleteAPNAdmin(@Req() req: any, @Body() body: any) : Promise<ServerMessage> {
        return await this.adminDataService.deleteAPNAdmin( body );
      }
}
