import { ServerMessage } from './../../../classes/ServerMessage.class';
import { Controller, Request , Get, Post, Body, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from '../../../models/user.entity';
import { AuthGuard } from '@nestjs/passport';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('create-normal-user')
  public async createUser(@Body() body): Promise<ServerMessage> {
    return this.userService.createUser(body);
  }


  @Post('change-password')
  public async changePasswordEndpoint(@Body() body): Promise<ServerMessage> {
    return this.userService.changePassword(body);
  }
}
