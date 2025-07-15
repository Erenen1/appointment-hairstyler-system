export interface IAdmin {
    id: string;
    fullName: string;
    email: string;
    password: string;
    phone: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
}

export interface IAdminResponse {
    id: string;
    fullName: string;
    email: string;
    phone: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
} 