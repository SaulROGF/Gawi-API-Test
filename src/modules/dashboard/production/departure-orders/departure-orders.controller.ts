// generales
import { Body, Controller, Get, Post, Param, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { DepartureOrdersService } from './departure-orders.service';
// middlewares
import { RoleProductionGuard } from './../../../../middlewares/roles.guard';
// dto y transferencia de datos
import { ServerMessage } from './../../../../classes/ServerMessage.class';


@Controller('production/departure-orders')
export class DepartureOrdersController {

    /**
     * Constructor
     * @param departureOrdersService servicio injectado de las ordenes de salida
     */
    constructor(
        private readonly departureOrdersService: DepartureOrdersService,
    ) { }

    /**
     * Obtener todas las organizaciones contenidas en la base de datos
     * @param req detalles de la solicitud del cliente
     * @returns dato provisto del servicio invocado 
     */
    @Get('get-all-organizations')
    @UseGuards(AuthGuard(), RoleProductionGuard)
    async getAllOrganizationsEndpoint(@Request() req: any): Promise<ServerMessage> {
        return await this.departureOrdersService.getAllOrganizations();
    }

    /**
     * Obtener todos los dispositivos que esten en almacen
     * @param req detalles de la solicitud del cliente
     * @returns  suma de todos los dispositivos que esten en almacen
     */
    @Get('get-devs-in-stock')
    @UseGuards(AuthGuard(), RoleProductionGuard)
    async getDevicesInStockEndpoint(@Request() req: any): Promise<ServerMessage> {
        return await this.departureOrdersService.getDevicesInStock();
    }

    /**
     * Crear una orden de salida
     * @param body información de la orden de salida
     * @returns confirmación de la creación de la orden 
     */
    @Post('create-order')
    @UseGuards(AuthGuard(), RoleProductionGuard)
    async createDepartureorderEndpoint(@Request() req: any, @Body() body: any): Promise<ServerMessage> {
        return await this.departureOrdersService.createDepartureOrder(req.user, body);
    } 

    /**
     * Obtener todas las ordenes de salida creadas en el sistema
     * @param req detalles de la solicitud del cliente
     * @returns todas las ordenes de salida creadas en el sistema
     */
    @Get('get-all-orders')
    @UseGuards(AuthGuard(), RoleProductionGuard)
    async getAllOrdersEndpoint(@Request() req: any): Promise<ServerMessage> {
        return await this.departureOrdersService.getAllOrders();
    }

    /**
     * Obteneer los dispositivos totales en las ordenes generadas
     * @param req detalles de la solicitud del cliente
     * @returns los dispositivos totales en las ordenes generadas
     */
    @Get('get-devs-on-demmand')
    @UseGuards(AuthGuard(), RoleProductionGuard)
    async getDevicesOnDemmandEndpoint(@Request() req: any): Promise<ServerMessage> {
        return await this.departureOrdersService.getDevicesOnDemmand();
    }

    /**
     * Cancelar una órden de salida
     * @param idDepartureOrder id de la órden de salida
     * @returns confirmación de éxito
     */
    @Get('cancel-order/:idDepartureOrder')
    @UseGuards(AuthGuard(), RoleProductionGuard)
    async cancelDepartureOrderEndpoint(
        @Param('idDepartureOrder') idDepartureOrder: number,
    ): Promise<ServerMessage>{
        return await this.departureOrdersService.cancelDepartureOrder(idDepartureOrder);
    }

    /**
     * Marcar como finalizada una órden de salida
     * @param idDepartureOrder id de la órden de salida
     * @returns confirmación de éxito
     */
    @Get('complete-order/:idDepartureOrder')
    @UseGuards(AuthGuard(), RoleProductionGuard)
    async completeDepartureOrderEndpoint(
        @Param('idDepartureOrder') idDepartureOrder: number,
    ): Promise<ServerMessage>{
        return await this.departureOrdersService.completeDepartureOrder(idDepartureOrder);
    }

}
