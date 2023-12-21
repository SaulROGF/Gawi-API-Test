export declare class GasHistoryAdapter {
    token: string;
    consumption: number;
    datetime: Date;
    constructor(body: any);
    checkDatetime(): boolean;
    check(): boolean;
    private formatDateTime;
    private formatSettingsToString;
}
