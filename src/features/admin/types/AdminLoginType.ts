
export interface LoginAdminRequest {
    email: string;
    password: string
}


export interface CreateAdminRequest {
    password: string;
    businessName: string;
    address: string;
    city: string;
    country: string;
    email: string;
    phone: string;
    website: string;
}