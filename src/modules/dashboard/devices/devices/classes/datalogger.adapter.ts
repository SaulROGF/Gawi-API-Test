import { DataloggerSettings } from '../../../../../models/dataloggerSettings.entity';
import { DataloggerHistory } from '../../../../../models/dataloggerHistory.entity';

class BitArray {
  arr: number;

  constructor() {
    this.arr = 0;
  }

  public set(idx: number, value: any) {
    this.arr |= (value & 1) << idx;
  }

  public get(idx: number) {
    return !!((this.arr >> idx) & 1);
  }
}

export class DataloggerHistoryAdapter {
  ALERTS_LEN: number;
  token: string;
  signalQuality: number;
  batteryLevel: number;
  digitalInputs: number;
  digitalOutputs: number;
  analogInput1: number;
  analogInput2: number;
  analogInput3: number;
  analogInput4: number;
  signalType1: number;
  signalType2: number;
  signalType3: number;
  signalType4: number;
  flow1: number;
  flow2: number;
  consumption1: number;
  consumption2: number;
  alerts: number;
  reason: number;
  datetime: Date;

  constructor( body: any | DataloggerHistory ) {
    this.ALERTS_LEN = 16;

    if( body.T ){
      this.token = body.T;
      this.consumption1 = parseFloat(body.A);
      this.consumption2 = parseFloat(body.B);
      this.flow1 = parseFloat(body.C);
      this.flow2 = parseFloat(body.D);
      this.analogInput1 = parseFloat(body.E);
      this.analogInput2 = parseFloat(body.F);
      this.analogInput3 = parseFloat(body.G);
      this.analogInput4 = parseFloat(body.H);
      this.signalQuality = parseInt(body.I);
      this.batteryLevel = parseInt(body.J);
      this.digitalInputs = parseInt(body.K) & 0x0f;
      this.digitalOutputs = parseInt(body.K) >>> 4;
      this.alerts = (parseInt(body.L) << 4) | (parseInt(body.M) >>> 4);
      this.reason = parseInt(body.M) & 0x0f;
      this.datetime = new Date(this.formatDateTime(body.O, body.N));
      this.signalType1 = parseFloat(body.P);
      this.signalType2 = parseFloat(body.Q);
      this.signalType3 = parseFloat(body.R);
      this.signalType4 = parseFloat(body.S);
    }else{
      this.token = "";
      this.consumption1 = body.consumption1;
      this.consumption2 = body.consumption2;
      this.flow1 = body.flow1;
      this.flow2 = body.flow2 ;
      this.analogInput1 = body.analogInput1;
      this.analogInput2 = body.analogInput2;
      this.analogInput3 = body.analogInput3;
      this.analogInput4 = body.analogInput4;
      this.signalQuality = body.signalQuality;
      this.batteryLevel = body.batteryLevel;
      this.digitalInputs = body.digitalInputs;
      this.digitalOutputs = body.digitalOutputs;
      this.alerts = body.alerts;
      //this.reason =//body.reason;
      this.datetime = body.datetime;
      this.signalType1 = body.signalType1;
      this.signalType2 = body.signalType2;
      this.signalType3 = body.signalType3;
      this.signalType4 = body.signalType4;
    }
  }

  public checkDatetime() {
    return Object.prototype.toString.call(this.datetime) !== '[object Date]' ||
      isNaN(this.datetime.getTime())
      ? true
      : false;
  }

  public check(): boolean {
    return this.token == undefined ||
      this.signalQuality == undefined ||
      this.batteryLevel == undefined ||
      this.digitalInputs == undefined ||
      this.digitalOutputs == undefined ||
      this.analogInput1 == undefined ||
      this.analogInput2 == undefined ||
      this.analogInput3 == undefined ||
      this.analogInput4 == undefined ||
      this.reason == undefined ||
      this.signalType1 == undefined ||
      this.signalType2 == undefined ||
      this.signalType3 == undefined ||
      this.signalType4 == undefined ||
      this.flow1 == undefined ||
      this.flow2 == undefined ||
      this.consumption1 == undefined ||
      this.consumption2 == undefined ||
      this.alerts == undefined ||
      this.token == null ||
      this.signalQuality == null ||
      this.batteryLevel == null ||
      this.digitalInputs == null ||
      this.digitalOutputs == null ||
      this.analogInput1 == null ||
      this.analogInput2 == null ||
      this.analogInput3 == null ||
      this.analogInput4 == null ||
      this.reason == null ||
      this.signalType1 == null ||
      this.signalType2 == null ||
      this.signalType3 == null ||
      this.signalType4 == null ||
      this.flow1 == null ||
      this.flow2 == null ||
      this.consumption1 == null ||
      this.consumption2 == null ||
      this.alerts == null
      ? true
      : false;
  }

  public formatAlerts(settings: DataloggerSettings) {
    // composición de alerts:
    // entradas analógicas      1er nibble
    // entradas digitales       2do nibble
    // alerta de flujo          sólo el 1er bit del 3er nibble 
    const extendedAlerts = new BitArray();
    
    // entradas digitales:
    extendedAlerts.set(0, ((1 << 4) & this.alerts) != 0);
    extendedAlerts.set(1, ((1 << 5) & this.alerts) != 0);
    extendedAlerts.set(2, ((1 << 6) & this.alerts) != 0);
    extendedAlerts.set(3, ((1 << 7) & this.alerts) != 0);

    // entradas analógicas por debajo del umbral
    extendedAlerts.set(
      4,
      ((1 << 0) & this.alerts) != 0 &&
        this.analogInput1 < settings.analogSetpointLow1,
    );
    extendedAlerts.set(
      5,
      ((1 << 1) & this.alerts) != 0 &&
        this.analogInput2 < settings.analogSetpointLow2,
    );
    extendedAlerts.set(
      6,
      ((1 << 2) & this.alerts) != 0 &&
        this.analogInput3 < settings.analogSetpointLow3,
    );
    extendedAlerts.set(
      7,
      ((1 << 3) & this.alerts) != 0 &&
        this.analogInput4 < settings.analogSetpointLow4,
    );
    // entradas analógicas por encima del umbral
    extendedAlerts.set(
      8,
      ((1 << 0) & this.alerts) != 0 &&
        this.analogInput1 > settings.analogSetpointHigh1,
    );
    extendedAlerts.set(
      9,
      ((1 << 1) & this.alerts) != 0 &&
        this.analogInput2 > settings.analogSetpointHigh2,
    );
    extendedAlerts.set(
      10,
      ((1 << 2) & this.alerts) != 0 &&
        this.analogInput3 > settings.analogSetpointHigh3,
    );
    extendedAlerts.set(
      11,
      ((1 << 3) & this.alerts) != 0 &&
        this.analogInput4 > settings.analogSetpointHigh4,
    );
    // flujos por debajo del umbral
    extendedAlerts.set(
      12,
      ((1 << 8) & this.alerts) != 0 && this.flow1 < settings.flowSetpointLow1,
    );
    extendedAlerts.set(13, false);
    extendedAlerts.set(
      14,
      ((1 << 8) & this.alerts) != 0 && this.flow1 > settings.flowSetpointHigh1,
    );
    // flujos por encima del umbral
    extendedAlerts.set(15, false);

    this.alerts = extendedAlerts.arr;
  }

  private formatDateTime(rawDate: string, rawTime: string) {
    let year: string = '20' + rawDate.split('/')[0];
    let month: string = this.formatSettingsToString(rawDate.split('/')[1], 2);
    let day: string = this.formatSettingsToString(rawDate.split('/')[2], 2);
    let hour: string = this.formatSettingsToString(rawTime.split(':')[0], 2);
    let mins: string = this.formatSettingsToString(rawTime.split(':')[1], 2);
    let secs: string = this.formatSettingsToString(rawTime.split(':')[2], 2);
    return (
      year +
      '-' +
      month +
      '-' +
      day +
      'T' +
      hour +
      ':' +
      mins +
      ':' +
      secs.slice(0, 2)
    );
  }

  private formatSettingsToString(num: string, len: number) {
    let ans: string = '' + num;
    while (ans.length < len) {
      ans = '0' + ans;
    }
    return ans;
  }
}
