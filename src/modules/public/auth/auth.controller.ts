import { AuthGuard } from '@nestjs/passport';
import {
  Controller,
  Request,
  Get,
  Post,
  Body,
  UseGuards,
  Param,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginUserDto } from '../user/dto/loginUser.dto';
import { ServerMessage } from '../../../classes/ServerMessage.class';
import { User } from '../../../models/user.entity';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async login(@Body() loginUserDto: LoginUserDto): Promise<ServerMessage> {
    return await this.authService.validateUserByPassword(loginUserDto);
  }

  @Post('store-notification-credentials')
  @UseGuards(AuthGuard())
  async storeNotificationsCredentialsEndpoint(
    @Body() credentials: any,
    @Request() req,
  ): Promise<ServerMessage> {
    return await this.authService.storeNotificationCredentials(
      credentials,
      req.user.idUser,
    );
  }

  @Post('disable-notifications')
  @UseGuards(AuthGuard())
  async disableNotificationsEndpoint(
    @Body() credentials: any,
  ) {
    return await this.authService.disableNotifications(credentials);
  }


  /**
   * This route will require successfully passing our default
   * auth strategy (JWT) in order to access the route
   * @param req
   * @returns
   */
  @Get('validate-token')
  @UseGuards(AuthGuard())
  async testAuthRoute(@Request() req) {
    //let user: User = req.user;
    //user.lastLoginDate = new Date();
    //await user.save();

    return new ServerMessage(false, 'Acceso a ruta de prueba correcto', {
      user: await this.authService.generateUserData(req.user),
    });
  }
}
