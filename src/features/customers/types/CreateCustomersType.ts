export type Customers = {
    id: string;
    fullName: string;
    phone: string;
    email: string;
    loyaltyPoints: string;
    notes: string;
    createdAt: string;
    updatedAt: string;
}

export interface CustomersRequest {
    fullName: string;
    phone: string;
    email: string;
    notes: string;
}