export class ActiveSubscriptionData{
    subscriptionName : string;
    subscriptionNumber : number;
    validUntil : Date;
    active : boolean;
    automaticPaymentActive : boolean;
    monthlyCost : number;
    monthsBuy : number;
    haveBillingData : boolean;
    waitingPay : boolean;
    waitingApproval : boolean;
    urlFile : string;

    constructor(){
        this.subscriptionName = "";
        this.subscriptionNumber = -1;
        this.validUntil = new Date();
        this.active = false;
        this.automaticPaymentActive = false;
        this.monthlyCost = -1;
        this.monthsBuy = -1;
        this.haveBillingData = false;
        this.waitingPay = false;
        this.waitingApproval = false;
        this.urlFile = "";
    }
}