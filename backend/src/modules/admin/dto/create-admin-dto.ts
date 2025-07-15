export interface CreateAdminDto {
    fullName: string;
    email: string;
    password: string;
    phone: string;
    isActive?: boolean;
}