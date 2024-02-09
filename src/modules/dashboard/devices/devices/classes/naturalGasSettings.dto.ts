import { Apn } from "src/models/apn.entity";
import { NaturalGasSettings } from "src/models/naturalGasSettings.entity";
import { IsBoolean, IsEnum, IsInt, IsNotEmpty, IsOptional, IsString, Max, Min } from 'class-validator';

export const consumptionUnitsValidator = {
    "M3": 0,
    "L":  1,
    "G":  2,
};

//Crea un enum con los valores de consumo M3, L, G
export enum ConsumptionUnits {
    "M3",
    "L",
    "G" 
}

export const ipProtocolValidator = {
    1: "ipv4",
    2: "ipv6",
    3: "ipv6v4",
};

export const authValidator = {
    0: "none",
    1: "PAP",
    2: "CHAP",
    3: "PAP/CHAP",
};


export const changes = [
    'customDailyTime',
    'dailyTime',
    'consumptionUnits',
    'storageFrequency',
    'periodicFrequency',
    'periodicTime',
    'ipProtocol',
    'user',
    'password',
    'auth',
    'apiUrl',
    'label',
    'consumptionAlertSetPoint',
    'consumptionAlertType',
    'lowBatteryFlag',
    'sensorFlag',
    'darkFlag',
    'darkSetPoint',
    'lightFlag',
    'lightSetPoint',
    'dailyTransmission'
  ]


/**
 * 
 */
export class NaturalGassettingsDto {
    checksumLength: number;
    headerLength: number;
    totalLength: number;
    DLY: string;
    CUN: string;
    SFQ: string;
    DYT: string;
    PDT: string;
    APN: string;
    URL: string;
    LBL: string;

    CAT: string;

    CAS: string;
    LBA: string;
    SFA: string;
    SDA: string;
    SBA: string;
    /*
    AT+CAS

    AT+LBA

    AT+SFA

    AT+SDA

    AT+SBA
    */
    

    constructor(settings: NaturalGasSettings, apn: Apn) {
        this.checksumLength = 9;
        this.headerLength = 31;
        this.totalLength = 512;

        this.DLY = "AT+DLY=" + settings.customDailyTime + "," + settings.dailyTime + "!";
        this.CUN = "AT+CUN=" + consumptionUnitsValidator[settings.consumptionUnits] + "!";
        this.SFQ = "AT+SFQ=" + settings.storageFrequency + "," + settings.storageTime + "!";
        this.DYT = "AT+DYT=" + settings.dailyTransmission + "!";
        this.PDT = "AT+PDT=" + settings.periodicFrequency + "," + settings.periodicTime + "!";
        this.APN = "AT+APN=" + settings.ipProtocol + ",'" + apn.apn + "','" + apn.user + "','" + apn.password + "'," + settings.auth + "!";
        this.URL = "AT+URL=" + "'" + settings.apiUrl + "'!"; 
        this.LBL = "AT+LBL=" + "'" + settings.label + "'!";
        this.CAS = "AT+CAS=" + settings.consumptionAlertSetPoint + "!";
        this.CAT = "AT+CAT=" + settings.consumptionAlertType + "!";
        this.LBA = "AT+LBA=" + settings.lowBatteryFlag + "!";
        this.SFA = "AT+SFA=" + settings.sensorFlag + "!";
        this.SDA = "AT+SDA=" + settings.darkFlag + "," + settings.darkSetPoint + "!";
        this.SBA = "AT+SBA=" + settings.lightFlag + "," + settings.lightSetPoint + "!";

    }

    public getCommands(): string[] {
        return [
            this.DLY,
            this.CUN,
            this.SFQ,
            this.DYT,
            this.PDT,
            this.APN,
            this.URL,
            this.LBL,
            this.CAS,
            this.CAT,
            this.LBA,
            this.SFA,
            this.SDA,
            this.SBA,

        ]
    }
}



export class UpdateNaturalGasSettingsDto {
    @IsInt()
    idDevice: number;

    @IsString()
    firmwareVersion: string;
    
    @IsInt()
    @Min(0)
    @Max(31)
    serviceOutageDay: number;
    
    @IsInt()
    @Min(0)
    monthMaxConsumption: number;
    
    @IsString()
    apiUrl: string;
    
    @IsEnum(ConsumptionUnits)
    consumptionUnits: string;
    
    @IsInt()
    storageFrequency: number;
    
    @IsString()
    storageTime: number;
    
    @IsString()
    dailyTime: number;
    
    @IsInt()
    @Min(0)
    customDailyTime: number;
    
    @IsInt()
    periodicFrequency: number;

    @IsInt()
    dailyTransmission: number;

    @IsString()
    periodicTime: number;
    
    /*
    0 = ipv4
    1 = ipv6
    2 = ipv6v4
    */
    @IsEnum(ipProtocolValidator)
    ipProtocol: string;
    
    /*
    0 = none
    1 = PAP
    2 = CHAP
    3 = PAP/CHAP
    */
    @IsEnum(authValidator)
    auth: string;
    
    @IsString()
    label: string;
    
    @IsInt()
    @Min(0)
    consumptionAlertType: number;
    
    @IsInt()
    @Min(0)
    consumptionAlertSetPoint: number;
    
    @IsInt()
    @Min(0)
    consumptionExcessFlag: number;
    
    @IsInt()
    @Min(0)
    lowBatteryFlag: number;
    
    @IsInt()
    @Min(0)
    sensorFlag: number;
    
    @IsInt()
    @Min(0)
    darkSetPoint: number;
    
    @IsInt()
    @Min(0)
    darkFlag: number;
    
    @IsInt()
    @Min(0)
    lightSetPoint: number;
    
    @IsInt()
    @Min(0)
    lightFlag: number;
    
    @IsInt()
    @Min(0)
    isOn: number;
}

