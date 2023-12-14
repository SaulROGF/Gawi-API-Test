import { User } from './../../../models/user.entity';
import {
    WebSocketGateway,
    WebSocketServer,
    SubscribeMessage,
    OnGatewayConnection,
    OnGatewayDisconnect,
    OnGatewayInit,
    MessageBody,
    WsResponse,
    ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

class SessionData {
    type : number; //0 = pyton , 1 = web 
    userName : string;
    extraData  : any;
    
    constructor(){
        this.type = -1;
        this.userName = "";
        this.extraData = {};
    }
}

@WebSocketGateway({ cors: true, path: '/calibrator' })
export class DashboardCalibrationGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    sessionsConnected: Map<string, SessionData>;

    serials: string[];
    maxMeasures: number;

    @WebSocketServer()
    server: Server;

    constructor() {
        this.sessionsConnected = new Map();
        this.serials = [];
        this.maxMeasures = 0;
    }
    //Funcion que se ejecuta cada que se inicializa correctamente el soket
    afterInit() {
        //console.log('Servidor de mensajes en linea');
        this.serials = [];
        this.maxMeasures = 0;
    }

    handleConnection(@ConnectedSocket() client: Socket) {
        // A client has connected
    }

    /////////////////////////////////////////////////////////
    handleDisconnect(@ConnectedSocket() client: Socket) {
        if ( this.sessionsConnected.has(client.id) == false ) {
            //Por alguna razon se entra aqui cada que la app se cierra aun si no se a conectado con la función
            //console.log("conexión sin usuario guardado");
        } else {
            let sesionData : SessionData = this.sessionsConnected.get(client.id);
            if(sesionData.type == 1){
                this.server.emit('web-client-disconnected');
                console.log("web de " + sesionData.userName + " desconectada");
            }else if(sesionData.type == 0){
                this.serials = [];
                this.maxMeasures = 0;
                this.server.emit('calibrator-client-disconnected');
                console.log("terminal desconectada");
            }
            this.sessionsConnected.delete(client.id);
        }
    }

    /* Recibir del pyton */
    @SubscribeMessage('connect-calibrator-client')
    connectCalibratorClient(@ConnectedSocket() client: Socket,@MessageBody() dataPorts: any) {
        if (this.sessionsConnected.has(client.id) == false) {
            let dataSession: SessionData = new SessionData();
            dataSession.type = 0;
            dataSession.userName = "Terminal de testeo";
            dataSession.extraData = {};
            this.serials = [];
            this.maxMeasures = 0;

            this.sessionsConnected.set(client.id, dataSession);

            console.log("Calibrador conectado");
        }
        
        this.serials = dataPorts.ports;
        this.maxMeasures = dataPorts.maxMeasures;

        this.checkTerminalConected();
        this.checkWebClientConected();
    }

    //Se recibe el puerto y progreso actual de la calibrada
    @SubscribeMessage('send-pattern-calibrator-serial')
    sendPatternCalibratorSerial(@ConnectedSocket() client: Socket, @MessageBody() data: { measure : number, date : Date}) {
        this.server.emit('update-pattern-calibrator-serial',data);
    }

    //Se recibe el puerto y progreso actual de la calibrada
    @SubscribeMessage('read-progress')
    getProgress(@ConnectedSocket() client: Socket, @MessageBody() measureOfM: any) {
        console.log(measureOfM);
        this.server.emit('update-recollection-progress',measureOfM);
    }
    @SubscribeMessage('set-doing-calibration-process')
    setDoingCalibrationProcess(@ConnectedSocket() client: Socket, @MessageBody() dataToSet: { 
        port: number, 
        pattern: [{ 
            measure: number, 
            date: string }],
        measure : [{ 
            measure: number, 
            date: string }]
        }) {
        this.server.emit('update-status-to-calibration-progress',dataToSet);
    }

    /* aviso del estado del proceso del calibrador desde el terminal*/
    @SubscribeMessage('calibration-started-alert')
    calibrationStartedAlert(@MessageBody() data: SessionData, @ConnectedSocket() client: Socket) {
        console.log("Proceso iniciado");
        this.server.emit('client-calibrator-started');
    }
    @SubscribeMessage('success-calibration-process')
    successCalibrationProcess(@MessageBody() data: { port : number, gain: number, offset: number, error: number,isOK : boolean }, @ConnectedSocket() client: Socket) {
        console.log(data);

        this.server.emit('client-success-calibration-process',data);
    }

    @SubscribeMessage('calibration-stopped-alert')
    calibrationSopedAlert(@MessageBody() data: SessionData, @ConnectedSocket() client: Socket) {
        console.log("Proceso parado");
        this.server.emit('client-calibrator-stopped');
    }
    ////////////////////////////////////////////////////////////////////////


    /* Recibir del web */
    @SubscribeMessage('set-web-client-online')
    connectWebClient(@MessageBody() data: SessionData, @ConnectedSocket() client: Socket) {
        console.log("web de " + data.userName + " conectada");
        
        this.sessionsConnected.set(client.id,data);
        this.checkTerminalConected();
        this.checkWebClientConected();
    }

    /* parar y detener el calibrador desde el cliente*/
    @SubscribeMessage('start-calibration')
    startCalibration(@MessageBody() data: SessionData, @ConnectedSocket() client: Socket) {
        console.log("Iniciando proceso");
        this.server.emit('start-calibration-process');
    }

    @SubscribeMessage('stop-calibration')
    stopCalibration(@MessageBody() data: SessionData, @ConnectedSocket() client: Socket) {
        console.log("Parando proceso");
        this.server.emit('stop-calibration-process');
    }

    checkTerminalConected(){
        let terminalConected = false;
        this.sessionsConnected.forEach(session =>{
            if(session.type == 0){
                terminalConected = true;
            }
        });

        if(terminalConected){
            console.log("terminal conectada");
            this.server.emit('client-calibrator-connected');

            if(this.checkWebClientConected()){ 
                console.log("mandando seriales");
                this.server.emit('set-client-calibrator-serials',{
                    serials : this.serials,
                    maxMeasure : this.maxMeasures,
                });
            }
        }else{
            console.log("sin calibrador conectado");
            
        }
    }

    checkWebClientConected() : boolean {
        let webConected = false;
        this.sessionsConnected.forEach(session =>{
            if(session.type == 1){
                webConected = true;
            }
        });

        if(webConected){
            console.log("web conectada");
            this.server.emit('web-client-connected');
        }else{
            console.log("sin web conectada");
            
        }

        return webConected;
    }
}