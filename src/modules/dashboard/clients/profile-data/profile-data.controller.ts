import { Controller, Get, Post, Body, Req, UseGuards, Param } from '@nestjs/common';
import { ProfileDataService } from './profile-data.service';
import { RoleClientGuard } from '../../../../middlewares/roles.guard';
import { AuthGuard } from '@nestjs/passport';
import { ServerMessage } from './../../../../classes/ServerMessage.class';

@Controller('clients/profile-data')
export class ProfileDataController {
  constructor(private readonly profileDataService: ProfileDataService) { }

  /**
   *
   */
  @Get('get-billing-info')
  @UseGuards(AuthGuard(), RoleClientGuard)
  async getBillingInfoEndpoint(@Req() req: any): Promise<ServerMessage> {
    return await this.profileDataService.getBillingInfoData(req.user);
  }

  /**
   *
   */
  @Post('update-billing-info')
  @UseGuards(AuthGuard(), RoleClientGuard)
  async updateBillingInfoEndpoint(
    @Body() body: any,
    @Req() req: any,
  ): Promise<ServerMessage> {
    return await this.profileDataService.updateBillingInfoData(req.user, body);
  }

  /**
   *
   */
  @Get('get-states-towns')
  @UseGuards(AuthGuard(), RoleClientGuard)
  async getTownsAndStatesEndpoint(@Req() req: any): Promise<ServerMessage> {
    return await this.profileDataService.retrieveTownsAndStates(
      req.user.idUser,
    );
  }

  /**
   *
   */
  @Post('update-town')
  @UseGuards(AuthGuard(), RoleClientGuard)
  async updateTownEndpoint(
    @Body() body: any,
    @Req() req: any,
  ): Promise<ServerMessage> {
    return await this.profileDataService.updateTownInClient(req.user, body);
  }

  /**
   *
   */
  @Get('delete-user-data')
  @UseGuards(AuthGuard(), RoleClientGuard)
  async deleteUserData(@Req() req: any): Promise<ServerMessage> {
    return await this.profileDataService.deleteUserData(req.user.idUser);
  }

  /**
   *
   */
  @Get('get-client-account-data')
  @UseGuards(AuthGuard(), RoleClientGuard)
  async getAdminAccountData(@Req() req: any): Promise<ServerMessage> {
    return await this.profileDataService.getClientAccountData(req.user.idUser);
  }

  /**
   *
   */
  @Post('update-client-name')
  @UseGuards(AuthGuard(), RoleClientGuard)
  async updateClientName(
    @Req() req: any,
    @Body() body: any,
  ): Promise<ServerMessage> {
    return await this.profileDataService.updateClientName(req.user, body);
  }

  /**
   *
   */
  @Post('update-client-phone')
  @UseGuards(AuthGuard(), RoleClientGuard)
  async updateClientPhone(
    @Req() req: any,
    @Body() body: any,
  ): Promise<ServerMessage> {
    return await this.profileDataService.updateClientPhone(req.user, body);
  }

  /**
   *
   */
  @Post('update-client-email')
  @UseGuards(AuthGuard(), RoleClientGuard)
  async updateClientEmail(
    @Req() req: any,
    @Body() body: any,
  ): Promise<ServerMessage> {
    return await this.profileDataService.updateClientEmail(req.user, body);
  }


  /**
   *
   */
  @Post("add-card")
  @UseGuards(AuthGuard(), RoleClientGuard)
  async addCardEndpoint(@Req() req: any, @Body() body: any): Promise<ServerMessage> {
    return await this.profileDataService.addCard(body, req.user);
  }


  /**
   *
   */
  @Post("delete-card")
  @UseGuards(AuthGuard(), RoleClientGuard)
  async deleteCardEndpoint(
    @Req() req: any,
    @Body() body: any,
  ): Promise<ServerMessage> {
    return await this.profileDataService.deleteCard(body, req.user);
  }


  /**
   *
   */
  @Get("get-all-cards")
  @UseGuards(AuthGuard(), RoleClientGuard)
  async getAllCardsEndpoint(
    @Req() req: any,
  ): Promise<ServerMessage> {
    return await this.profileDataService.getAllCards(req.user);
  }


  /**
   *
   */
  @Get("get-card/:idCard")
  @UseGuards(AuthGuard(), RoleClientGuard)
  async getCardEndpoint(
    @Req() req: any,
    @Param('idCard') idCard: number,
  ): Promise<ServerMessage> {
    return await this.profileDataService.getCard(idCard, req.user);
  }

  /**
   *
   */
  @Post("set-default-card")
  @UseGuards(AuthGuard(), RoleClientGuard)
  async setCardAsDefaultEndpoint(
    @Req() req: any,
    @Body() body: any,
  ): Promise<ServerMessage> {
    return await this.profileDataService.setCardAsDefault(body, req.user);
  }

  /**
   *
   */
  @Post("pay-device-subscription")
  @UseGuards(AuthGuard(), RoleClientGuard)
  async payDeviceSubscription(
    @Req() req: any,
    @Body() body: any,
  ): Promise<ServerMessage> {
    return await this.profileDataService.payDeviceSubscription( req.user.idUser, body );
  }

  /**
   *
   */
  @Get("get-payments-list")
  @UseGuards(AuthGuard(), RoleClientGuard)
  async getPaymentsList(
    @Req() req: any,
    @Body() body: any,
  ): Promise<ServerMessage> {
    return await this.profileDataService.getPaymentsList( req.user.idUser );
  }


  /**
   *
   */
  @Get("get-payment/:idPayment")
  @UseGuards(AuthGuard(), RoleClientGuard)
  async getPaymentDetails(
    @Req() req: any,
    @Param('idPayment') idHistoryPayments: number,
  ): Promise<ServerMessage> {
    return await this.profileDataService.getPaymentDetails(req.user.idUser,idHistoryPayments);
  }
}