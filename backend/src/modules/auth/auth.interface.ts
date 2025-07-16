/**
 * Kimlik doğrulama için kullanıcı arayüzü
 * Veritabanındaki admin tablosuna karşılık gelir
 */
export interface IAuth {
    id: string;
    email: string;
    password: string;
    fullName: string;
    userType: string;
    phone: string;
    isActive: boolean;
    lastLogin: Date;
    createdAt: Date;
    updatedAt: Date;
}

/**
 * Kimlik doğrulama yanıtı için kullanıcı arayüzü
 * Hassas bilgileri içermez (password gibi)
 */
export interface IAuthResponse {
    id: string;
    email: string;
    fullName: string;
    userType: string;
    phone: string;
    isActive: boolean;
    lastLogin: Date;
}