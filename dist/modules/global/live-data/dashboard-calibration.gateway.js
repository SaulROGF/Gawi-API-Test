"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DashboardCalibrationGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
class SessionData {
    constructor() {
        this.type = -1;
        this.userName = "";
        this.extraData = {};
    }
}
let DashboardCalibrationGateway = class DashboardCalibrationGateway {
    constructor() {
        this.sessionsConnected = new Map();
        this.serials = [];
        this.maxMeasures = 0;
    }
    afterInit() {
        this.serials = [];
        this.maxMeasures = 0;
    }
    handleConnection(client) {
    }
    handleDisconnect(client) {
        if (this.sessionsConnected.has(client.id) == false) {
        }
        else {
            let sesionData = this.sessionsConnected.get(client.id);
            if (sesionData.type == 1) {
                this.server.emit('web-client-disconnected');
                console.log("web de " + sesionData.userName + " desconectada");
            }
            else if (sesionData.type == 0) {
                this.serials = [];
                this.maxMeasures = 0;
                this.server.emit('calibrator-client-disconnected');
                console.log("terminal desconectada");
            }
            this.sessionsConnected.delete(client.id);
        }
    }
    connectCalibratorClient(client, dataPorts) {
        if (this.sessionsConnected.has(client.id) == false) {
            let dataSession = new SessionData();
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
    sendPatternCalibratorSerial(client, data) {
        this.server.emit('update-pattern-calibrator-serial', data);
    }
    getProgress(client, measureOfM) {
        console.log(measureOfM);
        this.server.emit('update-recollection-progress', measureOfM);
    }
    setDoingCalibrationProcess(client, dataToSet) {
        this.server.emit('update-status-to-calibration-progress', dataToSet);
    }
    calibrationStartedAlert(data, client) {
        console.log("Proceso iniciado");
        this.server.emit('client-calibrator-started');
    }
    successCalibrationProcess(data, client) {
        console.log(data);
        this.server.emit('client-success-calibration-process', data);
    }
    calibrationSopedAlert(data, client) {
        console.log("Proceso parado");
        this.server.emit('client-calibrator-stopped');
    }
    connectWebClient(data, client) {
        console.log("web de " + data.userName + " conectada");
        this.sessionsConnected.set(client.id, data);
        this.checkTerminalConected();
        this.checkWebClientConected();
    }
    startCalibration(data, client) {
        console.log("Iniciando proceso");
        this.server.emit('start-calibration-process');
    }
    stopCalibration(data, client) {
        console.log("Parando proceso");
        this.server.emit('stop-calibration-process');
    }
    checkTerminalConected() {
        let terminalConected = false;
        this.sessionsConnected.forEach(session => {
            if (session.type == 0) {
                terminalConected = true;
            }
        });
        if (terminalConected) {
            console.log("terminal conectada");
            this.server.emit('client-calibrator-connected');
            if (this.checkWebClientConected()) {
                console.log("mandando seriales");
                this.server.emit('set-client-calibrator-serials', {
                    serials: this.serials,
                    maxMeasure: this.maxMeasures,
                });
            }
        }
        else {
            console.log("sin calibrador conectado");
        }
    }
    checkWebClientConected() {
        let webConected = false;
        this.sessionsConnected.forEach(session => {
            if (session.type == 1) {
                webConected = true;
            }
        });
        if (webConected) {
            console.log("web conectada");
            this.server.emit('web-client-connected');
        }
        else {
            console.log("sin web conectada");
        }
        return webConected;
    }
};
__decorate([
    websockets_1.WebSocketServer(),
    __metadata("design:type", socket_io_1.Server)
], DashboardCalibrationGateway.prototype, "server", void 0);
__decorate([
    __param(0, websockets_1.ConnectedSocket()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket]),
    __metadata("design:returntype", void 0)
], DashboardCalibrationGateway.prototype, "handleConnection", null);
__decorate([
    __param(0, websockets_1.ConnectedSocket()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket]),
    __metadata("design:returntype", void 0)
], DashboardCalibrationGateway.prototype, "handleDisconnect", null);
__decorate([
    websockets_1.SubscribeMessage('connect-calibrator-client'),
    __param(0, websockets_1.ConnectedSocket()),
    __param(1, websockets_1.MessageBody()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", void 0)
], DashboardCalibrationGateway.prototype, "connectCalibratorClient", null);
__decorate([
    websockets_1.SubscribeMessage('send-pattern-calibrator-serial'),
    __param(0, websockets_1.ConnectedSocket()),
    __param(1, websockets_1.MessageBody()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", void 0)
], DashboardCalibrationGateway.prototype, "sendPatternCalibratorSerial", null);
__decorate([
    websockets_1.SubscribeMessage('read-progress'),
    __param(0, websockets_1.ConnectedSocket()),
    __param(1, websockets_1.MessageBody()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", void 0)
], DashboardCalibrationGateway.prototype, "getProgress", null);
__decorate([
    websockets_1.SubscribeMessage('set-doing-calibration-process'),
    __param(0, websockets_1.ConnectedSocket()),
    __param(1, websockets_1.MessageBody()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", void 0)
], DashboardCalibrationGateway.prototype, "setDoingCalibrationProcess", null);
__decorate([
    websockets_1.SubscribeMessage('calibration-started-alert'),
    __param(0, websockets_1.MessageBody()),
    __param(1, websockets_1.ConnectedSocket()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [SessionData, socket_io_1.Socket]),
    __metadata("design:returntype", void 0)
], DashboardCalibrationGateway.prototype, "calibrationStartedAlert", null);
__decorate([
    websockets_1.SubscribeMessage('success-calibration-process'),
    __param(0, websockets_1.MessageBody()),
    __param(1, websockets_1.ConnectedSocket()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, socket_io_1.Socket]),
    __metadata("design:returntype", void 0)
], DashboardCalibrationGateway.prototype, "successCalibrationProcess", null);
__decorate([
    websockets_1.SubscribeMessage('calibration-stopped-alert'),
    __param(0, websockets_1.MessageBody()),
    __param(1, websockets_1.ConnectedSocket()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [SessionData, socket_io_1.Socket]),
    __metadata("design:returntype", void 0)
], DashboardCalibrationGateway.prototype, "calibrationSopedAlert", null);
__decorate([
    websockets_1.SubscribeMessage('set-web-client-online'),
    __param(0, websockets_1.MessageBody()),
    __param(1, websockets_1.ConnectedSocket()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [SessionData, socket_io_1.Socket]),
    __metadata("design:returntype", void 0)
], DashboardCalibrationGateway.prototype, "connectWebClient", null);
__decorate([
    websockets_1.SubscribeMessage('start-calibration'),
    __param(0, websockets_1.MessageBody()),
    __param(1, websockets_1.ConnectedSocket()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [SessionData, socket_io_1.Socket]),
    __metadata("design:returntype", void 0)
], DashboardCalibrationGateway.prototype, "startCalibration", null);
__decorate([
    websockets_1.SubscribeMessage('stop-calibration'),
    __param(0, websockets_1.MessageBody()),
    __param(1, websockets_1.ConnectedSocket()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [SessionData, socket_io_1.Socket]),
    __metadata("design:returntype", void 0)
], DashboardCalibrationGateway.prototype, "stopCalibration", null);
DashboardCalibrationGateway = __decorate([
    websockets_1.WebSocketGateway({ cors: true, path: '/calibrator' }),
    __metadata("design:paramtypes", [])
], DashboardCalibrationGateway);
exports.DashboardCalibrationGateway = DashboardCalibrationGateway;
//# sourceMappingURL=dashboard-calibration.gateway.js.map