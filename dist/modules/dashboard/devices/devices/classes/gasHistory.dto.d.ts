export declare class GasHistoryDto {
    measure: string;
    bateryLevel: string;
    accumulatedConsumption: string;
    meanConsumption: string;
    intervalAlert: string;
    fillingAlert: string;
    resetAlert: string;
    temperature: string;
    signalQuality: string;
    datetime: string;
    constructor(deviceDate: string, deviceTime: string, imei: string, serialNumber: string, measure: string, consumption: string, meanConsumption: string, alerts: string, bateryLevel: string, temperature: string, signalQuality: string);
}
