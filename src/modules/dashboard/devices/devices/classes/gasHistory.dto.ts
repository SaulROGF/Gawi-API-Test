export class GasHistoryDto {
  measure: string;
  bateryLevel: string;
  accumulatedConsumption: string;
  meanConsumption: string;
  intervalAlert: string;
  fillingAlert: string;
  resetAlert:  string;
  temperature: string;
  signalQuality: string;
  datetime: string;
  
  constructor(
      deviceDate: string,
      deviceTime: string,
      imei: string,
      serialNumber: string,
      measure: string,
      consumption: string,
      meanConsumption: string,
      alerts: string,
      bateryLevel: string,
      temperature: string,
      signalQuality: string,
  ) {
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
