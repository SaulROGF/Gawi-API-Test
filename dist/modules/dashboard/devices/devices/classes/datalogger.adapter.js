"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DataloggerHistoryAdapter = void 0;
class BitArray {
    constructor() {
        this.arr = 0;
    }
    set(idx, value) {
        this.arr |= (value & 1) << idx;
    }
    get(idx) {
        return !!((this.arr >> idx) & 1);
    }
}
class DataloggerHistoryAdapter {
    constructor(body) {
        this.ALERTS_LEN = 16;
        if (body.T) {
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
        }
        else {
            this.token = "";
            this.consumption1 = body.consumption1;
            this.consumption2 = body.consumption2;
            this.flow1 = body.flow1;
            this.flow2 = body.flow2;
            this.analogInput1 = body.analogInput1;
            this.analogInput2 = body.analogInput2;
            this.analogInput3 = body.analogInput3;
            this.analogInput4 = body.analogInput4;
            this.signalQuality = body.signalQuality;
            this.batteryLevel = body.batteryLevel;
            this.digitalInputs = body.digitalInputs;
            this.digitalOutputs = body.digitalOutputs;
            this.alerts = body.alerts;
            this.datetime = body.datetime;
            this.signalType1 = body.signalType1;
            this.signalType2 = body.signalType2;
            this.signalType3 = body.signalType3;
            this.signalType4 = body.signalType4;
        }
    }
    checkDatetime() {
        return Object.prototype.toString.call(this.datetime) !== '[object Date]' ||
            isNaN(this.datetime.getTime())
            ? true
            : false;
    }
    check() {
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
    formatAlerts(settings) {
        const extendedAlerts = new BitArray();
        extendedAlerts.set(0, ((1 << 4) & this.alerts) != 0);
        extendedAlerts.set(1, ((1 << 5) & this.alerts) != 0);
        extendedAlerts.set(2, ((1 << 6) & this.alerts) != 0);
        extendedAlerts.set(3, ((1 << 7) & this.alerts) != 0);
        extendedAlerts.set(4, ((1 << 0) & this.alerts) != 0 &&
            this.analogInput1 < settings.analogSetpointLow1);
        extendedAlerts.set(5, ((1 << 1) & this.alerts) != 0 &&
            this.analogInput2 < settings.analogSetpointLow2);
        extendedAlerts.set(6, ((1 << 2) & this.alerts) != 0 &&
            this.analogInput3 < settings.analogSetpointLow3);
        extendedAlerts.set(7, ((1 << 3) & this.alerts) != 0 &&
            this.analogInput4 < settings.analogSetpointLow4);
        extendedAlerts.set(8, ((1 << 0) & this.alerts) != 0 &&
            this.analogInput1 > settings.analogSetpointHigh1);
        extendedAlerts.set(9, ((1 << 1) & this.alerts) != 0 &&
            this.analogInput2 > settings.analogSetpointHigh2);
        extendedAlerts.set(10, ((1 << 2) & this.alerts) != 0 &&
            this.analogInput3 > settings.analogSetpointHigh3);
        extendedAlerts.set(11, ((1 << 3) & this.alerts) != 0 &&
            this.analogInput4 > settings.analogSetpointHigh4);
        extendedAlerts.set(12, ((1 << 8) & this.alerts) != 0 && this.flow1 < settings.flowSetpointLow1);
        extendedAlerts.set(13, false);
        extendedAlerts.set(14, ((1 << 8) & this.alerts) != 0 && this.flow1 > settings.flowSetpointHigh1);
        extendedAlerts.set(15, false);
        this.alerts = extendedAlerts.arr;
    }
    formatDateTime(rawDate, rawTime) {
        let year = '20' + rawDate.split('/')[0];
        let month = this.formatSettingsToString(rawDate.split('/')[1], 2);
        let day = this.formatSettingsToString(rawDate.split('/')[2], 2);
        let hour = this.formatSettingsToString(rawTime.split(':')[0], 2);
        let mins = this.formatSettingsToString(rawTime.split(':')[1], 2);
        let secs = this.formatSettingsToString(rawTime.split(':')[2], 2);
        return (year +
            '-' +
            month +
            '-' +
            day +
            'T' +
            hour +
            ':' +
            mins +
            ':' +
            secs.slice(0, 2));
    }
    formatSettingsToString(num, len) {
        let ans = '' + num;
        while (ans.length < len) {
            ans = '0' + ans;
        }
        return ans;
    }
}
exports.DataloggerHistoryAdapter = DataloggerHistoryAdapter;
//# sourceMappingURL=datalogger.adapter.js.map