"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Validations = void 0;
class Validations {
    constructor() {
        this.rfcValidator = /^([A-ZÑ&]{3,4}) ?(?:- ?)?(\d{2}(?:0[1-9]|1[0-2])(?:0[1-9]|[12]\d|3[01])) ?(?:- ?)?([A-Z\d]{2})([A\d])$/;
        this.imeiValidator = /(\d{15})/g;
        this.serialNumberValidator = /(\d{8})/g;
        this.hexColorValidator = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
    }
    validateRFC(rfc) {
        return this.rfcValidator.test(rfc);
    }
    validateIMEI(imei) {
        return this.imeiValidator.test(imei);
    }
    validateSerialNumber(serialNumber) {
        return this.serialNumberValidator.test(serialNumber);
    }
    validateHexColor(hexColor) {
        return this.hexColorValidator.test(hexColor);
    }
}
exports.Validations = Validations;
//# sourceMappingURL=validations.class.js.map