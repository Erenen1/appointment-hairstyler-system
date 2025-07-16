/**
 * Profil yanıtı için veri transfer nesnesi
 */
export interface ProfileResponseDTO {
    id: string;
    email: string;
    fullName: string;
    userType: string;
    password: string;
    phone: string;
    isActive: boolean;
    lastLogin: Date;
    createdAt: Date;
    updatedAt: Date;
}