export declare class CustomerFacturapi {
    created_at: string;
    email: string;
    id: string;
    legal_name: string;
    livemode: boolean;
    organization: string;
    phone: string;
    tax_id: string;
    address: AddressFacturapi;
    constructor();
}
export declare class AddressFacturapi {
    city: string;
    country: string;
    exterior: string;
    interior: string;
    municipality: string;
    neighborhood: string;
    state: string;
    street: string;
    zip: string;
    constructor();
}
