import { Apn } from "src/models/apn.entity";
import { WaterSettings } from "src/models/waterSettings.entity";
export declare const consumptionUnitsValidator: {
    M3: number;
    L: number;
    G: number;
};
export declare const flowUnitsValidator: {
    LPS: number;
    M3H: number;
    GPM: number;
};
export declare const ipProtocolValidator: {
    0: string;
    1: string;
    2: string;
};
export declare const authValidator: {
    0: string;
    1: string;
    2: string;
    3: string;
};
export declare const dailyTransmissionValidator: {
    0: string;
    1: string;
};
export declare const consumptionAlertValidator: {
    0: string;
    1: string;
};
export declare class WaterSettingsDto {
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
    constructor(settings: WaterSettings, apn: Apn);
    getCommands(): string[];
}
