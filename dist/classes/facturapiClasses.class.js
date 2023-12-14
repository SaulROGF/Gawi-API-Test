"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddressFacturapi = exports.CustomerFacturapi = void 0;
class CustomerFacturapi {
    constructor() {
        this.created_at = "";
        this.email = "";
        this.id = "";
        this.legal_name = "";
        this.livemode = false;
        this.organization = "";
        this.phone = "";
        this.tax_id = "";
        this.address = new AddressFacturapi();
    }
}
exports.CustomerFacturapi = CustomerFacturapi;
class AddressFacturapi {
    constructor() {
        this.city = "";
        this.country = "";
        this.exterior = "";
        this.interior = "";
        this.municipality = "";
        this.neighborhood = "";
        this.state = "";
        this.street = "";
        this.zip = "";
    }
}
exports.AddressFacturapi = AddressFacturapi;
//# sourceMappingURL=facturapiClasses.class.js.map