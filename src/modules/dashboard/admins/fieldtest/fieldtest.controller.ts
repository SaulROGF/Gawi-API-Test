import { Body, Controller, Delete, Get, Param, Post, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { FieldtestService } from './fieldtest.service';
import { AuthGuard } from '@nestjs/passport';
import { RoleAdminGuard } from 'src/middlewares/roles.guard';
import { FieldDeviceDto } from './dtos/fildDevice.dto';
import { ServerMessage } from 'src/classes/ServerMessage.class';

@Controller('fieldtest')
export class FieldtestController {

    constructor(
        private readonly fieldTestService: FieldtestService,
    ){}


    //TODO: Hacer get para obtener los medidores en lista de pruebas de campo
    @Get()
    @UseGuards(AuthGuard(), RoleAdminGuard)
    getDevicesInField(): any{
        return this.fieldTestService.getDevicesInField();
    }

    //TODO: Hacer post para registrar medidor en lista de campo pruebas
    @Post()
    @UseGuards(AuthGuard(), RoleAdminGuard)
    @UsePipes(new ValidationPipe())
    async addDeviceToFieldTable(@Body() fieldDeviceDto: FieldDeviceDto): Promise<ServerMessage>{
        return this.fieldTestService.saveDeviceInField(fieldDeviceDto);
    }

    @Delete(':serialNumbers') 
    @UseGuards(AuthGuard(), RoleAdminGuard)
    async removeDeviceToFieldTable(@Param() params): Promise<ServerMessage[]> {
        const serialNumbers: string = params.serialNumbers
        return await this.fieldTestService.deleteDeviceFromField(serialNumbers);
    }

    
}
