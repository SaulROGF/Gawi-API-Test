"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActiveSubscriptionData = void 0;
class ActiveSubscriptionData {
    constructor() {
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
exports.ActiveSubscriptionData = ActiveSubscriptionData;
//# sourceMappingURL=activeSubscriptionData.class.js.map