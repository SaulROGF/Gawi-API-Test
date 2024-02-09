"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GasHistoryAdapter = void 0;
class GasHistoryAdapter {
    constructor(body) {
        this.token = body.T;
        this.consumption = parseFloat(body.A);
        this.datetime = new Date(this.formatDateTime(body.B, body.C));
    }
    checkDatetime() {
        return Object.prototype.toString.call(this.datetime) !== '[object Date]' ||
            isNaN(this.datetime.getTime())
            ? true
            : false;
    }
    check() {
        return this.token == undefined ||
            this.consumption == undefined ||
            this.consumption == null
            ? true
            : false;
    }
    formatDateTime(rawDate, rawTime) {
        let year = '20' + rawDate.split('/')[0];
        let month = this.formatSettingsToString(rawDate.split('/')[1], 2);
        let day = this.formatSettingsToString(rawDate.split('/')[2], 2);
        let hour = this.formatSettingsToString(rawTime.split(':')[0], 2);
        let mins = this.formatSettingsToString(rawTime.split(':')[1], 2);
        let secs = this.formatSettingsToString(rawTime.split(':')[2], 2);
        const x = (year +
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
        console.log(x);
        return x;
    }
    formatSettingsToString(num, len) {
        let ans = '' + num;
        while (ans.length < len) {
            ans = '0' + ans;
        }
        return ans;
    }
}
exports.GasHistoryAdapter = GasHistoryAdapter;
//# sourceMappingURL=gas.adapter.js.map