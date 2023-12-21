"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WaterSettingsDto = exports.consumptionAlertValidator = exports.dailyTransmissionValidator = exports.authValidator = exports.ipProtocolValidator = exports.flowUnitsValidator = exports.consumptionUnitsValidator = void 0;
const apn_entity_1 = require("../../../../../models/apn.entity");
const waterSettings_entity_1 = require("../../../../../models/waterSettings.entity");
exports.consumptionUnitsValidator = {
    "M3": 0,
    "L": 1,
    "G": 2,
};
exports.flowUnitsValidator = {
    "LPS": 0,
    "M3H": 1,
    "GPM": 2,
};
exports.ipProtocolValidator = {
    0: "ipv4",
    1: "ipv6",
    2: "ipv6v4",
};
exports.authValidator = {
    0: "none",
    1: "PAP",
    2: "CHAP",
    3: "PAP/CHAP",
};
exports.dailyTransmissionValidator = {
    0: "00:00",
    1: "12:00",
};
exports.consumptionAlertValidator = {
    0: "continous",
    1: "montly",
};
class WaterSettingsDto {
    constructor(settings, apn) {
        this.checksumLength = 9;
        this.headerLength = 31;
        this.totalLength = 512;
        this.DLY = "AT+DLY=" + settings.dailyTransmission + "," + settings.dailyTime + "!";
        this.CUN = "AT+CUN=" + exports.consumptionUnitsValidator[settings.consumptionUnits] + "!";
        this.QUN = "AT+QUN=" + exports.flowUnitsValidator[settings.flowUnits] + "!";
        this.SFQ = "AT+SFQ=" + settings.storageFrequency + "," + settings.storageTime + "!";
        this.DYT = "AT+DYT=" + settings.customDailyTime + "!";
        this.PDT = "AT+PDT=" + settings.periodicFrequency + "," + settings.periodicTime + "!";
        this.APN = "AT+APN=" + settings.ipProtocol + ",'" + apn.apn + "','" + apn.user + "','" + apn.password + "'," + settings.auth + "!";
        this.URL = "AT+URL=" + "'" + settings.apiUrl + "'!";
        this.LBL = "AT+LBL=" + "'" + settings.label + "'!";
        this.BSP = "AT+BSP=" + settings.burstSetpoint + "!";
        this.DSP = "AT+DSP=" + settings.dripSetpoint + "!";
        this.FSP = "AT+FSP=" + settings.flowSetpoint + "!";
        this.CAS = "AT+CAS=" + settings.consumptionSetpoint + "!";
        this.CAT = "AT+CAT=" + settings.consumptionAlertType + "!";
    }
    getCommands() {
        return [
            this.DLY,
            this.CUN,
            this.QUN,
            this.SFQ,
            this.DYT,
            this.PDT,
            this.APN,
            this.URL,
            this.LBL,
            this.DSP,
            this.BSP,
            this.FSP,
            this.CAS,
            this.CAT,
        ];
    }
}
exports.WaterSettingsDto = WaterSettingsDto;
//# sourceMappingURL=waterSettings.dto.js.map