export declare class Validations {
    rfcValidator: RegExp;
    imeiValidator: RegExp;
    serialNumberValidator: RegExp;
    hexColorValidator: RegExp;
    constructor();
    validateRFC(rfc: string): boolean;
    validateIMEI(imei: string): boolean;
    validateSerialNumber(serialNumber: string): boolean;
    validateHexColor(hexColor: string): boolean;
}
