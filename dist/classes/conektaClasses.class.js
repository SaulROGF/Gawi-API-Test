"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentMethodConekta = exports.ChargeOrderConekta = exports.ChargesConekta = exports.CustomerInfoConekta = exports.LineItemDataConekta = exports.LineItemsConekta = exports.MetadataConekta = exports.AddressConekta = exports.ShippingContactConekta = exports.ShippingLineConekta = exports.ShippingLinesConekta = exports.PaidOrderConekta = exports.ProductConekta = exports.ConektaCustomer = void 0;
class ConektaCustomer {
}
exports.ConektaCustomer = ConektaCustomer;
class ProductConekta {
    constructor() {
        this.name = "";
        this.unit_price = 0;
        this.quantity = 0;
        this.antifraud_info = {};
    }
}
exports.ProductConekta = ProductConekta;
class PaidOrderConekta {
    constructor() {
        this.id = "";
        this.updated_at = 0;
        this.payment_status = "";
        this.amount = 0;
        this.amount_refunded = 0;
        this.created_at = 0;
        this.currency = "";
        this.livemode = false;
        this.object = "";
        this.charges = new ChargesConekta();
        this.line_items = new LineItemsConekta();
        this.shipping_contact = new ShippingContactConekta();
        this.metadata = new MetadataConekta();
        this.shipping_lines = new ShippingLinesConekta();
        this.customer_info = new CustomerInfoConekta();
    }
}
exports.PaidOrderConekta = PaidOrderConekta;
class ShippingLinesConekta {
    constructor() {
        this.data = [];
        this.has_more = false;
        this.object = "";
        this.total = 0;
    }
}
exports.ShippingLinesConekta = ShippingLinesConekta;
class ShippingLineConekta {
    constructor() {
        this.id = "";
        this.parent_id = "";
        this.amount = 0;
        this.carrier = "";
        this.object = "";
    }
}
exports.ShippingLineConekta = ShippingLineConekta;
class ShippingContactConekta {
    constructor() {
        this.id = "";
        this.created_at = 0;
        this.object = "";
        this.address = new AddressConekta;
    }
}
exports.ShippingContactConekta = ShippingContactConekta;
class AddressConekta {
    constructor() {
        this.country = "";
        this.object = "";
        this.postal_code = "";
        this.residential = false;
        this.street1 = "";
    }
}
exports.AddressConekta = AddressConekta;
class MetadataConekta {
    constructor() {
        this.description = "";
    }
}
exports.MetadataConekta = MetadataConekta;
class LineItemsConekta {
    constructor() {
        this.data = [];
        this.has_more = false;
        this.object = "";
        this.total = 0;
    }
}
exports.LineItemsConekta = LineItemsConekta;
class LineItemDataConekta {
    constructor() {
        this.id = "";
        this.parent_id = "";
        this.antifraud_info = {};
        this.metadata = {};
        this.name = "";
        this.object = "";
        this.quantity = 0;
        this.unit_price = 0;
    }
}
exports.LineItemDataConekta = LineItemDataConekta;
class CustomerInfoConekta {
    constructor() {
        this.customer_id = "";
        this.corporate = false;
        this.email = "";
        this.name = "";
        this.object = "";
        this.phone = "";
    }
}
exports.CustomerInfoConekta = CustomerInfoConekta;
class ChargesConekta {
    constructor() {
        this.object = "";
        this.has_more = false;
        this.total = 0;
        this.data = [];
    }
}
exports.ChargesConekta = ChargesConekta;
class ChargeOrderConekta {
    constructor() {
        this.id = "";
        this.order_id = "";
        this.customer_id = "";
        this.amount = 0;
        this.created_at = 0;
        this.currency = "";
        this.description = "";
        this.fee = 0;
        this.livemode = false;
        this.object = "";
        this.paid_at = 0;
        this.payment_method = new PaymentMethodConekta();
        this.status = "";
    }
}
exports.ChargeOrderConekta = ChargeOrderConekta;
class PaymentMethodConekta {
    constructor() {
        this.account_type = "";
        this.auth_code = "";
        this.brand = "";
        this.country = "";
        this.exp_month = "";
        this.exp_year = "";
        this.fraud_indicators = [];
        this.issuer = "";
        this.last4 = "";
        this.name = "";
        this.object = "";
        this.type = "";
    }
}
exports.PaymentMethodConekta = PaymentMethodConekta;
//# sourceMappingURL=conektaClasses.class.js.map