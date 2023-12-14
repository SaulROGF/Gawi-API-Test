import { OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
declare class SessionData {
    type: number;
    userName: string;
    extraData: any;
    constructor();
}
export declare class DashboardCalibrationGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    sessionsConnected: Map<string, SessionData>;
    serials: string[];
    maxMeasures: number;
    server: Server;
    constructor();
    afterInit(): void;
    handleConnection(client: Socket): void;
    handleDisconnect(client: Socket): void;
    connectCalibratorClient(client: Socket, dataPorts: any): void;
    sendPatternCalibratorSerial(client: Socket, data: {
        measure: number;
        date: Date;
    }): void;
    getProgress(client: Socket, measureOfM: any): void;
    setDoingCalibrationProcess(client: Socket, dataToSet: {
        port: number;
        pattern: [
            {
                measure: number;
                date: string;
            }
        ];
        measure: [
            {
                measure: number;
                date: string;
            }
        ];
    }): void;
    calibrationStartedAlert(data: SessionData, client: Socket): void;
    successCalibrationProcess(data: {
        port: number;
        gain: number;
        offset: number;
        error: number;
        isOK: boolean;
    }, client: Socket): void;
    calibrationSopedAlert(data: SessionData, client: Socket): void;
    connectWebClient(data: SessionData, client: Socket): void;
    startCalibration(data: SessionData, client: Socket): void;
    stopCalibration(data: SessionData, client: Socket): void;
    checkTerminalConected(): void;
    checkWebClientConected(): boolean;
}
export {};
