export class CustomerFacturapi {
    created_at: string;
    email: string;
    id: string;
    legal_name: string;
    livemode: boolean;
    organization: string;
    phone: string;
    tax_id: string;
    address: AddressFacturapi;

        constructor() {
            this.created_at = "";
            this.email = "";
            this.id = "";
            this.legal_name = "";
            this.livemode = false;
            this.organization = "";
            this.phone = "";
            this.tax_id = "";
            this.address= new AddressFacturapi();
        }
}

export class AddressFacturapi {
    city: string;
    country: string;
    exterior: string;
    interior: string;
    municipality: string;
    neighborhood: string;
    state: string;
    street: string;
    zip: string;

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
