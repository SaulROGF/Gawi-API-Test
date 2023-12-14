/**
 * 
 */
export const ReasonDescriptions = {
  1: "loggin",       // Almacenado en memoria de forma normal y se transmite cuando hay otra transmisión pendiente
  2: "daily00",      // Transmisión diaria a las 00 horas
  3: "daily12",      // Transmisión diaria a las 12 horas
  4: "daily",        // Transmisión diaria
  5: "periodic",     // Transmisión periódica (Este limítalo a un tiempo mínimo de 5 minutos entre transmisiones)
  6: "leaking",      // Transmisión por fuga
  7: "burst",        // ransmisión por consumo continuo
  8: "dripping",     // Transmisión por goteo
  9: "montly",       // Transmisión con por setpoint de  consumo que se borra al mes
  10: "consumption", // Transmisión por setpoint de consumo repetitiva
};


export class WaterHistoryDto {
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

  constructor(body: any) {
    this.token = body.T;
    this.consumption = parseFloat(body.A);
    this.flow = parseFloat(body.B);
    this.temperature = parseFloat(body.C);
    this.signalQuality = parseInt(body.D);
    this.batteryLevel = parseInt(body.E);
    this.alerts = parseInt(body.F);
    this.reason = parseInt(body.G);
    this.deviceDate = body.H;
    this.deviceTime = body.I;
    this.deviceDatetime = this.formatDateTime(body.H, body.I);
    this.reversedConsumption = parseFloat(body.J);
  }
  
  private formatDateTime(rawDate: string, rawTime: string) {
    let year:  string = "20" + rawDate.split("/")[0];
    let month: string = this.formatSettingsToString(rawDate.split("/")[1], 2);
    let day:   string = this.formatSettingsToString(rawDate.split("/")[2], 2);
    let hour:  string = this.formatSettingsToString(rawTime.split(":")[0], 2);
    let mins:  string = this.formatSettingsToString(rawTime.split(":")[1], 2);
    let secs:  string = this.formatSettingsToString(rawTime.split(":")[2], 2)
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
