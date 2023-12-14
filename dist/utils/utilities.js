"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertDateAsUTCForceCuu = exports.getTomorrow = exports.toLocalTime = exports.createDateAsUTC = void 0;
function createDateAsUTC(date) {
    return new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds()));
}
exports.createDateAsUTC = createDateAsUTC;
;
function toLocalTime(now) {
    const segsInMS = 60000;
    const offset = segsInMS * now.getTimezoneOffset();
    now.setTime(now.getTime() - offset);
    return now;
}
exports.toLocalTime = toLocalTime;
;
function getTomorrow(now) {
    let tomorrow = now;
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow;
}
exports.getTomorrow = getTomorrow;
;
function convertDateAsUTCForceCuu(date) {
    let utc = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds()));
    return new Date((typeof utc === "string" ? new Date(utc) : utc)
        .toLocaleString("en-US", { timeZone: 'America/Chihuahua' }));
}
exports.convertDateAsUTCForceCuu = convertDateAsUTCForceCuu;
//# sourceMappingURL=utilities.js.map