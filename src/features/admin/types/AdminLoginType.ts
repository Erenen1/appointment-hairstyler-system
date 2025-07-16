
export interface LoginAdminRequest {
    email: string;
    password: string
}


export interface CreateAdminRequest {
    password: string;
    fullName: string;
    email: string;
    phone: string;
}