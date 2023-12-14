import { Apn } from "src/models/apn.entity";
import { WaterSettings } from "src/models/waterSettings.entity";

/**
 * 
 */
export const consumptionUnitsValidator = {
    "M3": 0,
    "L":  1,
    "G":  2,
};

export const flowUnitsValidator = {
    "LPS": 0,
    "M3H": 1,
    "GPM": 2,
};

export const ipProtocolValidator = {
    0: "ipv4",
    1: "ipv6",
    2: "ipv6v4",
};

export const authValidator = {
    0: "none",
    1: "PAP",
    2: "CHAP",
    3: "PAP/CHAP",
};

export const dailyTransmissionValidator = {
    0: "00:00",
    1: "12:00",
};

export const consumptionAlertValidator = {
    0: "continous",
    1: "montly",
};


/**
 * 
 */
export class WaterSettingsDto {
    checksumLength: number;
    headerLength: number;
    totalLength: number;
    DLY: string;
    CUN: string;
    QUN: string;
    SFQ: string;
    DYT: string;
    PDT: string;
    APN: string;
    URL: string;
    LBL: string;
    BSP: string;
    DSP: string;
    FSP: string;
    CAS: string;
    CAT: string;
    

    constructor(settings: WaterSettings, apn: Apn) {
        this.checksumLength = 9;
        this.headerLength = 31;
        this.totalLength = 512;

        this.DLY = "AT+DLY=" + settings.dailyTransmission + "," + settings.dailyTime + "!";
        this.CUN = "AT+CUN=" + consumptionUnitsValidator[settings.consumptionUnits] + "!";
        this.QUN = "AT+QUN=" + flowUnitsValidator[settings.flowUnits] + "!";
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

    public getCommands(): string[] {
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
        ]
    }
}




