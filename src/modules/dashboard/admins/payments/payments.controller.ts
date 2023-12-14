import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ServerMessage } from '../../../../classes/ServerMessage.class';
import { RoleAdminGuard } from '../../../../middlewares/roles.guard';
import { PaymentsService } from './payments.service';

@Controller('administrator/payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) { }
 
  /**
  *
  */
  @Post("manual-subscriptions-activations")
  @UseGuards(AuthGuard(), RoleAdminGuard)
  async manualSubscriptionsActivations(
    @Body() body: any,
  ): Promise<ServerMessage> {
    return await this.paymentsService.manualSubscriptionsActivations(body);
  }

  /**
 *
 */
  @Post("get-subscription-payment-list")
  @UseGuards(AuthGuard(), RoleAdminGuard)
  async deleteCardEndpoint(
    @Body() body: any,
  ): Promise<ServerMessage> {
    return await this.paymentsService.paymentsListDeviceSubscription(body);
  }

  @Post('create-invoice')
  @UseGuards(AuthGuard(), RoleAdminGuard)
  createInvoice(/* @Request() req ,*/ @Body() body) {
    return this.paymentsService.createPaymentSubscriptionInvoice(body);
  }

  /**
    *
    */
  @Post("get-already-bills-list")
  @UseGuards(AuthGuard(), RoleAdminGuard)
  async getAlreadyBillsList(
    @Body() body: any,
  ): Promise<ServerMessage> {
    return await this.paymentsService.getAlreadyBillsList(body);
  }
}
