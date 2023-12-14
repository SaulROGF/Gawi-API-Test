export class ConektaCustomer {
    livemode: boolean;
    name: string;
    email: string;
    phone: string;
    id: string;
    object: string;
    created_at: number;
    corporate: boolean;
    custom_reference: string;
}

export class ProductConekta {
    name: string;
    unit_price: number;
    quantity: number;
    antifraud_info: {
        //  trip_id: "12345",
        //  driver_id : "driv_1231",
        //  ticket_class: "economic",
        //  pickup_latlon: "23.4323456,-123.1234567",
        //  dropoff_latlon: "23.4323456,-123.1234567"
    }

    constructor() {
        this.name = "";
        this.unit_price = 0;
        this.quantity = 0;
        this.antifraud_info = {};
    }
}

export class PaidOrderConekta {
    id: string;
    updated_at: number;
    payment_status: string;//"paid" - si se regresa este string es que todo el proceso esta OK
    amount: number;
    amount_refunded: number;
    created_at: number;
    currency: string;
    livemode: boolean;
    object: string;
    charges: ChargesConekta;
    line_items: LineItemsConekta; // Productos que se cobraron
    shipping_contact: ShippingContactConekta; //Dirección de envio de los productos
    metadata: MetadataConekta;
    shipping_lines: ShippingLinesConekta; //Información de los paquetes enviados
    customer_info: CustomerInfoConekta;

    constructor() {
        this.id = "";
        this.updated_at = 0;
        this.payment_status = "";//"paid"
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

export class ShippingLinesConekta {
    data: ShippingLineConekta[]
    has_more: boolean;
    object: string;
    total: number;

    constructor() {
        this.data = []
        this.has_more = false;
        this.object = "";
        this.total = 0;
    }
}

export class ShippingLineConekta {
    id: string;
    parent_id: string;
    amount: number;
    carrier: string;
    object: string;

    constructor() {
        this.id = "";
        this.parent_id = "";
        this.amount = 0;
        this.carrier = "";
        this.object = "";
    }
}

export class ShippingContactConekta {
    id: string;
    created_at: number;
    object: string;
    address: AddressConekta;

    constructor() {
        this.id = "";
        this.created_at = 0;
        this.object = "";
        this.address = new AddressConekta;
    }
}

export class AddressConekta {
    country: string;
    object: string;
    postal_code: string;
    residential: boolean;
    street1: string;

    constructor() {
        this.country = "";
        this.object = "";
        this.postal_code = "";
        this.residential = false;
        this.street1 = "";
    }
}
export class MetadataConekta {
    description: string;

    constructor() {
        this.description = "";
    }
}

export class LineItemsConekta {
    data: LineItemDataConekta[];
    has_more: boolean;
    object: string;
    total: number;

    constructor() {
        this.data = [];
        this.has_more = false;
        this.object = "";
        this.total = 0;
    }
}

export class LineItemDataConekta {
    id: string;
    parent_id: string;
    antifraud_info: {}
    metadata: {}
    name: string;
    object: string;
    quantity: number;
    unit_price: number;

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

export class CustomerInfoConekta {
    customer_id: string;
    corporate: boolean;
    email: string;
    name: string;
    object: string;
    phone: string;

    constructor() {
        this.customer_id = "";
        this.corporate = false;
        this.email = "";
        this.name = "";
        this.object = "";
        this.phone = "";
    }
}

export class ChargesConekta {
    object: string;
    has_more: boolean;
    total: number;
    data: ChargeOrderConekta[];

    constructor() {
        this.object = "";
        this.has_more = false;
        this.total = 0;
        this.data = [];
    }

}

export class ChargeOrderConekta {
    id: string;
    order_id: string;
    customer_id: string;
    amount: number;
    created_at: number;
    currency: string;
    description: string;
    fee: number;
    livemode: boolean;
    object: string;
    paid_at: number;
    payment_method: PaymentMethodConekta;
    status: string /* "paid" */;

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

export class PaymentMethodConekta {
    account_type: string;
    auth_code: string;
    brand: string;
    country: string;
    exp_month: string;
    exp_year: string;
    fraud_indicators: any[];
    issuer: string;
    last4: string;
    name: string;
    object: string;
    type: string;

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
