"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WaterHistoryDto = exports.ReasonDescriptions = void 0;
exports.ReasonDescriptions = {
    1: "loggin",
    2: "daily00",
    3: "daily12",
    4: "daily",
    5: "periodic",
    6: "leaking",
    7: "burst",
    8: "dripping",
    9: "montly",
    10: "consumption",
};
class WaterHistoryDto {
    constructor(body) {
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
    formatDateTime(rawDate, rawTime) {
        let year = "20" + rawDate.split("/")[0];
        let month = this.formatSettingsToString(rawDate.split("/")[1], 2);
        let day = this.formatSettingsToString(rawDate.split("/")[2], 2);
        let hour = this.formatSettingsToString(rawTime.split(":")[0], 2);
        let mins = this.formatSettingsToString(rawTime.split(":")[1], 2);
        let secs = this.formatSettingsToString(rawTime.split(":")[2], 2);
        return year + "-" + month + "-" + day + "T" + hour + ":" + mins + ":" + secs.slice(0, 2);
    }
    formatSettingsToString(num, len) {
        let ans = "" + num;
        while (ans.length < len) {
            ans = "0" + ans;
        }
        return ans;
    }
}
exports.WaterHistoryDto = WaterHistoryDto;
//# sourceMappingURL=waterHistory.dto.js.map