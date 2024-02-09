export const ReasonDescriptions = {
    1: "loggin",       // Almacenado en memoria de forma normal y se transmite cuando hay otra transmisión pendiente
    2: "daily00",      // Transmisión diaria a las 00 horas
    3: "daily12",      // Transmisión diaria a las 12 horas
}

/*

  A - consumo
  B - temperatura
  C - calidad de la señal
  D - nivel de bateria
  E - alarmas
  F - razon de transmision
  G - fecha
  H - hora
  T - token
*/
export class NaturalGasHistoryDTO {
    consumption: number;
    temperature: number;
    signalQuality: number;
    batteryLevel: number;
    alerts: number;
    reason: number;
    deviceDate: string;
    deviceTime: string;
    dateTime: string;
    token: string;
    
    constructor(body: any) {
        this.consumption = parseInt(body.A);
        this.temperature = parseFloat(body.B);
        this.signalQuality = parseInt(body.C);
        this.batteryLevel = parseInt(body.D);
        this.alerts = parseInt(body.E);
        this.reason = parseInt(body.F);
        this.deviceDate = body.G;
        this.deviceTime = body.H;
        this.dateTime = this.formatDateTime(body.G, body.H);
        this.token = body.T;
    }
    
    private formatDateTime(rawDate: string, rawTime: string) {
        const  year:  string = "20" + rawDate.split("/")[0];
        const month: string = this.formatSettingsToString(rawDate.split("/")[1], 2);
        const day:   string = this.formatSettingsToString(rawDate.split("/")[2], 2);
        const hour:  string = this.formatSettingsToString(rawTime.split(":")[0], 2);
        const mins:  string = this.formatSettingsToString(rawTime.split(":")[1], 2);
        const secs:  string = this.formatSettingsToString(rawTime.split(":")[2], 2)
        return year + "-" + month + "-" + day + "T" + hour + ":" + mins + ":" + secs.slice(0,2);
    }
    
    private formatSettingsToString(num: string, len: number) {
        let ans: string = "" + num;
        while (ans.length < len) {
        ans = "0" + ans;
        }
        return ans;
    }
}