"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GasHistoryDto = void 0;
class GasHistoryDto {
    constructor(deviceDate, deviceTime, imei, serialNumber, measure, consumption, meanConsumption, alerts, bateryLevel, temperature, signalQuality) {
        this.measure = (measure == "OR") ? "0.0" : measure;
        this.accumulatedConsumption = consumption.slice(0, -1);
        this.meanConsumption = meanConsumption.slice(0, -1);
        this.intervalAlert = alerts[0];
        this.fillingAlert = alerts[1];
        this.resetAlert = alerts[2];
        this.bateryLevel = bateryLevel;
        this.temperature = temperature;
        this.signalQuality = signalQuality;
        this.datetime = deviceDate + "T" + deviceTime;
    }
}
exports.GasHistoryDto = GasHistoryDto;
//# sourceMappingURL=gasHistory.dto.js.map