import { Controller, Get, Post, Body } from '@nestjs/common';
import { ServerMessage } from './../../../classes/ServerMessage.class';
import { PublicService } from './public.service';
import { RealIP } from 'nestjs-real-ip';

@Controller('public')
export class PublicController {
  constructor(private readonly publicService: PublicService) {}

  /**
   *
   */
  @Post('reset-password')
  public async resetPassword(@Body() body: any): Promise<ServerMessage>  {
    return await this.publicService.resetPassword(body);
  }

  /**
   *
   */
  @Post('generate-recovery-email')
  public async generateRecoveryEmailEndpoint(@Body() body: any): Promise<ServerMessage>  {
    const ans = await this.publicService.generateRecoveryEmail(body);
    console.log("</>", ans);
    return ans;
  }

  /**
   *
   */
  @Post('create-client')
  public async createClient(@RealIP() ip: string, @Body() body: any): Promise<ServerMessage> {
    return await this.publicService.createClient(body, ip);
  }
}
