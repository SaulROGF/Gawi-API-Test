export declare const ReasonDescriptions: {
    1: string;
    2: string;
    3: string;
    4: string;
    5: string;
    6: string;
    7: string;
    8: string;
    9: string;
    10: string;
};
export declare class WaterHistoryDto {
    token: string;
    consumption: number;
    flow: number;
    temperature: number;
    signalQuality: number;
    batteryLevel: number;
    alerts: number;
    reason: number;
    deviceDatetime: string;
    deviceDate: string;
    deviceTime: string;
    reversedConsumption: number;
    constructor(body: any);
    private formatDateTime;
    private formatSettingsToString;
}
