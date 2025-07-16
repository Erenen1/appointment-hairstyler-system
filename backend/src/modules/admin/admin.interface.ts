/**
 * Admin kullanıcı arayüzü
 * Veritabanındaki admins tablosuna karşılık gelir
 */
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

/**
 * Admin yanıt arayüzü
 * Hassas bilgileri içermez (password gibi)
 */
export interface IAdminResponse {
    id: string;
    fullName: string;
    email: string;
    phone: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
} 