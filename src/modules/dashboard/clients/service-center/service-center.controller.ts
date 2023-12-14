import { Controller, Get, Post, Body, Req, UseGuards } from '@nestjs/common';
import { ServiceCenterService } from './service-center.service';
import { ServerMessage } from './../../../../classes/ServerMessage.class';
import { RoleClientGuard } from '../../../../middlewares/roles.guard';
import { AuthGuard } from '@nestjs/passport';

@Controller('clients/service-center')
export class ServiceCenterController {
  constructor(private readonly serviceCenterService: ServiceCenterService) {}

  /**
   *
   */
  @Get('retrieve-contacts')
  @UseGuards(AuthGuard(), RoleClientGuard)
  async homeEndpoint(@Req() req: any): Promise<ServerMessage> {
    return await this.serviceCenterService.retrieveContacts(req.user);
  }
}
