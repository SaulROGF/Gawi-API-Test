export declare class ConektaCustomer {
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
export declare class ProductConekta {
    name: string;
    unit_price: number;
    quantity: number;
    antifraud_info: {};
    constructor();
}
export declare class PaidOrderConekta {
    id: string;
    updated_at: number;
    payment_status: string;
    amount: number;
    amount_refunded: number;
    created_at: number;
    currency: string;
    livemode: boolean;
    object: string;
    charges: ChargesConekta;
    line_items: LineItemsConekta;
    shipping_contact: ShippingContactConekta;
    metadata: MetadataConekta;
    shipping_lines: ShippingLinesConekta;
    customer_info: CustomerInfoConekta;
    constructor();
}
export declare class ShippingLinesConekta {
    data: ShippingLineConekta[];
    has_more: boolean;
    object: string;
    total: number;
    constructor();
}
export declare class ShippingLineConekta {
    id: string;
    parent_id: string;
    amount: number;
    carrier: string;
    object: string;
    constructor();
}
export declare class ShippingContactConekta {
    id: string;
    created_at: number;
    object: string;
    address: AddressConekta;
    constructor();
}
export declare class AddressConekta {
    country: string;
    object: string;
    postal_code: string;
    residential: boolean;
    street1: string;
    constructor();
}
export declare class MetadataConekta {
    description: string;
    constructor();
}
export declare class LineItemsConekta {
    data: LineItemDataConekta[];
    has_more: boolean;
    object: string;
    total: number;
    constructor();
}
export declare class LineItemDataConekta {
    id: string;
    parent_id: string;
    antifraud_info: {};
    metadata: {};
    name: string;
    object: string;
    quantity: number;
    unit_price: number;
    constructor();
}
export declare class CustomerInfoConekta {
    customer_id: string;
    corporate: boolean;
    email: string;
    name: string;
    object: string;
    phone: string;
    constructor();
}
export declare class ChargesConekta {
    object: string;
    has_more: boolean;
    total: number;
    data: ChargeOrderConekta[];
    constructor();
}
export declare class ChargeOrderConekta {
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
    status: string;
    constructor();
}
export declare class PaymentMethodConekta {
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
    constructor();
}
